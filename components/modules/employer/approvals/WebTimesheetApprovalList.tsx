import { Colors } from "@/constants/Colors";
import { TimesheetApproval } from "@/types";
import { ChevronRight, MapPin } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function WebTimesheetApprovalList({
  items,
  onApprove,
  openWorkerDetails
}: {
  items: TimesheetApproval[];
  onApprove: (item: TimesheetApproval) => void;
  openWorkerDetails: (workerId: string) => void
}) {
  return (
    <View className="rounded-[28px] border border-neutral-200/80 bg-white p-5 shadow-sm md:p-6">
      <View className="mb-2 flex-row items-center justify-between gap-4">
        <Text className="text-lg font-bold tracking-tight text-neutral-900">
          Pending Timesheets
        </Text>
        <View className="flex-row items-center gap-1.5">
          <Text className="text-sm font-medium text-neutral-500">
            Review queue
          </Text>
          <ChevronRight size={16} color="#737373" />
        </View>
      </View>

      <View className="mt-3 overflow-hidden rounded-[22px] border border-neutral-100">
        {items.map((item, index) => (
          <View
            key={item.id}
            className={`bg-white px-5 py-5 ${
              index < items.length - 1 ? "border-b border-neutral-100" : ""
            }`}
          >
            <View className="flex-row items-start justify-between gap-4">
              <View className="flex-1">
                <View className="flex-row items-center justify-between gap-3">
                  <View className="flex-1 pr-3">
                    <Text className="text-base font-bold text-neutral-950">
                      {item.workerName}
                    </Text>
                    <Text className="mt-1 text-sm text-neutral-500">
                      {item.role}
                    </Text>
                  </View>

                  <View className="rounded-full bg-orange-50 px-3 py-1.5">
                    <Text
                      style={{ color: Colors.common.BRAND }}
                      className="text-[11px] font-bold"
                    >
                      Pending
                    </Text>
                  </View>
                </View>

                <Text className="mt-4 text-sm font-semibold text-neutral-900">
                  {item.weekLabel}
                </Text>
                {/* <Text className="mt-1 text-xs text-neutral-400">
                  {item.submittedAt}
                </Text> */}

                <View className="mt-3 flex-row items-center gap-2">
                  <MapPin size={15} color="#C81E1E" />
                  <Text className="text-sm text-neutral-500">
                    {item.location}
                  </Text>
                </View>

                {/* <Text className="mt-2 text-sm text-neutral-500">
                  {item.totalHours}
                </Text> */}
                <View className="mt-5 flex-row items-center justify-end gap-3 pt-4">
                  <TouchableOpacity
                    onPress={() => openWorkerDetails(item.id)}
                    activeOpacity={0.85}
                  >
                    <Text className="text-sm font-bold text-neutral-700">
                      View Details
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => onApprove(item)}
                    activeOpacity={0.9}
                    className="rounded-xl border border-neutral-200 px-4 py-3"
                  >
                    <Text className="text-sm font-bold text-neutral-700">
                      Approve
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}