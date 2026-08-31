import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { useForm } from "react-hook-form";
import { ArrowRight, Camera, ChevronDown } from "lucide-react-native";
import AuthWebShell from "./_web-shell";
import { normalizeUserRole, type UserRole } from "@/constants/Routes";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import { useUpdateWorkerProfileMutation } from "@/store/api/workerProfileApi";
import {
  getAddressDetails,
  getAddressSuggestions,
  type AddressDetails,
  type AddressSuggestion,
} from "@/utils/googlePlaces";
import { buildWorkerProfileFormData } from "@/utils/workerProfileFormData";

type RegisterGeneralFormValues = {
  trade: string;
  experience: string;
  address: string;
};

interface RegisterGeneralScreenProps {
  role?: UserRole;
  name?: string;
  onContinue?: () => void;
  onLoginPress?: () => void;
  onBackPress?: () => void;
}

const trades = [
  { label: "Groundworker", value: "GROUNDWORKER" },
  { label: "Carpenter", value: "CARPENTER" },
  { label: "Electrician", value: "ELECTRICIAN" },
  { label: "Plumber", value: "PLUMBER" },
  { label: "Bricklayer", value: "BRICKLAYER" },
  { label: "Painter", value: "PAINTER" },
  { label: "Scaffolder", value: "SCAFFOLDER" },
];

const experiences = [
  { label: "0-1 year", value: "0" },
  { label: "1 year", value: "1" },
  { label: "2 years", value: "2" },
  { label: "3 years", value: "3" },
  { label: "4 years", value: "4" },
  { label: "5 years", value: "5" },
  { label: "6 years", value: "6" },
  { label: "7+ years", value: "7" },
];

function getOptionLabel(
  options: { label: string; value: string }[],
  value: string,
) {
  return options.find((option) => option.value === value)?.label || "";
}

export default function RegisterGeneralScreenWeb({
  role,
  name,
  onContinue,
  onLoginPress,
  onBackPress,
}: RegisterGeneralScreenProps) {
  const router = useRouter();
  const activeRole = normalizeUserRole(role);
  const [openField, setOpenField] = useState<"trade" | "experience" | null>(
    null,
  );
  const [profileImage, setProfileImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [selectedAddress, setSelectedAddress] =
    useState<AddressDetails | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestion[]
  >([]);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [isSelectingAddress, setIsSelectingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [updateWorkerProfile, { isLoading: isUpdatingProfile }] =
    useUpdateWorkerProfileMutation();

  const { control, handleSubmit, watch, setValue } =
    useForm<RegisterGeneralFormValues>({
      defaultValues: {
        trade: "",
        experience: "",
        address: "",
      },
    });

  const selectedTrade = watch("trade");
  const selectedExperience = watch("experience");
  const addressValue = watch("address");

  useEffect(() => {
    const trimmedAddress = addressValue.trim();

    if (selectedAddress && selectedAddress.description !== trimmedAddress) {
      setSelectedAddress(null);
    }

    if (
      trimmedAddress.length < 3 ||
      selectedAddress?.description === trimmedAddress
    ) {
      setAddressSuggestions([]);
      return;
    }

    let isMounted = true;
    const timeoutId = setTimeout(async () => {
      setIsAddressLoading(true);

      try {
        const suggestions = await getAddressSuggestions(trimmedAddress);

        if (isMounted) {
          setAddressSuggestions(suggestions);
          setAddressError(null);
        }
      } catch (error) {
        console.error("Address suggestion lookup failed:", error);

        if (isMounted) {
          setAddressSuggestions([]);
          setAddressError("Unable to load address suggestions right now.");
        }
      } finally {
        if (isMounted) {
          setIsAddressLoading(false);
        }
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [addressValue, selectedAddress]);

  const handlePickProfileImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Toast.show({
        type: "error",
        text1: "Permission required",
        text2: "Please allow photo access to upload your profile image.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0]);
      console.log("Selected profile image:", result.assets[0].uri);
    }
  };

  const handleSelectAddress = async (suggestion: AddressSuggestion) => {
    setIsSelectingAddress(true);

    try {
      const details = await getAddressDetails(
        suggestion.placeId,
        suggestion.description,
      );

      setSelectedAddress(details);
      setAddressSuggestions([]);
      setAddressError(null);
      setValue("address", details.description, {
        shouldDirty: true,
        shouldTouch: true,
      });
    } catch (error) {
      console.error("Address details lookup failed:", error);
      Toast.show({
        type: "error",
        text1: "Address lookup failed",
        text2: "Please choose another address suggestion.",
      });
    } finally {
      setIsSelectingAddress(false);
    }
  };

  const renderDropdown = (
    field: "trade" | "experience",
    label: string,
    value: string,
    options: { label: string; value: string }[],
    placeholder: string,
  ) => {
    const isOpen = openField === field;
    const displayValue = getOptionLabel(options, value);

    return (
      <View>
        <Text className="mb-2 text-sm font-semibold text-[#333]">{label}</Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setOpenField(isOpen ? null : field)}
          className="flex h-[50px] flex-row items-center justify-between rounded-xl border border-[#e8e8e8] bg-white px-4"
        >
          <Text className="text-sm font-medium text-[#222]">
            {displayValue || placeholder}
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

  const onSubmit = async (data: RegisterGeneralFormValues) => {
    if (!data.trade || !data.experience) {
      Toast.show({
        type: "error",
        text1: "Complete your trade details",
        text2: "Please select your trade and experience.",
      });
      return;
    }

    if (!selectedAddress) {
      Toast.show({
        type: "error",
        text1: "Select an address",
        text2: "Please choose an address suggestion so we can save coordinates.",
      });
      return;
    }

    try {
      const formData = await buildWorkerProfileFormData({
        name,
        trade: data.trade,
        experience: data.experience,
        address: selectedAddress,
        image: profileImage,
      });

      await updateWorkerProfile(formData).unwrap();

      Toast.show({
        type: "success",
        text1: "Profile updated",
        text2: "Your trade details have been saved.",
      });

      if (onContinue) {
        onContinue();
      } else {
        router.push({
          pathname: "/auth",
          params: { step: "register_documents", role: activeRole },
        });
      }
    } catch (error) {
      console.error("Update worker profile failed:", error);
      Toast.show({
        type: "error",
        text1: "Unable to update profile",
        text2: "Please try again in a moment.",
      });
    }
  };

  const handleSkip = () => {
    if (onContinue) {
      onContinue();
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
        <View>
          <Text className="mb-2 text-sm font-semibold text-[#333]">
            Profile image
          </Text>
          <TouchableOpacity
            onPress={handlePickProfileImage}
            activeOpacity={0.85}
            className="flex-row items-center gap-4 rounded-2xl border border-[#e8e8e8] bg-white px-4 py-4"
          >
            <View className="h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#FFF5F2]">
              {profileImage ? (
                <Image
                  source={{ uri: profileImage.uri }}
                  resizeMode="cover"
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <Camera size={24} color="#FF5500" />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-[#222]">
                {profileImage
                  ? "Change profile image"
                  : "Upload profile image"}
              </Text>
              <Text className="mt-1 text-xs font-medium text-neutral-500">
                Optional. This will be sent as image.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

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

        <View className="relative z-50">
          <StandardInputField
            label="Address"
            id="address"
            control={control}
            required={true}
            placeholder="Start typing your address"
          />

          {isAddressLoading || isSelectingAddress ? (
            <Text className="-mt-3 mb-3 text-xs font-medium text-neutral-500">
              Searching addresses...
            </Text>
          ) : null}

          {addressError ? (
            <Text className="-mt-3 mb-3 text-xs font-medium text-[#d92d20]">
              {addressError}
            </Text>
          ) : null}

          {addressSuggestions.length > 0 ? (
            <View
              className="absolute left-0 right-0 top-[76px] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
              style={{ zIndex: 50 }}
            >
              {addressSuggestions.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion.placeId}
                  onPress={() => handleSelectAddress(suggestion)}
                  activeOpacity={0.8}
                  className="min-h-[48px] justify-center border-b border-neutral-100 px-4 last:border-b-0"
                >
                  <Text className="text-sm font-medium text-neutral-800">
                    {suggestion.description}
                  </Text>
                </TouchableOpacity>
                ))}
              </View>
            ) : null}
        </View>

        {addressSuggestions.length > 0 ? <View className="mb-40" /> : null}
      </View>

      <View className="mt-6 gap-4">
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isUpdatingProfile || isSelectingAddress}
          activeOpacity={0.9}
          className="flex-row items-center justify-center gap-2 rounded-2xl bg-[#1B2530] py-4"
        >
          <Text className="text-base font-semibold text-white">
            {isUpdatingProfile ? "Updating..." : "Continue"}
          </Text>
          <ArrowRight size={16} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSkip}
          activeOpacity={0.9}
          className="w-full border border-[#1B2530] py-4 rounded-xl items-center justify-center shadow-sm mt-4"
        >
          <Text className="text-neutral-800 text-base font-semibold">
            Skip for now
          </Text>
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
