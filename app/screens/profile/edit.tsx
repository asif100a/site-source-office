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
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import StandardFileUploadBox, {
  UploadedFile,
} from "@/components/standard_ui/form_fields/StandardFileUploadBox";
import ScreenLoader from "@/components/ui/screen-loader";
import { Avatar, FileChip, ScreenShell } from "./_components";
import { useLocalSearchParams, useRouter } from "expo-router";
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

type EditProfileFormValues = {
  fullName: string;
  email: string;
  trade: string;
};

const normalizeRole = (origin?: string | string[]) =>
  (Array.isArray(origin) ? origin[0] : origin) === "employer"
    ? "employer"
    : "worker";

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

export default function EditProfileScreen() {
  const router = useRouter();
  const [openField, setOpenField] = useState<"trade" | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<UploadedFile | null>(
    null,
  );
  const [certificate, setCertificate] = useState<UploadedFile | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { control, handleSubmit, reset, setValue, watch } =
    useForm<EditProfileFormValues>({
      defaultValues: {
        fullName: "",
        email: "",
        trade: "",
      },
    });

  const { origin } = useLocalSearchParams();
  const userRole = normalizeRole(origin);
  const isWorker = userRole === "worker";
  const {
    data: workerProfile,
    isFetching: isFetchingWorkerProfile,
    refetch: refetchWorkerProfile,
  } = useGetWorkerAccountProfileQuery(undefined, {
    skip: !isWorker,
  });
  console.log(" worker profile: ", workerProfile);
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
  const existingCertificates = useMemo(
    () => getProfileCertificates(activeProfile),
    [activeProfile],
  );
  const existingTrades = useMemo(() => getProfileTrades(activeProfile), [activeProfile]);
  const existingProfileImage = useMemo(
    () => getProfileImage(activeProfile),
    [activeProfile],
  );
  const currentName = watch("fullName");
  const currentEmail = watch("email");
  const selectedTrade = watch("trade");
  const avatarUri = profileImageFile?.uri ?? existingProfileImage ?? null;
  const isSaving = isWorker ? isUpdatingWorkerProfile : isUpdatingEmployerProfile;
  const isLoadingProfile = isWorker
    ? isFetchingWorkerProfile
    : isFetchingEmployerProfile;
  const showInitialLoader = isLoadingProfile && !activeProfile;

  useEffect(() => {
    reset({
      fullName: getProfileName(activeProfile),
      email: getProfileEmail(activeProfile),
      trade: existingTrades[0] ?? "",
    });
  }, [activeProfile, existingTrades, reset]);

  const displayedCertificates = useMemo(() => {
    const nextCertificates = [...existingCertificates];

    if (
      certificate?.name &&
      !nextCertificates.some((item) => item === certificate.name)
    ) {
      nextCertificates.push(certificate.name);
    }

    return nextCertificates;
  }, [certificate, existingCertificates]);

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
      <View className="mb-5">
        <Text className="mb-2 text-xs font-semibold text-neutral-500">
          Trade / Skill
        </Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setOpenField(isOpen ? null : "trade")}
          className="h-14 flex-row items-center justify-between rounded-xl border border-neutral-200 bg-white px-4"
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
        <View className="px-5 pb-16 pt-4 bg-neutral-50">
          <TouchableOpacity
            onPress={handleSubmit(handleSave)}
            disabled={isSaving || showInitialLoader}
            style={{ backgroundColor: "#1E2933" }}
            className="h-14 rounded-lg items-center justify-center"
          >
            <Text className="text-white font-extrabold text-sm">
              {isSaving ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      }
    >
      {showInitialLoader ? (
        <ScreenLoader />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#FF5500"
              colors={["#FF5500"]}
            />
          }
        >
          <View className="flex-row items-center justify-between mb-8">
            <View className="flex-row items-center gap-3">
              <Avatar uri={avatarUri} size={44} fallbackLabel={currentName} />
              <View>
                <Text className="text-slate-900 text-base font-extrabold">
                  {currentName || "Profile"}
                </Text>
                <Text className="text-neutral-500 text-sm">
                  {currentEmail || "No email available"}
                </Text>
              </View>
            </View>
          </View>

          <StandardInputField<EditProfileFormValues>
            label="Full Name"
            id="fullName"
            control={control}
            placeholder="Enter Your Full Name"
            textInputProps={{
              className: "text-neutral-900 text-sm font-semibold",
            }}
          />

          <StandardInputField<EditProfileFormValues>
            label="Email Address"
            id="email"
            type="email"
            control={control}
            placeholder="Enter Your Email"
            textInputProps={{
              className: "text-neutral-900 text-sm font-semibold",
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

          {isWorker && (
            <>
              {renderTradeDropdown()}

              <StandardFileUploadBox
                label="Upload Certificate"
                file={certificate}
                setFile={setCertificate}
                mode="both"
                title="Upload Certificate"
                description="PDF, PNG, JPG or other files (max 10MB)"
                optional
              />
            </>
          )}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingRight: 20 }}
          >
            {displayedCertificates.map((item) => (
              <FileChip key={item} label={item} />
            ))}
          </ScrollView>
        </ScrollView>
      )}
    </ScreenShell>
  );
}
