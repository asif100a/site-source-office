import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Image } from "expo-image";
import { Info, Sparkles, Upload } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import StandardCheckbox from "@/components/standard_ui/form_fields/StandardCheckbox";
import LogoWhite from "@/assets/icons/LogoWhite";
import AuthWebShell from "./_web-shell";

interface RegisterEmployerScreenProps {
  onContinue?: (data: {
    companyName: string;
    logo: any;
    password: string;
    address: string;
  }) => void;
  onLoginPress?: () => void;
}

export default function RegisterEmployerScreenWeb({
  onContinue,
  onLoginPress,
}: RegisterEmployerScreenProps) {
  const router = useRouter();
  const [logo, setLogo] = useState<any>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      companyName: "",
      password: "",
      confirmPassword: "",
      address: "2972 Westheimer Rd. Santa A...",
    },
  });

  const handleUploadLogo = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      setLogo(res.assets[0]);
    }
  };

  const onSubmit = (data: any) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (!termsAccepted) {
      Alert.alert(
        "Terms required",
        "Please accept the terms and privacy policy to continue.",
      );
      return;
    }
    if (onContinue) {
      onContinue({
        companyName: data.companyName,
        logo,
        password: data.password,
        address: data.address,
      });
    }
  };

  return (
    <View className="flex-1 min-h-0">
      <View className="rounded-[28px] border border-neutral-200 bg-white p-5 md:p-6">
        <View className="mb-6 items-center rounded-[24px] bg-[#FF5500] px-6 py-8">
          <LogoWhite />
          <Text className="mt-6 text-center text-2xl font-semibold tracking-tight text-white">
            Create your company account
          </Text>
          <Text className="mt-2 max-w-md text-center text-sm leading-6 text-white/85">
            Set up your employer profile and connect your company to the
            platform.
          </Text>
        </View>

        <View className="grid gap-5 lg:grid-cols-2">
          <View className="lg:col-span-2">
            <StandardInputField
              label="Company Name"
              id="companyName"
              control={control}
              required
              placeholder="Enter company name"
            />
          </View>

          <View className="lg:col-span-2">
            <Text className="mb-2 text-sm font-medium text-neutral-800">
              Upload Logo
            </Text>
            <View
              className="items-center rounded-2xl border-2 border-dashed border-neutral-200 bg-[#FAFAFA] p-6"
              style={{ borderStyle: "dashed" }}
            >
              <Text className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Upload photo
              </Text>
              <Text className="mb-4 text-[10px] font-medium tracking-wide text-neutral-400">
                JPG • PNG - MAX 10MB
              </Text>

              <TouchableOpacity
                onPress={handleUploadLogo}
                activeOpacity={0.8}
                className="flex-row items-center gap-1.5 rounded-full bg-[#1B2530] px-4 py-2.5"
              >
                <Upload size={14} color="#FFFFFF" />
                <Text className="text-xs font-semibold text-white">
                  Upload logo
                </Text>
              </TouchableOpacity>

              {logo ? (
                <View className="mt-4 w-full overflow-hidden rounded-xl">
                  <Image
                    source={{ uri: logo.uri }}
                    className="h-36 w-full"
                    contentFit="cover"
                  />
                </View>
              ) : null}
            </View>
          </View>

          <StandardInputField
            label="Password"
            id="password"
            type="password"
            control={control}
            required
            placeholder="Enter password"
          />

          <StandardInputField
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            control={control}
            required
            placeholder="Confirm password"
          />

          <View className="lg:col-span-2">
            <StandardInputField
              label="Address"
              id="address"
              control={control}
              required
              placeholder="Enter address"
            />
          </View>

          <View className="lg:col-span-2 flex-row items-start gap-2">
            <StandardCheckbox
              value={termsAccepted}
              onValueChange={setTermsAccepted}
            />
            <Text className="flex-1 text-xs font-medium leading-relaxed text-neutral-500">
              By continuing you agree to our{" "}
              <Text className="text-xs font-semibold text-[#FF5500] underline">
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text className="text-xs font-semibold text-[#FF5500] underline">
                Privacy policy
              </Text>
              .
            </Text>
          </View>

          <View className="lg:col-span-2 rounded-2xl border border-[#FFDCD0] bg-[#FFF5F2] p-4">
            <View className="flex-row items-start gap-3">
              <View className="mt-0.5 rounded-full bg-[#FF5500] p-1">
                <Info size={12} color="#FFFFFF" />
              </View>
              <Text className="flex-1 text-xs leading-5 text-[#3C3C3C]">
                Admin will review your documents within 2-4 hours. You will
                receive a push notification when approved.
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-6 gap-4">
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.9}
            className="flex-row items-center justify-center gap-2 rounded-2xl bg-[#1B2530] py-4"
          >
            <Text className="text-base font-semibold text-white">Continue</Text>
            <Sparkles size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <View className="flex-row items-center justify-center">
            <Text className="text-sm font-medium text-neutral-700">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={
                onLoginPress ??
                (() =>
                  router.push({
                    pathname: "/auth",
                    params: { step: "login", role: "employer" },
                  }))
              }
              activeOpacity={0.7}
            >
              <Text className="text-sm font-semibold text-[#1B2530] underline">
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
