import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  TextInput,
  Switch,
} from "react-native";
import React, { useMemo, useState } from "react";
import { CounterRow, DateCard, FormSectionLabel } from "./_ui";
import { Check, ChevronDown } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import {
  MUST_HAVE_OPTIONS,
  MUST_HAVE_VALUES,
  type JobDateRange,
  type MustHaveOption,
} from "./job-post.constants";
import DateRangeCalendar, {
  formatDateLabel,
} from "@/components/modules/common/DateRangeCalendar";
import TimePickerField, {
  createTimeValue,
} from "@/components/modules/common/TimePickerField";
import Toast from "react-native-toast-message";
import type { JobPostPayload } from "@/store/api/jobApi";
import { TRADES } from "@/assets/data";

const WORKING_DAY_OPTIONS = [
  {
    key: "monday",
    label: "Monday",
    startTime: createTimeValue(7, 30),
    endTime: createTimeValue(16, 30),
    enabled: true,
  },
  {
    key: "tuesday",
    label: "Tuesday",
    startTime: createTimeValue(7, 30),
    endTime: createTimeValue(16, 30),
    enabled: true,
  },
  {
    key: "wednesday",
    label: "Wednesday",
    startTime: createTimeValue(7, 30),
    endTime: createTimeValue(16, 30),
    enabled: true,
  },
  {
    key: "thursday",
    label: "Thursday",
    startTime: createTimeValue(7, 30),
    endTime: createTimeValue(16, 30),
    enabled: true,
  },
  {
    key: "friday",
    label: "Friday",
    startTime: createTimeValue(7, 30),
    endTime: createTimeValue(16, 30),
    enabled: true,
  },
  {
    key: "saturday",
    label: "Saturday",
    startTime: createTimeValue(8, 0),
    endTime: createTimeValue(13, 0),
    enabled: false,
  },
  {
    key: "sunday",
    label: "Sunday",
    startTime: createTimeValue(8, 0),
    endTime: createTimeValue(13, 0),
    enabled: false,
  },
] as const;

type WorkingDayKey = (typeof WORKING_DAY_OPTIONS)[number]["key"];
type WeekendPayRate = "standard" | "1.5x" | "2x";
type WorkingDaySchedule = Record<
  WorkingDayKey,
  {
    enabled: boolean;
    startTime: Date;
    endTime: Date;
    weekendRate: WeekendPayRate;
  }
>;

const WEEKEND_DAY_KEYS: WorkingDayKey[] = ["saturday", "sunday"];
const WEEKEND_RATE_OPTIONS: Exclude<WeekendPayRate, "standard">[] = [
  "1.5x",
  "2x",
];
const WEB_SWITCH_STYLE =
  Platform.OS === "web"
    ? ({ accentColor: Colors.common.BRAND } as const)
    : undefined;

const getInitialWorkingDaySchedule = (): WorkingDaySchedule =>
  Object.fromEntries(
    WORKING_DAY_OPTIONS.map((day) => [
      day.key,
      {
        enabled: day.enabled,
        startTime: day.startTime,
        endTime: day.endTime,
        weekendRate: "standard",
      },
    ]),
  ) as WorkingDaySchedule;

export default function PostAJob({
  locationCoordinates,
  locationValid,
  onCreateJobPost,
  isCreatingJob = false,
}: {
  locationCoordinates: [number, number] | null;
  locationValid: boolean;
  onCreateJobPost: (payload: JobPostPayload) => Promise<boolean>;
  isCreatingJob?: boolean;
}) {
  const [title, setTitle] = useState("");
  const [hourlyRate, setHourlyRate] = useState(24);
  const [workersNeeded, setWorkersNeeded] = useState(2);
  const [tradeMenuOpen, setTradeMenuOpen] = useState(false);
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [selectedMustHaves, setSelectedMustHaves] = useState<MustHaveOption[]>([]);
  const [jobDateRange, setJobDateRange] = useState<JobDateRange>({});
  const [workingDaySchedule, setWorkingDaySchedule] =
    useState<WorkingDaySchedule>({
      monday: {
        enabled: true,
        startTime: createTimeValue(7, 30),
        endTime: createTimeValue(16, 30),
        weekendRate: "standard",
      },
      tuesday: {
        enabled: true,
        startTime: createTimeValue(7, 30),
        endTime: createTimeValue(16, 30),
        weekendRate: "standard",
      },
      wednesday: {
        enabled: true,
        startTime: createTimeValue(7, 30),
        endTime: createTimeValue(16, 30),
        weekendRate: "standard",
      },
      thursday: {
        enabled: true,
        startTime: createTimeValue(7, 30),
        endTime: createTimeValue(16, 30),
        weekendRate: "standard",
      },
      friday: {
        enabled: true,
        startTime: createTimeValue(7, 30),
        endTime: createTimeValue(16, 30),
        weekendRate: "standard",
      },
      saturday: {
        enabled: false,
        startTime: createTimeValue(8, 0),
        endTime: createTimeValue(13, 0),
        weekendRate: "standard",
      },
      sunday: {
        enabled: false,
        startTime: createTimeValue(8, 0),
        endTime: createTimeValue(13, 0),
        weekendRate: "standard",
      },
    });

  const workingDays = useMemo(
    () => countWorkingDaysInRange(jobDateRange, workingDaySchedule),
    [jobDateRange, workingDaySchedule],
  );
  const estimatedBillableHours = useMemo(
    () => countBillableHoursInRange(jobDateRange, workingDaySchedule),
    [jobDateRange, workingDaySchedule],
  );
  const selectedDateCount = useMemo(
    () => countSelectedDatesInRange(jobDateRange),
    [jobDateRange],
  );
  const selectedTradesLabel = useMemo(() => {
    if (selectedTrades.length === 0) {
      return "Select trade";
    }

    if (selectedTrades.length <= 2) {
      return selectedTrades
        .map((trade) => TRADES.find((option) => option.value === trade)?.label ?? trade)
        .join(", ");
    }

    return `${selectedTrades
      .slice(0, 2)
      .map((trade) => TRADES.find((option) => option.value === trade)?.label ?? trade)
      .join(", ")} +${selectedTrades.length - 2}`;
  }, [selectedTrades]);

  const totalEstimate = useMemo(
    () => hourlyRate * estimatedBillableHours * workersNeeded,
    [estimatedBillableHours, hourlyRate, workersNeeded],
  );

  const handleCreateJobPost = async () => {
    if (!title.trim()) {
      Toast.show({ type: "error", text1: "Job title is required" });
      return;
    }
    if(!selectedTrades.length) {
      Toast.show({ type: "error", text1: "Select at least one trade" });
      return;
    }
    if (!jobDateRange.from || !jobDateRange.to) {
      Toast.show({ type: "error", text1: "Select a valid date range" });
      return;
    }
    if (!locationValid || !locationCoordinates) {
      Toast.show({ type: "error", text1: "Select a valid site location" });
      return;
    }
    if (startOfLocalDay(jobDateRange.from) > startOfLocalDay(jobDateRange.to)) {
      Toast.show({ type: "error", text1: "Finish date must be after start date" });
      return;
    }
    if (!notes.trim()) {
      Toast.show({ type: "error", text1: "Job notes are required" });
      return;
    }
    const workingHours = WORKING_DAY_OPTIONS.filter(
      (day) => workingDaySchedule[day.key].enabled,
    );
    if (!workingHours.length || hourlyRate <= 0 || workersNeeded <= 0) {
      Toast.show({ type: "error", text1: "Enter valid job rate, workers, and hours" });
      return;
    }
    if (workingDays <= 0) {
      Toast.show({
        type: "error",
        text1: "Select working days inside the date range",
      });
      return;
    }

    const created = await onCreateJobPost({
      title: title.trim(),
      trades: selectedTrades,
      hourlyRate,
      workersNeeded,
      location: { type: "Point", coordinates: locationCoordinates },
      startDate: formatDateForPayload(jobDateRange.from),
      endDate: formatDateForPayload(jobDateRange.to),
      workingHours: workingHours.map((day) => ({
        day: day.label,
        startTime: formatTime(workingDaySchedule[day.key].startTime),
        endTime: formatTime(workingDaySchedule[day.key].endTime),
        isPayOnePointFiveX: workingDaySchedule[day.key].weekendRate === "1.5x",
        isPayTwoX: workingDaySchedule[day.key].weekendRate === "2x",
      })),
      mustHave: selectedMustHaves.map((item) => MUST_HAVE_VALUES[item]),
      note: notes.trim(),
    });

    if (created) {
      setTitle("");
      setHourlyRate(24);
      setWorkersNeeded(2);
      setTradeMenuOpen(false);
      setSelectedTrades([]);
      setNotes("");
      setSelectedMustHaves([]);
      setJobDateRange({});
      setWorkingDaySchedule(getInitialWorkingDaySchedule());
    }
  };

  const toggleMustHave = (option: MustHaveOption) => {
    setSelectedMustHaves((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  };

  const toggleTrade = (trade: string) => {
    setSelectedTrades((current) =>
      current.includes(trade)
        ? current.filter((item) => item !== trade)
        : [...current, trade],
    );
  };

  const adjustValue = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    nextValue: number,
  ) => {
    setter(Math.max(1, nextValue));
  };

  const toggleWorkingDay = (day: WorkingDayKey) => {
    setWorkingDaySchedule((current) => ({
      ...current,
      [day]: {
        ...current[day],
        enabled: !current[day].enabled,
      },
    }));
  };

  const updateWorkingDayTime = (
    day: WorkingDayKey,
    field: "startTime" | "endTime",
    value: Date,
  ) => {
    setWorkingDaySchedule((current) => ({
      ...current,
      [day]: {
        ...current[day],
        [field]: value,
      },
    }));
  };

  const updateWeekendPayRate = (
    day: WorkingDayKey,
    rate: Exclude<WeekendPayRate, "standard">,
  ) => {
    setWorkingDaySchedule((current) => ({
      ...current,
      [day]: {
        ...current[day],
        weekendRate: current[day].weekendRate === rate ? "standard" : rate,
      },
    }));
  };

  return (
    <View className="px-5 pt-3">
      <Text className="text-[20px] font-black tracking-[-0.3px] text-[#121212]">
        Post a job
      </Text>

      <FormSectionLabel label="Job title" />
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Senior Site Electrician Needed"
        placeholderTextColor="#999999"
        className="mt-3 rounded-xl border border-neutral-200/80 bg-white py-4 text-[13px] text-[#222222]"
        style={{ paddingHorizontal: 16 }}
      />

      <FormSectionLabel label="Trade needed" />
      <View className="mt-3">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setTradeMenuOpen((current) => !current)}
          className="flex-row items-center justify-between rounded-[18px] bg-white px-4 py-4"
        >
          <Text className="text-[13px] font-semibold text-[#202020]">
            {selectedTradesLabel}
          </Text>
          <ChevronDown size={20} color="#727272" />
        </TouchableOpacity>

        {tradeMenuOpen ? (
          <View className="mt-2 overflow-hidden rounded-[18px] border border-neutral-200 bg-white">
            {TRADES.map((option) => {
              const selected = selectedTrades.includes(option.value);

              return (
                <TouchableOpacity
                  key={option.value}
                  activeOpacity={0.8}
                  onPress={() => toggleTrade(option.value)}
                  className={`min-h-[48px] flex-row items-center justify-between px-4 ${
                    selected ? "bg-[#FFF5F2]" : "bg-white"
                  }`}
                >
                  <Text
                    className={`text-[13px] ${
                      selected
                        ? "font-bold text-[#FF5500]"
                        : "font-medium text-neutral-800"
                    }`}
                  >
                    {option.label}
                  </Text>
                  {selected ? (
                    <Check size={16} color={Colors.common.BRAND} />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}

        {selectedTrades.length > 0 ? (
          <View className="mt-3 flex-row flex-wrap gap-2">
            {selectedTrades.map((trade) => (
              <Pressable
                key={trade}
                onPress={() => toggleTrade(trade)}
                className="rounded-full bg-[#FFF1EA] px-3 py-2"
              >
                <Text className="text-[12px] font-bold text-[#FF5500]">
                  {trade}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>

      <View className="mt-4 rounded-[22px] bg-white p-4">
        <CounterRow
          label="Hourly rate"
          hint="Market rate here is £22-£28/hr"
          value={`£${hourlyRate}/hr`}
          onDecrease={() => adjustValue(setHourlyRate, hourlyRate - 1)}
          onIncrease={() => adjustValue(setHourlyRate, hourlyRate + 1)}
        />

        <View className="my-4 h-px bg-[#EFEFEF]" />

        <CounterRow
          label="Workers needed"
          hint={`£${formatCurrencyAmount(hourlyRate * estimatedBillableHours)} per worker for selected hours`}
          value={`${workersNeeded}`}
          onDecrease={() => adjustValue(setWorkersNeeded, workersNeeded - 1)}
          onIncrease={() => adjustValue(setWorkersNeeded, workersNeeded + 1)}
        />
      </View>

      <FormSectionLabel label="Job dates" />
      <View className="mt-3 rounded-[24px] bg-white px-3 py-4">
        <View className="flex-row gap-3">
          <DateCard
            label="Start"
            value={formatDateLabel(jobDateRange.from)}
            // active
          />
          <DateCard label="Finish" value={formatDateLabel(jobDateRange.to)} />
        </View>

        <View className="mt-4">
          <DateRangeCalendar
            value={jobDateRange}
            onChange={setJobDateRange}
            onClear={() => setJobDateRange({})}
            summaryEmptyLabel="Select job dates"
          />
        </View>

        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-[12px] font-medium text-[#555555]">
            {selectedDateCount || 0} selected dates
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setJobDateRange({})}
          >
            <Text
              className="text-[12px] font-bold"
              style={{ color: Colors.common.BRAND }}
            >
              Clear
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FormSectionLabel label="Working hours" />
      <View className="mt-3 rounded-[24px] bg-white p-4">
        <View className="gap-3">
          {WORKING_DAY_OPTIONS.map((day) => {
            const schedule = workingDaySchedule[day.key];
            const enabled = schedule.enabled;
            const showWeekendRates = WEEKEND_DAY_KEYS.includes(day.key);

            return (
              <View
                key={day.key}
                className="rounded-[18px] border border-[#EEEEEE] px-3 py-3"
              >
                <View className="flex-row items-center justify-between gap-3">
                  <View className="flex-row items-center gap-3">
                    <Switch
                      value={enabled}
                      onValueChange={() => toggleWorkingDay(day.key)}
                      trackColor={{ false: "#E6E6E6", true: "#FFD4BF" }}
                      thumbColor={enabled ? Colors.common.BRAND : "#FFFFFF"}
                      ios_backgroundColor="#E6E6E6"
                      style={WEB_SWITCH_STYLE as any}
                    />
                    <Text className="text-[13px] font-bold text-[#202020]">
                      {day.label}
                    </Text>
                  </View>

                  <View
                    className={`flex-row items-center gap-2 ${
                      enabled ? "opacity-100" : "opacity-50"
                    }`}
                  >
                    <TimePickerField
                      value={schedule.startTime}
                      onChange={(value) =>
                        updateWorkingDayTime(day.key, "startTime", value)
                      }
                      disabled={!enabled}
                    />
                    <Text className="text-[12px] font-semibold text-[#777777]">
                      to
                    </Text>
                    <TimePickerField
                      value={schedule.endTime}
                      onChange={(value) =>
                        updateWorkingDayTime(day.key, "endTime", value)
                      }
                      disabled={!enabled}
                    />
                  </View>
                </View>

                {showWeekendRates ? (
                  <View className="mt-3 flex-row items-center gap-2">
                    {WEEKEND_RATE_OPTIONS.map((rate) => {
                      const selected = schedule.weekendRate === rate;

                      return (
                        <Pressable
                          key={rate}
                          onPress={() => updateWeekendPayRate(day.key, rate)}
                          disabled={!enabled}
                          className={`flex-row items-center gap-2 rounded-full border px-3 py-2 ${
                            selected
                              ? "border-[#FF5A1F] bg-[#FFF1EA]"
                              : "border-[#E9E9E9] bg-white"
                          } ${enabled ? "opacity-100" : "opacity-50"}`}
                        >
                          <View
                            className={`h-4 w-4 items-center justify-center rounded-[4px] border ${
                              selected
                                ? "border-[#FF5A1F] bg-[#FF5A1F]"
                                : "border-[#CFCFCF] bg-white"
                            }`}
                          >
                            {selected ? (
                              <Check size={11} color="#FFFFFF" />
                            ) : null}
                          </View>
                          <Text className="text-[12px] font-bold text-[#202020]">
                            {rate} pay
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      </View>

      <FormSectionLabel label="Must have" />
      <View className="mt-3 flex-row flex-wrap gap-3">
        {MUST_HAVE_OPTIONS.map((option) => {
          const selected = selectedMustHaves.includes(option);

          return (
            <Pressable
              key={option}
              onPress={() => toggleMustHave(option)}
              className={`rounded-full px-4 py-3 ${
                selected ? "bg-[#111111]" : "bg-white"
              }`}
            >
              <Text
                className={`text-sm font-bold ${
                  selected ? "text-white" : "text-[#606060]"
                }`}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FormSectionLabel label="Job notes" />
      <TextInput
        value={notes}
        onChangeText={setNotes}
        multiline
        textAlignVertical="top"
        placeholder="Add site notes, access details, or start instructions"
        className="mt-3 min-h-[110px] rounded-[20px] bg-white py-4 text-[13px] leading-5 text-[#222222] border border-neutral-200/80 placeholder:text-[#A3A3A3]"
        style={{
          paddingHorizontal: 16,
        }}
      />

      <View className="mt-6 rounded-[22px] bg-white px-4 py-5">
        <View className="flex-row items-end justify-between gap-4">
          <View>
            <Text className="text-[11px] font-bold uppercase tracking-[1.3px] text-[#222222]">
              Estimated total
            </Text>
            <Text className="mt-1 text-[24px] font-black tracking-[-0.6px] text-[#222222]">
              £{formatCurrencyAmount(totalEstimate)}
            </Text>
          </View>

          <Text className="max-w-[170px] text-right text-[12px] font-semibold leading-4 text-[#222222]">
            {workersNeeded} x labourer · {formatHourCount(estimatedBillableHours)} billable hrs
          </Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleCreateJobPost}
        disabled={isCreatingJob}
        className="mt-4 items-center justify-center rounded-[18px] py-4"
        style={{ backgroundColor: Colors.common.BRAND }}
      >
        <Text className="text-[13px] font-black text-white">
          {isCreatingJob ? "Posting..." : "Post Job"}
        </Text>
      </TouchableOpacity>

      <Text className="px-5 pb-2 pt-3 text-center text-[11px] leading-4 text-[#7D7D7D]">
        Workers are matched by trade, rating and travel time. You pick who
        starts.
      </Text>
    </View>
  );
}

const countWorkingDaysInRange = (
  range: JobDateRange,
  schedule: WorkingDaySchedule,
) => {
  if (!range.from || !range.to) {
    return 0;
  }

  const start = startOfLocalDay(range.from);
  const end = startOfLocalDay(range.to);

  if (start > end) {
    return 0;
  }

  let count = 0;
  const cursor = startOfLocalDay(start);
  const dayKeys: WorkingDayKey[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  while (cursor <= end) {
    const dayKey = dayKeys[cursor.getDay()];

    if (schedule[dayKey].enabled) {
      count += 1;
    }

    cursor.setDate(cursor.getDate() + 1);
    cursor.setHours(0, 0, 0, 0);
  }

  return count;
};

const countBillableHoursInRange = (
  range: JobDateRange,
  schedule: WorkingDaySchedule,
) => {
  if (!range.from || !range.to) {
    return 0;
  }

  const start = startOfLocalDay(range.from);
  const end = startOfLocalDay(range.to);

  if (start > end) {
    return 0;
  }

  let hours = 0;
  const cursor = startOfLocalDay(start);
  const dayKeys: WorkingDayKey[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  while (cursor <= end) {
    const dayKey = dayKeys[cursor.getDay()];
    const daySchedule = schedule[dayKey];

    if (daySchedule.enabled) {
      hours +=
        getShiftHours(daySchedule.startTime, daySchedule.endTime) *
        getPayMultiplier(daySchedule.weekendRate);
    }

    cursor.setDate(cursor.getDate() + 1);
    cursor.setHours(0, 0, 0, 0);
  }

  return hours;
};

const getShiftHours = (startTime: Date, endTime: Date) => {
  const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
  const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();

  return Math.max(0, (endMinutes - startMinutes) / 60);
};

const getPayMultiplier = (rate: WeekendPayRate) => {
  if (rate === "1.5x") {
    return 1.5;
  }

  if (rate === "2x") {
    return 2;
  }

  return 1;
};

const formatHourCount = (hours: number) =>
  Number.isInteger(hours) ? `${hours}` : hours.toFixed(1);

const formatCurrencyAmount = (amount: number) =>
  amount.toLocaleString(undefined, {
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  });

const startOfLocalDay = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate());

const countSelectedDatesInRange = (range: JobDateRange) => {
  if (!range.from || !range.to) {
    return 0;
  }

  const start = startOfLocalDay(range.from);
  const end = startOfLocalDay(range.to);

  if (start > end) {
    return 0;
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.round((end.getTime() - start.getTime()) / millisecondsPerDay) + 1;
};

const formatDateForPayload = (value: Date) => {
  const date = startOfLocalDay(value);

  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  ).toISOString();
};

const formatTime = (value: Date) =>
  `${String(value.getHours()).padStart(2, "0")}:${String(
    value.getMinutes(),
  ).padStart(2, "0")}`;
