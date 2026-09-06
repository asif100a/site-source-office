import { Colors } from "@/constants/Colors";
import { TimesheetApproval } from "@/types";
import { ArrowRight, MapPin } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function TimesheetApprovalList({
  items,
  onApprove,
  onViewDetails,
  isLoading = false,
  isError = false,
}: {
  items: TimesheetApproval[];
  onApprove: (item: TimesheetApproval) => void;
  onViewDetails: (item: TimesheetApproval) => void;
  isLoading?: boolean;
  isError?: boolean;
}) {
  return (
    <View>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-neutral-950 text-[18px] font-semibold">
          Pending Timesheets
        </Text>
        <ArrowRight size={20} color="#1F2937" />
      </View>
      <View className="rounded-[24px] bg-white px-4 py-4">
        {isLoading ? (
          <Text className="py-4 text-sm font-semibold text-neutral-400">
            Loading pending timesheets...
          </Text>
        ) : null}

        {isError ? (
          <Text className="py-4 text-sm font-semibold text-red-600">
            Unable to load pending timesheets. Please pull to refresh and try
            again.
          </Text>
        ) : null}

        {!isLoading && !isError && items.length === 0 ? (
          <Text className="py-4 text-sm font-semibold text-neutral-400">
            No pending timesheets.
          </Text>
        ) : null}

        {items.map((item, index) => (
          <View
            key={item.id}
            className={`py-4 ${
              index < items.length - 1 ? "border-b border-neutral-100" : ""
            }`}
          >
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1 pr-2">
                <Text className="text-sm font-bold text-neutral-950">
                  {item.workerName}
                </Text>
                <Text className="mt-1 text-xs text-neutral-500">
                  {item.role}
                </Text>
              </View>

              <View className="rounded-full bg-orange-50 px-3 py-1.5">
                <Text
                  style={{ color: Colors.common.BRAND }}
                  className="text-[10px] font-extrabold"
                >
                  Pending
                </Text>
              </View>
            </View>

            <Text className="mt-3 text-sm font-semibold text-neutral-900">
              {item.weekLabel}
            </Text>
            <Text className="mt-1 text-xs text-neutral-400">
              {item.submittedAt}
            </Text>

            <View className="mt-3 flex-row items-center gap-2">
              <MapPin size={14} color="#C81E1E" />
              <Text className="flex-1 text-xs text-neutral-500">
                {item.location}
              </Text>
            </View>

            <Text className="mt-2 text-xs font-semibold text-neutral-500">
              {item.totalHours}
            </Text>

            <View className="mt-4 flex-row items-center justify-end gap-3">
              <TouchableOpacity
                onPress={() => onViewDetails(item)}
                activeOpacity={0.85}
              >
                <Text className="text-xs font-bold text-neutral-700">
                  View Details
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onApprove(item)}
                activeOpacity={0.9}
                className="rounded-xl border border-neutral-200 px-4 py-2.5"
              >
                <Text className="text-xs font-bold text-neutral-700">
                  Approve
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
