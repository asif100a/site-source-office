import { View, Text } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { Link } from "expo-router";
import Logo from "@/assets/images/app-logo.png";

const FOOTER_LINK_GROUPS = [
  {
    title: "Account",
    links: [
      { href: "/tabs/(worker-tabs)/profile", label: "Profile" },
      { href: "/tabs/(worker-tabs)/my-jobs", label: "My Jobs" },
      { href: "/tabs/(worker-tabs)/chats", label: "Chats" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/screens/profile/contact", label: "Contact Support" },
      { href: "/screens/profile/disputes", label: "Support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/screens/profile/terms", label: "Terms" },
      { href: "/screens/profile/privacy-policy", label: "Privacy Policy" },
    ],
  },
] as const;

export default function WorkerWebFooter() {
  return (
    <View className="border-t border-neutral-200 bg-white">
      <View className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-0">
        <View className="flex flex-col gap-8 md:flex-row md:flex-wrap md:justify-between">
          <View className="max-w-sm md:basis-[320px]">
            <View className="mb-4">
              <Image source={Logo} style={{ width: 130, height: 70 }} />
            </View>
            <Text className="text-sm leading-6 text-neutral-600">
              Find work, track jobs, and stay connected with your team from one
              desktop-friendly workspace.
            </Text>
          </View>

          <View className="flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:gap-12 md:flex-1 md:justify-end">
            {FOOTER_LINK_GROUPS.map((group) => (
              <View key={group.title} className="min-w-[160px] gap-3">
                <Text className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-950">
                  {group.title}
                </Text>
                <View className="gap-2">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href as any}
                      className="text-sm text-neutral-600 transition-colors hover:text-neutral-950"
                    >
                      {link.label}
                    </Link>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="mt-10 flex flex-col gap-3 border-t border-neutral-200 pt-6 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
          <Text>(c) 2026 Site Source. All rights reserved.</Text>
          <Text>Built for workers who want a cleaner desktop experience.</Text>
        </View>
      </View>
    </View>
  );
}
