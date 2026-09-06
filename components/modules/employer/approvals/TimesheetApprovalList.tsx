import { Colors } from "@/constants/Colors";
import { EmployerTimesheet, EmployerTimesheetDay } from "@/types";
import { ArrowRight, MapPin } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

const formatLocation = (item: EmployerTimesheet) => {
  const address = item.job?.location?.address;
  if (address) return address;

  const coordinates = item.job?.location?.coordinates;
  if (Array.isArray(coordinates) && coordinates.length >= 2) {
    return `${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}`;
  }

  return item.job?.title ?? "Location unavailable";
};

const formatSubmittedAt = (value?: string) => {
  if (!value) return "Submitted date unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Submitted date unavailable";

  return `Submitted ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
};

const formatTotalHours = (days?: EmployerTimesheetDay[]) => {
  const totalHours = (days ?? []).reduce((sum, day) => {
    const hours = Number(day.hours);
    return sum + (Number.isFinite(hours) ? hours : 0);
  }, 0);

  return `${totalHours} hrs submitted time`;
};

export default function TimesheetApprovalList({
  items,
  onApprove,
  onViewDetails,
  isLoading = false,
  isError = false,
}: {
  items: EmployerTimesheet[];
  onApprove: (item: EmployerTimesheet) => void;
  onViewDetails: (item: EmployerTimesheet) => void;
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
                  {item.workerAuth?.profile?.name ?? "Worker"}
                </Text>
                <Text className="mt-1 text-xs text-neutral-500">
                  {item.workerAuth?.workerProfile?.trades?.join(", ") ||
                    item.job?.title ||
                    "Trade not set"}
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
              Week {item.week}
            </Text>
            <Text className="mt-1 text-xs text-neutral-400">
              {formatSubmittedAt(item.createdAt)}
            </Text>

            <View className="mt-3 flex-row items-center gap-2">
              <MapPin size={14} color="#C81E1E" />
              <Text className="flex-1 text-xs text-neutral-500">
                {formatLocation(item)}
              </Text>
            </View>

            <Text className="mt-2 text-xs font-semibold text-neutral-500">
              {formatTotalHours(item.timeSheetDays)}
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
