import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, X } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import MessageSupportModal from "../../common/MessageSupportModal";

const APPROVAL_DAYS = [
  { day: "Saturday", hours: "8 Hours" },
  { day: "Sunday", hours: "8 Hours" },
  { day: "Monday", hours: "8 Hours" },
  { day: "Tuesday", hours: "8 Hours" },
];

export default function WorkerApproveModal({
  visible,
  selectedWeek,
  weekOptions,
  isWeekDropdownOpen,
  onToggleWeekDropdown,
  onSelectWeek,
  onApproveAll,
  onClose,
}: {
  visible: boolean;
  selectedWeek: string;
  weekOptions: string[];
  isWeekDropdownOpen: boolean;
  onToggleWeekDropdown: () => void;
  onSelectWeek: (weekLabel: string) => void;
  onApproveAll?: (weekLabel: string) => void;
  onClose: () => void;
}) {
  const isWeb = Platform.OS === "web";
  const [approvedDaysByWeek, setApprovedDaysByWeek] = useState<
    Record<string, string[]>
  >({});

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

  const handleApproveDay = (day: string) => {
    setApprovedDaysByWeek((current) => {
      const currentWeekDays = current[selectedWeek] ?? [];

      if (currentWeekDays.includes(day)) {
        return current;
      }

      return {
        ...current,
        [selectedWeek]: [...currentWeekDays, day],
      };
    });
  };

  const handleApproveAll = () => {
    setApprovedDaysByWeek((current) => ({
      ...current,
      [selectedWeek]: APPROVAL_DAYS.map((item) => item.day),
    }));
    onApproveAll?.(selectedWeek);
    onClose();
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

            <View className="mb-4">
              <Text
                className={`mb-2 ${isWeb ? "text-sm font-semibold" : "text-xs font-medium"} text-neutral-500`}
              >
                Week
              </Text>
              <TouchableOpacity
                onPress={onToggleWeekDropdown}
                className={`flex-row items-center justify-between rounded-xl border border-neutral-200 active:opacity-80 ${isWeb ? "min-h-14 px-4 py-3.5" : "min-h-12 px-3 py-3"}`}
              >
                <Text
                  className={`${isWeb ? "text-base" : "text-sm"} ${
                    selectedWeek === "Select Week"
                      ? "text-neutral-400"
                      : "text-neutral-800"
                  }`}
                >
                  {selectedWeek}
                </Text>
                <ChevronDown size={16} color="#737373" />
              </TouchableOpacity>

              {isWeekDropdownOpen ? (
                <View className="mt-2 overflow-hidden rounded-xl border border-neutral-200 bg-white">
                  {weekOptions.map((weekLabel, index) => (
                    <TouchableOpacity
                      key={weekLabel}
                      onPress={() => onSelectWeek(weekLabel)}
                      className={`${isWeb ? "px-4 py-3.5" : "px-3 py-3"} active:bg-neutral-50 ${
                        index < weekOptions.length - 1
                          ? "border-b border-neutral-100"
                          : ""
                      }`}
                    >
                      <Text className="text-sm font-medium text-neutral-800">
                        {weekLabel}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
            </View>

            <View className="gap-3">
              {APPROVAL_DAYS.map((item) => (
                <View
                  key={item.day}
                  className={`flex-row items-center justify-between rounded-2xl border border-neutral-100 ${isWeb ? "bg-neutral-50/60 px-5 py-4" : "px-4 py-3"}`}
                >
                  <View className="flex-1 pr-3">
                    <Text
                      className={`${isWeb ? "text-lg" : "text-base"} font-medium text-slate-800`}
                    >
                      {item.day}
                    </Text>
                    <Text className="mt-0.5 text-sm text-slate-400">
                      {item.hours}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleApproveDay(item.day)}
                    disabled={selectedApprovedDays.includes(item.day)}
                    className={`rounded-xl border active:opacity-80 ${isWeb ? "px-4 py-2.5" : "px-4 py-2"} ${
                      selectedApprovedDays.includes(item.day)
                        ? "border-orange-200 bg-orange-50"
                        : "border-neutral-200 bg-white"
                    }`}
                  >
                    <Text
                      className={`${isWeb ? "text-sm" : "text-xs"} font-medium ${
                        selectedApprovedDays.includes(item.day)
                          ? "text-orange-600"
                          : "text-neutral-500"
                      }`}
                    >
                      {selectedApprovedDays.includes(item.day)
                        ? "Approved"
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
                style={{ backgroundColor: "#1F2937" }}
                className={`items-center justify-center rounded-xl px-4 active:opacity-90 ${isWeb ? "min-h-14" : "min-h-12 py-3"}`}
              >
                <Text className="text-base font-medium text-white">
                  Approve all
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDispute}
                style={{ backgroundColor: "#FFFFFF" }}
                className={`mt-3 items-center justify-center rounded-xl px-4 active:opacity-90 border border-neutral-200 ${isWeb ? "min-h-14" : "min-h-12 py-3"}`}
              >
                <Text className="text-base font-medium text-black">
                  Dispute
                </Text>
              </TouchableOpacity>
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
