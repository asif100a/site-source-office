import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import MessageSupportModal from "../../common/MessageSupportModal";
import Toast from "react-native-toast-message";
import {
  useApproveAllTimesheetStatusMutation,
  useChangeTimesheetStatusMutation,
} from "@/store/api/timesheetApi";

type ApprovalDay = {
  id: string;
  day: string;
  hours: number;
  status: string;
};

const formatDayLabel = (day: string) =>
  day
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatHoursLabel = (hours: number) =>
  `${hours} ${hours === 1 ? "Hour" : "Hours"}`;

export default function WorkerApproveModal({
  visible,
  selectedWeek,
  timesheetId,
  approvalDays = [],
  onClose,
}: {
  visible: boolean;
  selectedWeek: string;
  timesheetId?: string;
  approvalDays?: ApprovalDay[];
  onClose: () => void;
}) {
  const isWeb = Platform.OS === "web";
  const [changeTimesheetStatus, { isLoading: isChangingStatus }] =
    useChangeTimesheetStatusMutation();
  const [approveAllTimesheetStatus, { isLoading: isApprovingAll }] =
    useApproveAllTimesheetStatusMutation();
  const [approvedDaysByWeek, setApprovedDaysByWeek] = useState<
    Record<string, string[]>
  >({});
  const [currentId, setCurrentId] = useState<string | null>(null);

  const selectedApprovedDays = useMemo(
    () => approvedDaysByWeek[selectedWeek] ?? [],
    [approvedDaysByWeek, selectedWeek],
  );

  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportModalState, setSupportModalState] = useState<
    "form" | "submitted"
  >("form");

  useEffect(() => {
    if (!visible) {
      setApprovedDaysByWeek({});
    }
  }, [visible]);

  const handleApproveDay = async (day: ApprovalDay) => {
    setCurrentId(day.id);
    try {
      const response = await changeTimesheetStatus({
        id: day.id,
        status: "APPROVED",
      }).unwrap();
      console.log("changeTimesheetStatus response:", response);

      setApprovedDaysByWeek((current) => {
        const currentWeekDays = current[selectedWeek] ?? [];

        if (currentWeekDays.includes(day.day)) {
          return current;
        }

        return {
          ...current,
          [selectedWeek]: [...currentWeekDays, day.day],
        };
      });
      Toast.show({
        type: "success",
        text1: "Timesheet day approved",
      });
    } catch (error: any) {
      console.error("Error approving timesheet day:", error);
      Toast.show({
        type: "error",
        text1: "Could not approve day",
        text2: error?.data?.message ?? error?.message ?? "Please try again.",
      });
    } finally {
      setCurrentId(null);
    }
  };

  const handleApproveAll = async () => {
    if (!timesheetId) {
      Toast.show({ type: "error", text1: "Timesheet is missing" });
      return;
    }

    try {
      const response = await approveAllTimesheetStatus(timesheetId).unwrap();
      console.log("approveAllTimesheetStatus response:", response);
      setApprovedDaysByWeek((current) => ({
        ...current,
        [selectedWeek]: approvalDays.map((item) => item.day),
      }));
      Toast.show({
        type: "success",
        text1: "Timesheet approved",
      });
      onClose();
    } catch (error: any) {
      console.error("Error approving all timesheet days:", error);
      Toast.show({
        type: "error",
        text1: "Could not approve timesheet",
        text2: error?.data?.message ?? error?.message ?? "Please try again.",
      });
    }
  };

  const handleDispute = () => {
    setSupportModalState("form");
    setShowSupportModal(true);
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        className={`flex-1 px-4 ${isWeb ? "items-center justify-center py-10" : "justify-end pb-8"}`}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
      >
        {!isWeb ? (
          <View className="absolute left-5 top-[42%] flex-row">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-[#FF7A00]">
              <Text className="text-sm font-bold text-white">K</Text>
            </View>
            <View className="-ml-1.5 h-8 w-8 items-center justify-center rounded-full bg-[#7C3AED]">
              <Text className="text-sm font-bold text-white">C</Text>
            </View>
          </View>
        ) : null}

        <View
          className={`bg-white ${isWeb ? "w-full max-w-2xl overflow-hidden rounded-[28px]" : "max-h-[82vh] rounded-2xl"}`}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={{
              paddingHorizontal: isWeb ? 28 : 16,
              paddingTop: isWeb ? 24 : 16,
              paddingBottom: isWeb ? 28 : 20,
            }}
          >
            <View
              className={`${isWeb ? "mb-6 border-b border-neutral-100 pb-5" : "mb-5"} flex-row items-center justify-between`}
            >
              <View className="flex-1 pr-4">
                {isWeb ? (
                  <View className="mb-3 self-start rounded-full bg-orange-50 px-3 py-1.5">
                    <Text
                      style={{ color: Colors.common.BRAND }}
                      className="text-[11px] font-bold uppercase tracking-wide"
                    >
                      Timesheet Approval
                    </Text>
                  </View>
                ) : null}

                <Text
                  className={`${isWeb ? "text-[32px]" : "text-[28px]"} font-semibold text-neutral-900`}
                >
                  Timesheet Approval
                </Text>
                {isWeb ? (
                  <Text className="mt-2 text-sm leading-6 text-neutral-500">
                    Review the selected week, confirm daily hours, and approve
                    the submitted timesheet without leaving this page.
                  </Text>
                ) : null}
              </View>

              <TouchableOpacity
                onPress={onClose}
                className={`${isWeb ? "bg-neutral-100 p-2.5" : "p-1"} rounded-full active:opacity-70`}
              >
                <X size={16} color="#111827" />
              </TouchableOpacity>
            </View>

            <View className="mb-4 rounded-xl border border-neutral-200 px-3 py-3">
              <Text className="mb-1 text-xs font-medium text-neutral-500">
                Week
              </Text>
              <Text className="text-sm font-semibold text-neutral-800">
                {selectedWeek}
              </Text>
            </View>

            <View className="gap-3">
              {approvalDays.length === 0 ? (
                <Text className="rounded-2xl border border-neutral-100 px-4 py-3 text-sm font-medium text-neutral-400">
                  No timesheet day details available.
                </Text>
              ) : null}

              {approvalDays.map((item) => (
                <View
                  key={item.id}
                  className={`flex-row items-center justify-between rounded-2xl border border-neutral-100 ${isWeb ? "bg-neutral-50/60 px-5 py-4" : "px-4 py-3"}`}
                >
                  <View className="flex-1 pr-3">
                    <Text
                      className={`${isWeb ? "text-lg" : "text-base"} font-medium text-slate-800`}
                    >
                      {formatDayLabel(item.day)}
                    </Text>
                    <Text className="mt-0.5 text-sm text-slate-400">
                      {formatHoursLabel(item.hours)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleApproveDay(item)}
                    disabled={
                      isChangingStatus ||
                      selectedApprovedDays.includes(item.day) ||
                      item.status === "APPROVED"
                    }
                    className={`rounded-xl border active:opacity-80 ${isWeb ? "px-4 py-2.5" : "px-4 py-2"} ${
                      selectedApprovedDays.includes(item.day) ||
                      item.status === "APPROVED"
                        ? "border-orange-200 bg-orange-50"
                        : "border-neutral-200 bg-white"
                    }`}
                  >
                    <Text
                      className={`${isWeb ? "text-sm" : "text-xs"} font-medium ${
                        selectedApprovedDays.includes(item.day) ||
                        item.status === "APPROVED"
                          ? "text-orange-600"
                          : "text-neutral-500"
                      }`}
                    >
                      {selectedApprovedDays.includes(item.day) ||
                      item.status === "APPROVED"
                        ? "Approved"
                        : isChangingStatus && currentId === item.id
                          ? "Approving..."
                          : "Approve"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View
              className={`${isWeb ? "mt-6 border-t border-neutral-100 pt-5" : "mt-5"}`}
            >
              <TouchableOpacity
                onPress={handleApproveAll}
                disabled={isApprovingAll || approvalDays.length === 0}
                style={{ backgroundColor: "#1F2937" }}
                className={`items-center justify-center rounded-xl px-4 active:opacity-90 ${isWeb ? "min-h-14" : "min-h-12 py-3"}`}
              >
                <Text className="text-base font-medium text-white">
                  {isApprovingAll ? "Approving..." : "Approve all"}
                </Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={handleDispute}
                style={{ backgroundColor: "#FFFFFF" }}
                className={`mt-3 items-center justify-center rounded-xl px-4 active:opacity-90 border border-neutral-200 ${isWeb ? "min-h-14" : "min-h-12 py-3"}`}
              >
                <Text className="text-base font-medium text-black">
                  Dispute
                </Text>
              </TouchableOpacity> */}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Message Support Modal */}
      <MessageSupportModal
        showSupportModal={showSupportModal}
        setShowSupportModal={setShowSupportModal}
        supportModalState={supportModalState}
        setSupportModalState={setSupportModalState}
      />
    </Modal>
  );
}
