import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ArrowRight, ChevronDown } from "lucide-react-native";
import AuthWebShell from "./_web-shell";
import { normalizeUserRole, type UserRole } from "@/constants/Routes";

interface RegisterGeneralScreenProps {
  role?: UserRole;
  onContinue?: (data: {
    trade: string;
    experience: string;
    availableTime: string;
    address: string;
  }) => void;
  onLoginPress?: () => void;
  onBackPress?: () => void;
}

export default function RegisterGeneralScreenWeb({
  role,
  onContinue,
  onLoginPress,
  onBackPress,
}: RegisterGeneralScreenProps) {
  const router = useRouter();
  const activeRole = normalizeUserRole(role);
  const [openField, setOpenField] = useState<
    "trade" | "experience" | "availableTime" | null
  >(null);

  const { handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      trade: "Groundworker",
      experience: "6 years",
      availableTime: "8 am - 5 pm",
      address: "2972 Westheimer Rd. Santa A...",
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

  const times = [
    { label: "8 am - 5 pm", value: "8 am - 5 pm" },
    { label: "7 am - 4 pm", value: "7 am - 4 pm" },
    { label: "9 am - 6 pm", value: "9 am - 6 pm" },
    { label: "Night shift", value: "Night shift" },
    { label: "Flexible", value: "Flexible" },
  ];

  const selectedTrade = watch("trade");
  const selectedExperience = watch("experience");
  const selectedTime = watch("availableTime");

  const renderDropdown = (
    field: "trade" | "experience" | "availableTime",
    label: string,
    value: string,
    options: { label: string; value: string }[],
    placeholder: string,
  ) => {
    const isOpen = openField === field;

    return (
      <View>
        <Text className="mb-2 text-sm font-semibold text-[#333]">{label}</Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setOpenField(isOpen ? null : field)}
          className="flex h-[50px] flex-row items-center justify-between rounded-xl border border-[#e8e8e8] bg-white px-4"
        >
          <Text className="text-sm font-medium text-[#222]">
            {value || placeholder}
          </Text>
          <ChevronDown size={18} color="#999999" />
        </TouchableOpacity>

        {isOpen ? (
          <View className="mt-2 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
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
                  className={`min-h-[48px] justify-center px-4 ${
                    selected ? "bg-[#FFF5F2]" : "bg-white"
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      selected
                        ? "font-bold text-[#FF5500]"
                        : "font-medium text-neutral-800"
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

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    router.push({
      pathname: "/auth",
      params: { step: "register_sso", role: activeRole },
    });
  };

  const onSubmit = (data: any) => {
    if (onContinue) {
      onContinue(data);
    } else {
      router.push({
        pathname: "/auth",
        params: { step: "register_documents", role: activeRole },
      });
    }
  };

  return (
    <AuthWebShell
      eyebrow="Profile setup"
      title="Add Your Trade Details"
      subtitle="Employers can understand your trade, experience, and availability faster when your profile is complete."
      onBackPress={handleBack}
    >
      <View className="gap-6">
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
          "Select availability",
        )} */}
      </View>

      <View className="mt-6 gap-4">
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.9}
          className="flex-row items-center justify-center gap-2 rounded-2xl bg-[#1B2530] py-4"
        >
          <Text className="text-base font-semibold text-white">Continue</Text>
          <ArrowRight size={16} color="#FFFFFF" />
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
                  params: { step: "login", role: activeRole },
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
    </AuthWebShell>
  );
}
