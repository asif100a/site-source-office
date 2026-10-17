import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setToken } from "@/store/slices/authSlice";
import { BACKEND_URL } from "@/constants/env.config";
import {
  getDashboardRouteForRole,
  normalizeUserRole,
} from "@/constants/Routes";
import { markUserAuthenticated, setActiveRole } from "@/constants/authState";

export default function AppleCallback() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams<{ code?: string; error?: string; role?: string }>();
  const [message, setMessage] = useState("Completing Apple sign-in...");

  useEffect(() => {
    const complete = async () => {
      const role = normalizeUserRole(params.role);
      if (params.error) throw new Error(params.error);
      if (!params.code) throw new Error("Apple did not return an authorization code.");

      const response = await fetch(`${BACKEND_URL}/auth/apple/web/exchange`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: params.code, role: role.toUpperCase() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message ?? "Apple sign-in failed.");

      const token = data.accessToken ?? data.data?.accessToken ?? data.data?.token;
      if (!token) throw new Error("The server did not return an access token.");

      dispatch(setToken(token));
      await AsyncStorage.setItem("token", token);
      setActiveRole(role);
      markUserAuthenticated();
      router.replace(getDashboardRouteForRole(role));
    };

    void complete().catch((error: any) => {
      setMessage(error?.message ?? "Apple sign-in failed.");
      Toast.show({ type: "error", text1: "Apple sign-in failed", text2: error?.message });
      setTimeout(() => router.replace({ pathname: "/auth", params: { step: "login", role: normalizeUserRole(params.role) } }), 1500);
    });
  }, [dispatch, params.code, params.error, params.role, router]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 16 }}>
      <ActivityIndicator />
      <>{message}</>
    </View>
  );
}
