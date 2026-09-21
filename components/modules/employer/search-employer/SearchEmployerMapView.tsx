import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Briefcase, Filter, Navigation } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/Colors";
import {
  formatDistance,
} from "@/constants/workerHome";
import MapFallback from "@/components/modules/employer/employer-details/_ui/MapFallback";
import {
  getNativeMapComponents,
  MarkerBubble,
} from "@/components/modules/worker/home/_ui";
import {
  getWorkerMapPosition,
} from "@/utils/workerMapJobs";
import type { MapRegion, WorkerHomeJob } from "@/types";
import JobLocationPicker from "@/components/modules/employer/home/JobLocationPicker";
import type { AddressDetails } from "@/utils/googlePlaces";

const getMapZoom = (region: MapRegion) => {
  const delta = Math.max(region.latitudeDelta, region.longitudeDelta);

  if (delta >= 5) return 6;
  if (delta >= 2) return 8;
  if (delta >= 1) return 9;
  if (delta >= 0.5) return 10;
  if (delta >= 0.2) return 11;
  if (delta >= 0.1) return 12;

  return 14;
};

const getGoogleMapEmbedUrl = (region: MapRegion) => {
  const query = encodeURIComponent(`${region.latitude},${region.longitude}`);

  return `https://maps.google.com/maps?q=${query}&z=${getMapZoom(region)}&output=embed`;
};

const formatWorkersNeeded = (workersNeeded: number) =>
  `${workersNeeded} worker${workersNeeded === 1 ? "" : "s"} needed`;

const formatHourlyRate = (hourlyRate?: number) => {
  const value = Number(hourlyRate);
  if (!Number.isFinite(value) || value <= 0) return "Rate not set";

  return `GBP ${value}/hr`;
};

export default function SearchEmployerMapView({
  jobs,
  featuredJob,
  isLoading,
  isError,
  isSelectedJobLoading,
  mapRegion,
  hasWorkerLocation,
  handleViewDetails,
  locationAddress,
  onLocationChange,
  onLocationValidityChange,
  onOpenFilters,
  onSelectJob,
}: {
  jobs: WorkerHomeJob[];
  featuredJob?: WorkerHomeJob;
  isLoading: boolean;
  isError: boolean;
  isSelectedJobLoading: boolean;
  mapRegion: MapRegion;
  hasWorkerLocation: boolean;
  handleViewDetails: (job: WorkerHomeJob) => void;
  locationAddress: string;
  onLocationChange: (details: AddressDetails) => void;
  onLocationValidityChange: (isValid: boolean) => void;
  onOpenFilters: () => void;
  onSelectJob: (id: string) => void;
}) {
  const nativeMapComponents = getNativeMapComponents();
  const NativeMapView = nativeMapComponents?.MapView;
  const NativeMarker = nativeMapComponents?.Marker;
  const NativeProviderGoogle = nativeMapComponents?.ProviderGoogle;
  const mapEmbedUrl = useMemo(
    () => getGoogleMapEmbedUrl(mapRegion),
    [mapRegion],
  );

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="flex-1 bg-neutral-100 relative overflow-hidden"
    >
      <View className="absolute inset-0">
        {Platform.OS === "web" ? (
          <>
            <WebGoogleMap sourceUrl={mapEmbedUrl} />
            {jobs.map((job) => (
              <TouchableOpacity
                key={job.id}
                activeOpacity={0.9}
                onPress={() => onSelectJob(job.id)}
                className="absolute z-10 items-center"
                style={
                  {
                    ...getWorkerMapPosition(job.coordinate, mapRegion),
                    transform: [{ translateX: -18 }],
                  } as StyleProp<ViewStyle>
                }
              >
                <MarkerBubble dark={job.id === featuredJob?.id} />
                {job.id === featuredJob?.id ? (
                  <View className="mt-1 rounded-full bg-[#111111] px-3 py-1 shadow-sm">
                    <Text
                      className="text-xs font-bold text-white"
                      numberOfLines={1}
                    >
                      {job.company}
                    </Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            ))}
          </>
        ) : NativeMapView && NativeMarker ? (
          <NativeMapView
            style={{ flex: 1 }}
            provider={NativeProviderGoogle}
            region={mapRegion}
            initialRegion={mapRegion}
            mapType="standard"
            loadingEnabled
            loadingBackgroundColor="#E5E7EB"
            moveOnMarkerPress={false}
            showsUserLocation={hasWorkerLocation}
            showsMyLocationButton={hasWorkerLocation}
            showsCompass={false}
            toolbarEnabled={false}
          >
            {jobs.map((job) => (
              <NativeMarker
                key={job.id}
                coordinate={job.coordinate}
                title={job.title}
                description={job.company}
                onPress={() => onSelectJob(job.id)}
              >
                <MarkerBubble dark={job.id === featuredJob?.id} />
              </NativeMarker>
            ))}
          </NativeMapView>
        ) : (
          <MapFallback />
        )}
      </View>

      <View className="absolute inset-x-0 top-0 bg-black/10 px-5 pb-4 pt-5">
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <JobLocationPicker
              address={locationAddress}
              onChange={onLocationChange}
              onValidityChange={onLocationValidityChange}
              onlyField
            />
          </View>

          <TouchableOpacity
            className="rounded-2xl bg-[#111111] px-4 py-3 shadow-sm"
            onPress={onOpenFilters}
          >
            <View className="flex-row items-center gap-2">
              <Filter size={18} color="#FFFFFF" />
              <Text className="text-sm font-bold text-white">Filters</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="mt-4 flex-row items-center justify-between">
          <View className="rounded-full bg-[#111111] px-4 py-2.5">
            <Text className="text-sm font-bold text-white">
              {jobs.length} live sites {hasWorkerLocation ? "nearby" : "available"}
            </Text>
          </View>
        </View>
      </View>

      <View className="absolute bottom-5 right-5 z-10 rounded-2xl bg-white px-3 py-3 shadow-sm">
        <Navigation size={18} color={Colors.common.BRAND} />
      </View>

      <View className="absolute bottom-5 left-5 right-5 z-10">
        {isLoading ? (
          <View className="rounded-[28px] bg-white px-5 py-5 shadow-lg">
            <ActivityIndicator color={Colors.common.BRAND} />
          </View>
        ) : isError ? (
          <View className="rounded-[28px] border border-red-100 bg-red-50 px-5 py-5 shadow-lg">
            <Text className="text-center text-sm font-semibold text-red-700">
              Unable to load jobs. Please try again.
            </Text>
          </View>
        ) : featuredJob ? (
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() => handleViewDetails(featuredJob)}
            className="rounded-[28px] bg-white px-5 py-5 shadow-lg"
          >
            <View className="gap-4">
              <View className="flex-row items-start justify-between gap-4">
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#2F5BFF]">
                  <Briefcase size={24} color="#FFFFFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-bold text-neutral-950">
                    {isSelectedJobLoading ? "Loading job..." : featuredJob.title}
                  </Text>
                  <Text className="text-sm font-medium text-neutral-500">
                    {featuredJob.company}
                  </Text>
                  {featuredJob.trades?.length ? (
                    <Text className="mt-1 text-xs font-bold uppercase tracking-[0.6px] text-neutral-400">
                      {featuredJob.trades.join(", ")}
                    </Text>
                  ) : null}
                </View>

                <View className="items-end">
                  <Text className="text-lg font-bold text-neutral-950">
                    {isSelectedJobLoading
                      ? "--"
                      : formatHourlyRate(featuredJob.hourlyRate)}
                  </Text>
                </View>
              </View>

              <View className="gap-2 border-t border-neutral-100 pt-3">
                <Text className="text-sm font-semibold text-neutral-700">
                  {featuredJob.area}
                  {featuredJob.distanceMiles
                    ? ` - ${formatDistance(featuredJob.distanceMiles)}`
                    : ""}
                </Text>
                <Text className="text-sm font-semibold text-neutral-700">
                  {featuredJob.startDateLabel ?? featuredJob.startLabel} -{" "}
                  {featuredJob.endDateLabel ?? "End date not set"} -{" "}
                  {formatWorkersNeeded(featuredJob.workersNeeded)}
                </Text>
                {featuredJob.workingHoursLabel ? (
                  <Text className="text-xs font-medium leading-5 text-neutral-500">
                    {featuredJob.workingHoursLabel}
                  </Text>
                ) : null}
                {featuredJob.mustHave?.length ? (
                  <Text className="text-xs font-medium leading-5 text-neutral-500">
                    Must have: {featuredJob.mustHave.join(", ")}
                  </Text>
                ) : null}
                {featuredJob.note ? (
                  <Text
                    className="text-xs font-medium leading-5 text-neutral-500"
                    numberOfLines={2}
                  >
                    {featuredJob.note}
                  </Text>
                ) : null}
                <Text className="text-xs font-bold uppercase tracking-[0.8px] text-neutral-400">
                  Tap to view details
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <View className="rounded-[28px] border border-dashed border-neutral-200 bg-white px-5 py-5 shadow-lg">
            <Text className="text-center text-sm font-semibold text-neutral-500">
              No content available.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function WebGoogleMap({ sourceUrl }: { sourceUrl: string }) {
  // Expo web cannot use react-native-maps, so this mirrors the worker home map.
  return React.createElement("iframe", {
    title: "Search jobs map",
    src: sourceUrl,
    loading: "lazy",
    referrerPolicy: "no-referrer-when-downgrade",
    style: {
      width: "100%",
      height: "100%",
      border: 0,
      display: "block",
    },
  });
}
