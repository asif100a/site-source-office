import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Minus,
  Plus,
} from "lucide-react-native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { Colors } from "@/constants/Colors";
import ScreenHeader from "@/components/layout/ScreenHeader";

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

const MUST_HAVE_OPTIONS = ["CSCS card", "Own tools", "Own PPE"] as const;

type MustHaveOption = (typeof MUST_HAVE_OPTIONS)[number];

export default function EmployerHomeScreen() {
  const router = useRouter();
  const [hourlyRate, setHourlyRate] = useState(24);
  const [workersNeeded, setWorkersNeeded] = useState(2);
  const [weekendWork, setWeekendWork] = useState(false);
  const [notes, setNotes] = useState(
    "Second-floor strip out, skip on site, 7:30am start. Ask for Danny at the gate.",
  );
  const [selectedMustHaves, setSelectedMustHaves] = useState<MustHaveOption[]>(
    ["CSCS card"],
  );

  const totalEstimate = useMemo(() => hourlyRate * 9 * 10 * workersNeeded, [
    hourlyRate,
    workersNeeded,
  ]);

  const handleCreateJobPost = () => {
    router.push({
      pathname: "/screens/job/CreateJobPost",
      params: { origin: "employer" },
    });
  };

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
    <ScreenWrapper>
      <ScreenHeader />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 44 }}
      >
        <View className="bg-[#DDD8D2] px-4 pt-4 pb-5">
          <View className="flex-row items-start justify-between">
            <View className="rounded-full bg-white px-4 py-2 shadow-sm">
              <View className="flex-row items-center gap-2">
                <View className="h-2 w-2 rounded-full bg-[#FF5A1F]" />
                <Text className="text-[13px] font-semibold text-[#262626]">
                  Shoreditch, E2
                </Text>
              </View>
            </View>

            <View className="mt-20 mr-1 gap-2">
              {[
                <MapPin key="pin" size={18} color={Colors.common.BRAND} />,
                <Plus key="plus" size={18} color="#111111" />,
                <Minus key="minus" size={18} color="#111111" />,
              ].map((icon, index) => (
                <TouchableOpacity
                  key={`map-control-${index}`}
                  activeOpacity={0.85}
                  className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm"
                >
                  {icon}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="items-center pt-3">
            <View className="rounded-full bg-[#2E2E2E] px-5 py-2">
              <Text className="text-xs font-bold text-white">
                Drag the map to place your site
              </Text>
            </View>
          </View>

          <View className="mt-28 rounded-[24px] bg-white px-4 py-4 shadow-sm">
            <View className="flex-row items-center justify-between gap-4">
              <View className="flex-row items-center gap-3">
                <View
                  className="h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: Colors.common.BRAND }}
                >
                  <MapPin size={20} color="#FFFFFF" fill="#FFFFFF" />
                </View>

                <View className="shrink">
                  <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#8A8A8A]">
                    Site location
                  </Text>
                  <Text className="text-[13px] font-bold text-[#111111]">
                    42 Hoxton Street, London N1
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                className="rounded-2xl bg-[#F3F3F3] px-4 py-3"
              >
                <Text className="text-sm font-bold text-[#222222]">Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="px-4 pt-3">
          <Text className="text-[20px] font-black tracking-[-0.3px] text-[#121212]">
            Post a job
          </Text>

          <FormSectionLabel label="Trade needed" />
          <TouchableOpacity
            activeOpacity={0.85}
            className="mt-3 flex-row items-center justify-between rounded-[18px] bg-white px-4 py-4"
          >
            <Text className="text-[13px] font-semibold text-[#202020]">
              Select trade
            </Text>
            <ChevronDown size={20} color="#727272" />
          </TouchableOpacity>

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
              <DateCard label="Start" value="10 Aug" active />
              <DateCard label="Finish" value="21 Aug" />
            </View>

            <View className="mt-5 flex-row items-center justify-between">
              <TouchableOpacity
                activeOpacity={0.85}
                className="h-9 w-9 items-center justify-center rounded-full bg-[#F3F3F3]"
              >
                <ChevronLeft size={18} color="#282828" />
              </TouchableOpacity>
              <Text className="text-[13px] font-bold text-[#222222]">
                August 2026
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                className="h-9 w-9 items-center justify-center rounded-full bg-[#F3F3F3]"
              >
                <ChevronRight size={18} color="#282828" />
              </TouchableOpacity>
            </View>

            <View className="mt-4 flex-row justify-between px-1">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                <Text
                  key={`${day}-${index}`}
                  className="w-10 text-center text-[10px] font-bold text-[#8A8A8A]"
                >
                  {day}
                </Text>
              ))}
            </View>

            <View className="mt-3 flex-row flex-wrap justify-between gap-y-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((day) => (
                <Text
                  key={day}
                  className="w-10 text-center text-[12px] font-semibold text-[#C7C7C7]"
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
                    className={`text-[12px] font-bold ${
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

            <View className="mt-4 flex-row items-center justify-between">
              <Text className="text-[12px] font-medium text-[#555555]">
                10 working days on site
              </Text>
              <TouchableOpacity activeOpacity={0.85}>
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
            <View className="flex-row items-start justify-between gap-3">
              <View className="shrink">
                <Text className="text-[15px] font-bold text-[#1B1B1B]">
                  Mon - Fri
                </Text>
                <Text className="mt-1 text-[12px] text-[#777777]">
                  9 hr shift · 7:30am-4:30pm
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <TimePill value="07:30" />
                <Text className="text-[12px] font-semibold text-[#777777]">to</Text>
                <TimePill value="16:30" />
              </View>
            </View>

            <View className="mt-5 flex-row items-center justify-between rounded-[18px] border border-[#EEEEEE] px-3 py-3">
              <View className="flex-row items-center gap-3">
                <Switch
                  value={weekendWork}
                  onValueChange={setWeekendWork}
                  trackColor={{ false: "#E6E6E6", true: "#FFD4BF" }}
                  thumbColor={weekendWork ? Colors.common.BRAND : "#FFFFFF"}
                />
                <View>
                  <Text className="text-[13px] font-bold text-[#202020]">
                    Weekend work
                  </Text>
                  <Text className="text-[12px] text-[#7A7A7A]">
                    Off by default
                  </Text>
                </View>
              </View>
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
            className="mt-3 min-h-[110px] rounded-[20px] bg-white px-4 py-4 text-[13px] leading-5 text-[#222222]"
          />

          <View className="mt-6 rounded-[22px] bg-[#121316] px-4 py-5">
            <View className="flex-row items-end justify-between gap-4">
              <View>
                <Text className="text-[11px] font-bold uppercase tracking-[1.3px] text-[#A7A7A7]">
                  Estimated total
                </Text>
                <Text className="mt-1 text-[24px] font-black tracking-[-0.6px] text-white">
                  £{totalEstimate.toLocaleString()}
                </Text>
              </View>

              <Text className="max-w-[150px] text-right text-[12px] font-semibold leading-4 text-[#C9C9C9]">
                {workersNeeded} x labourer · 10 days · 9 hr shifts
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
      </ScrollView>
    </ScreenWrapper>
  );
}

function FormSectionLabel({ label }: { label: string }) {
  return (
    <Text className="mt-6 text-[10px] font-extrabold uppercase tracking-[1.3px] text-[#7A7A7A]">
      {label}
    </Text>
  );
}

function CounterRow({
  label,
  hint,
  value,
  onDecrease,
  onIncrease,
}: {
  label: string;
  hint: string;
  value: string;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <View className="shrink">
        <Text className="text-[15px] font-bold text-[#202020]">{label}</Text>
        <Text className="mt-1 text-[11px] text-[#858585]">{hint}</Text>
      </View>

      <View className="flex-row items-center gap-4">
        <CounterButton icon={<Minus size={18} color="#202020" />} onPress={onDecrease} />
        <Text className="min-w-[58px] text-center text-[18px] font-black tracking-[-0.3px] text-[#111111]">
          {value}
        </Text>
        <CounterButton
          icon={<Plus size={18} color="#FFFFFF" />}
          onPress={onIncrease}
          filled
        />
      </View>
    </View>
  );
}

function CounterButton({
  icon,
  filled = false,
  onPress,
}: {
  icon: React.ReactNode;
  filled?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className={`h-11 w-11 items-center justify-center rounded-2xl ${
        filled ? "bg-[#111111]" : "bg-[#F3F3F3]"
      }`}
    >
      {icon}
    </TouchableOpacity>
  );
}

function DateCard({
  label,
  value,
  active = false,
}: {
  label: string;
  value: string;
  active?: boolean;
}) {
  return (
    <View
      className={`flex-1 rounded-[18px] border bg-white px-3 py-3 ${
        active ? "border-[#FF5A1F]" : "border-[#E9E9E9]"
      }`}
    >
      <Text className="text-[10px] font-bold uppercase tracking-[1px] text-[#8B8B8B]">
        {label}
      </Text>
      <Text className="mt-1 text-[18px] font-black tracking-[-0.3px] text-[#111111]">
        {value}
      </Text>
    </View>
  );
}

function TimePill({ value }: { value: string }) {
  return (
    <View className="flex-row items-center gap-2 rounded-2xl border border-[#E9E9E9] bg-white px-3 py-2.5">
      <Text className="text-[13px] font-bold text-[#202020]">{value}</Text>
      <Clock3 size={15} color="#8A8A8A" />
    </View>
  );
}
