import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import { usePathname, useRouter } from "expo-router";
import { ArrowRight, Menu, X } from "lucide-react-native";

import Logo from "@/assets/images/app-logo.png";
import {
  getWorkerLoginRoute,
  isUserAuthenticated,
} from "@/constants/authState";

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
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (href: string) => {
    setMenuOpen(false);

    const isProtectedLink =
      href === "/tabs/(worker-tabs)/my-jobs" ||
      href === "/tabs/(worker-tabs)/chats" ||
      href === "/tabs/(worker-tabs)/profile";

    if (isProtectedLink && !isUserAuthenticated()) {
      router.push(getWorkerLoginRoute(href));
      return;
    }

    router.push(href as any);
  };

  return (
    <View className="border-b border-neutral-200 bg-white/95 backdrop-blur">
      <View className="mx-auto flex w-full max-w-7xl flex-row items-center gap-4 px-4 py-3 lg:px-0">
        <Pressable
          onPress={() => handleNavigate("/tabs/(worker-tabs)")}
          className="shrink-0 active:opacity-80"
        >
          <Image source={Logo} style={{ width: 112, height: 60 }} />
        </Pressable>

        <View className="hidden flex-1 flex-row items-center justify-center gap-2 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = isActiveNavPath(pathname, link);

            return (
              <Pressable
                key={link.href}
                onPress={() => handleNavigate(link.href)}
                className={`rounded-full px-5 py-2.5 transition-colors ${
                  isActive ? "bg-neutral-950" : "hover:bg-neutral-100"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    isActive ? "text-white" : "text-neutral-600"
                  }`}
                >
                  {link.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="ml-auto hidden lg:flex">
          <Pressable
            onPress={() => router.push(getWorkerLoginRoute())}
            className="flex-row items-center gap-2 rounded-full bg-neutral-950 px-4 py-2.5 active:opacity-90"
          >
            <Text className="text-sm font-semibold text-white">Login</Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </Pressable>
        </View>

        <Pressable
          onPress={() => setMenuOpen((current) => !current)}
          className="ml-auto h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white active:opacity-85 lg:hidden"
        >
          {menuOpen ? <X size={18} color="#171717" /> : <Menu size={18} color="#171717" />}
        </Pressable>
      </View>

      {menuOpen ? (
        <View className="border-t border-neutral-200 bg-white px-4 pb-4 pt-3 lg:hidden">
          <View className="gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = isActiveNavPath(pathname, link);

              return (
                <Pressable
                  key={link.href}
                  onPress={() => handleNavigate(link.href)}
                  className={`rounded-2xl px-4 py-3 ${
                    isActive ? "bg-neutral-950" : "bg-neutral-100"
                  }`}
                >
                  <Text
                    className={`text-sm font-bold ${
                      isActive ? "text-white" : "text-neutral-800"
                    }`}
                  >
                    {link.label}
                  </Text>
                </Pressable>
              );
            })}

            <Pressable
              onPress={() => {
                setMenuOpen(false);
                router.push(getWorkerLoginRoute());
              }}
              className="mt-2 flex-row items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-4 py-3.5 active:opacity-90"
            >
              <Text className="text-sm font-bold text-white">Login</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}
