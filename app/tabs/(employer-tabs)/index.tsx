import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import type { Region } from "react-native-maps";
import { MapPin, Minus, Plus } from "lucide-react-native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { Colors } from "@/constants/Colors";
import ScreenHeader from "@/components/layout/ScreenHeader";
import JobRequests from "@/components/modules/employer/home/JobRequests";
import MapFallback from "@/components/modules/employer/employer-details/_ui/MapFallback";
import PostAJob from "@/components/modules/employer/home/PostAJob";
import Toast from "react-native-toast-message";
import { useCreateJobMutation } from "@/store/api/jobApi";
import type { JobPostPayload } from "@/store/api/jobApi";

export const MUST_HAVE_OPTIONS = ["CSCS card", "Own tools", "Own PPE"] as const;

export type NativeMapComponents = {
  MapView: typeof import("react-native-maps").default;
  Marker: typeof import("react-native-maps").Marker;
  ProviderGoogle: typeof import("react-native-maps").PROVIDER_GOOGLE;
};

export type MustHaveOption = (typeof MUST_HAVE_OPTIONS)[number];
export type JobDateRange = {
  from?: Date;
  to?: Date;
};

export const SITE_REGION: Region = {
  latitude: 51.5295,
  longitude: -0.0887,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};

function getNativeMapComponents(): NativeMapComponents | null {
  try {
    const maps =
      require("react-native-maps") as typeof import("react-native-maps");
    return {
      MapView: maps.default,
      Marker: maps.Marker,
      ProviderGoogle: maps.PROVIDER_GOOGLE,
    };
  } catch {
    return null;
  }
}

export default function EmployerHomeScreen() {
  const router = useRouter();
  const nativeMapComponents = getNativeMapComponents();
  const NativeMapView = nativeMapComponents?.MapView;
  const NativeMarker = nativeMapComponents?.Marker;
  const NativeProviderGoogle = nativeMapComponents?.ProviderGoogle;
  const [siteRegion, setSiteRegion] = useState<Region>(SITE_REGION);
  const [createJob, { isLoading: isCreatingJob }] = useCreateJobMutation();

  const handleCreateJobPost = async (payload: JobPostPayload): Promise<boolean> => {
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

  const handleWorkerDetails = (id: string) => {
    router.push({
      pathname: `/screens/worker-details/${id}` as any,
      params: { origin: "employer" },
    });
  };

  return (
    <ScreenWrapper>
      <ScreenHeader />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 44 }}
      >
        <View className="px-5 pt-4 pb-5">
          <View className="relative overflow-hidden rounded-xl bg-[#DDD8D2]">
            <View className="h-[320px]">
              {NativeMapView && NativeMarker ? (
                <NativeMapView
                  style={{ flex: 1 }}
                  provider={NativeProviderGoogle}
                  region={siteRegion}
                  onRegionChangeComplete={setSiteRegion}
                  mapType="standard"
                  loadingEnabled
                  showsCompass={false}
                  toolbarEnabled={false}
                  showsMyLocationButton={false}
                  moveOnMarkerPress={false}
                >
                  <NativeMarker coordinate={siteRegion} title="Site location" />
                </NativeMapView>
              ) : (
                <MapFallback />
              )}
            </View>

            <View className="absolute inset-x-0 top-0 px-4 pt-4">
              <View className="flex-row items-start justify-between">
                <View className="rounded-full bg-white px-4 py-2 shadow-sm">
                  <View className="flex-row items-center gap-2">
                    <View className="h-2 w-2 rounded-full bg-[#FF5A1F]" />
                    <Text className="text-[13px] font-semibold text-[#262626]">
                      Shoreditch, E2
                    </Text>
                  </View>
                </View>

                <View className="mt-16 mr-1 gap-2">
                  <TouchableOpacity
                    activeOpacity={0.85}
                    className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm"
                  >
                    <MapPin size={18} color={Colors.common.BRAND} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => adjustMapZoom("in")}
                    className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm"
                  >
                    <Plus size={18} color="#111111" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => adjustMapZoom("out")}
                    className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm"
                  >
                    <Minus size={18} color="#111111" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="pointer-events-none absolute inset-x-0 top-16 items-center pt-3">
              <View className="rounded-full bg-[#2E2E2E] px-5 py-2">
                <Text className="text-xs font-bold text-white">
                  Drag the map to place your site
                </Text>
              </View>
            </View>

            <View className="absolute inset-x-4 bottom-4 rounded-[24px] bg-white px-4 py-4 shadow-sm">
              <View className="flex-row items-center justify-between gap-4">
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: Colors.common.BRAND }}
                  >
                    <MapPin size={20} color="#FFFFFF" fill="#FFFFFF" />
                  </View>

                  <View className="shrink">
                    <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#8A8A8A]">
                      Site location
                    </Text>
                    <Text className="text-[13px] font-bold text-[#111111]">
                      42 Hoxton Street, London N1
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  className="rounded-2xl bg-[#F3F3F3] px-4 py-3"
                >
                  <Text className="text-sm font-bold text-[#222222]">Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* POST A JOB */}
        <PostAJob
          locationCoordinates={[siteRegion.longitude, siteRegion.latitude]}
          onCreateJobPost={handleCreateJobPost}
          isCreatingJob={isCreatingJob}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}
