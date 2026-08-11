import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react-native";
import LogoWhite from "@/assets/icons/LogoWhite";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import StandardSelectField from "@/components/standard_ui/form_fields/StandardSelectField";
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
}

export default function RegisterGeneralScreenWeb({
  role,
  onContinue,
  onLoginPress,
}: RegisterGeneralScreenProps) {
  const router = useRouter();
  const activeRole = normalizeUserRole(role);

  const { control, handleSubmit } = useForm({
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
    <View className="flex-1 min-h-0">
      <View className="rounded-[28px] border border-neutral-200 bg-white p-5 md:p-6">
        <View className="mb-6 items-center rounded-[24px] bg-[#FF5500] px-6 py-8">
          <LogoWhite />
          <Text className="mt-6 text-center text-2xl font-semibold tracking-tight text-white">
            Add your work details
          </Text>
          <Text className="mt-2 max-w-md text-center text-sm leading-6 text-white/85">
            Employers can understand your trade, experience, and availability
            faster when your profile is complete.
          </Text>
        </View>

        <View className="grid gap-5 lg:grid-cols-2">
          <StandardSelectField
            label="Trade / Skill"
            id="trade"
            control={control}
            options={trades}
            placeholder="Select trade / skill"
            required
          />

          <StandardSelectField
            label="Experience"
            id="experience"
            control={control}
            options={experiences}
            placeholder="Select experience"
            required
          />

          <StandardSelectField
            label="Available times"
            id="availableTime"
            control={control}
            options={times}
            placeholder="Select availability"
            required
          />

          <StandardInputField
            label="Address"
            id="address"
            control={control}
            required
            placeholder="Enter address"
          />
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
      </View>
    </View>
  );
}
