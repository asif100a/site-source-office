import React, { useEffect, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertTriangle,
  Bell,
  ChevronLeft,
  FileText,
  Info,
  Star,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import LogoWhite from "@/assets/icons/LogoWhite";

export const profilePhoto =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop";

export const proofPhoto =
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=700&h=450&fit=crop";

export function ProfileHeader({
  title,
  navigateBack,
}: {
  title: string;
  navigateBack?: () => void;
}) {
  const router = useRouter();
  const { origin } = useLocalSearchParams<{ origin?: string | string[] }>();
  const originRoute = Array.isArray(origin) ? origin[0] : origin;

  const handleBackPress = () => {
    if (navigateBack) {
      navigateBack();
      return;
    }

    router.back();
  };

  return (
    <View
      style={{ backgroundColor: Colors.common.BRAND }}
      className="pt-8 pb-3 px-5"
    >
      <View className="flex-row justify-between items-end">
        <TouchableOpacity
          onPress={handleBackPress}
          className="flex-row items-start gap-0 active:opacity-75"
        >
          <ChevronLeft size={22} color="#FFFFFF" style={{ marginTop: 0 }} />
          <Text className="min-w-32 max-w-32 text-white text-base font-bold tracking-tight">
            {"Back"}
          </Text>
        </TouchableOpacity>

        <View
          className="mb-0 mr-0"
          style={
            { minWidth: "100", minHeight: "72", position: "relative" } as any
          }
        >
          <View
            style={{
              position: "absolute",
              right: "37%",
            }}
          >
            <LogoWhite size={{ width: "124", height: "84" }} />
          </View>
        </View>

        <TouchableOpacity className="w-11 h-11 rounded-full bg-white/15 items-center justify-center active:opacity-75">
          <Bell color="#FFFFFF" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function ScreenShell({
  title,
  children,
  footer,
  navigateBack,
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  navigateBack?: () => void;
}) {
  if (Platform.OS === "web") {
    return (
      <View className="flex-1 bg-neutral-50">
        <View className="flex-1">{children}</View>
        {footer}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-50">
      <ProfileHeader title={title} navigateBack={navigateBack} />
      <View className="flex-1">{children}</View>
      {footer}
    </View>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View
      className={`bg-white rounded-xl border border-neutral-200/80 ${className}`}
    >
      {children}
    </View>
  );
}

export function StatusPill({
  label,
  tone = "review",
}: {
  label: string;
  tone?: "review" | "approved" | "resolved" | "danger";
}) {
  const styles = {
    review: { bg: "#FFF0EA", text: Colors.common.BRAND },
    approved: { bg: "#EAFBEF", text: "#22A447" },
    resolved: { bg: "#EAFBEF", text: "#22A447" },
    danger: { bg: "#FFECEF", text: "#EF4444" },
  }[tone];

  return (
    <View
      style={{ backgroundColor: styles.bg }}
      className="px-3 py-1 rounded-full"
    >
      <Text
        style={{ color: styles.text }}
        className="text-[10px] font-extrabold"
      >
        {label}
      </Text>
    </View>
  );
}

export function DisputeLogo() {
  return (
    <View className="w-11 h-11 rounded-md bg-red-500 items-center justify-center">
      <AlertTriangle
        size={19}
        color="#FFFFFF"
        fill="#FFFFFF"
        strokeWidth={2.4}
      />
    </View>
  );
}

export function DisputeSummary({ resolved = false }: { resolved?: boolean }) {
  return (
    <Card className="p-4 mb-4">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-3">
          <DisputeLogo />
          <View>
            <Text className="text-neutral-950 font-extrabold text-base">
              Hartley Construction
            </Text>
            <Text className="text-neutral-500 text-xs font-semibold mt-0.5">
              May 12 - May 16
            </Text>
          </View>
        </View>
        <StatusPill
          label={resolved ? "Resolved" : "Under Review"}
          tone={resolved ? "resolved" : "review"}
        />
      </View>
    </Card>
  );
}

export function WorkSummaryList({ resolved = false }: { resolved?: boolean }) {
  const rows = [
    { status: "Approved" as const },
    { status: "Approved" as const },
    { status: resolved ? "Resolved" : "In Dispute" },
  ];

  return (
    <View>
      <Text className="text-neutral-950 text-sm font-extrabold mb-2">
        Work Summary
      </Text>
      <Card className="px-4 py-1 mb-4">
        {rows.map((row, index) => (
          <View
            key={`${row.status}-${index}`}
            className="flex-row items-center justify-between py-3 border-b border-neutral-100 last:border-b-0"
          >
            <View>
              <Text className="text-neutral-900 font-extrabold text-sm">
                Week 1
              </Text>
              <Text className="text-neutral-500 text-xs mt-1">
                12th - 16th July
              </Text>
            </View>
            <StatusPill
              label={row.status}
              tone={
                row.status === "In Dispute"
                  ? "danger"
                  : row.status === "Resolved"
                    ? "resolved"
                    : "approved"
              }
            />
          </View>
        ))}
      </Card>
    </View>
  );
}

export function FileChip({ label = "CSCS Gold Card" }: { label?: string }) {
  return (
    <View className="w-36 h-12 rounded-lg bg-white border border-neutral-100 px-3 flex-row items-center gap-2">
      <FileText size={17} color="#FF4D67" />
      <View>
        <Text className="text-slate-700 text-sm font-bold" numberOfLines={1}>
          {label}
        </Text>
        <Text className="text-neutral-400 text-[10px] font-semibold">
          1.1 MB
        </Text>
      </View>
    </View>
  );
}

export function Avatar({
  uri,
  size = 42,
  fallbackLabel,
}: {
  uri?: string | ImageSourcePropType | null;
  size?: number;
  fallbackLabel?: string;
}) {
  const [hasImageError, setHasImageError] = useState(false);
  const source = typeof uri === "string" ? { uri } : uri;
  const trimmedFallback = fallbackLabel?.trim() ?? "";
  const firstWord = trimmedFallback.split(/\s+/)[0] ?? "";
  const shouldShowFallback =
    hasImageError ||
    !source ||
    (typeof uri === "string" && uri.trim().length === 0);

  useEffect(() => {
    setHasImageError(false);
  }, [uri]);

  if (shouldShowFallback) {
    return (
      <View
        className="items-center justify-center bg-neutral-200"
        style={{ width: size, height: size, borderRadius: size / 2 }}
      >
        <Text
          className="font-extrabold text-neutral-700"
          style={{ fontSize: Math.max(12, size * 0.22) }}
          numberOfLines={1}
        >
          {firstWord || "Profile"}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={source}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      onError={() => setHasImageError(true)}
    />
  );
}

export function RatingStars({ size = 13 }: { size?: number }) {
  return (
    <View className="flex-row gap-0.5">
      {[0, 1, 2, 3, 4].map((star) => (
        <Star key={star} size={size} color="#FBC02D" fill="#FBC02D" />
      ))}
    </View>
  );
}

export function VersionBanner() {
  return (
    <View className="flex-row items-center gap-3 bg-neutral-200/70 rounded-lg px-4 py-3 mb-6">
      <Info size={15} color="#12365A" fill="#12365A" />
      <Text className="text-slate-700 text-sm font-semibold">
        Version 2.1 : Effective 1 Jan 2026
      </Text>
    </View>
  );
}

export default function ProfileComponentsRoute() {
  return null;
}
