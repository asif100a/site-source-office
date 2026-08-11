import React from "react";
import { Link, Slot, usePathname, useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import Logo from "@/assets/images/app-logo.png";

const NAV_LINKS = [
  {
    href: "/tabs/(worker-tabs)",
    label: "Home",
    activePaths: ["/tabs", "/tabs/"],
  },
  {
    href: "/tabs/(worker-tabs)/jobs",
    label: "Search Jobs",
    activePaths: ["/tabs/jobs"],
  },
  {
    href: "/tabs/(worker-tabs)/my-jobs",
    label: "My Jobs",
    activePaths: ["/tabs/my-jobs"],
  },
  {
    href: "/tabs/(worker-tabs)/chats",
    label: "Chats",
    activePaths: ["/tabs/chats"],
  },
  {
    href: "/tabs/(worker-tabs)/profile",
    label: "Profile",
    activePaths: ["/tabs/profile"],
  },
];

function isActiveNavPath(pathname: string, link: (typeof NAV_LINKS)[number]) {
  return link.activePaths.some((activePath) => {
    if (activePath === "/tabs" || activePath === "/tabs/") {
      return pathname === activePath;
    }

    return pathname === activePath || pathname.startsWith(`${activePath}/`);
  });
}

function WorkerWebNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View className="border-b border-neutral-200 bg-white/95 backdrop-blur">
      <View className="mx-auto flex w-full max-w-7xl flex-row items-center gap-6 px-6 py-3 lg:px-0">
        <Pressable
          onPress={() => router.push("/tabs/(worker-tabs)" as any)}
          className="shrink-0 active:opacity-80"
        >
          <Image source={Logo} style={{ width: 130, height: 70 }} />
        </Pressable>

        <View className="hidden flex-1 flex-row items-center justify-center gap-2 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = isActiveNavPath(pathname, link);

            return (
              <Link
                key={link.href}
                href={link.href as any}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-neutral-950 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </View>

        <View className="ml-auto">
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/auth",
                params: { step: "login" },
              })
            }
            className="flex-row items-center gap-2 rounded-full bg-neutral-950 px-4 py-2.5 active:opacity-90"
          >
            <Text className="text-sm font-semibold text-white">Login</Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

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

function WorkerWebFooter() {
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

export default function WorkerTabsWebLayout() {
  return (
    <ScrollView className="flex-1 bg-neutral-50">
      <WorkerWebNavbar />
      <Slot />
      <WorkerWebFooter />
    </ScrollView>
  );
}
