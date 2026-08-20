import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import LogoWhite from "@/assets/icons/LogoWhite";
import { useForm } from "react-hook-form";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import { Upload, Info } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import StandardCheckbox from "@/components/standard_ui/form_fields/StandardCheckbox";

interface RegisterEmployerScreenProps {
  onContinue?: (data: {
    companyName: string;
    logo: any;
    password: string;
    address: string;
  }) => void;
  onLoginPress?: () => void;
  onBackPress?: () => void;
}

export default function RegisterEmployerScreen({
  onContinue,
  onLoginPress,
  onBackPress,
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
      Alert.alert("Terms required", "Please accept the terms and privacy policy to continue.");
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
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      bounces={false}
    >
      {/* Orange Header Section */}
      <View className="bg-[#FF5500] pb-10 px-6">
        <View className="mb-4 justify-center items-center">
          <LogoWhite />
        </View>
        <Text className="text-white text-3xl font-bold tracking-tight">
          Create Your Account
        </Text>
        {/* <Text className="text-white/85 text-sm mt-1.5 font-medium">
          Register to continue your journey with Site Source
        </Text> */}
      </View>

      {/* Form Fields Section */}
      <View className="px-6 pt-6 pb-20 gap-1">
        {/* Company Name */}
        <StandardInputField
          label="Company Name"
          id="companyName"
          control={control}
          required={true}
          placeholder="Enter Company Name"
        />

        {/* Logo Upload */}
        <View className="mb-1">
          <Text className="text-sm mb-2 text-neutral-800 font-medium">
            Upload Logo
          </Text>
          <View
            className="border-2 border-dashed border-neutral-200 rounded-2xl p-6 items-center bg-[#FAFAFA]"
            style={{ borderStyle: "dashed" }}
          >
            <Text className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mb-1">
              Upload Photo
            </Text>
            <Text className="text-neutral-400 text-[10px] font-medium tracking-wide mb-4">
              JPG • PNG - MAX 10MB
            </Text>
            <TouchableOpacity
              onPress={handleUploadLogo}
              activeOpacity={0.8}
              className="bg-[#1B2530] px-4 py-2.5 rounded-full flex-row items-center gap-1.5 shadow-sm"
            >
              <Upload size={14} color="#FFFFFF" />
              <Text className="text-white text-xs font-semibold">
                Upload Logo
              </Text>
            </TouchableOpacity>
            {logo && (
              <View className="mt-4 w-full">
                <Image
                  source={{ uri: logo.uri }}
                  className="w-full h-32 rounded-xl"
                  contentFit="cover"
                />
              </View>
            )}
          </View>
        </View>

        {/* Password */}
        <StandardInputField
          label="Password"
          id="password"
          type="password"
          control={control}
          required={true}
          placeholder="•••••••"
        />

        {/* Confirm Password */}
        <StandardInputField
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          control={control}
          required={true}
          placeholder="•••••••"
        />

        {/* Address */}
        <StandardInputField
          label="Address"
          id="address"
          control={control}
          required={true}
          placeholder="Enter Address"
        />

        <View className="flex-row items-start gap-2 mt-4">
          <StandardCheckbox
            value={termsAccepted}
            onValueChange={setTermsAccepted}
          />
          {/* Terms and Conditions */}
          <Text className="text-neutral-400 text-xs leading-relaxed font-medium -mt-1">
            By continuing you agree to our{" "}
            <Text className="text-[#FF5500] underline font-semibold text-xs">
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text className="text-[#FF5500] underline font-semibold text-xs">
              Privacy policy
            </Text>
          </Text>
        </View>

        {/* Info Alert Box */}
        <View className="bg-[#FFF5F2] border border-[#FFDCD0] rounded-xl p-4 flex-row gap-3 items-start mt-3">
          <View className="bg-[#FF5500] rounded-full p-1 items-center justify-center mt-0.5">
            <Info size={12} color="#FFFFFF" />
          </View>
          <Text className="flex-1 text-[#3C3C3C] text-xs font-medium leading-relaxed">
            Admin will review your documents within 2-4 hours. You will receive
            a push notification when approved.
          </Text>
        </View>

        {/* Continue Button */}
        <View className="my-6">
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.9}
            className="w-full bg-[#1B2530] py-4 rounded-xl items-center justify-center shadow-sm"
          >
            <Text className="text-white text-base font-semibold">Continue</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center items-center">
          <Text className="text-neutral-800 text-sm font-medium">
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
            <Text className="text-[#1B2530] text-sm font-bold underline">
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
