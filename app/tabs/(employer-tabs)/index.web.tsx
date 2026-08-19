import React, { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Minus,
  Plus,
} from "lucide-react-native";
import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import JobRequests from "@/components/modules/employer/home/JobRequests";
import { Colors } from "@/constants/Colors";
import { CounterRow, DateCard, FormSectionLabel, SnapshotCard, SummaryRow, TimePill } from "@/components/modules/employer/home/_ui/web.index";
import WebMapHeroCard from "@/components/modules/employer/home/WebMapHeroCard";

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
const TRADE_OPTIONS = [
  { label: "Groundworker", value: "Groundworker" },
  { label: "Carpenter", value: "Carpenter" },
  { label: "Electrician", value: "Electrician" },
  { label: "Plumber", value: "Plumber" },
  { label: "Bricklayer", value: "Bricklayer" },
  { label: "Painter", value: "Painter" },
  { label: "Scaffolder", value: "Scaffolder" },
];

type MustHaveOption = (typeof MUST_HAVE_OPTIONS)[number];
type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const SITE_REGION: MapRegion = {
  latitude: 51.5295,
  longitude: -0.0887,
  latitudeDelta: 0.018,
  longitudeDelta: 0.018,
};

const getGoogleMapEmbedUrl = (region: MapRegion, zoom: number) => {
  const query = encodeURIComponent(`${region.latitude},${region.longitude}`);

  return `https://maps.google.com/maps?q=${query}&z=${zoom}&output=embed`;
};

export default function EmployerHomeScreenWeb() {
  const router = useRouter();
  const [hourlyRate, setHourlyRate] = useState(24);
  const [workersNeeded, setWorkersNeeded] = useState(2);
  const [weekendWork, setWeekendWork] = useState(false);
  const [siteRegion, setSiteRegion] = useState<MapRegion>(SITE_REGION);
  const [mapZoom, setMapZoom] = useState(15);
  const [tradeMenuOpen, setTradeMenuOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState("Groundworker");
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
  const mapEmbedUrl = useMemo(
    () => getGoogleMapEmbedUrl(siteRegion, mapZoom),
    [mapZoom, siteRegion],
  );

  const handleCreateJobPost = () => {
    router.push({
      pathname: "/screens/job/CreateJobPost",
      params: { origin: "employer" },
    });
  };

  const openWorkerDetails = (workerId: string) => {
    router.push({
      pathname: "/screens/worker-details/[id]",
      params: { id: workerId, origin: "employer" },
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
    setMapZoom((current) =>
      direction === "in"
        ? Math.min(current + 1, 20)
        : Math.max(current - 1, 3),
    );

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

  return (
    <ScreenWrapper>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 112 }}
      >
        <View className="px-5 py-6 md:px-8 md:py-8 xl:px-12">
          <View className="mx-auto w-full max-w-7xl gap-6">
            <View className="overflow-hidden rounded-[32px] border border-neutral-200/80 bg-white shadow-sm">
              <View className="relative px-6 py-6 md:px-8 md:py-8">
                <View
                  className="absolute -right-12 -top-16 h-40 w-40 rounded-full opacity-80"
                  style={{ backgroundColor: Colors.common.BRAND_LIGHT }}
                />
                <View className="absolute -bottom-10 left-8 h-24 w-24 rounded-full bg-neutral-100" />

                <View className="relative flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                  <View className="max-w-3xl gap-3">
                    <View className="self-start rounded-full bg-orange-50 px-3 py-1.5">
                      <Text
                        style={{ color: Colors.common.BRAND }}
                        className="text-xs font-bold uppercase"
                      >
                        Employer workspace
                      </Text>
                    </View>

                    <View className="gap-2">
                      <Text className="max-w-3xl text-3xl font-bold tracking-tight text-neutral-950">
                        Build the job brief, lock the site details, and start
                        hiring from one desktop workspace.
                      </Text>
                      <Text className="max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
                        This follows the same employer home flow as mobile,
                        reorganized for web with a live posting canvas on the
                        left and a hiring summary on the right.
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={handleCreateJobPost}
                    className="self-start rounded-2xl px-5 py-4 xl:self-auto"
                    style={{ backgroundColor: Colors.common.BRAND }}
                  >
                    <Text className="text-sm font-bold text-white">
                      Post Job
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="flex-col gap-6 xl:flex-row">
              <View className="flex-1 gap-6">
                <WebMapHeroCard
                  mapEmbedUrl={mapEmbedUrl}
                  onZoomIn={() => adjustMapZoom("in")}
                  onZoomOut={() => adjustMapZoom("out")}
                />

                <View className="rounded-[30px] border border-neutral-200/80 bg-white p-6 shadow-sm">
                  <View className="mb-6 flex-row items-start justify-between gap-4">
                    <View>
                      <Text className="text-[28px] font-bold tracking-tight text-neutral-950">
                        Post a job
                      </Text>
                      <Text className="mt-2 text-sm text-neutral-500">
                        Set the role, timing, and site requirements before you
                        send this posting live.
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
                        onDecrease={() =>
                          adjustValue(setHourlyRate, hourlyRate - 1)
                        }
                        onIncrease={() =>
                          adjustValue(setHourlyRate, hourlyRate + 1)
                        }
                      />
                    </View>

                    <View className="rounded-[24px] border border-neutral-100 bg-white p-5">
                      <CounterRow
                        label="Workers needed"
                        hint={`£${hourlyRate * 9} per day at 9 hrs`}
                        value={`${workersNeeded}`}
                        onDecrease={() =>
                          adjustValue(setWorkersNeeded, workersNeeded - 1)
                        }
                        onIncrease={() =>
                          adjustValue(setWorkersNeeded, workersNeeded + 1)
                        }
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
                          {["M", "T", "W", "T", "F", "S", "S"].map(
                            (day, index) => (
                              <Text
                                key={`${day}-${index}`}
                                className="w-10 text-center text-[11px] font-bold text-[#8A8A8A]"
                              >
                                {day}
                              </Text>
                            ),
                          )}
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
                            <Text className="text-sm font-semibold text-[#777777]">
                              to
                            </Text>
                            <TimePill value="16:30" />
                          </View>
                        </View>

                        <View className="mt-5 flex-row items-center justify-between rounded-[18px] border border-[#EEEEEE] px-4 py-4">
                          <View className="flex-row items-center gap-3">
                            <Switch
                              value={weekendWork}
                              onValueChange={setWeekendWork}
                              trackColor={{ false: "#E6E6E6", true: "#FFD4BF" }}
                              thumbColor={
                                weekendWork
                                  ? Colors.common.BRAND
                                  : "#FFFFFF"
                              }
                            />
                            <View>
                              <Text className="text-sm font-bold text-[#202020]">
                                Weekend work
                              </Text>
                              <Text className="text-sm text-[#7A7A7A]">
                                Off by default
                              </Text>
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

                <View className="rounded-[30px] border border-neutral-200/80 bg-white p-6 shadow-sm">
                  <JobRequests
                    openWorkerDetails={openWorkerDetails}
                    containerStyle={{ marginTop: 0, paddingHorizontal: 0 }}
                  />
                </View>
              </View>

              <View className="w-full gap-6 xl:w-[360px] 2xl:w-[390px]">
                <View className="rounded-[30px] border border-neutral-200/80 bg-[#121316] p-6 shadow-sm">
                  <Text className="text-[11px] font-bold uppercase tracking-[1.3px] text-[#A7A7A7]">
                    Estimated total
                  </Text>
                  <Text className="mt-2 text-[34px] font-bold tracking-tight text-white">
                    £{totalEstimate.toLocaleString()}
                  </Text>
                  <Text className="mt-3 text-sm leading-6 text-[#C9C9C9]">
                    {workersNeeded} x labourer · 10 days · 9 hr shifts
                  </Text>

                  <View className="mt-6 gap-3 rounded-[22px] bg-white/5 p-4">
                    <SummaryRow label="Site" value="42 Hoxton Street, London N1" />
                    <SummaryRow label="Trade" value="Labour" />
                    <SummaryRow label="Dates" value="10 Aug - 21 Aug 2026" />
                    <SummaryRow label="Hours" value="07:30 - 16:30" />
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={handleCreateJobPost}
                    className="mt-6 items-center justify-center rounded-[18px] py-4"
                    style={{ backgroundColor: Colors.common.BRAND }}
                  >
                    <Text className="text-sm font-bold text-white">
                      Post Job
                    </Text>
                  </TouchableOpacity>

                  <Text className="mt-4 text-center text-xs leading-5 text-[#B4B4B4]">
                    Workers are matched by trade, rating and travel time. You
                    pick who starts.
                  </Text>
                </View>

                <View className="rounded-[30px] border border-neutral-200/80 bg-white p-6 shadow-sm">
                  <Text className="text-xs font-bold uppercase tracking-[1.3px] text-[#7A7A7A]">
                    Hiring snapshot
                  </Text>
                  <View className="mt-4 gap-4">
                    <SnapshotCard
                      label="Draft completeness"
                      value="92%"
                      helper="Only trade selection is left before publishing."
                    />
                    <SnapshotCard
                      label="Market signal"
                      value="Healthy"
                      helper="Current rate fits the local range for August 2026."
                    />
                    <SnapshotCard
                      label="Schedule"
                      value="10 days"
                      helper="Monday to Friday plan with weekend work off."
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
