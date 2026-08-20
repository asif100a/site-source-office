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
import { router } from "expo-router";
import {
  MUST_HAVE_OPTIONS,
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

const TRADE_OPTIONS = [
  { label: "Groundworker", value: "Groundworker" },
  { label: "Carpenter", value: "Carpenter" },
  { label: "Electrician", value: "Electrician" },
  { label: "Plumber", value: "Plumber" },
  { label: "Bricklayer", value: "Bricklayer" },
  { label: "Painter", value: "Painter" },
  { label: "Scaffolder", value: "Scaffolder" },
];

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

export default function PostAJob() {
  const [hourlyRate, setHourlyRate] = useState(24);
  const [workersNeeded, setWorkersNeeded] = useState(2);
  const [tradeMenuOpen, setTradeMenuOpen] = useState(false);
  const [selectedTrades, setSelectedTrades] = useState<string[]>([
    "Groundworker",
  ]);
  const [notes, setNotes] = useState(
    "Second-floor strip out, skip on site, 7:30am start. Ask for Danny at the gate.",
  );
  const [selectedMustHaves, setSelectedMustHaves] = useState<MustHaveOption[]>([
    "CSCS card",
  ]);
  const [jobDateRange, setJobDateRange] = useState<JobDateRange>({
    from: new Date(2026, 7, 18),
    to: new Date(2026, 7, 21),
  });
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
    () => countWeekdaysInRange(jobDateRange),
    [jobDateRange],
  );
  const selectedTradesLabel = useMemo(() => {
    if (selectedTrades.length === 0) {
      return "Select trade";
    }

    if (selectedTrades.length <= 2) {
      return selectedTrades.join(", ");
    }

    return `${selectedTrades.slice(0, 2).join(", ")} +${selectedTrades.length - 2}`;
  }, [selectedTrades]);

  const totalEstimate = useMemo(
    () => hourlyRate * 9 * Math.max(workingDays, 1) * workersNeeded,
    [hourlyRate, workersNeeded, workingDays],
  );

  const handleCreateJobPost = () => {
    Toast.show({
      type: "success",
      text1: "Job post created",
      text2: "Your job post has been created.",
    })
    console.log("Job post created...!")
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
            {TRADE_OPTIONS.map((option) => {
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
          hint={`£${hourlyRate * 9} per day at 9 hrs`}
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
            active
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
            {workingDays || 0} working days on site
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
                      activeThumbColor={Colors.common.BRAND}
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
        className="mt-3 min-h-[110px] rounded-[20px] bg-white py-4 text-[13px] leading-5 text-[#222222] border border-neutral-200/80"
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
              £{totalEstimate.toLocaleString()}
            </Text>
          </View>

          <Text className="max-w-[150px] text-right text-[12px] font-semibold leading-4 text-[#222222]">
            {workersNeeded} x labourer · {workingDays || 0} days · 9 hr shifts
          </Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleCreateJobPost}
        className="mt-4 items-center justify-center rounded-[18px] py-4"
        style={{ backgroundColor: Colors.common.BRAND }}
      >
        <Text className="text-[13px] font-black text-white">Post Job</Text>
      </TouchableOpacity>

      <Text className="px-5 pb-2 pt-3 text-center text-[11px] leading-4 text-[#7D7D7D]">
        Workers are matched by trade, rating and travel time. You pick who
        starts.
      </Text>
    </View>
  );
}

const countWeekdaysInRange = (range: JobDateRange) => {
  if (!range.from || !range.to) {
    return 0;
  }

  const start = new Date(range.from);
  const end = new Date(range.to);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (start > end) {
    return 0;
  }

  let count = 0;
  const cursor = new Date(start);

  while (cursor <= end) {
    const day = cursor.getDay();

    if (day !== 0 && day !== 6) {
      count += 1;
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return count;
};

