import React, { useMemo, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import WebMapHeroCard from "@/components/modules/employer/home/WebMapHeroCard";
import WebTopSection from "@/components/modules/employer/home/WebTopSection";
import WebPostJobSection from "@/components/modules/employer/home/WebPostJobSection";
import Toast from "react-native-toast-message";
import { useCreateJobMutation } from "@/store/api/jobApi";
import type { JobPostPayload } from "@/store/api/jobApi";
import JobLocationPicker from "@/components/modules/employer/home/JobLocationPicker";
import type { AddressDetails } from "@/utils/googlePlaces";
export {
  MUST_HAVE_OPTIONS,
  type JobDateRange,
  type MustHaveOption,
} from "@/components/modules/employer/home/job-post.constants";

type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export const SITE_REGION: MapRegion = {
  latitude: 51.5295,
  longitude: -0.0887,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};

const WEEKEND_DAYS = new Set(["saturday", "sunday"]);

const getGoogleMapEmbedUrl = (region: MapRegion, zoom: number) => {
  const query = encodeURIComponent(`${region.latitude},${region.longitude}`);

  return `https://maps.google.com/maps?q=${query}&z=${zoom}&output=embed`;
};

const getWeekendPayValidationMessage = (payload: JobPostPayload) => {
  const weekendWithoutPremiumPay = payload.workingHours.find((schedule) => {
    const day = schedule.day.trim().toLowerCase();

    return (
      WEEKEND_DAYS.has(day) &&
      !schedule.isPayOnePointFiveX &&
      !schedule.isPayTwoX
    );
  });

  if (!weekendWithoutPremiumPay) {
    return "";
  }

  return `${weekendWithoutPremiumPay.day} requires 1.5x pay or 2x pay.`;
};

export default function EmployerHomeScreenWeb() {
  const [hourlyRate, setHourlyRate] = useState(24);
  const [workersNeeded, setWorkersNeeded] = useState(2);
  const [siteRegion, setSiteRegion] = useState<MapRegion>(SITE_REGION);
  const [siteAddress, setSiteAddress] = useState("");
  const [siteCoordinates, setSiteCoordinates] = useState<
    [number, number] | null
  >(null);
  const [isLocationValid, setIsLocationValid] = useState(false);
  const [mapZoom, setMapZoom] = useState(15);
  const scrollViewRef = useRef<ScrollView>(null);
  const [createJob, { isLoading: isCreatingJob }] = useCreateJobMutation();

  const mapEmbedUrl = useMemo(
    () => getGoogleMapEmbedUrl(siteRegion, mapZoom),
    [mapZoom, siteRegion],
  );

  const handleCreateJobPost = async (
    payload: JobPostPayload,
  ): Promise<boolean> => {
    const weekendPayError = getWeekendPayValidationMessage(payload);

    if (weekendPayError) {
      Toast.show({
        type: "error",
        text1: "Select weekend pay",
        text2: weekendPayError,
      });
      return false;
    }

    try {
      console.log("Job post Payload: ", payload);
      const response = await createJob(payload).unwrap();
      console.log("Create job response: ", response);
      if (response.success || (response?.data as any)?.success) {
        Toast.show({
          type: "success",
          text1: "Job post created",
          text2: "Your job post has been created.",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Error creating job post:", error);
      Toast.show({
        type: "error",
        text1: "Could not create job post",
        text2: error?.data?.message ?? error?.message ?? "Please try again.",
      });
      return false;
    }
  };

  const adjustMapZoom = (direction: "in" | "out") => {
    setMapZoom((current) =>
      direction === "in" ? Math.min(current + 1, 20) : Math.max(current - 1, 3),
    );

    setSiteRegion((current) => {
      const nextDelta =
        direction === "in"
          ? Math.max(current.latitudeDelta * 0.7, 0.0025)
          : Math.min(current.latitudeDelta / 0.7, 0.2);

      return {
        ...current,
        latitudeDelta: nextDelta,
        longitudeDelta: nextDelta,
      };
    });
  };

  const handleLocationChange = (details: AddressDetails) => {
    setSiteAddress(details.description);
    setSiteCoordinates(details.coordinates);
    setSiteRegion((current) => ({
      ...current,
      longitude: details.coordinates[0],
      latitude: details.coordinates[1],
    }));
  };

  return (
    <ScreenWrapper>
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 112 }}
      >
        <View className="px-5 py-6 md:px-8 md:py-8 xl:px-12">
          <View className="mx-auto w-full max-w-7xl gap-6">
            <WebTopSection
              handleCreateJobPost={() =>
                scrollViewRef.current?.scrollTo({ y: 560, animated: true })
              }
            />

            <View className="flex-col gap-6 xl:flex-row">
              <View className="flex-1 gap-6">
                <WebMapHeroCard
                  mapEmbedUrl={mapEmbedUrl}
                  siteAddress={siteAddress}
                  onZoomIn={() => adjustMapZoom("in")}
                  onZoomOut={() => adjustMapZoom("out")}
                />

                <JobLocationPicker
                  address={siteAddress}
                  onChange={handleLocationChange}
                  onValidityChange={(valid) => {
                    setIsLocationValid(valid);
                    if (!valid) {
                      setSiteCoordinates(null);
                    }
                  }}
                />

                <WebPostJobSection
                  hourlyRate={hourlyRate}
                  workersNeeded={workersNeeded}
                  setHourlyRate={setHourlyRate}
                  setWorkersNeeded={setWorkersNeeded}
                  locationCoordinates={siteCoordinates}
                  locationValid={isLocationValid}
                  onCreateJobPost={handleCreateJobPost}
                  isCreatingJob={isCreatingJob}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
