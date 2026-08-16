import React from "react";
import { Platform, Text, View } from "react-native";
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
  coordinate: {
    latitude: number;
    longitude: number;
  };
};

type NativeMapComponents = {
  MapView: typeof import("react-native-maps").default;
  Marker: typeof import("react-native-maps").Marker;
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
    return { MapView: maps.default, Marker: maps.Marker };
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
  openWorkerDetails,
}: {
  WORKERS: WorkerMapItem[];
  openWorkerDetails: (id: string) => void;
}) {
  const nativeMapComponents = getNativeMapComponents();
  const NativeMapView = nativeMapComponents?.MapView;
  const NativeMarker = nativeMapComponents?.Marker;
  const featuredWorker = WORKERS[0];

  return (
    <View className="flex-1 overflow-hidden bg-neutral-100">
      <View className="absolute inset-0">
        {NativeMapView && NativeMarker ? (
          <NativeMapView
            style={{ flex: 1 }}
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
                onPress={() => openWorkerDetails(worker.id)}
              >
                <WorkerMarkerBubble label={worker.name.split(" ")[0]} />
              </NativeMarker>
            ))}
          </NativeMapView>
        ) : (
          <MapFallback />
        )}
      </View>

      {featuredWorker ? (
        <View className="absolute bottom-6 left-5 right-5">
          <WorkerSearchCardRow
            worker={featuredWorker}
            onPress={() => openWorkerDetails(featuredWorker.id)}
          />
        </View>
      ) : null}
    </View>
  );
}
