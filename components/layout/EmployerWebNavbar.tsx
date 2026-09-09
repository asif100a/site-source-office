import { View, Text, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { Link, usePathname, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { ArrowRight, LogOut, Menu, X } from "lucide-react-native";
import Logo from "@/assets/images/app-logo.png";
import { clearUserAuthenticated } from "@/constants/authState";
import { useIsAuthenticated } from "@/hooks/useAuthGuard";
import { logout } from "@/store/slices/authSlice";

const NAV_LINKS = [
  {
    href: "/tabs",
    label: "Home",
    activePaths: ["/tabs", "/tabs/"],
  },
  {
    href: "/tabs/workers",
    label: "Search Workers",
    activePaths: ["/tabs/workers"],
  },
  {
    href: "/tabs/my-jobs",
    label: "My Jobs",
    activePaths: ["/tabs/my-jobs"],
  },
  {
    href: "/tabs/approvals",
    label: "Approvals",
    activePaths: ["/tabs/approvals"],
  },
  {
    href: "/tabs/profile",
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

export default function EmployerWebNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isAuthenticated = useIsAuthenticated();

  const handleNavigate = (href: string) => {
    setMenuOpen(false);
    router.push(href as any);
  };

  const handleLogin = () => {
    router.push({
      pathname: "/auth",
      params: { step: "login", role: "employer" },
    });
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setMenuOpen(false);
    setIsLoggingOut(true);

    try {
      await Promise.all([
        AsyncStorage.removeItem("token"),
        AsyncStorage.removeItem("otpToken"),
        AsyncStorage.removeItem("forgotToken"),
      ]);
    } catch (error) {
      console.error("Failed to clear auth storage during logout.", error);
    }

    dispatch(logout());
    clearUserAuthenticated();
    router.replace({
      pathname: "/auth",
      params: { currentStep: "login", role: "employer" },
    });
    setIsLoggingOut(false);
  };

  return (
    <View className="border-b border-neutral-200 bg-white/95 backdrop-blur">
      <View className="mx-auto flex w-full max-w-7xl flex-row items-center gap-4 px-4 py-3 lg:px-0">
        <Pressable
          onPress={() => handleNavigate("/tabs")}
          className="shrink-0 active:opacity-80"
        >
          <Image source={Logo} style={{ width: 112, height: 60 }} />
        </Pressable>

        <View className="hidden flex-1 flex-row items-center justify-center gap-2 lg:flex">
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

        <View className="ml-auto hidden lg:flex">
          {isAuthenticated ? (
            <Pressable
              onPress={() => void handleLogout()}
              disabled={isLoggingOut}
              className="flex-row items-center gap-2 rounded-full bg-neutral-950 px-4 py-2.5 active:opacity-90 disabled:opacity-60"
            >
              <Text className="text-sm font-semibold text-white">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Text>
              <LogOut size={16} color="#FFFFFF" />
            </Pressable>
          ) : (
            <Pressable
              onPress={handleLogin}
              className="flex-row items-center gap-2 rounded-full bg-neutral-950 px-4 py-2.5 active:opacity-90"
            >
              <Text className="text-sm font-semibold text-white">Login</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </Pressable>
          )}
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

            {isAuthenticated ? (
              <Pressable
                onPress={() => void handleLogout()}
                disabled={isLoggingOut}
                className="mt-2 flex-row items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-4 py-3.5 active:opacity-90 disabled:opacity-60"
              >
                <Text className="text-sm font-bold text-white">
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Text>
                <LogOut size={16} color="#FFFFFF" />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  setMenuOpen(false);
                  handleLogin();
                }}
                className="mt-2 flex-row items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-4 py-3.5 active:opacity-90"
              >
                <Text className="text-sm font-bold text-white">Login</Text>
                <ArrowRight size={16} color="#FFFFFF" />
              </Pressable>
            )}
          </View>
        </View>
      ) : null}
    </View>
  );
}
