import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useForm } from "react-hook-form";
import { Camera, ChevronDown, Image as ImageIcon, Trash2, X } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
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
import { buildProfileEditFormData } from "@/utils/profileEditFormData";
import { TRADES } from "@/assets/data";
import { useGetEmployerProfileQuery, useUpdateEmployerProfileMutation } from "@/store/api/employerProfileApi";

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
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<UploadedFile | null>(
    null,
  );
  const [certificate, setCertificate] = useState<UploadedFile | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTakePhoto = async () => {
    setIsPhotoModalOpen(false);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Camera Permission Required",
          "Please allow camera access in your device settings to take a profile picture.",
          [{ text: "OK" }],
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });

      if (result.canceled || !result.assets || !result.assets[0]) return;

      const asset = result.assets[0];
      const uriParts = asset.uri.split(".");
      const extension = uriParts[uriParts.length - 1].toLowerCase();
      const mimeType = extension === "png" ? "image/png" : "image/jpeg";
      const fileName = asset.fileName ?? `profile_${Date.now()}.${extension}`;

      setProfileImageFile({
        uri: asset.uri,
        name: fileName,
        type: mimeType,
        size: asset.fileSize ?? undefined,
      });

      Toast.show({
        type: "success",
        text1: "Profile photo set",
        text2: "Your headshot has been framed and is ready to save.",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unable to open camera. Please try again.",
      });
    }
  };

  const handlePickFromLibrary = async () => {
    setIsPhotoModalOpen(false);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Photo Library Permission Required",
          "Please allow access to your photo library in device settings to choose a profile picture.",
          [{ text: "OK" }],
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
        allowsMultipleSelection: false,
      });

      if (result.canceled || !result.assets || !result.assets[0]) return;

      const asset = result.assets[0];
      const uriParts = asset.uri.split(".");
      const extension = uriParts[uriParts.length - 1].toLowerCase();
      const mimeType = extension === "png" ? "image/png" : "image/jpeg";
      const fileName = asset.fileName ?? `profile_${Date.now()}.${extension}`;

      setProfileImageFile({
        uri: asset.uri,
        name: fileName,
        type: mimeType,
        size: asset.fileSize ?? undefined,
      });

      Toast.show({
        type: "success",
        text1: "Profile photo set",
        text2: "Your headshot has been framed and is ready to save.",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unable to select photo. Please try again.",
      });
    }
  };

  const handleRemovePhoto = () => {
    setIsPhotoModalOpen(false);
    setProfileImageFile(null);
  };
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
  } = useGetEmployerProfileQuery(undefined, {
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
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setIsPhotoModalOpen(true)}
                className="relative"
              >
                <Avatar uri={avatarUri} size={54} fallbackLabel={currentName} />
                <View className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1E2933] items-center justify-center border-2 border-white shadow-sm">
                  <Camera size={12} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
              <View>
                <Text className="text-slate-900 text-base font-extrabold">
                  {currentName || "Profile"}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsPhotoModalOpen(true)}
                >
                  <Text className="text-[#FF5500] text-xs font-bold mt-0.5">
                    Change profile photo
                  </Text>
                </TouchableOpacity>
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
            description="Take a photo or choose from camera roll (max 10MB)"
            optional
            onCustomUpload={() => setIsPhotoModalOpen(true)}
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

      {/* Photo Picker Options Modal */}
      <Modal
        visible={isPhotoModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPhotoModalOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsPhotoModalOpen(false)}
          className="flex-1 bg-black/60 justify-end"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl p-6 pb-10 shadow-2xl"
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-lg font-extrabold text-neutral-950">
                Profile Photo
              </Text>
              <TouchableOpacity
                onPress={() => setIsPhotoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 items-center justify-center active:opacity-75"
              >
                <X size={16} color="#333333" />
              </TouchableOpacity>
            </View>
            <Text className="text-xs text-neutral-500 font-medium mb-5">
              Take a picture now or select from your camera roll. Drag to frame your headshot.
            </Text>

            <View className="gap-3">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleTakePhoto}
                className="flex-row items-center gap-3.5 p-4 rounded-2xl border border-neutral-200 bg-neutral-50 active:bg-neutral-100"
              >
                <View className="w-11 h-11 rounded-full bg-[#FFF5F2] items-center justify-center">
                  <Camera size={20} color="#FF5500" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-neutral-900">
                    Take a Picture Now
                  </Text>
                  <Text className="text-xs text-neutral-500 mt-0.5">
                    Open your camera and snap a new headshot
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handlePickFromLibrary}
                className="flex-row items-center gap-3.5 p-4 rounded-2xl border border-neutral-200 bg-neutral-50 active:bg-neutral-100"
              >
                <View className="w-11 h-11 rounded-full bg-blue-50 items-center justify-center">
                  <ImageIcon size={20} color="#2563EB" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-neutral-900">
                    Choose from Camera Roll
                  </Text>
                  <Text className="text-xs text-neutral-500 mt-0.5">
                    Select a photo and drag to fit your profile headshot
                  </Text>
                </View>
              </TouchableOpacity>

              {profileImageFile ? (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleRemovePhoto}
                  className="flex-row items-center gap-3.5 p-4 rounded-2xl border border-red-100 bg-red-50/50 active:bg-red-50"
                >
                  <View className="w-11 h-11 rounded-full bg-red-100 items-center justify-center">
                    <Trash2 size={20} color="#EF4444" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-red-600">
                      Remove Selected Photo
                    </Text>
                    <Text className="text-xs text-neutral-500 mt-0.5">
                      Clear current photo selection
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ScreenShell>
  );
}
