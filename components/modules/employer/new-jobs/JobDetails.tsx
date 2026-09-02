import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useGetSingleJobQuery } from "@/store/api/jobApi";
import JobLocationLabel from "@/components/modules/employer/my-jobs/JobLocationLabel";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ScreenLoader from "@/components/ui/screen-loader";

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not set";

export default function NewJobDetails({
  jobId,
  showApplyButton = false,
  onApply,
}: {
  jobId: string;
  showApplyButton?: boolean;
  onApply?: () => void;
}) {
  const { data, isLoading, isError, error, refetch } = useGetSingleJobQuery(jobId);
  const [refreshing, setRefreshing] = useState(false);
  const job = data?.data?.data ?? data?.data;
  console.log("error", isError, error);

  const refreshJob = async () => {
    setRefreshing(true);

    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <ScreenLoader />
      </ScreenWrapper>
    );
  }

  if (isError || !job) {
    return (
      <View className="rounded-2xl bg-white p-6">
        <Text className="text-base font-bold text-neutral-900">
          {(error as any)?.message || (error as any)?.data?.message || 'Unable to load this job'}
        </Text>
        <Text className="mt-2 text-sm text-neutral-500">
          Please go back and try again.
        </Text>
      </View>
    );
  }

  const coordinates = Array.isArray(job.location?.coordinates)
    ? [Number(job.location.coordinates[0]), Number(job.location.coordinates[1])] as [number, number]
    : undefined;

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refreshJob} />
      }
    >
      <View className="rounded-3xl bg-white p-5">
        <Text className="text-xs font-bold uppercase tracking-widest text-orange-600">
          New Job
        </Text>
        <Text className="mt-2 text-2xl font-bold text-neutral-950">{job.title}</Text>
        <Text className="mt-2 text-sm font-semibold text-neutral-500">{job.status}</Text>

        <View className="mt-6 gap-4">
          <Detail label="Trade" value={(job.trades ?? []).join(", ") || "Not set"} />
          <Detail label="Hourly rate" value={job.hourlyRate != null ? `$${job.hourlyRate}/hour` : "Not set"} />
          <Detail label="Workers needed" value={String(job.workersNeeded ?? "Not set")} />
          <Detail label="Start date" value={formatDate(job.startDate)} />
          <Detail label="End date" value={formatDate(job.endDate)} />
        </View>

        <View className="mt-6 border-t border-neutral-100 pt-5">
          <Text className="text-xs font-bold uppercase tracking-widest text-neutral-500">Location</Text>
          <View className="mt-2 flex-row items-center gap-2">
            <JobLocationLabel location={job.location?.address} coordinates={coordinates} />
          </View>
        </View>

        <View className="mt-6 border-t border-neutral-100 pt-5">
          <Text className="text-xs font-bold uppercase tracking-widest text-neutral-500">Working hours</Text>
          <View className="mt-3 gap-3">
            {(job.workingHours ?? []).map((hour: any) => (
              <View key={hour.day} className="flex-row items-center justify-between rounded-xl bg-neutral-50 px-3 py-3">
                <Text className="text-sm font-bold text-neutral-900">{hour.day}</Text>
                <Text className="text-sm text-neutral-600">{hour.startTime} - {hour.endTime}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mt-6 border-t border-neutral-100 pt-5">
          <Text className="text-xs font-bold uppercase tracking-widest text-neutral-500">Must have</Text>
          <Text className="mt-2 text-sm text-neutral-700">{(job.mustHave ?? []).join(", ") || "None"}</Text>
          <Text className="mt-5 text-xs font-bold uppercase tracking-widest text-neutral-500">Notes</Text>
          <Text className="mt-2 text-sm leading-6 text-neutral-700">{job.note || "No notes"}</Text>
        </View>

        {showApplyButton ? (
          <TouchableOpacity
            onPress={onApply}
            className="mt-6 rounded-2xl bg-neutral-950 px-4 py-4"
          >
            <Text className="text-center text-sm font-bold text-white">
              Apply for this job
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </ScrollView>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between gap-4">
      <Text className="text-sm text-neutral-500">{label}</Text>
      <Text className="text-right text-sm font-bold text-neutral-900">{value}</Text>
    </View>
  );
}
