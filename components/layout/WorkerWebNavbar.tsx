import { View, Text, Pressable } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { Link, usePathname, useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";
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
  {
    href: "/screens/common/Notifications",
    label: "Notifications",
    activePaths: ["/screens/common/Notifications"],
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

export default function WorkerWebNavbar() {
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
