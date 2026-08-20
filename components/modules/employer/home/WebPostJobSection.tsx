import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Pressable,
  TextInput,
} from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import { CounterRow, DateCard, FormSectionLabel, TimePill } from "./_ui";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import {
  MUST_HAVE_OPTIONS,
  type MustHaveOption,
} from "./job-post.constants";

const CALENDAR_DAYS = [
  { value: 10, active: true },
  { value: 11, highlighted: true },
  { value: 12, highlighted: true },
  { value: 13, highlighted: true },
  { value: 14, highlighted: true },
  { value: 15, highlighted: true },
  { value: 16, highlighted: true },
  { value: 17, highlighted: true },
  { value: 18, highlighted: true },
  { value: 19, highlighted: true },
  { value: 20, highlighted: true },
  { value: 21, active: true },
  { value: 22 },
  { value: 23 },
  { value: 24 },
  { value: 25 },
  { value: 26 },
  { value: 27 },
  { value: 28 },
  { value: 29 },
  { value: 30 },
  { value: 31 },
];

const TRADE_OPTIONS = [
  { label: "Groundworker", value: "Groundworker" },
  { label: "Carpenter", value: "Carpenter" },
  { label: "Electrician", value: "Electrician" },
  { label: "Plumber", value: "Plumber" },
  { label: "Bricklayer", value: "Bricklayer" },
  { label: "Painter", value: "Painter" },
  { label: "Scaffolder", value: "Scaffolder" },
];

export default function WebPostJobSection({
  hourlyRate,
  workersNeeded,
  setHourlyRate,
  setWorkersNeeded,
}: {
  hourlyRate: number;
  workersNeeded: number;
  setHourlyRate: Dispatch<SetStateAction<number>>;
  setWorkersNeeded: Dispatch<SetStateAction<number>>;
}) {
  const [weekendWork, setWeekendWork] = useState(false);
  const [tradeMenuOpen, setTradeMenuOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState("Groundworker");
  const [notes, setNotes] = useState(
    "Second-floor strip out, skip on site, 7:30am start. Ask for Danny at the gate.",
  );
  const [selectedMustHaves, setSelectedMustHaves] = useState<MustHaveOption[]>([
    "CSCS card",
  ]);

  const toggleMustHave = (option: MustHaveOption) => {
    setSelectedMustHaves((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  };

  const adjustValue = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    nextValue: number,
  ) => {
    setter(Math.max(1, nextValue));
  };

  return (
    <View className="rounded-[30px] border border-neutral-200/80 bg-white p-6 shadow-sm">
      <View className="mb-6 flex-row items-start justify-between gap-4">
        <View>
          <Text className="text-[28px] font-bold tracking-tight text-neutral-950">
            Post a job
          </Text>
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
            {selectedTrade || "Select trade"}
          </Text>
          <ChevronDown size={20} color="#727272" />
        </TouchableOpacity>

        {tradeMenuOpen ? (
          <View className="mt-2 overflow-hidden rounded-[18px] border border-neutral-200 bg-white">
            {TRADE_OPTIONS.map((option) => {
              const selected = selectedTrade === option.value;

              return (
                <TouchableOpacity
                  key={option.value}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedTrade(option.value);
                    setTradeMenuOpen(false);
                  }}
                  className={`min-h-[48px] justify-center px-4 ${
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
                </TouchableOpacity>
              );
            })}
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
          <DateCard label="Start" value="10 Aug" active />
          <DateCard label="Finish" value="21 Aug" />

          <View className="rounded-[22px] bg-neutral-50 px-5 py-4">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                activeOpacity={0.85}
                className="h-10 w-10 items-center justify-center rounded-full bg-white"
              >
                <ChevronLeft size={18} color="#282828" />
              </TouchableOpacity>
              <Text className="text-sm font-bold text-[#222222]">
                August 2026
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                className="h-10 w-10 items-center justify-center rounded-full bg-white"
              >
                <ChevronRight size={18} color="#282828" />
              </TouchableOpacity>
            </View>

            <View className="mt-4 flex-row justify-between">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                <Text
                  key={`${day}-${index}`}
                  className="w-10 text-center text-[11px] font-bold text-[#8A8A8A]"
                >
                  {day}
                </Text>
              ))}
            </View>

            <View className="mt-4 flex-row flex-wrap justify-between gap-y-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((day) => (
                <Text
                  key={day}
                  className="w-10 text-center text-[13px] font-semibold text-[#C7C7C7]"
                >
                  {day}
                </Text>
              ))}

              {CALENDAR_DAYS.map((day) => (
                <View
                  key={day.value}
                  className={`h-10 w-10 items-center justify-center rounded-2xl ${
                    day.active
                      ? "bg-[#FF5A1F]"
                      : day.highlighted
                        ? "bg-[#FFF1EA]"
                        : "bg-transparent"
                  }`}
                >
                  <Text
                    className={`text-[13px] font-bold ${
                      day.active
                        ? "text-white"
                        : day.highlighted
                          ? "text-[#FF5A1F]"
                          : "text-[#252525]"
                    }`}
                  >
                    {day.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-sm font-medium text-[#555555]">
            10 working days on site
          </Text>
          <TouchableOpacity activeOpacity={0.85}>
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
            <View className="flex-row items-start justify-between gap-4">
              <View className="shrink">
                <Text className="text-base font-bold text-[#1B1B1B]">
                  Mon - Fri
                </Text>
                <Text className="mt-1 text-sm text-[#777777]">
                  9 hr shift · 7:30am-4:30pm
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <TimePill value="07:30" />
                <Text className="text-sm font-semibold text-[#777777]">to</Text>
                <TimePill value="16:30" />
              </View>
            </View>

            <View className="mt-5 flex-row items-center justify-between rounded-[18px] border border-[#EEEEEE] px-4 py-4">
              <View className="flex-row items-center gap-3">
                <Switch
                  value={weekendWork}
                  onValueChange={setWeekendWork}
                  trackColor={{ false: "#E6E6E6", true: "#FFD4BF" }}
                  thumbColor={weekendWork ? Colors.common.BRAND : "#FFFFFF"}
                />
                <View>
                  <Text className="text-sm font-bold text-[#202020]">
                    Weekend work
                  </Text>
                  <Text className="text-sm text-[#7A7A7A]">Off by default</Text>
                </View>
              </View>
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
        className="mt-3 min-h-[140px] rounded-[22px] border border-neutral-100 bg-neutral-50 px-4 py-4 text-sm leading-6 text-[#222222]"
      />
    </View>
  );
}
