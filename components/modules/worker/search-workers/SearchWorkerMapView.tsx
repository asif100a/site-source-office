import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, Text, View } from "react-native";
import type { Region } from "react-native-maps";
import { MapPin } from "lucide-react-native";
import MapFallback from "@/components/modules/employer/employer-details/_ui/MapFallback";
import WorkerSearchCardRow from "./WorkerSearchCardRow";
import { Colors } from "@/constants/Colors";

type WorkerMapItem = {
  id: string;
  name: string;
  role: string;
  location: string;
  availability: string;
  experience: string;
  image?: string | null;
  coordinate: {
    latitude: number;
    longitude: number;
  };
};

type NativeMapComponents = {
  MapView: typeof import("react-native-maps").default;
  Marker: typeof import("react-native-maps").Marker;
  ProviderGoogle: typeof import("react-native-maps").PROVIDER_GOOGLE;
};

const MAP_REGION: Region = {
  latitude: 51.5295,
  longitude: -0.056,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
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

function WorkerMarkerBubble({ label }: { label: string }) {
  return (
    <View className="rounded-full border border-neutral-200 bg-white px-3 py-2 shadow-sm">
      <View className="flex-row items-center gap-2">
        <View
          className="h-5 w-5 items-center justify-center rounded-full"
          style={{ backgroundColor: Colors.common.BRAND_LIGHT }}
        >
          <MapPin size={11} color={Colors.common.BRAND} />
        </View>
        <Text className="text-[11px] font-bold text-neutral-900">{label}</Text>
      </View>
    </View>
  );
}

export default function SearchWorkerMapView({
  WORKERS,
  isLoading = false,
  isError = false,
  openWorkerDetails,
}: {
  WORKERS: WorkerMapItem[];
  isLoading?: boolean;
  isError?: boolean;
  openWorkerDetails: (id: string) => void;
}) {
  const [selectedWorkerId, setSelectedWorkerId] = useState("");
  const nativeMapComponents = getNativeMapComponents();
  const NativeMapView = nativeMapComponents?.MapView;
  const NativeMarker = nativeMapComponents?.Marker;
  const NativeProviderGoogle = nativeMapComponents?.ProviderGoogle;
  const selectedWorker =
    WORKERS.find((worker) => worker.id === selectedWorkerId) ?? WORKERS[0];

  useEffect(() => {
    if (!WORKERS.some((worker) => worker.id === selectedWorkerId)) {
      setSelectedWorkerId(WORKERS[0]?.id ?? "");
    }
  }, [WORKERS, selectedWorkerId]);

  return (
    <View className="flex-1 overflow-hidden bg-neutral-100">
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
            {WORKERS.map((worker) => (
              <NativeMarker
                key={worker.id}
                coordinate={worker.coordinate}
                title={worker.name}
                description={worker.role}
                onPress={() => setSelectedWorkerId(worker.id)}
              >
                <WorkerMarkerBubble label={worker.name.split(" ")[0]} />
              </NativeMarker>
            ))}
          </NativeMapView>
        ) : (
          <MapFallback />
        )}
      </View>

      {isLoading ? (
        <View className="absolute bottom-14 left-5 right-5 items-center rounded-2xl bg-white px-5 py-8">
          <ActivityIndicator color={Colors.common.BRAND} />
          <Text className="mt-3 text-sm font-semibold text-neutral-500">
            Loading nearby workers...
          </Text>
        </View>
      ) : isError ? (
        <View className="absolute bottom-14 left-5 right-5 rounded-2xl bg-red-50 px-5 py-8">
          <Text className="text-center text-sm font-semibold text-red-700">
            Unable to load nearby workers. Please try again.
          </Text>
        </View>
      ) : selectedWorker ? (
        <View className="absolute bottom-14 left-5 right-5">
          <WorkerSearchCardRow
            worker={selectedWorker}
            onPress={() => openWorkerDetails(selectedWorker.id)}
          />
        </View>
      ) : null}
    </View>
  );
}
