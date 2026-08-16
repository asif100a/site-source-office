import React from "react";
import {
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import LogoWhite from "@/assets/icons/LogoWhite";
import { Svg, Rect, Defs, LinearGradient, Stop } from "react-native-svg";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  ShieldCheck,
} from "lucide-react-native";
import ONBOARDING_1 from "@/assets/images/onboarding/onboarding-1.png";
import { clearUserAuthenticated, setActiveRole } from "@/constants/authState";

const BottomFade = () => (
  <View
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }}
  >
    <Svg height="100%" width="100%">
      <Defs>
        <LinearGradient id="web-onboarding-fade" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#071018" stopOpacity="0.1" />
          <Stop offset="45%" stopColor="#071018" stopOpacity="0.12" />
          <Stop offset="100%" stopColor="#071018" stopOpacity="0.88" />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#web-onboarding-fade)" />
    </Svg>
  </View>
);

function FeaturePill({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <View className="flex-row items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
      {icon}
      <Text className="text-white/85 text-sm font-medium">{label}</Text>
    </View>
  );
}

function PrimaryAction({
  label,
  icon,
  variant = "primary",
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  variant?: "primary" | "secondary";
  onPress: () => void;
}) {
  const primary = variant === "primary";
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className={`flex-row items-center justify-center gap-2 rounded-xl px-5 py-4 ${
        primary
          ? "bg-white"
          : "border border-white/20 bg-transparent"
      }`}
    >
      {icon}
      <Text
        className={`text-base font-semibold ${
          primary ? "text-[#071018]" : "text-white"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isDesktop = width >= 960;

  const navigateToWorker = () => {
    clearUserAuthenticated();
    setActiveRole("worker");
    router.replace("/tabs/(worker-tabs)" as any);
  };

  const navigateToEmployer = () => {
    clearUserAuthenticated();
    setActiveRole("employer");
    router.replace({
      pathname: "/auth",
      params: { role: "employer", step: "login" },
    });
  };

  const featureRow = (
    <View className="flex-row flex-wrap gap-3">
      <FeaturePill
        icon={<ShieldCheck size={16} color="#FFFFFF" strokeWidth={2.1} />}
        label="Transparent rates"
      />
      <FeaturePill
        icon={<BriefcaseBusiness size={16} color="#FFFFFF" strokeWidth={2.1} />}
        label="Real jobs"
      />
      <FeaturePill
        icon={<Building2 size={16} color="#FFFFFF" strokeWidth={2.1} />}
        label="Employer access"
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#071018]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
      >
        <View
          style={{
            minHeight: height,
            flexDirection: isDesktop ? "row" : "column",
            backgroundColor: "#071018",
          }}
        >
          <View
            style={{
              flex: isDesktop ? 1 : undefined,
              minHeight: isDesktop ? height : Math.max(620, height * 0.82),
              paddingHorizontal: isDesktop ? 64 : 24,
              paddingTop: isDesktop ? 44 : 28,
              paddingBottom: isDesktop ? 44 : 28,
              justifyContent: "space-between",
              backgroundColor: "#08121b",
            }}
          >
            <View className="gap-8">
              <View className="items-start">
                <LogoWhite size={isDesktop ? { width: "148", height: "99" } : undefined} />
              </View>

              <View className="gap-5">
                <Text
                  className={`text-white font-bold tracking-tight ${
                    isDesktop ? "text-6xl leading-[1.02]" : "text-4xl leading-tight"
                  }`}
                  style={{ maxWidth: isDesktop ? 560 : 360 }}
                >
                  The Smarter Way to Find Work
                </Text>
                <Text
                  className={`text-white/72 font-medium leading-7 ${
                    isDesktop ? "text-lg" : "text-base"
                  }`}
                  style={{ maxWidth: isDesktop ? 520 : 340 }}
                >
                  Workers can find real jobs at transparent rates, while employers
                  can move from sign-up to hiring without losing momentum.
                </Text>
              </View>

              {featureRow}
            </View>

            <View className="gap-5">
              <View className={isDesktop ? "flex-row gap-4" : "gap-3"}>
                <View style={{ flex: 1 }}>
                  <PrimaryAction
                    label="Worker"
                    icon={<ArrowRight size={18} color="#071018" strokeWidth={2.2} />}
                    onPress={navigateToWorker}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <PrimaryAction
                    label="Employer"
                    icon={<ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />}
                    variant="secondary"
                    onPress={navigateToEmployer}
                  />
                </View>
              </View>

              <Text className="text-white/45 text-sm leading-6" style={{ maxWidth: 520 }}>
                Choose the path that matches how you use the platform today.
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: isDesktop ? 1.05 : undefined,
              minHeight: isDesktop ? height : Math.max(540, height * 0.74),
              backgroundColor: "#000",
              position: "relative",
            }}
          >
            <ImageBackground
              source={ONBOARDING_1}
              resizeMode="cover"
              style={{ flex: 1, width: "100%", height: "100%" }}
            >
              <BottomFade />

              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <View
                  style={{
                    paddingHorizontal: isDesktop ? 44 : 24,
                    paddingBottom: isDesktop ? 52 : 32,
                  }}
                >
                  <View style={{ maxWidth: 420 }} className="gap-3">
                    <Text className="text-white text-2xl font-bold leading-tight">
                      Built for quick decisions.
                    </Text>
                    <Text className="text-white/76 text-sm leading-6">
                      The onboarding path stays focused on the two roles people use
                      most, with a clearer split for desktop screens.
                    </Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
