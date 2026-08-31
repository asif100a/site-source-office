import React, { useEffect, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useForm } from "react-hook-form";
import { ChevronDown } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import StandardFileUploadBox, {
  UploadedFile,
} from "@/components/standard_ui/form_fields/StandardFileUploadBox";
import ScreenLoader from "@/components/ui/screen-loader";
import {
  Avatar,
  FileChip,
  ScreenShell,
} from "./_components";
import { useLocalSearchParams, useRouter } from "expo-router";
import { normalizeUserRole, type UserRole } from "@/constants/Routes";
import { safeGetWebStorageItem } from "@/constants/webStorage";
import Toast from "react-native-toast-message";
import {
  useGetWorkerProfileQuery as useGetWorkerAccountProfileQuery,
  useUpdateWorkerProfileMutation,
} from "@/store/api/workerProfileApi";
import {
  useGetWorkerProfileQuery as useGetEmployerAccountProfileQuery,
  useUpdateWorkerProfileMutation as useUpdateEmployerProfileMutation,
} from "@/store/api/employerProfileApi";
import { buildProfileEditFormData } from "@/utils/profileEditFormData";
import { TRADES } from "@/assets/data";

const WEB_ROLE_STORAGE_KEY = "site-source.active-role";

type EditProfileFormValues = {
  fullName: string;
  email: string;
  trade: string;
};

const getAccountData = (response: any) => response?.data ?? response;

const getProfileName = (response: any) =>
  getAccountData(response)?.profile?.name ??
  getAccountData(response)?.workerProfile?.name ??
  "";

const getProfileEmail = (response: any) =>
  getAccountData(response)?.email ??
  response?.email ??
  "";

const getProfileImage = (response: any) =>
  getAccountData(response)?.profile?.image ??
  getAccountData(response)?.workerProfile?.image ??
  null;

const getProfileCertificates = (response: any) => {
  const certificates = getAccountData(response)?.workerProfile?.certificates;
  return Array.isArray(certificates) ? certificates : [];
};

const getProfileTrades = (response: any) => {
  const trades = getAccountData(response)?.workerProfile?.trades;
  return Array.isArray(trades) ? trades : [];
};

function getOptionLabel(
  options: { label: string; value: string }[],
  value: string,
) {
  return options.find((option) => option.value === value)?.label || "";
}

export default function EditProfileScreenWeb() {
  const router = useRouter();
  const params = useLocalSearchParams<{ origin?: string | string[] }>();
  const [userRole, setUserRole] = useState<UserRole>("worker");
  const [openField, setOpenField] = useState<"trade" | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<UploadedFile | null>(
    null,
  );
  const [certificate, setCertificate] = useState<UploadedFile | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isWorker = userRole === "worker";

  const { control, handleSubmit, reset, setValue, watch } =
    useForm<EditProfileFormValues>({
      defaultValues: {
        fullName: "",
        email: "",
        trade: "",
      },
    });
  const {
    data: workerProfile,
    isFetching: isFetchingWorkerProfile,
    refetch: refetchWorkerProfile,
  } = useGetWorkerAccountProfileQuery(undefined, {
    skip: !isWorker,
  });
  const {
    data: employerProfile,
    isFetching: isFetchingEmployerProfile,
    refetch: refetchEmployerProfile,
  } = useGetEmployerAccountProfileQuery(undefined, {
    skip: isWorker,
  });
  const [updateWorkerProfile, { isLoading: isUpdatingWorkerProfile }] =
    useUpdateWorkerProfileMutation();
  const [updateEmployerProfile, { isLoading: isUpdatingEmployerProfile }] =
    useUpdateEmployerProfileMutation();
  const activeProfile = isWorker ? workerProfile : employerProfile;
  const currentName = watch("fullName");
  const currentEmail = watch("email");
  const selectedTrade = watch("trade");
  const existingCertificates = useMemo(
    () => getProfileCertificates(activeProfile),
    [activeProfile],
  );
  const existingTrades = useMemo(() => getProfileTrades(activeProfile), [activeProfile]);
  const existingProfileImage = useMemo(
    () => getProfileImage(activeProfile),
    [activeProfile],
  );
  const displayedCertificates = useMemo(
    () =>
      certificate?.name && !existingCertificates.includes(certificate.name)
        ? [...existingCertificates, certificate.name]
        : existingCertificates,
    [certificate, existingCertificates],
  );
  const avatarUri = profileImageFile?.uri ?? existingProfileImage ?? null;
  const isSaving = isWorker ? isUpdatingWorkerProfile : isUpdatingEmployerProfile;
  const isLoadingProfile = isWorker
    ? isFetchingWorkerProfile
    : isFetchingEmployerProfile;
  const showInitialLoader = isLoadingProfile && !activeProfile;

  useEffect(() => {
    const origin = Array.isArray(params.origin) ? params.origin[0] : params.origin;
    setUserRole(
      normalizeUserRole(
        origin ?? safeGetWebStorageItem(WEB_ROLE_STORAGE_KEY) ?? undefined,
      ),
    );
  }, [params.origin]);

  useEffect(() => {
    reset({
      fullName: getProfileName(activeProfile),
      email: getProfileEmail(activeProfile),
      trade: existingTrades[0] ?? "",
    });
  }, [activeProfile, existingTrades, reset]);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      await (isWorker ? refetchWorkerProfile() : refetchEmployerProfile());
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderTradeDropdown = () => {
    const isOpen = openField === "trade";
    const displayValue = getOptionLabel(TRADES, selectedTrade);

    return (
      <View className="mb-1">
        <Text className="mb-2 text-xs font-semibold text-neutral-500">
          Trade / Skill
        </Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setOpenField(isOpen ? null : "trade")}
          className="flex-row h-14 items-center justify-between rounded-xl border border-neutral-200 bg-white px-4"
        >
          <Text
            className={`text-sm font-semibold ${
              displayValue ? "text-neutral-900" : "text-neutral-400"
            }`}
          >
            {displayValue || "Select trade / skill"}
          </Text>
          <ChevronDown size={17} color="#171717" />
        </TouchableOpacity>

        {isOpen ? (
          <View className="mt-2 overflow-hidden rounded-xl border border-neutral-200 bg-white">
            {TRADES.map((option) => {
              const selected = selectedTrade === option.value;

              return (
                <TouchableOpacity
                  key={option.value}
                  activeOpacity={0.8}
                  onPress={() => {
                    setValue("trade", option.value, {
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

  const handleSave = async (data: EditProfileFormValues) => {
    const payload = {
      ...(data.fullName.trim() ? { name: data.fullName.trim() } : {}),
      ...(isWorker
        ? {
            trades: data.trade ? [data.trade] : [],
          }
        : {}),
    };

    try {
      const formData = await buildProfileEditFormData({
        payload,
        image: profileImageFile,
        certificates: certificate ? [certificate] : [],
      });

      await (isWorker
        ? updateWorkerProfile(formData).unwrap()
        : updateEmployerProfile(formData).unwrap());

      Toast.show({
        type: "success",
        text1: "Profile updated",
        text2: "Your profile changes have been saved.",
      });
      setCertificate(null);
      router.back();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Unable to update profile",
        text2:
          error?.data?.message ??
          error?.message ??
          "Please try again in a moment.",
      });
    }
  };

  return (
    <ScreenShell
      title="Profile"
      footer={
        <View className="border-t border-neutral-200 bg-neutral-50 px-6 pb-6 pt-4 md:px-10 xl:px-12">
          <View className="mx-auto w-full max-w-7xl">
            <TouchableOpacity
              onPress={handleSubmit(handleSave)}
              disabled={isSaving || showInitialLoader}
              style={{ backgroundColor: Colors.common.GRAY_DARK }}
              className="h-14 items-center justify-center rounded-xl active:opacity-90"
            >
              <Text className="text-sm font-extrabold text-white">
                {isSaving ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    >
      {showInitialLoader ? (
        <ScreenLoader message="Loading profile..." />
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#FF5500"
              colors={["#FF5500"]}
            />
          }
        >
          <View className="px-6 pt-6 md:px-10 xl:px-12 md:pt-8">
            <View className="mx-auto w-full max-w-7xl">
              <View className="rounded-[28px] border border-neutral-200 bg-white p-6 md:p-8">
                <View className="flex-col gap-6 lg:flex-row lg:items-start">
                  <View className="flex-[1.15] gap-6">
                    <View className="flex-row items-center justify-between gap-4">
                      <View className="flex-row items-center gap-3">
                        <Avatar
                          uri={avatarUri}
                          size={52}
                          fallbackLabel={currentName}
                        />
                        <View>
                          <Text className="text-base font-bold text-neutral-950">
                            {currentName || "Profile"}
                          </Text>
                          <Text className="text-sm text-neutral-500">
                            {currentEmail || "No email available"}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View className="rounded-2xl bg-neutral-50 p-4">
                      <Text className="text-sm font-semibold text-neutral-900">
                        Update your public profile
                      </Text>
                      <Text className="mt-1 text-sm leading-6 text-neutral-600">
                        Keep your name, contact details, and profile image
                        current so your profile stays accurate.
                      </Text>
                    </View>
                  </View>

                  <View className="hidden h-px w-full bg-neutral-200 lg:block lg:h-auto lg:w-px" />

                  <View className="flex-[2] border border-neutral-300 rounded-2xl p-6">
                    <View className="gap-5">
                      <StandardInputField<EditProfileFormValues>
                        label="Full Name"
                        id="fullName"
                        control={control}
                        placeholder="Enter Your Full Name"
                        textInputProps={{
                          className: "text-sm font-semibold text-neutral-900",
                        }}
                      />

                      <StandardInputField<EditProfileFormValues>
                        label="Email Address"
                        id="email"
                        type="email"
                        control={control}
                        placeholder="Enter Your Email"
                        textInputProps={{
                          className: "text-sm font-semibold text-neutral-900",
                        }}
                        readOnly
                      />

                      <StandardFileUploadBox
                        label="Profile Image"
                        file={profileImageFile}
                        setFile={setProfileImageFile}
                        mode="image"
                        title="Upload Profile Image"
                        description="JPG or PNG (max 10MB)"
                        optional
                      />

                      {isWorker ? (
                        <>
                          {renderTradeDropdown()}

                          <StandardFileUploadBox
                            label="Upload Certificate"
                            file={certificate}
                            setFile={setCertificate}
                            mode="pdf"
                            title="Upload Certificate"
                            description="PDF files (max 10MB)"
                            optional
                          />

                          <View className="gap-2">
                            <Text className="text-xs font-semibold text-neutral-500">
                              Uploaded files
                            </Text>
                            <ScrollView
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              contentContainerStyle={{
                                gap: 10,
                                paddingRight: 20,
                              }}
                            >
                              {displayedCertificates.map((item) => (
                                <FileChip key={item} label={item} />
                              ))}
                            </ScrollView>
                          </View>
                        </>
                      ) : null}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </ScreenShell>
  );
}
