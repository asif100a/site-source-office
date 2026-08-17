import { useLocalSearchParams, useRouter } from "expo-router";
import { ReactNode } from "react";
import { ExternalLink, MapPin, ArrowLeft } from "lucide-react-native";
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { Region } from "react-native-maps";
import JobSummaryCard from "@/components/modules/employer/employer-details/JobSummaryCard";
import JobOverviewSection from "@/components/modules/employer/employer-details/JobOverviewSection";
import MapFallback from "@/components/modules/employer/employer-details/_ui/MapFallback";
import { EmployerJobDetails } from "@/types";
import { Colors } from "@/constants/Colors";

type NativeMapComponents = {
  MapView: typeof import("react-native-maps").default;
  Marker: typeof import("react-native-maps").Marker;
  ProviderGoogle: typeof import("react-native-maps").PROVIDER_GOOGLE;
};

const JOB_COORDINATES: Region = {
  latitude: 51.5246,
  longitude: -0.0786,
  latitudeDelta: 0.014,
  longitudeDelta: 0.014,
};

const DEFAULT_JOB_DETAILS: EmployerJobDetails = {
  title: "Labourer",
  company: "Tech Innovators Inc.",
  payRate: "120",
  tag: "Market Rate",
  location: "Shoreditch - 1.2 mi away",
  team: "2 developers, 1 designer",
  duration: "12 Jun - 1 month",
  time: "2 hours ago",
  tradeSkill: "Groundworker",
  tradeCount: "1 labor",
  employmentType: "Full-time",
  jobDuration: "4 week",
  requirements:
    "CIS registration required. CSCS Gold card preferred. Site induction on day one.",
};

const JOB_DETAILS_BY_ID: Record<string, EmployerJobDetails> = {
  "3": DEFAULT_JOB_DETAILS,
  "4": DEFAULT_JOB_DETAILS,
  "5": {
    ...DEFAULT_JOB_DETAILS,
    title: "Graphic Designer",
    payRate: "90",
    tag: "Competitive Rate",
    location: "Soho - 2.5 mi away",
    team: "1 designer",
    duration: "15 Jun - 2 weeks",
    time: "4 hours ago",
    tradeSkill: "Creative Design",
    tradeCount: "1 designer",
    employmentType: "Contract",
    jobDuration: "2 week",
    requirements:
      "Portfolio required. Experience with Adobe Creative Suite and motion graphics preferred.",
  },
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

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
      {children}
    </Text>
  );
}

function TradeSkillSection({ value }: { value: string }) {
  return (
    <View className="mb-6">
      <SectionLabel>Trade / Skill</SectionLabel>
      <View className="rounded-xl border border-neutral-200/80 bg-white px-4 py-3.5">
        <Text className="text-sm font-bold text-neutral-800">{value}</Text>
      </View>
    </View>
  );
}

function RequirementsSection({ value }: { value: string }) {
  return (
    <View className="rounded-2xl border border-neutral-200/80 bg-white p-4">
      <Text className="mb-3 text-base font-bold text-neutral-900">
        Requirements
      </Text>
      <Text className="text-sm font-medium leading-relaxed text-neutral-600">
        {value}
      </Text>
    </View>
  );
}

function JobHighlights({
  jobDetails,
  onOpenMaps,
  onBack,
  onApply,
}: {
  jobDetails: EmployerJobDetails;
  onOpenMaps: () => void;
  onBack: () => void;
  onApply: () => void;
}) {
  return (
    <View className="overflow-hidden rounded-[28px] border border-neutral-200/80 bg-white shadow-sm">
      <View className="relative px-6 py-6 md:px-8 md:py-8">
        <View
          className="absolute -top-16 right-0 h-40 w-40 rounded-full opacity-80"
          style={{ backgroundColor: Colors.common.BRAND_LIGHT }}
        />
        <View className="absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-neutral-100" />

        <View className="relative">
      <View className="flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <View className="max-w-3xl gap-4">
          <View className="flex-row items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 self-start">
            <MapPin size={14} color={Colors.common.BRAND} />
            <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-900">
              Employer details
            </Text>
          </View>

          <View className="gap-2">
            <Text className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-950">
              {jobDetails.title} at {jobDetails.company}
            </Text>
            <Text className="max-w-2xl text-sm md:text-base leading-6 text-neutral-600">
              Review the same job summary, overview, requirements, and location
              in a layout that is easier to scan on desktop.
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-3">
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.88}
            className="flex-row items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3.5"
          >
            <ArrowLeft size={18} color="#111827" />
            <Text className="text-sm font-bold text-neutral-900">
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onApply}
            activeOpacity={0.9}
            className="flex-row items-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3.5"
          >
            <Text className="text-sm font-bold text-white">Apply</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-6 flex-row flex-wrap gap-3">
        <View className="rounded-2xl bg-neutral-950 px-5 py-3.5">
          <Text className="text-xs font-bold uppercase tracking-[0px] text-white/60">
            Pay
          </Text>
          <Text className="mt-1 text-lg font-bold tracking-tight text-white">
            GBP {jobDetails.payRate}/hour
          </Text>
        </View>
        <View className="rounded-2xl border border-neutral-200 bg-white px-5 py-3.5">
          <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
            Duration
          </Text>
          <Text className="mt-1 text-lg font-bold tracking-tight text-neutral-950">
            {jobDetails.jobDuration}
          </Text>
        </View>
        <View className="rounded-2xl border border-neutral-200 bg-white px-5 py-3.5">
          <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-500">
            Location
          </Text>
          <Text className="mt-1 text-lg font-bold tracking-tight text-neutral-950">
            {jobDetails.location}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onOpenMaps}
        activeOpacity={0.88}
        className="mt-5 flex-row items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3.5"
      >
        <Text className="text-sm font-bold text-neutral-700">
          Open in Google Maps
        </Text>
        <ExternalLink size={16} color="#6B7280" />
      </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function EmployerDetailsWebScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();

  const jobId = Array.isArray(id) ? id[0] : id;
  const jobDetails = (jobId && JOB_DETAILS_BY_ID[jobId]) || DEFAULT_JOB_DETAILS;

  const nativeMapComponents = getNativeMapComponents();
  const NativeMapView = nativeMapComponents?.MapView;
  const NativeMarker = nativeMapComponents?.Marker;
  const NativeProviderGoogle = nativeMapComponents?.ProviderGoogle;

  const handleBackPress = () => {
    router.back();
  };

  const handleApplyPress = () => {
    const returnTo = jobId
      ? `/screens/employer-details/${jobId}`
      : "/tabs/(worker-tabs)";

    router.push({
      pathname: "/auth",
      params: {
        role: "worker",
        step: "register_sso",
        returnTo,
      },
    } as any);
  };

  const handleOpenGoogleMaps = async () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${JOB_COORDINATES.latitude},${JOB_COORDINATES.longitude}`;

    try {
      await Linking.openURL(mapsUrl);
    } catch {
      // Best-effort fallback.
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      style={{ paddingBottom: 120 }}
    >
      <View className="px-6 pt-6 md:px-10 xl:px-12 md:pt-8">
        <View className="mx-auto w-full max-w-7xl gap-6">
          <JobHighlights
            jobDetails={jobDetails}
            onOpenMaps={handleOpenGoogleMaps}
            onBack={handleBackPress}
            onApply={handleApplyPress}
          />

          <View className="flex-col gap-6 xl:flex-row">
            <View className="flex-[1.45] gap-6">
              <View className="rounded-[24px] border border-neutral-200/80 bg-white p-5 shadow-sm md:p-6">
                <JobSummaryCard jobDetails={jobDetails} />
                <TradeSkillSection value={jobDetails.tradeSkill} />
                <JobOverviewSection jobDetails={jobDetails} />
                <RequirementsSection value={jobDetails.requirements} />
              </View>
            </View>

            <View className="flex-1 gap-4">
              <View className="rounded-[24px] border border-neutral-200/80 bg-white p-5 shadow-sm md:p-6">
                <SectionLabel>Location</SectionLabel>
                <View className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-slate-100">
                  <View className="h-72 w-full">
                    {NativeMapView && NativeMarker ? (
                      <NativeMapView
                        style={{ flex: 1 }}
                        provider={NativeProviderGoogle}
                        initialRegion={JOB_COORDINATES}
                        region={JOB_COORDINATES}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        rotateEnabled={false}
                        pitchEnabled={false}
                        toolbarEnabled={false}
                      >
                        <NativeMarker coordinate={JOB_COORDINATES} />
                      </NativeMapView>
                    ) : (
                      <MapFallback />
                    )}

                    <View className="absolute inset-0 z-10 items-center justify-center">
                      <View className="items-center gap-3">
                        <MapPin size={34} color="#EF4444" fill="#EF4444" />
                        <TouchableOpacity
                          onPress={handleOpenGoogleMaps}
                          activeOpacity={0.9}
                          className="flex-row items-center gap-2 rounded-full border border-neutral-100 bg-white/95 px-3 py-2 shadow-lg"
                        >
                          <Text className="text-xs font-bold text-neutral-900">
                            Open in Google Maps
                          </Text>
                          <ExternalLink size={14} color="#6B7280" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

