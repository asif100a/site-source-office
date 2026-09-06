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
import Toast from "react-native-toast-message";
import { useCreateTimesheetMutation } from "@/store/api/timesheetApi";

type WeekdayField = {
  key: string;
  date: Date;
  dateKey: string;
};

type TimesheetWeekOption = {
  id: string;
  week: number;
  label: string;
  startDate: Date;
  endDate: Date;
};

type TimesheetPayload = {
  week: number;
  timeSheetDays: {
    day: string;
    hours: number;
  }[];
};

type ServerTimesheetWeek = {
  week: number;
  label: string;
  startDate: string;
  endDate: string;
};

const addDays = (date: Date, days: number) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const parseScheduleDate = (dateLabel: string) => {
  const parsedDate = new Date(dateLabel);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  return null;
};

const normalizeDate = (date: Date | null) => {
  if (!date) return null;

  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
};

const formatWeekdayLabel = (date: Date) => {
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
  const dayNumber = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });

  return `${dayName} - ${dayNumber} ${month}`;
};

const formatWeekOptionLabel = (week?: TimesheetWeekOption) => {
  if (!week) return "No week available";

  const startDate = week.startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endDate = week.endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${week.label} (${startDate} - ${endDate})`;
};

const getPayloadDay = (date: Date) =>
  date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getTimesheetWeeks = (
  timeSheetWeeks: ServerTimesheetWeek[],
): TimesheetWeekOption[] =>
  timeSheetWeeks
    .map((week) => {
      const startDate = normalizeDate(parseScheduleDate(week.startDate));
      const endDate = normalizeDate(parseScheduleDate(week.endDate));

      if (!startDate || !endDate || startDate > endDate) {
        return null;
      }

      return {
        id: week.label || `week-${week.week}`,
        week: week.week,
        label: week.label || `week-${week.week}`,
        startDate,
        endDate,
      };
    })
    .filter(Boolean) as TimesheetWeekOption[];

const createWeekFields = (
  weekStartDate: Date,
  weekEndDate: Date,
): WeekdayField[] => {
  const weekStart = normalizeDate(weekStartDate);
  const weekEnd = normalizeDate(weekEndDate);
  if (!weekStart || !weekEnd) return [];

  const fields: WeekdayField[] = [];
  let currentDate = weekStart;

  while (currentDate <= weekEnd) {
    const dateKey = getDateKey(currentDate);

    fields.push({
      key: dateKey,
      date: currentDate,
      dateKey,
    });
    currentDate = addDays(currentDate, 1);
  }

  return fields;
};

export default function RequestApprovalModal({
  showApprovalModal,
  setShowApprovalModal,
  jobId,
  timeSheetWeeks,
}: {
  showApprovalModal: boolean;
  setShowApprovalModal: React.Dispatch<React.SetStateAction<boolean>>;
  jobId: string;
  timeSheetWeeks: ServerTimesheetWeek[];
}) {
  const [createTimesheet, { isLoading: isSubmitting }] =
    useCreateTimesheetMutation();
  const weekOptions = useMemo(
    () => getTimesheetWeeks(timeSheetWeeks),
    [timeSheetWeeks],
  );
  const [selectedWeekId, setSelectedWeekId] = useState(weekOptions[0]?.id);
  const [isWeekDropdownOpen, setIsWeekDropdownOpen] = useState(false);
  const selectedWeek =
    weekOptions.find((week) => week.id === selectedWeekId) ?? weekOptions[0];
  const weekFields = useMemo(
    () =>
      selectedWeek
        ? createWeekFields(selectedWeek.startDate, selectedWeek.endDate)
        : [],
    [selectedWeek],
  );
  const [dailyHours, setDailyHours] = useState<Record<string, string>>({});

  const totalHours = useMemo(
    () =>
      weekFields.reduce((sum, field) => {
        const hours = Number.parseFloat(dailyHours[field.dateKey] ?? "");
        return sum + (Number.isFinite(hours) ? hours : 0);
      }, 0),
    [dailyHours, weekFields],
  );

  useEffect(() => {
    if (showApprovalModal) {
      setSelectedWeekId(weekOptions[0]?.id);
      setIsWeekDropdownOpen(false);
      setDailyHours({});
    }
  }, [showApprovalModal, weekOptions]);

  const handleSubmit = async () => {
    if (!jobId) {
      Toast.show({ type: "error", text1: "Job is missing" });
      return;
    }

    if (!selectedWeek || !weekFields.length) {
      Toast.show({ type: "error", text1: "No timesheet week available" });
      return;
    }

    const missingField = weekFields.find((field) => {
      const value = dailyHours[field.dateKey]?.trim();
      const hours = Number.parseFloat(value ?? "");

      return !value || !Number.isFinite(hours) || hours <= 0;
    });

    if (missingField) {
      Toast.show({
        type: "error",
        text1: "All weekdays are required",
        text2: `Enter valid hours for ${getPayloadDay(missingField.date).toLowerCase()}.`,
      });
      return;
    }

    const timeSheetDays: TimesheetPayload["timeSheetDays"] = weekFields.map(
      (field) => ({
        day: getPayloadDay(field.date),
        hours: Number.parseFloat(dailyHours[field.dateKey] ?? "0"),
      }),
    );

    const payload: TimesheetPayload = {
      week: selectedWeek.week,
      timeSheetDays,
    };

    try {
      await createTimesheet({
        id: jobId,
        data: payload,
      }).unwrap();

      Toast.show({
        type: "success",
        text1: "Timesheet submitted",
        text2: "Your hours were sent for approval.",
      });
      setShowApprovalModal(false);
    } catch (error: any) {
      console.error("Error submitting timesheet:", error);
      Toast.show({
        type: "error",
        text1: "Could not submit timesheet",
        text2: error?.data?.message ?? error?.message ?? "Please try again.",
      });
    }
  };

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
                  className="rounded-2xl border border-neutral-200/70 bg-white px-4 py-4 active:opacity-85"
                >
                    <View className="flex-row items-center justify-between gap-3">
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-neutral-950">
                          {formatWeekOptionLabel(selectedWeek)}
                        </Text>
                      <Text className="mt-1 text-[11px] font-medium text-neutral-400">
                        Fill in the hours worked for each day of the week.
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
                      const isSelected = week.id === selectedWeekId;

                      return (
                        <TouchableOpacity
                          key={week.id}
                          onPress={() => {
                            setSelectedWeekId(week.id);
                            setDailyHours({});
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
                            {formatWeekOptionLabel(week)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : null}
                <View className="mt-3 overflow-hidden rounded-2xl border border-neutral-200/70 bg-white">
                  {weekFields.map((field, index) => {
                    const isLast = index === weekFields.length - 1;

                    return (
                      <View
                        key={field.key}
                        className={`px-4 py-3 ${
                          isLast ? "pb-4" : ""
                        } ${index === 0 ? "pt-4" : ""} ${
                          !isLast ? "border-b border-neutral-100" : ""
                        }`}
                      >
                        <Text className="mb-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                          {formatWeekdayLabel(field.date)}
                        </Text>
                        <View className="flex-row items-center rounded-2xl border border-neutral-200/60 bg-neutral-50 px-4 py-3">
                          <TextInput
                            className="flex-1 py-0 text-sm font-semibold text-neutral-800"
                            placeholder="Enter hours"
                            placeholderTextColor="#A3A3A3"
                            keyboardType="numeric"
                            editable={!isSubmitting}
                            value={dailyHours[field.dateKey] ?? ""}
                            onChangeText={(value) =>
                              setDailyHours((current) => ({
                                ...current,
                                [field.dateKey]: value,
                              }))
                            }
                          />
                          <Text className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                            hrs
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
                <View className="mt-3 flex-row items-center justify-between rounded-2xl border border-neutral-200/70 bg-neutral-50 px-4 py-3">
                  <Text className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Total hours
                  </Text>
                  <Text className="text-sm font-extrabold text-neutral-900">
                    {totalHours.toFixed(1)} hrs
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={{ backgroundColor: Colors.common.GRAY_DARK }}
            className="mb-3 w-full items-center justify-center rounded-2xl py-4 active:opacity-90"
          >
            <Text className="text-sm font-extrabold text-white">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
