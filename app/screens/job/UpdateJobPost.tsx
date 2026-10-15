import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Colors } from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import UpdateJobHeader from "@/components/modules/employer/update-job/UpdateJobHeader";
import UpdateJobForm from "@/components/modules/employer/update-job/UpdateJobForm";
import type { JobFormValues } from "@/components/modules/employer/update-job/UpdateJobForm";
import { useGetSingleJobQuery, useUpdateJobMutation } from "@/store/api/jobApi";
import ScreenLoader from "@/components/ui/screen-loader";
import { getAddressFromCoordinates } from "@/utils/googlePlaces";
import Toast from "react-native-toast-message";

export default function UpdateJobPost() {
  const router = useRouter();
  const { id, mode, origin } = useLocalSearchParams<{
    id?: string;
    mode?: string;
    origin?: string;
  }>();
  const jobId = Array.isArray(id) ? id[0] : id;
  const isEditing = mode === "edit" && Boolean(jobId);
  const { control, handleSubmit, reset, setValue } = useForm<JobFormValues>({
    defaultValues: {
      jobTitle: "",
      hourlyRate: "",
      tradeSkill: "GROUND_WORKER",
      address: "",
      workersNeeded: "1",
      workBrief: "",
      note: "",
    },
  });

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [location, setLocation] = useState("");
  const [locationCoordinates, setLocationCoordinates] = useState<[number, number] | null>(null);

  const jobQuery = useGetSingleJobQuery(jobId ?? "", { skip: !isEditing });
  const currentJob = jobQuery.data?.data?.data ?? jobQuery.data?.data;
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();

  useEffect(() => {
    const job = currentJob;
    console.log("Job: ", job);
    if (!job) return;
    const workerEntries = Array.isArray(job.workersNeeded) ? job.workersNeeded : [];
    reset({
      jobTitle: job.title ?? "",
      hourlyRate: job.hourlyRate != null ? String(job.hourlyRate) : "",
      tradeSkill: job.trades?.[0] ?? workerEntries?.[0]?.trade ?? "GROUND_WORKER",
      address: job.location?.address ?? job.address ?? "",
      workersNeeded: String(workerEntries?.[0]?.howMany ?? 1),
      workBrief: job.note ?? job.workBrief ?? "",
      note: job.note ?? "",
    });
    setLocation(job.location?.address ?? job.address ?? "");
    setLocationCoordinates(Array.isArray(job.location?.coordinates) ? [Number(job.location.coordinates[0]), Number(job.location.coordinates[1])] : null);
    setStartDate(job.startDate ? new Date(job.startDate) : null);
    setEndDate(job.endDate ? new Date(job.endDate) : null);
    const coordinates = job.location?.coordinates;
    if (Array.isArray(coordinates) && coordinates.length === 2) {
      void getAddressFromCoordinates([
        Number(coordinates[0]),
        Number(coordinates[1]),
      ])
        .then((address) => { setLocation(address); setValue("address", address); })
        .catch(() => setValue("address", "Saved location"));
    }
  }, [currentJob, reset, setValue]);

  const submitJob = handleSubmit(async (values) => {
    try {
      if (isEditing && jobId) {
        await updateJob({
          id: jobId,
          body: {
            title: values.jobTitle.trim(),
            hourlyRate: Number(values.hourlyRate),
            workersNeeded: [{ trade: values.tradeSkill, howMany: Number(values.workersNeeded) }],
            location: locationCoordinates
              ? { type: "Point", coordinates: locationCoordinates }
              : currentJob?.location
                ? { ...currentJob.location }
              : undefined,
            endDate: endDate ? endDate.toISOString() : undefined,
            workingHours: currentJob?.workingHours ?? [],
            mustHave: currentJob?.mustHave ?? [],
            note: values.note.trim(),
            ...(startDate ? { startDate: startDate.toISOString() } : {}),
          },
        }).unwrap();
      }
      Toast.show({
        type: "success",
        text1: "Job updated successfully",
        text2: "Your job post has been updated successfully.",
      });
      router.replace("/tabs/(employer-tabs)/my-jobs" as any);
    } catch (error) {
      console.error("Error updating job post:", error);
    }
  });

  const onBackPress = () => {
    router.back();
  };

  if (jobQuery?.isLoading) {
    return (
      <ScreenWrapper>
        <ScreenLoader />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      style={{
        marginBottom: 40,
      }}
    >
      <StatusBar style="dark" />

      {/* Header */}
      <UpdateJobHeader onBackPress={onBackPress} />

      {/* Form */}
      <UpdateJobForm
        control={control}
        setShowWorkersModal={() => undefined}
        tradeOptions={[]}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        applicationDeadline={null}
        setApplicationDeadline={() => undefined}
        selectedTrade={currentJob?.trades?.[0] ?? currentJob?.workersNeeded?.[0]?.trade ?? ""}
        location={location}
        onLocationChange={(details) => { setLocation(details.description); setValue("address", details.description); setLocationCoordinates(details.coordinates); }}
      />

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-4 py-4 flex-row gap-3">
        <TouchableOpacity
          onPress={submitJob}
          style={{ backgroundColor: Colors.common.GRAY_DARK }}
          className="flex-1 py-4 rounded-2xl items-center justify-center active:opacity-90 shadow-sm"
        >
          <Text className="text-white font-extrabold text-sm">
            {isUpdating
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Publish Job"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-1 py-4 border border-neutral-200 rounded-2xl items-center justify-center bg-white active:opacity-75"
        >
          <Text className="text-neutral-900 font-extrabold text-sm">
            Discard
          </Text>
        </TouchableOpacity>
      </View>

    </ScreenWrapper>
  );
}
