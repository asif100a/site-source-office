import { View, Text, TouchableOpacity } from "react-native";
import {
  Bookmark,
  Briefcase,
  Calendar,
  MapPin,
  Users,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";

type LabourerCardProps = {
  job: any;
  handleViewDetails: (id: string) => void;
  handleApply?: (id: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onOpenDetails?: (job: any) => void;
  isBookmarking?: boolean;
  isApplying?: boolean;
};

export default function LabourerCard({
  job,
  handleViewDetails,
  handleApply,
  isFavorite = false,
  onToggleFavorite,
  onOpenDetails,
  isBookmarking = false,
  isApplying = false,
}: LabourerCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => onOpenDetails?.(job)}
      className="rounded-2xl border border-neutral-100/85 bg-white p-5"
    >
      <View className="mb-4 flex-row items-start justify-between">
        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
            <Briefcase size={22} color="#FFFFFF" />
          </View>
          <View>
            <Text className="text-base font-extrabold text-neutral-950">
              {job.title?.length > 25 ? `${job.title.slice(0, 25)}...` : job.title}
            </Text>
            <Text className="text-xs font-semibold text-neutral-500">
              {job.company}
            </Text>
          </View>
        </View>

        <View className="items-end gap-2">
          <TouchableOpacity
            onPress={(event) => {
              event.stopPropagation();
              onToggleFavorite?.(job.id);
            }}
            disabled={isBookmarking}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite ? "Remove from favourites" : "Add to favourites"
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
          <Text className="min-w-20 flex-row text-right text-sm font-extrabold text-neutral-900">
            £{job.payRate}/hour
          </Text>
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

      <View className="flex-row items-center justify-between gap-2">
        <Text className="text-xs font-medium text-neutral-400" numberOfLines={1}>
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
              handleApply?.(job.id);
            }}
            disabled={isApplying}
            style={{ backgroundColor: Colors.common.GRAY_DARK, minWidth: 132 }}
            className="rounded-md px-4 py-2 shadow-sm active:opacity-90"
          >
            <Text className="text-center text-xs font-bold text-white">
              {isApplying ? "Applying..." : "Apply"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
