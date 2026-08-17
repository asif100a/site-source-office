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
import type { Region } from "react-native-maps";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  MapPin,
  Minus,
  Plus,
} from "lucide-react-native";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { Colors } from "@/constants/Colors";
import ScreenHeader from "@/components/layout/ScreenHeader";
import JobRequests from "@/components/modules/employer/home/JobRequests";
import MapFallback from "@/components/modules/employer/employer-details/_ui/MapFallback";

const MUST_HAVE_OPTIONS = ["CSCS card", "Own tools", "Own PPE"] as const;

type NativeMapComponents = {
  MapView: typeof import("react-native-maps").default;
  Marker: typeof import("react-native-maps").Marker;
  ProviderGoogle: typeof import("react-native-maps").PROVIDER_GOOGLE;
};

type MustHaveOption = (typeof MUST_HAVE_OPTIONS)[number];
type JobDateRange = {
  from?: Date;
  to?: Date;
};

const SITE_REGION: Region = {
  latitude: 51.5295,
  longitude: -0.0887,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};

function getNativeMapComponents(): NativeMapComponents | null {
  try {
    const maps =
      require("react-native-maps") as typeof import("react-native-maps");
    return {
      MapView: maps.default,
      Marker: maps.Marker,
      ProviderGoogle: maps.PROVIDER_GOOGLE,
    };
  } catch {
    return null;
  }
}

const formatJobDate = (date?: Date) => {
  if (!date) {
    return "--";
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};

const formatJobDateRange = (range: JobDateRange) => {
  if (!range.from && !range.to) {
    return "Select job dates";
  }

  if (range.from && !range.to) {
    return formatJobDate(range.from);
  }

  if (!range.from && range.to) {
    return formatJobDate(range.to);
  }

  return `${formatJobDate(range.from)} - ${formatJobDate(range.to)}`;
};

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

export default function EmployerHomeScreen() {
  const router = useRouter();
  const calendarStyles = useDefaultStyles();
  const nativeMapComponents = getNativeMapComponents();
  const NativeMapView = nativeMapComponents?.MapView;
  const NativeMarker = nativeMapComponents?.Marker;
  const NativeProviderGoogle = nativeMapComponents?.ProviderGoogle;
  const [hourlyRate, setHourlyRate] = useState(24);
  const [workersNeeded, setWorkersNeeded] = useState(2);
  const [weekendWork, setWeekendWork] = useState(false);
  const [siteRegion, setSiteRegion] = useState<Region>(SITE_REGION);
  const [jobDateRange, setJobDateRange] = useState<JobDateRange>({
    from: new Date(2026, 7, 18),
    to: new Date(2026, 7, 21),
  });
  const [notes, setNotes] = useState(
    "Second-floor strip out, skip on site, 7:30am start. Ask for Danny at the gate.",
  );
  const [selectedMustHaves, setSelectedMustHaves] = useState<MustHaveOption[]>(
    ["CSCS card"],
  );

  const workingDays = useMemo(
    () => countWeekdaysInRange(jobDateRange),
    [jobDateRange],
  );

  const totalEstimate = useMemo(
    () => hourlyRate * 9 * Math.max(workingDays, 1) * workersNeeded,
    [hourlyRate, workersNeeded, workingDays],
  );

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

  const adjustMapZoom = (direction: "in" | "out") => {
    setSiteRegion((current) => {
      const nextDelta =
        direction === "in"
          ? Math.max(current.latitudeDelta * 0.7, 0.0025)
          : Math.min(current.latitudeDelta / 0.7, 0.2);

      return {
        ...current,
        latitudeDelta: nextDelta,
        longitudeDelta: nextDelta,
      };
    });
  };

  const handleWorkerDetails = (id: string) => {
    router.push({
      pathname: `/screens/worker-details/${id}` as any,
      params: { origin: "employer" },
    });
  };

  return (
    <ScreenWrapper>
      <ScreenHeader />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 44 }}
      >
        <View className="px-5 pt-4 pb-5">
          <View className="relative overflow-hidden rounded-xl bg-[#DDD8D2]">
            <View className="h-[320px]">
              {NativeMapView && NativeMarker ? (
                <NativeMapView
                  style={{ flex: 1 }}
                  provider={NativeProviderGoogle}
                  region={siteRegion}
                  onRegionChangeComplete={setSiteRegion}
                  mapType="standard"
                  loadingEnabled
                  showsCompass={false}
                  toolbarEnabled={false}
                  showsMyLocationButton={false}
                  moveOnMarkerPress={false}
                >
                  <NativeMarker coordinate={siteRegion} title="Site location" />
                </NativeMapView>
              ) : (
                <MapFallback />
              )}
            </View>

            <View className="absolute inset-x-0 top-0 px-4 pt-4">
              <View className="flex-row items-start justify-between">
                <View className="rounded-full bg-white px-4 py-2 shadow-sm">
                  <View className="flex-row items-center gap-2">
                    <View className="h-2 w-2 rounded-full bg-[#FF5A1F]" />
                    <Text className="text-[13px] font-semibold text-[#262626]">
                      Shoreditch, E2
                    </Text>
                  </View>
                </View>

                <View className="mt-16 mr-1 gap-2">
                  <TouchableOpacity
                    activeOpacity={0.85}
                    className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm"
                  >
                    <MapPin size={18} color={Colors.common.BRAND} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => adjustMapZoom("in")}
                    className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm"
                  >
                    <Plus size={18} color="#111111" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => adjustMapZoom("out")}
                    className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm"
                  >
                    <Minus size={18} color="#111111" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="pointer-events-none absolute inset-x-0 top-16 items-center pt-3">
              <View className="rounded-full bg-[#2E2E2E] px-5 py-2">
                <Text className="text-xs font-bold text-white">
                  Drag the map to place your site
                </Text>
              </View>
            </View>

            <View className="absolute inset-x-4 bottom-4 rounded-[24px] bg-white px-4 py-4 shadow-sm">
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
                  <Text className="text-sm font-bold text-[#222222]">
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 pt-3">
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
              <DateCard label="Start" value={formatJobDate(jobDateRange.from)} active />
              <DateCard label="Finish" value={formatJobDate(jobDateRange.to)} />
            </View>

            <View className="mt-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3">
              <View className="mb-3 flex-row items-center justify-between gap-3">
                <View className="flex-1 flex-row items-center gap-2">
                  <CalendarDays size={15} color="#737373" />
                  <Text className="flex-1 text-xs font-semibold text-neutral-600">
                    {formatJobDateRange(jobDateRange)}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setJobDateRange({})}
                >
                  <Text className="text-xs font-bold text-[#FF5500]">
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                mode="range"
                startDate={jobDateRange.from}
                endDate={jobDateRange.to}
                onChange={({ startDate, endDate }) =>
                  setJobDateRange({
                    from: startDate ? new Date(startDate as any) : undefined,
                    to: endDate ? new Date(endDate as any) : undefined,
                  })
                }
                containerStyle={{ width: "100%" }}
                style={{ width: "100%" }}
                className="w-full rounded-2xl bg-neutral-50"
                minDate={new Date()}
                firstDayOfWeek={1}
                showOutsideDays
                calendar="gregory"
                containerHeight={300}
                navigationPosition="around"
                styles={{
                  ...calendarStyles,
                  header: {
                    marginBottom: 12,
                  },
                  month_selector_label: {
                    color: "#111827",
                    fontSize: 15,
                    fontWeight: "800",
                  },
                  year_selector_label: {
                    color: "#111827",
                    fontSize: 15,
                    fontWeight: "800",
                  },
                  button_prev: {
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: Colors.common.BRAND_LIGHT,
                  },
                  button_next: {
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: Colors.common.BRAND_LIGHT,
                  },
                  button_prev_image: {
                    tintColor: Colors.common.BRAND,
                    width: 15,
                    height: 15,
                  },
                  button_next_image: {
                    tintColor: Colors.common.BRAND,
                    width: 15,
                    height: 15,
                  },
                  day_cell: {
                    minHeight: 44,
                  },
                  day_label: {
                    color: "#262626",
                    fontWeight: "600",
                  },
                  outside_label: {
                    color: "#A3A3A3",
                  },
                  disabled_label: {
                    color: "#D4D4D4",
                  },
                  weekday_label: {
                    color: "#8A8A8A",
                    fontSize: 11,
                    fontWeight: "700",
                  },
                  selected: {
                    backgroundColor: Colors.common.BRAND,
                    borderRadius: 12,
                  },
                  selected_label: { color: "#FFFFFF", fontWeight: "800" },
                  range_start: {
                    backgroundColor: Colors.common.BRAND,
                    borderRadius: 12,
                  },
                  range_start_label: {
                    color: "#FFFFFF",
                    fontWeight: "800",
                  },
                  range_end: {
                    backgroundColor: Colors.common.BRAND,
                    borderRadius: 12,
                  },
                  range_end_label: {
                    color: "#FFFFFF",
                    fontWeight: "800",
                  },
                  range_middle: {
                    backgroundColor: "transparent",
                    borderRadius: 0,
                  },
                  range_middle_label: {
                    color: Colors.common.BRAND,
                    fontWeight: "700",
                  },
                  range_fill: {
                    backgroundColor: "#FFE4D6",
                  },
                  range_fill_weekstart: {
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                  },
                  range_fill_weekend: {
                    borderTopRightRadius: 12,
                    borderBottomRightRadius: 12,
                  },
                  today: {
                    borderColor: Colors.common.BRAND,
                    borderWidth: 1,
                  },
                  today_label: {
                    color: Colors.common.BRAND,
                    fontWeight: "800",
                  },
                }}
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

        {/* Job Requests */}
        <JobRequests openWorkerDetails={handleWorkerDetails} containerStyle={{
          paddingHorizontal: 20
        }} />
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
