import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  Bookmark,
  Briefcase,
  Calendar,
  MapPin,
  Users,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import type { WorkerJobItem } from "./VerticalJobListings";

export default function VerticalOfferListings({
  handleViewDetails,
  handleAcceptOffer,
  favoriteJobIds = [],
  onToggleFavorite,
  onOpenDetails,
  offers,
}: {
  handleViewDetails: (id: string) => void;
  handleAcceptOffer: (id: string) => void;
  favoriteJobIds?: string[];
  onToggleFavorite?: (id: string) => void;
  onOpenDetails?: (job: WorkerJobItem) => void;
  offers?: WorkerJobItem[];
}) {
  const source =
    offers ?? [
      {
        id: "3",
        title: "Labourer",
        company: "Tech Innovators Inc.",
        payRate: "80",
        tag: "Market Rate",
        location: "Shoreditch â€¢ 1.2 mi away",
        team: "2 developers, 1 designer",
        duration: "12 Jun â€¢ 1 month",
        time: "2 hours ago",
      },
      {
        id: "5",
        title: "Graphic Designer",
        company: "Creative Studios",
        payRate: "60",
        tag: "Competitive Rate",
        location: "Soho â€¢ 2.5 mi away",
        team: "1 designer",
        duration: "15 Jun â€¢ 2 weeks",
        time: "4 hours ago",
      },
    ];

  return (
    <View className="gap-4">
      {source.map((offer) => {
        const isFavorite = favoriteJobIds.includes(offer.id);

        return (
          <TouchableOpacity
            key={offer.id}
            activeOpacity={0.92}
            onPress={() => onOpenDetails?.(offer)}
            className="rounded-2xl border border-neutral-100/85 bg-white p-5"
          >
            <View className="mb-4 flex-row items-start justify-between gap-4">
              <View className="flex-row items-center gap-3">
                <View className="h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                  <Briefcase size={22} color="#FFFFFF" />
                </View>
                <View>
                  <Text className="text-base font-extrabold text-neutral-950">
                    {offer.title}
                  </Text>
                  <Text className="text-xs font-semibold text-neutral-500">
                    {offer.company}
                  </Text>
                </View>
              </View>

              <View className="items-end gap-2">
                <TouchableOpacity
                  onPress={(event) => {
                    event.stopPropagation();
                    onToggleFavorite?.(offer.id);
                  }}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isFavorite
                      ? "Remove from favourites"
                      : "Add to favourites"
                  }
                  className={`h-10 w-10 items-center justify-center rounded-full border ${
                    isFavorite
                      ? "border-orange-200 bg-orange-50"
                      : "border-neutral-200 bg-white"
                  }`}
                >
                  <Bookmark
                    size={18}
                    color={isFavorite ? Colors.common.BRAND : "#737373"}
                    fill={isFavorite ? Colors.common.BRAND : "transparent"}
                  />
                </TouchableOpacity>
                <Text className="min-w-20 flex-row text-sm font-extrabold text-neutral-900">
                  £{offer.payRate}/hour
                </Text>
              </View>
            </View>

            <View className="mb-4 gap-2.5 border-y border-neutral-50 py-3">
              <View className="flex-row items-center gap-2">
                <MapPin size={15} color="#858585" />
                <Text className="text-xs font-semibold text-neutral-500">
                  {offer.location}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Users size={15} color="#858585" />
                <Text className="text-xs font-semibold text-neutral-500">
                  {offer.team}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Calendar size={15} color="#858585" />
                <Text className="text-xs font-semibold text-neutral-500">
                  {offer.duration}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between gap-2">
              <Text
                className="text-xs font-medium text-neutral-400"
                numberOfLines={1}
              >
                {offer.time}
              </Text>

              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={(event) => {
                    event.stopPropagation();
                    if (onOpenDetails) {
                      onOpenDetails(offer);
                      return;
                    }

                    handleViewDetails(offer.id);
                  }}
                  className="rounded-md bg-neutral-100 px-4 py-2 active:opacity-70"
                  style={{ minWidth: 82 }}
                >
                  <Text className="text-center text-xs font-bold text-neutral-600">
                    View Details
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={(event) => {
                    event.stopPropagation();
                    handleAcceptOffer?.(offer.id);
                  }}
                  style={{
                    backgroundColor: Colors.common.GRAY_DARK,
                    minWidth: 132,
                  }}
                  className="rounded-md px-4 py-2 shadow-sm active:opacity-90"
                >
                  <Text className="text-center text-xs font-bold text-white">
                    Accept
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
