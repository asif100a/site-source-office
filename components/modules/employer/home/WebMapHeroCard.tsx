import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { MapPin, Minus, Plus } from "lucide-react-native";

export default function WebMapHeroCard({
  mapEmbedUrl,
  siteAddress,
  onZoomIn,
  onZoomOut,
}: {
  mapEmbedUrl: string;
  siteAddress: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
}) {
  return (
    <View className="overflow-hidden rounded-[30px] border border-neutral-200/80 bg-white shadow-sm">
      <View className="relative bg-[#DDD8D2]">
        <View className="h-[360px]">
          <WebGoogleMap sourceUrl={mapEmbedUrl} />
        </View>

        <View className="absolute inset-x-0 top-0 px-6 py-6">
          <View className="flex-row items-start justify-between gap-4">
            <View className="rounded-full bg-white px-4 py-2 shadow-sm">
              <View className="flex-row items-center gap-2">
                <View className="h-2.5 w-2.5 rounded-full bg-[#FF5A1F]" />
                <Text className="text-sm font-semibold text-[#262626]">
                  {siteAddress || "Select site location"}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                activeOpacity={0.85}
                className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm"
              >
                <MapPin size={18} color={Colors.common.BRAND} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onZoomIn}
                className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm"
              >
                <Plus size={18} color="#111111" />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onZoomOut}
                className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm"
              >
                <Minus size={18} color="#111111" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="pointer-events-none absolute inset-x-0 top-20 items-center">
          <View className="rounded-full bg-[#2E2E2E] px-5 py-2">
            <Text className="text-xs font-bold text-white">
              Drag the map to place your site
            </Text>
          </View>
        </View>

        <View className="absolute inset-x-6 bottom-6 rounded-[24px] bg-white px-5 py-5 shadow-sm">
          <View className="flex-row items-center justify-between gap-4">
            <View className="flex-row items-center gap-4">
              <View
                className="h-14 w-14 items-center justify-center rounded-2xl"
                style={{ backgroundColor: Colors.common.BRAND }}
              >
                <MapPin size={22} color="#FFFFFF" fill="#FFFFFF" />
              </View>

              <View className="shrink">
                <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#8A8A8A]">
                  Site location
                </Text>
                <Text className="mt-1 text-sm font-bold text-[#111111]">
                  {siteAddress || "Choose a location from search"}
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
  );
}

function WebGoogleMap({ sourceUrl }: { sourceUrl: string }) {
  return React.createElement("iframe", {
    title: "Site location map",
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
