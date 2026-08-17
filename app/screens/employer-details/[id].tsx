import { useLocalSearchParams, useRouter } from "expo-router";
import type { ReactNode } from "react";
import { Bookmark, MapPin, ExternalLink } from "lucide-react-native";
import {
  Linking,
  Platform,
  ScrollView,
  Text,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import type { Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import StickyActions from "@/components/modules/employer/employer-details/StickyActions";
import JobSummaryCard from "@/components/modules/employer/employer-details/JobSummaryCard";
import JobOverviewSection from "@/components/modules/employer/employer-details/JobOverviewSection";
import MapFallback from "@/components/modules/employer/employer-details/_ui/MapFallback";
import { EmployerJobDetails } from "@/types";
import { Colors } from "@/constants/Colors";
import BackButton from "@/components/standard_ui/buttons/BackButton";

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
  location: "Shoreditch \u2022 1.2 mi away",
  team: "2 developers, 1 designer",
  duration: "12 Jun \u2022 1 month",
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
    location: "Soho \u2022 2.5 mi away",
    team: "1 designer",
    duration: "15 Jun \u2022 2 weeks",
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
  if (Platform.OS === "web") {
    return null;
  }

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
        <Text className="text-sm font-semibold text-neutral-800">{value}</Text>
      </View>
    </View>
  );
}

function RequirementsSection({ value }: { value: string }) {
  return (
    <View className="mb-6 rounded-2xl border border-neutral-200/80 bg-white p-4">
      <Text className="mb-3 text-base font-extrabold text-neutral-900">
        Requirements
      </Text>
      <Text className="text-sm font-medium leading-relaxed text-neutral-600">
        {value}
      </Text>
    </View>
  );
}

export default function EmployerDetailsScreen() {
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
      // Best-effort fallback if the device blocks the direct open.
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white" }}
      edges={["bottom"]}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        <View
          style={{ backgroundColor: Colors.common.BRAND }}
          className="pt-12 pb-3 px-6"
        >
          <View className="flex-row items-center justify-between">
            <BackButton
              title="Employer Details"
              textStyle={{ fontSize: 18, fontWeight: "600" }}
            />

            <TouchableOpacity className="h-11 w-11 items-center justify-center rounded-2xl bg-neutral-900 active:opacity-85">
              <Bookmark size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        {/* <CommonHeader /> */}

        <View className="px-6">
          <JobSummaryCard jobDetails={jobDetails} />
          <TradeSkillSection value={jobDetails.tradeSkill} />
          <JobOverviewSection jobDetails={jobDetails} />
          <RequirementsSection value={jobDetails.requirements} />

          <View className="mb-8">
            <SectionLabel>Location</SectionLabel>
            <View className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-slate-100">
              <View className="h-56 w-full">
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
                    <Pressable
                      onPress={handleOpenGoogleMaps}
                      className="flex-row items-center gap-2 rounded-full bg-white/95 px-3 py-2 shadow-lg border border-neutral-100"
                    >
                      <Text className="text-xs font-extrabold text-neutral-900">
                        Open in Google Maps
                      </Text>
                      <ExternalLink size={14} color="#6B7280" />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <StickyActions
        onPrimaryPress={handleApplyPress}
        onSecondaryPress={handleBackPress}
      />
    </SafeAreaView>
  );
}
