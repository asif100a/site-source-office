import React, { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  BellRing,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import StandardToggle from "@/components/standard_ui/StandardToggle";
import { ScreenShell } from "./_components";

type NotificationOption = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

const INITIAL_OPTIONS: NotificationOption[] = [
  {
    id: "job-alerts",
    title: "Job Alerts",
    description: "Get notified when new matching jobs are posted",
    enabled: true,
  },
  {
    id: "messages",
    title: "Messages",
    description: "Receive updates for new chats and replies",
    enabled: true,
  },
  {
    id: "booking-updates",
    title: "Booking Updates",
    description: "Know when a job is accepted, changed, or cancelled",
    enabled: true,
  },
  {
    id: "payment-updates",
    title: "Payment Updates",
    description: "Receive payment, invoice, and payout notifications",
    enabled: true,
  },
  {
    id: "reminders",
    title: "Shift Reminders",
    description: "Get reminders before upcoming work starts",
    enabled: true,
  },
];

function SettingsCard({
  title,
  description,
  enabled,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white px-5 py-4">
      <View className="flex-1 pr-4">
        <Text className="text-base font-semibold text-neutral-950">{title}</Text>
        <Text className="mt-1 text-xs leading-5 text-neutral-500">
          {description}
        </Text>
      </View>

      <StandardToggle
        value={enabled}
        onValueChange={onToggle}
        trackColor={{ false: "#D4D4D4", true: Colors.common.BRAND }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#D4D4D4"
        accessibilityRole="switch"
        accessibilityLabel={title}
        accessibilityHint={description}
      />
    </View>
  );
}

export default function NotificationSettingsWeb() {
  const [settings, setSettings] = useState(INITIAL_OPTIONS);

  const enabledCount = useMemo(
    () => settings.filter((setting) => setting.enabled).length,
    [settings],
  );

  const toggleSetting = (id: string) => {
    setSettings((currentSettings) =>
      currentSettings.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting,
      ),
    );
  };

  return (
    <ScreenShell title="Notification Settings">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-6 pt-6 md:px-10 xl:px-12 md:pt-8">
          <View className="mx-auto w-full max-w-7xl gap-6">
            <View className="rounded-[28px] border border-neutral-200 bg-white p-6 md:p-8">
              <View className="flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <View className="max-w-3xl gap-4">
                  <View className="flex-row flex-wrap items-center gap-2">
                    <View className="flex-row items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
                      <BellRing size={14} color={Colors.common.BRAND} />
                      <Text className="text-xs font-semibold uppercase tracking-[0px] text-neutral-900">
                        Notifications
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
                      <View className="h-2 w-2 rounded-full bg-emerald-500" />
                      <Text className="text-xs font-semibold text-neutral-600">
                        {enabledCount} of {settings.length} enabled
                      </Text>
                    </View>
                  </View>

                  <View className="gap-2">
                    <Text className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-950">
                      Control what the web app sends you.
                    </Text>
                    <Text className="max-w-2xl text-sm md:text-base leading-6 text-neutral-600">
                      Keep the same notification preferences from mobile, but use
                      a wider web layout that makes each setting easier to scan
                      and switch.
                    </Text>
                  </View>
                </View>

                <View className="flex-row flex-wrap gap-3">
                  <View className="rounded-2xl bg-neutral-950 px-5 py-3.5">
                    <Text className="text-xs font-semibold uppercase tracking-[0px] text-white/60">
                      Active
                    </Text>
                    <Text className="mt-1 text-lg font-semibold tracking-tight text-white">
                      {enabledCount}
                    </Text>
                  </View>

                  <View className="rounded-2xl border border-neutral-200 bg-white px-5 py-3.5">
                    <Text className="text-xs font-semibold uppercase tracking-[0px] text-neutral-500">
                      Muted
                    </Text>
                    <Text className="mt-1 text-lg font-semibold tracking-tight text-neutral-950">
                      {settings.length - enabledCount}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="flex-col gap-6 xl:flex-row">
              <View className="flex-[1.6] gap-4">
                <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
                  <View className="flex-row items-center gap-3 rounded-2xl bg-neutral-50 px-4 py-3">
                    <ShieldCheck size={18} color={Colors.common.BRAND} />
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-neutral-900">
                        Notification control
                      </Text>
                      <Text className="mt-1 text-sm text-neutral-600">
                        Toggle each channel independently. Changes are local in
                        this screen.
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="gap-3">
                  {settings.map((setting) => (
                    <SettingsCard
                      key={setting.id}
                      title={setting.title}
                      description={setting.description}
                      enabled={setting.enabled}
                      onToggle={() => toggleSetting(setting.id)}
                    />
                  ))}
                </View>
              </View>

              <View className="flex-1 gap-4">
                <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
                  <View className="flex-row items-center gap-3">
                    <View className="h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
                      <Sparkles size={18} color={Colors.common.BRAND} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-neutral-900">
                        Keep important alerts on
                      </Text>
                      <Text className="mt-1 text-sm leading-6 text-neutral-600">
                        Job alerts, messages, and payment updates are the most
                        useful signals for a worker account.
                      </Text>
                    </View>
                  </View>

                  <View className="mt-4 gap-3">
                    <View className="rounded-2xl bg-neutral-100 p-4">
                      <Text className="text-sm font-semibold text-neutral-900">
                        Faster response
                      </Text>
                      <Text className="mt-1 text-sm leading-6 text-neutral-600">
                        Turn on messages to catch replies quickly.
                      </Text>
                    </View>

                    <View className="rounded-2xl bg-neutral-100 p-4">
                      <Text className="text-sm font-semibold text-neutral-900">
                        Less noise
                      </Text>
                      <Text className="mt-1 text-sm leading-6 text-neutral-600">
                        Mute reminders or booking updates if they're too noisy
                        for the day.
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.9}
                  className="flex-row items-center justify-between rounded-[24px] bg-neutral-950 px-5 py-5"
                >
                  <View className="flex-1 pr-3">
                    <Text className="text-xs font-semibold uppercase tracking-[0px] text-white/60">
                      Email summary
                    </Text>
                    <Text className="mt-2 text-lg font-semibold tracking-tight text-white">
                      Weekly digest enabled
                    </Text>
                  </View>
                  <Mail size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}
