import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Pressable,
  TextInput,
} from "react-native";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
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
  { key: "monday", label: "Monday", startTime: createTimeValue(7, 30), endTime: createTimeValue(16, 30), enabled: true },
  { key: "tuesday", label: "Tuesday", startTime: createTimeValue(7, 30), endTime: createTimeValue(16, 30), enabled: true },
  { key: "wednesday", label: "Wednesday", startTime: createTimeValue(7, 30), endTime: createTimeValue(16, 30), enabled: true },
  { key: "thursday", label: "Thursday", startTime: createTimeValue(7, 30), endTime: createTimeValue(16, 30), enabled: true },
  { key: "friday", label: "Friday", startTime: createTimeValue(7, 30), endTime: createTimeValue(16, 30), enabled: true },
  { key: "saturday", label: "Saturday", startTime: createTimeValue(8, 0), endTime: createTimeValue(13, 0), enabled: false },
  { key: "sunday", label: "Sunday", startTime: createTimeValue(8, 0), endTime: createTimeValue(13, 0), enabled: false },
] as const;

type WorkingDayKey = (typeof WORKING_DAY_OPTIONS)[number]["key"];
type WeekendPayRate = "standard" | "1.5x" | "2x";
type WorkingDaySchedule = Record<
  WorkingDayKey,
  { enabled: boolean; startTime: Date; endTime: Date; weekendRate: WeekendPayRate }
>;

const WEEKEND_DAY_KEYS: WorkingDayKey[] = ["saturday", "sunday"];
const WEEKEND_RATE_OPTIONS: Exclude<WeekendPayRate, "standard">[] = ["1.5x", "2x"];
const WEB_SWITCH_STYLE = Platform.OS === "web"
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

export default function WebPostJobSection({
  hourlyRate,
  workersNeeded,
  setHourlyRate,
  setWorkersNeeded,
  locationCoordinates,
  locationValid,
  onCreateJobPost,
  isCreatingJob = false,
}: {
  hourlyRate: number;
  workersNeeded: number;
  setHourlyRate: Dispatch<SetStateAction<number>>;
  setWorkersNeeded: Dispatch<SetStateAction<number>>;
  locationCoordinates: [number, number] | null;
  locationValid: boolean;
  onCreateJobPost: (payload: JobPostPayload) => Promise<boolean>;
  isCreatingJob?: boolean;
}) {
  const [title, setTitle] = useState("");
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

  const handleCreateJobPost = async () => {
    if (!title.trim()) {
      Toast.show({ type: "error", text1: "Job title is required" });
      return;
    }
    if (!selectedTrades.length || !jobDateRange.from || !jobDateRange.to) {
      Toast.show({ type: "error", text1: "Complete the job details first" });
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

  const workingDays = useMemo(
    () => countWorkingDaysInRange(jobDateRange, workingDaySchedule),
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
    <View className="rounded-[30px] border border-neutral-200/80 bg-white p-6 shadow-sm">
      <View className="mb-6 flex-row items-start justify-between gap-4">
        <View>
      <Text className="text-[28px] font-bold tracking-tight text-neutral-950">
        Post a job
      </Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Job title"
        placeholderTextColor="#999999"
        className="mt-4 rounded-[18px] border border-neutral-200 bg-neutral-50 px-4 py-4 text-sm text-[#222222]"
      />
          <Text className="mt-2 text-sm text-neutral-500">
            Set the role, timing, and site requirements before you send this
            posting live.
          </Text>
        </View>

        <View className="rounded-full bg-neutral-100 px-3 py-2">
          <Text className="text-[11px] font-bold text-neutral-700">
            Draft mode
          </Text>
        </View>
      </View>

      <FormSectionLabel label="Trade needed" />
      <View className="mt-3">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setTradeMenuOpen((current) => !current)}
          className="flex-row items-center justify-between rounded-[18px] border border-neutral-200 bg-neutral-50 px-4 py-4"
        >
          <Text className="text-sm font-semibold text-[#202020]">
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
                    className={`text-sm ${
                      selected
                        ? "font-bold text-[#FF5500]"
                        : "font-medium text-neutral-800"
                    }`}
                  >
                    {option.label}
                  </Text>
                  {selected ? <Check size={16} color={Colors.common.BRAND} /> : null}
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

      <View className="mt-5 grid gap-4 xl:grid-cols-2">
        <View className="rounded-[24px] border border-neutral-100 bg-white p-5">
          <CounterRow
            label="Hourly rate"
            hint="Market rate here is £22-£28/hr"
            value={`£${hourlyRate}/hr`}
            onDecrease={() => adjustValue(setHourlyRate, hourlyRate - 1)}
            onIncrease={() => adjustValue(setHourlyRate, hourlyRate + 1)}
          />
        </View>

        <View className="rounded-[24px] border border-neutral-100 bg-white p-5">
          <CounterRow
            label="Workers needed"
            hint={`£${hourlyRate * 9} per day at 9 hrs`}
            value={`${workersNeeded}`}
            onDecrease={() => adjustValue(setWorkersNeeded, workersNeeded - 1)}
            onIncrease={() => adjustValue(setWorkersNeeded, workersNeeded + 1)}
          />
        </View>
      </View>

      <FormSectionLabel label="Job dates" />
      <View className="mt-3 rounded-[26px] border border-neutral-100 bg-white p-5">
        <View className="grid gap-4 xl:grid-cols-[220px,220px,1fr]">
          <DateCard
            label="Start"
            value={formatDateLabel(jobDateRange.from)}
            active
          />
          <DateCard label="Finish" value={formatDateLabel(jobDateRange.to)} />

          <DateRangeCalendar
            value={jobDateRange}
            onChange={setJobDateRange}
            onClear={() => setJobDateRange({})}
            summaryEmptyLabel="Select job dates"
            containerHeight={280}
          />
        </View>

        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-sm font-medium text-[#555555]">
            {selectedDateCount || 0} selected dates
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setJobDateRange({})}
          >
            <Text
              className="text-sm font-bold"
              style={{ color: Colors.common.BRAND }}
            >
              Clear
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-6 grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <View>
          <FormSectionLabel label="Working hours" />
          <View className="mt-3 rounded-[24px] border border-neutral-100 bg-white p-5">
            <View className="gap-3">
              {WORKING_DAY_OPTIONS.map((day) => {
                const schedule = workingDaySchedule[day.key];
                const enabled = schedule.enabled;
                const showWeekendRates = WEEKEND_DAY_KEYS.includes(day.key);

                return (
                  <View
                    key={day.key}
                    className="rounded-[18px] border border-[#EEEEEE] px-4 py-4"
                  >
                    <View className="flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                      <View className="flex-row items-center gap-3">
                        <Switch
                          value={enabled}
                          onValueChange={() => toggleWorkingDay(day.key)}
                          trackColor={{ false: "#E6E6E6", true: "#FFD4BF" }}
                          thumbColor={enabled ? Colors.common.BRAND : "#FFFFFF"}
                          ios_backgroundColor="#E6E6E6"
                          style={WEB_SWITCH_STYLE as any}
                        />
                        <Text className="text-sm font-bold text-[#202020]">
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
                        <Text className="text-sm font-semibold text-[#777777]">
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
                      <View className="mt-3 flex-row flex-wrap items-center gap-2">
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
                                {selected ? <Check size={11} color="#FFFFFF" /> : null}
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
        </View>

        <View>
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
        </View>
      </View>

      <FormSectionLabel label="Job notes" />
      <TextInput
        value={notes}
        onChangeText={setNotes}
        multiline
        textAlignVertical="top"
        placeholder="Add site notes, access details, or start instructions"
        className="mt-3 min-h-[140px] rounded-[22px] border border-neutral-100 bg-neutral-50 px-4 py-4 text-sm leading-6 text-[#222222] placeholder:text-[#999999]"
      />

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleCreateJobPost}
        disabled={isCreatingJob}
        className="mt-5 items-center justify-center rounded-[18px] py-4"
        style={{ backgroundColor: Colors.common.BRAND }}
      >
        <Text className="text-sm font-bold text-white">
          {isCreatingJob ? "Posting..." : "Post Job"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const formatTime = (value: Date) =>
  `${String(value.getHours()).padStart(2, "0")}:${String(
    value.getMinutes(),
  ).padStart(2, "0")}`;

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
