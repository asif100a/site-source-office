import React, { useMemo, useRef, useState } from "react";
import { useRouter } from "expo-router";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Minus,
  Plus,
} from "lucide-react-native";
import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import JobRequests from "@/components/modules/employer/home/JobRequests";
import { Colors } from "@/constants/Colors";
import {
  SnapshotCard,
  SummaryRow,
} from "@/components/modules/employer/home/_ui/web.index";
import WebMapHeroCard from "@/components/modules/employer/home/WebMapHeroCard";
import WebTopSection from "@/components/modules/employer/home/WebTopSection";
import WebPostJobSection from "@/components/modules/employer/home/WebPostJobSection";
import Toast from "react-native-toast-message";
import { useCreateJobMutation } from "@/store/api/jobApi";
import type { JobPostPayload } from "@/store/api/jobApi";
import JobLocationPicker from "@/components/modules/employer/home/JobLocationPicker";
import type { AddressDetails } from "@/utils/googlePlaces";

type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const SITE_REGION: MapRegion = {
  latitude: 51.5295,
  longitude: -0.0887,
  latitudeDelta: 0.018,
  longitudeDelta: 0.018,
};

const getGoogleMapEmbedUrl = (region: MapRegion, zoom: number) => {
  const query = encodeURIComponent(`${region.latitude},${region.longitude}`);

  return `https://maps.google.com/maps?q=${query}&z=${zoom}&output=embed`;
};

const WEEKEND_DAYS = new Set(["saturday", "sunday"]);

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
  const router = useRouter();
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
  const totalEstimate = useMemo(
    () => hourlyRate * 9 * 10 * workersNeeded,
    [hourlyRate, workersNeeded],
  );
  const mapEmbedUrl = useMemo(
    () => getGoogleMapEmbedUrl(siteRegion, mapZoom),
    [mapZoom, siteRegion],
  );

  const handleCreateJobPost = async (payload: JobPostPayload): Promise<boolean> => {
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

  const openWorkerDetails = (workerId: string) => {
    router.push({
      pathname: "/screens/worker-details/[id]",
      params: { id: workerId, origin: "employer" },
    });
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
            {/* Top section */}
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

                {/* Post Job Section */}
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

              <View className="w-full gap-6 xl:w-[360px] 2xl:w-[390px]">
                <View className="rounded-[30px] border border-neutral-200/80 bg-white p-6 shadow-sm">
                  <Text className="text-[11px] font-bold uppercase tracking-[1.3px] text-[#222222]">
                    Estimated total
                  </Text>
                  <Text className="mt-2 text-[34px] font-bold tracking-tight text-[#222222]">
                    £{totalEstimate.toLocaleString()}
                  </Text>
                  <Text className="mt-3 text-sm leading-6 text-[#222222]">
                    {workersNeeded} x labourer · 10 days · 9 hr shifts
                  </Text>

                  <View className="mt-6 gap-3 rounded-[22px] bg-[#222222]/5 p-4">
                    <SummaryRow
                      label="Site"
                      value={siteAddress || "No location selected"}
                    />
                    <SummaryRow label="Trade" value="Labour" />
                    <SummaryRow label="Dates" value="10 Aug - 21 Aug 2026" />
                    <SummaryRow label="Hours" value="07:30 - 16:30" />
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() =>
                      scrollViewRef.current?.scrollTo({ y: 560, animated: true })
                    }
                    className="mt-6 items-center justify-center rounded-[18px] py-4"
                    style={{ backgroundColor: Colors.common.BRAND }}
                  >
                    <Text className="text-sm font-bold text-white">
                      Post Job
                    </Text>
                  </TouchableOpacity>

                  <Text className="mt-4 text-center text-xs leading-5 text-[#222233]">
                    Workers are matched by trade, rating and travel time. You
                    pick who starts.
                  </Text>
                </View>

                <View className="rounded-[30px] border border-neutral-200/80 bg-white p-6 shadow-sm">
                  <Text className="text-xs font-bold uppercase tracking-[1.3px] text-[#7A7A7A]">
                    Hiring snapshot
                  </Text>
                  <View className="mt-4 gap-4">
                    <SnapshotCard
                      label="Draft completeness"
                      value="92%"
                      helper="Only trade selection is left before publishing."
                    />
                    <SnapshotCard
                      label="Market signal"
                      value="Healthy"
                      helper="Current rate fits the local range for August 2026."
                    />
                    <SnapshotCard
                      label="Schedule"
                      value="10 days"
                      helper="Monday to Friday plan with weekend work off."
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
