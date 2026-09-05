import React from "react";
import {
  ActivityIndicator,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { Region } from "react-native-maps";
import {
  Briefcase,
  Calendar,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import MapFallback from "@/components/modules/employer/employer-details/_ui/MapFallback";
import { SafeAreaView } from "react-native-safe-area-context";
import type { WorkerJobItem } from "@/components/modules/worker/offers/VerticalJobListings";

type NativeMapComponents = {
  MapView: typeof import("react-native-maps").default;
  Marker: typeof import("react-native-maps").Marker;
  ProviderGoogle: typeof import("react-native-maps").PROVIDER_GOOGLE;
};

type SearchMapJobItem = WorkerJobItem & {
  coordinate?: {
    latitude: number;
    longitude: number;
  };
};

const MAP_REGION: Region = {
  latitude: 51.5444,
  longitude: -0.0031,
  latitudeDelta: 0.045,
  longitudeDelta: 0.045,
};

function getNativeMapComponents(): NativeMapComponents | null {
  if (Platform.OS === "web") {
    return null;
  }

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

export default function SearchEmployerMapView({
  jobs,
  isLoading,
  isError,
  handleViewDetails,
  searchQuery,
  onChangeSearchQuery,
  onOpenFilters,
  onOpenDetails,
}: {
  jobs: SearchMapJobItem[];
  isLoading: boolean;
  isError: boolean;
  handleViewDetails: (id: string) => void;
  searchQuery: string;
  onChangeSearchQuery: (value: string) => void;
  onOpenFilters: () => void;
  onOpenDetails?: (job: WorkerJobItem) => void;
}) {
  const nativeMapComponents = getNativeMapComponents();
  const NativeMapView = nativeMapComponents?.MapView;
  const NativeMarker = nativeMapComponents?.Marker;
  const NativeProviderGoogle = nativeMapComponents?.ProviderGoogle;
  const featuredJob = jobs[0];
  const visibleJobs = featuredJob ? [featuredJob] : [];

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="flex-1 bg-neutral-100 relative overflow-hidden"
    >
      <View className="absolute inset-0">
        {NativeMapView && NativeMarker ? (
          <NativeMapView
            style={{ flex: 1 }}
            provider={NativeProviderGoogle}
            initialRegion={MAP_REGION}
            mapType="standard"
            loadingEnabled
            loadingBackgroundColor="#E5E7EB"
            moveOnMarkerPress={false}
            showsUserLocation={false}
            showsMyLocationButton={false}
            showsCompass={false}
            toolbarEnabled={false}
          >
            {jobs
              .filter((job) => Boolean(job.coordinate))
              .map((job) => (
                <NativeMarker
                  key={job.id}
                  coordinate={job.coordinate!}
                  title={job.title}
                  description={job.company}
                />
              ))}
          </NativeMapView>
        ) : (
          <MapFallback />
        )}
      </View>

      <View className="absolute left-5 right-5 top-5">
        <View className="mb-4 flex-row items-center gap-3">
          <View className="flex-1 flex-row items-center rounded-xl border border-neutral-200/80 bg-white px-4 py-1 shadow-sm">
            <Search size={18} color="#A3A3A3" className="mr-2" />
            <TextInput
              className="flex-1 py-0 text-sm font-medium text-neutral-800"
              placeholder="Search Jobs"
              placeholderTextColor="#A3A3A3"
              value={searchQuery}
              onChangeText={onChangeSearchQuery}
            />
          </View>

          <TouchableOpacity
            onPress={onOpenFilters}
            className="items-center justify-center rounded-xl border border-neutral-200/80 bg-white p-4 shadow-sm active:opacity-80"
          >
            <SlidersHorizontal size={18} color="#333333" />
          </TouchableOpacity>
        </View>

        {featuredJob ? (
          <View className="self-center rounded-2xl border border-neutral-100 bg-white/95 p-3 shadow-lg">
            <View className="flex-row items-center gap-2.5">
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Briefcase size={14} color="#FFFFFF" />
              </View>
              <View>
                <Text className="text-[10px] font-extrabold text-neutral-900">
                  {featuredJob.title}
                </Text>
                <Text className="text-[8px] font-semibold text-neutral-500">
                  {featuredJob.company}
                </Text>
                <Text className="mt-0.5 text-[8px] font-bold text-neutral-900">
                  {"\u00A3"}
                  {featuredJob.payRate}/hour
                </Text>
              </View>
              <View
                style={{ backgroundColor: Colors.common.BRAND_LIGHT }}
                className="rounded px-1.5 py-0.5"
              >
                <Text
                  style={{ color: Colors.common.BRAND }}
                  className="text-[7px] font-extrabold"
                >
                  Open
                </Text>
              </View>
            </View>
          </View>
        ) : null}
      </View>

      <View className="absolute bottom-16 left-5 right-5">
        {isLoading ? (
          <View className="rounded-3xl border border-neutral-100/90 bg-white p-5 shadow-xl">
            <ActivityIndicator color={Colors.common.BRAND} />
          </View>
        ) : isError ? (
          <View className="rounded-3xl border border-red-100 bg-red-50 p-5 shadow-xl">
            <Text className="text-center text-sm font-semibold text-red-700">
              Unable to load jobs. Please try again.
            </Text>
          </View>
        ) : !visibleJobs.length ? (
          <View className="rounded-3xl border border-dashed border-neutral-200 bg-white p-5 shadow-xl">
            <Text className="text-center text-sm font-semibold text-neutral-500">
              No content available.
            </Text>
          </View>
        ) : (
          visibleJobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              activeOpacity={0.92}
              onPress={() => onOpenDetails?.(job)}
              className="rounded-3xl border border-neutral-100/90 bg-white p-5 shadow-xl"
            >
              <View className="mb-4 flex-row items-start justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                    <Briefcase size={22} color="#FFFFFF" />
                  </View>
                  <View>
                    <Text className="text-base font-extrabold text-neutral-950">
                      {job.title}
                    </Text>
                    <Text className="text-xs font-semibold text-neutral-500">
                      {job.company}
                    </Text>
                  </View>
                </View>

                <View className="items-end">
                  <Text className="text-sm font-extrabold text-neutral-900">
                    {"\u00A3"}
                    {job.payRate}/hour
                  </Text>
                  <View
                    style={{ backgroundColor: Colors.common.BRAND_LIGHT }}
                    className="mt-1.5 rounded-full px-2.5 py-0.5"
                  >
                    <Text
                      style={{ color: Colors.common.BRAND }}
                      className="text-[10px] font-extrabold"
                    >
                      {job.tag}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="mb-4 gap-2.5 border-y border-neutral-50 py-3">
                <View className="flex-row items-center gap-2">
                  <MapPin size={15} color="#858585" />
                  <Text className="text-xs font-semibold text-neutral-500">
                    {job.location}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Users size={15} color="#858585" />
                  <Text className="text-xs font-semibold text-neutral-500">
                    {job.team}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Calendar size={15} color="#858585" />
                  <Text className="text-xs font-semibold text-neutral-500">
                    {job.duration}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-xs font-medium text-neutral-400">
                  {job.time}
                </Text>

                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={(event) => {
                      event.stopPropagation();
                      if (onOpenDetails) {
                        onOpenDetails(job);
                        return;
                      }

                      handleViewDetails(job.id);
                    }}
                    className="rounded-xl bg-neutral-100 px-4 py-2 active:opacity-70"
                  >
                    <Text className="min-w-20 text-xs font-bold text-neutral-600">
                      View Details
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={(event) => {
                      event.stopPropagation();
                      if (onOpenDetails) {
                        onOpenDetails(job);
                        return;
                      }

                      handleViewDetails(job.id);
                    }}
                    style={{ backgroundColor: Colors.common.GRAY_DARK }}
                    className="rounded-xl px-4 py-2 shadow-sm active:opacity-90"
                  >
                    <Text className="min-w-20 text-xs font-bold text-white">
                      Send Request
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </SafeAreaView>
  );
}
