import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, X } from "lucide-react-native";
import { Colors } from "@/constants/Colors";

type TimesheetWeekOption = {
  id: string;
  label: string;
  startDate: Date;
};

const WEEKS_TO_SHOW = 3;

const addDays = (date: Date, days: number) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const getOrdinalSuffix = (day: number) => {
  if (day >= 11 && day <= 13) return "th";

  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const formatWeekStartDate = (date: Date) => {
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "long" });

  return `${day}${getOrdinalSuffix(day)} ${month}`;
};

const parseScheduleDate = (dateLabel: string) => {
  const parsedDate = new Date(dateLabel);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  return new Date();
};

const getTimesheetWeeks = (scheduleStartDate: string) => {
  const startDate = parseScheduleDate(scheduleStartDate);

  return Array.from({ length: WEEKS_TO_SHOW }, (_, index) => {
    const weekStartDate = addDays(startDate, index * 7);

    return {
      id: `week-${index + 1}`,
      label: `Week ${index + 1} - ${formatWeekStartDate(weekStartDate)}`,
      startDate: weekStartDate,
    };
  });
};

export default function RequestApprovalModal({
  showApprovalModal,
  setShowApprovalModal,
  scheduleStartDate,
}: {
  showApprovalModal: boolean;
  setShowApprovalModal: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleStartDate: string;
}) {
  const weekOptions = useMemo(
    () => getTimesheetWeeks(scheduleStartDate),
    [scheduleStartDate],
  );
  const [selectedWeekId, setSelectedWeekId] = useState(weekOptions[0]?.id);
  const [isWeekDropdownOpen, setIsWeekDropdownOpen] = useState(false);
  const [totalHours, setTotalHours] = useState("");

  const selectedWeek =
    weekOptions.find((week) => week.id === selectedWeekId) ?? weekOptions[0];

  useEffect(() => {
    if (showApprovalModal) {
      setSelectedWeekId(weekOptions[0]?.id);
      setIsWeekDropdownOpen(false);
      setTotalHours("");
    }
  }, [showApprovalModal, weekOptions]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showApprovalModal}
      onRequestClose={() => setShowApprovalModal(false)}
    >
      <View className="flex-1 justify-end bg-neutral-500/50">
        <View className="rounded-t-4xl border-t border-neutral-100 bg-white p-6 pb-12 shadow-2xl">
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-lg font-extrabold tracking-tight text-neutral-900">
              Submit Timesheet
            </Text>
            <TouchableOpacity
              onPress={() => setShowApprovalModal(false)}
              className="h-8 w-8 items-center justify-center rounded-full bg-neutral-100 active:opacity-75"
            >
              <X size={16} color="#333333" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="mb-6 max-h-100"
            showsVerticalScrollIndicator={false}
          >
            <View className="gap-4.5 pr-1">
              <View>
                <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Week
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    setIsWeekDropdownOpen((currentValue) => !currentValue)
                  }
                  className="rounded-2xl border border-neutral-200/60 bg-neutral-50 px-4 py-3.5 active:opacity-85"
                >
                  <View className="flex-row items-center justify-between gap-3">
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-neutral-800">
                        {selectedWeek?.label ?? "Select week"}
                      </Text>
                      <Text className="mt-1 text-[11px] font-medium text-neutral-400">
                        Pulled from schedule start date: {scheduleStartDate}
                      </Text>
                    </View>
                    <ChevronDown
                      size={18}
                      color="#737373"
                      style={{
                        transform: [
                          { rotate: isWeekDropdownOpen ? "180deg" : "0deg" },
                        ],
                      }}
                    />
                  </View>
                </TouchableOpacity>

                {isWeekDropdownOpen ? (
                  <View className="mt-2 overflow-hidden rounded-2xl border border-neutral-200/70 bg-white">
                    {weekOptions.map((week) => {
                      const isSelected = week.id === selectedWeek?.id;

                      return (
                        <TouchableOpacity
                          key={week.id}
                          onPress={() => {
                            setSelectedWeekId(week.id);
                            setIsWeekDropdownOpen(false);
                          }}
                          className={`px-4 py-3 active:opacity-80 ${
                            isSelected ? "bg-orange-50" : "bg-white"
                          }`}
                        >
                          <Text
                            className={`text-sm font-semibold ${
                              isSelected
                                ? "text-neutral-950"
                                : "text-neutral-600"
                            }`}
                          >
                            {week.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : null}
              </View>

              <View>
                <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Total working hours
                </Text>
                <View className="flex-row items-center rounded-2xl border border-neutral-200/60 bg-neutral-50 px-4 py-3">
                  <TextInput
                    className="flex-1 py-0 text-sm font-semibold text-neutral-800"
                    placeholder="Enter total hours for the selected week"
                    placeholderTextColor="#A3A3A3"
                    keyboardType="numeric"
                    value={totalHours}
                    onChangeText={setTotalHours}
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            onPress={() => setShowApprovalModal(false)}
            style={{ backgroundColor: Colors.common.GRAY_DARK }}
            className="mb-3 w-full items-center justify-center rounded-2xl py-4 active:opacity-90"
          >
            <Text className="text-sm font-extrabold text-white">Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
