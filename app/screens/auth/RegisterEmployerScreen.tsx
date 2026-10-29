import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { Text } from "@/components/ui/text";
import LogoWhite from "@/assets/icons/LogoWhite";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import { normalizeUserRole, type UserRole } from "@/constants/Routes";
import { useRegisterMutation } from "@/store/api/authApi";
import { useUpdateEmployerProfileMutation } from "@/store/api/employerProfileApi";
import { buildProfileEditFormData } from "@/utils/profileEditFormData";
import { passwordSchema } from "@/zod/authSchema";
import {
  getAddressDetails,
  getAddressSuggestions,
  type AddressDetails,
  type AddressSuggestion,
} from "@/utils/googlePlaces";

interface RegisterEmployerScreenProps {
  isSso?: boolean;
  initialEmail?: string;
  initialName?: string;
  onContinue?: (data: {
    email?: string;
    name?: string;
  }) => void;
  onLoginPress?: () => void;
  onBackPress?: () => void;
}

type RegisterEmployerFormValues = {
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
};

export default function RegisterEmployerScreen({
  isSso,
  initialEmail,
  initialName,
  onContinue,
  onLoginPress,
}: RegisterEmployerScreenProps) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const activeRole = normalizeUserRole(params.role) as UserRole;
  const [selectedAddress, setSelectedAddress] = useState<AddressDetails | null>(
    null,
  );
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestion[]
  >([]);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [isSelectingAddress, setIsSelectingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [register, { isLoading }] = useRegisterMutation();
  const [updateEmployerProfile, { isLoading: isUpdatingProfile }] =
    useUpdateEmployerProfileMutation();

  const { control, handleSubmit, setValue, watch } =
    useForm<RegisterEmployerFormValues>({
      defaultValues: {
        companyName: initialName || "",
        email: initialEmail || "",
        password: "",
        confirmPassword: "",
        address: "",
      },
    });

  useEffect(() => {
    if (initialEmail) setValue("email", initialEmail);
    if (initialName) setValue("companyName", initialName);
  }, [initialEmail, initialName, setValue]);

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
        console.error("Employer address suggestion lookup failed:", error);

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
      console.error("Employer address details lookup failed:", error);
      Toast.show({
        type: "error",
        text1: "Address lookup failed",
        text2: "Please choose another address suggestion.",
      });
    } finally {
      setIsSelectingAddress(false);
    }
  };

  const onSubmit = async (data: RegisterEmployerFormValues) => {
    if (!selectedAddress) {
      Toast.show({
        type: "error",
        text1: "Select an address",
        text2:
          "Please choose an address suggestion so we can save coordinates.",
      });
      return;
    }

    if (isSso) {
      if (!data.companyName.trim()) {
        Toast.show({
          type: "error",
          text1: "Company name required",
          text2: "Please enter your company name.",
        });
        return;
      }

      try {
        const payload = {
          name: data.companyName.trim(),
          companyName: data.companyName.trim(),
          address: {
            type: "Point",
            coordinates: selectedAddress.coordinates,
            description: selectedAddress.description,
          },
        };
        const formData = await buildProfileEditFormData({ payload });
        await updateEmployerProfile(formData).unwrap();

        Toast.show({
          type: "success",
          text1: "Company details saved",
          text2: "Your employer profile has been updated.",
        });

        onContinue?.({
          email: data.email || initialEmail,
          name: data.companyName,
        });
      } catch (error: any) {
        console.error("Employer profile update failed:", error);
        Toast.show({
          type: "error",
          text1: "Update failed",
          text2:
            error?.data?.message ??
            error?.message ??
            "Unable to update company details right now.",
        });
      }
      return;
    }

    if (data.password !== data.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password mismatch",
        text2: "Passwords do not match.",
      });
      return;
    }

    try {
      const response = await register({
        email: data.email,
        password: data.password,
        name: data.companyName,
        role: "EMPLOYER",
        address: {
          type: "Point",
          coordinates: selectedAddress.coordinates,
        },
      }).unwrap();

      Toast.show({
        type: "success",
        text1: "Registration successful",
        text2: response.message ?? "Your employer account has been created.",
      });

      onContinue?.({
        email: data.email,
        name: data.companyName,
      });
    } catch (error: any) {
      console.error("Employer registration failed:", error);
      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2:
          error?.data?.message ??
          error?.message ??
          "Unable to complete registration right now.",
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
      <View className="bg-[#FF5500] pb-10 px-6">
        <View className="mb-4 justify-center items-center">
          <LogoWhite />
        </View>
        <Text className="text-white text-3xl font-bold tracking-tight">
          {isSso ? "Complete Employer Profile" : "Create Employer Account"}
        </Text>
        <Text className="text-white/85 text-sm mt-1.5 font-medium">
          {isSso
            ? "Add your company name and business location to get started."
            : "Register your company and confirm your business location."}
        </Text>
      </View>

      <View className="px-6 pt-6 pb-20 gap-1">
        <StandardInputField
          label="Company Name"
          id="companyName"
          control={control}
          required={true}
          placeholder="Enter company name"
        />

        <StandardInputField
          label="Email Address"
          id="email"
          type="email"
          control={control}
          required={true}
          readOnly={isSso}
          placeholder="Enter your email"
        />

        {!isSso && (
          <>
            <StandardInputField
              label="Password"
              id="password"
              type="password"
              control={control}
              required={true}
              rules={{
                validate: (value: string) => {
                  const result = passwordSchema.safeParse(value);
                  return result.success || result.error.errors[0]?.message;
                },
              }}
              placeholder="Enter your password"
            />

            <StandardInputField
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              control={control}
              required={true}
              placeholder="Confirm your password"
            />
          </>
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
              style={{
                elevation: 12,
                zIndex: 50,
              }}
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

        <View className="my-6">
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading || isUpdatingProfile || isSelectingAddress}
            activeOpacity={0.9}
            className="w-full bg-[#1B2530] py-4 rounded-xl items-center justify-center shadow-sm"
          >
            <Text className="text-white text-base font-semibold">
              {isSso
                ? isUpdatingProfile
                  ? "Saving Details..."
                  : "Save & Continue"
                : isLoading
                  ? "Creating Account..."
                  : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>

        {!isSso && (
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
        )}
      </View>
    </ScrollView>
  );
}
