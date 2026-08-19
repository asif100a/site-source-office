import { Colors } from "@/constants/Colors";
import { TimesheetApproval } from "@/types";
import { ChevronRight, MapPin } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function TimesheetApprovalList({
  items,
  onApprove,
  openWorkerDetails
}: {
  items: TimesheetApproval[];
  onApprove: (item: TimesheetApproval) => void;
  openWorkerDetails: (workerId: string) => void;
}) {
  return (
    <View className="rounded-[24px] bg-white px-4 py-4">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-base font-extrabold text-neutral-950">
          Pending Timesheets
        </Text>
        <ChevronRight size={18} color="#1F2937" />
      </View>

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
              <Text className="mt-1 text-xs text-neutral-500">{item.role}</Text>
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
          {/* <Text className="mt-1 text-xs text-neutral-400">{item.submittedAt}</Text> */}

          <View className="mt-3 flex-row items-center gap-2">
            <MapPin size={14} color="#C81E1E" />
            <Text className="flex-1 text-xs text-neutral-500">
              {item.location}
            </Text>
          </View>

          {/* <Text className="mt-2 text-xs text-neutral-500">{item.totalHours}</Text> */}

          <View className="mt-4 flex-row items-center justify-end gap-3">
            <TouchableOpacity onPress={() => openWorkerDetails(item.id)} activeOpacity={0.85}>
              <Text className="text-xs font-bold text-neutral-700">View Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onApprove(item)}
              activeOpacity={0.9}
              className="rounded-xl border border-neutral-200 px-4 py-2.5"
            >
              <Text className="text-xs font-bold text-neutral-700">Approve</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}