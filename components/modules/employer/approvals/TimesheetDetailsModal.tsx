import { TimesheetApproval } from "@/types";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { X } from "lucide-react-native";

const formatDayLabel = (day: string) =>
  day
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatHoursLabel = (hours: number) =>
  `${hours} ${hours === 1 ? "Hour" : "Hours"}`;

export default function TimesheetDetailsModal({
  visible,
  timesheet,
  onClose,
}: {
  visible: boolean;
  timesheet: TimesheetApproval | null;
  onClose: () => void;
}) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-end px-4 pb-8"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
      >
        <View className="max-h-[82vh] rounded-2xl bg-white">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
          >
            <View className="mb-5 flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-[24px] font-semibold text-neutral-900">
                  Timesheet Details
                </Text>
                <Text className="mt-1 text-sm font-medium text-neutral-500">
                  {timesheet?.workerName ?? "Worker"}
                </Text>
              </View>

              <TouchableOpacity
                onPress={onClose}
                className="rounded-full p-1 active:opacity-70"
              >
                <X size={16} color="#111827" />
              </TouchableOpacity>
            </View>

            <View className="mb-4 rounded-2xl border border-neutral-100 px-4 py-3">
              <Text className="text-sm font-bold text-neutral-950">
                {timesheet?.weekLabel ?? "Week"}
              </Text>
              <Text className="mt-1 text-xs font-semibold text-neutral-400">
                {timesheet?.submittedAt ?? "Submitted date unavailable"}
              </Text>
              <Text className="mt-2 text-xs font-semibold text-neutral-500">
                {timesheet?.role ?? "Trade not set"}
              </Text>
              <Text className="mt-1 text-xs text-neutral-500">
                {timesheet?.location ?? "Location unavailable"}
              </Text>
            </View>

            <View className="gap-3">
              {timesheet?.days?.length ? (
                timesheet.days.map((item) => (
                  <View
                    key={item.id}
                    className="flex-row items-center justify-between rounded-2xl border border-neutral-100 px-4 py-3"
                  >
                    <View>
                      <Text className="text-base font-medium text-slate-800">
                        {formatDayLabel(item.day)}
                      </Text>
                      <Text className="mt-0.5 text-sm text-slate-400">
                        {item.status}
                      </Text>
                    </View>
                    <Text className="text-sm font-bold text-neutral-900">
                      {formatHoursLabel(item.hours)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="rounded-2xl border border-neutral-100 px-4 py-3 text-sm font-medium text-neutral-400">
                  No timesheet day details available.
                </Text>
              )}
            </View>

            <Text className="mt-4 text-right text-sm font-extrabold text-neutral-900">
              {timesheet?.totalHours ?? "0 hrs submitted time"}
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
