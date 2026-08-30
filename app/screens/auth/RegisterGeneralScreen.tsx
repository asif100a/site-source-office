import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import LogoWhite from "@/assets/icons/LogoWhite";
import { useForm } from "react-hook-form";
import { ChevronDown } from "lucide-react-native";
import { normalizeUserRole, UserRole } from "@/constants/Routes";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";

interface RegisterGeneralScreenProps {
  role?: UserRole;
  onContinue?: () => void;
  onLoginPress?: () => void;
  onBackPress?: () => void;
}

export default function RegisterGeneralScreen({
  role,
  onContinue,
  onLoginPress,
}: RegisterGeneralScreenProps) {
  const router = useRouter();
  const activeRole = normalizeUserRole(role);
  const [openField, setOpenField] = useState<
    "trade" | "experience" | "availableTime" | null
  >(null);

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      trade: "",
      experience: "",
      availableTime: "",
      address: "",
    },
  });

  const trades = [
    { label: "Groundworker", value: "Groundworker" },
    { label: "Carpenter", value: "Carpenter" },
    { label: "Electrician", value: "Electrician" },
    { label: "Plumber", value: "Plumber" },
    { label: "Bricklayer", value: "Bricklayer" },
    { label: "Painter", value: "Painter" },
    { label: "Scaffolder", value: "Scaffolder" },
  ];

  const experiences = [
    { label: "0-1 year", value: "0-1 year" },
    { label: "1 year", value: "1 year" },
    { label: "2 years", value: "2 years" },
    { label: "3 years", value: "3 years" },
    { label: "4 years", value: "4 years" },
    { label: "5 years", value: "5 years" },
    { label: "6 years", value: "6 years" },
    { label: "7+ years", value: "7+ years" },
  ];

  const selectedTrade = watch("trade");
  const selectedExperience = watch("experience");

  const renderDropdown = (
    field: "trade" | "experience" | "availableTime",
    label: string,
    value: string,
    options: { label: string; value: string }[],
    placeholder: string,
  ) => {
    const isOpen = openField === field;

    return (
      <View className="mb-5">
        <Text className="mb-2 text-sm font-semibold text-[#333]">{label}</Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setOpenField(isOpen ? null : field)}
          className="h-[50px] flex-row items-center justify-between rounded-xl border border-[#e8e8e8] bg-white px-4"
        >
          <Text className="text-sm font-medium text-[#222]">
            {value || placeholder}
          </Text>
          <ChevronDown size={18} color="#999999" />
        </TouchableOpacity>

        {isOpen ? (
          <View className="mt-2 overflow-hidden rounded-xl border border-neutral-200 bg-white">
            {options.map((option) => {
              const selected = value === option.value;

              return (
                <TouchableOpacity
                  key={option.value}
                  activeOpacity={0.8}
                  onPress={() => {
                    setValue(field, option.value, {
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                    setOpenField(null);
                  }}
                  className={`min-h-[48px] px-4 justify-center ${
                    selected ? "bg-[#FFF5F2]" : "bg-white"
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      selected
                        ? "text-[#FF5500] font-bold"
                        : "text-neutral-800 font-medium"
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
      </View>
    );
  };

  const onSubmit = (data: any) => {
    if (onContinue) {
      onContinue();
    } else {
      router.push({
        pathname: "/auth",
        params: { step: "register_documents", role: activeRole },
      });
    }
  };

  const handleSkip = () => {
    if (onContinue) {
      onContinue();
    }
  }

  return (
    <View className="flex-1 bg-white" style={{ flex: 1 }}>
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {/* Orange Header Section */}
        <View className="bg-[#FF5500] pb-10 px-6">
          <View className="mb-4 justify-center items-center">
            <LogoWhite />
          </View>
          <Text className="text-white text-3xl font-bold tracking-tight">
            Add Your Trade Details
          </Text>
          <Text className="text-white/85 text-sm mt-1.5 font-medium">
            Tell employers about your trade, experience, and availability.
          </Text>
        </View>

        {/* Form Fields Section */}
        <View className="px-6 pt-6 pb-20 gap-1">
          {renderDropdown(
            "trade",
            "Trade / Skill",
            selectedTrade,
            trades,
            "Select trade / skill",
          )}

          {renderDropdown(
            "experience",
            "Experience",
            selectedExperience,
            experiences,
            "Select experience",
          )}

          {/* {renderDropdown(
            "availableTime",
            "Available times",
            selectedTime,
            times,
            "Select available times",
          )} */}

          <StandardInputField
            label="Address"
            id="address"
            control={control}
            required={true}
            placeholder="Enter your Address"
          />

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.9}
            className="w-full bg-[#1B2530] py-4 rounded-xl items-center justify-center shadow-sm mt-4"
          >
            <Text className="text-white text-base font-semibold">Continue</Text>
          </TouchableOpacity>

          {/* Skip Button */}
          <TouchableOpacity
            onPress={handleSkip}
            activeOpacity={0.9}
            className="w-full border border-[#1B2530] py-4 rounded-xl items-center justify-center shadow-sm mt-4"
          >
            <Text className="text-neutral-800 text-base font-semibold">Skip for now</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-neutral-800 text-sm font-medium">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={
                onLoginPress ??
                (() =>
                  router.push({
                    pathname: "/auth",
                    params: { step: "login", role: activeRole },
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
    </View>
  );
}
