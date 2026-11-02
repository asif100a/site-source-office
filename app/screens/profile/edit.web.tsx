import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useForm } from "react-hook-form";
import { Camera, ChevronDown, Image as ImageIcon, Trash2, X } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import StandardFileUploadBox, {
  UploadedFile,
} from "@/components/standard_ui/form_fields/StandardFileUploadBox";
import ScreenLoader from "@/components/ui/screen-loader";
import HeadshotCropModalWeb from "@/components/modules/common/HeadshotCropModal.web";
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
import { buildProfileEditFormData } from "@/utils/profileEditFormData";
import { TRADES } from "@/assets/data";
import { useGetEmployerProfileQuery, useUpdateEmployerProfileMutation } from "@/store/api/employerProfileApi";

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
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [cropCandidateUri, setCropCandidateUri] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profileImageFile, setProfileImageFile] = useState<UploadedFile | null>(
    null,
  );
  const [certificate, setCertificate] = useState<UploadedFile | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isWorker = userRole === "worker";

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      Toast.show({
        type: "error",
        text1: "File too large",
        text2: "Please select an image under 10MB.",
      });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setCropCandidateUri(objectUrl);
    setIsCropModalOpen(true);
    e.target.value = "";
  };

  const handleTakePhotoNow = () => {
    setIsPhotoModalOpen(false);
    cameraInputRef.current?.click();
  };

  const handlePickFromLibrary = () => {
    setIsPhotoModalOpen(false);
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = () => {
    setIsPhotoModalOpen(false);
    setProfileImageFile(null);
  };

  const handleCropConfirmed = (croppedFile: UploadedFile) => {
    setProfileImageFile(croppedFile);
    Toast.show({
      type: "success",
      text1: "Profile photo set",
      text2: "Your headshot has been framed and is ready to save.",
    });
  };

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
  } = useGetEmployerProfileQuery(undefined, {
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
                      <View className="flex-row items-center gap-4">
                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={() => setIsPhotoModalOpen(true)}
                          className="relative cursor-pointer"
                        >
                          <Avatar
                            uri={avatarUri}
                            size={64}
                            fallbackLabel={currentName}
                          />
                          <View className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#1E2933] items-center justify-center border-2 border-white shadow-sm">
                            <Camera size={14} color="#FFFFFF" />
                          </View>
                        </TouchableOpacity>
                        <View>
                          <Text className="text-base font-bold text-neutral-950">
                            {currentName || "Profile"}
                          </Text>
                          <Text className="text-sm text-neutral-500 mb-1">
                            {currentEmail || "No email available"}
                          </Text>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => setIsPhotoModalOpen(true)}
                            className="cursor-pointer"
                          >
                            <Text className="text-[#FF5500] text-xs font-bold">
                              Change profile photo
                            </Text>
                          </TouchableOpacity>
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
                        description="Take a photo or choose from camera roll (max 10MB)"
                        optional
                        onCustomUpload={() => setIsPhotoModalOpen(true)}
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

      {/* Hidden file inputs for Web Camera & File selection */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        style={{ display: "none" }}
        onChange={handleFileSelected}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileSelected}
      />

      {/* Photo Picker Options Modal on Web */}
      <Modal
        visible={isPhotoModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPhotoModalOpen(false)}
      >
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setIsPhotoModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-extrabold text-neutral-950">
                Profile Photo
              </h3>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-neutral-500 font-medium mb-5">
              Take a picture now or select from your camera roll. Drag to frame your headshot.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleTakePhotoNow}
                className="flex items-center gap-3.5 p-4 rounded-2xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors text-left"
              >
                <div className="w-11 h-11 rounded-full bg-[#FFF5F2] flex items-center justify-center flex-shrink-0">
                  <Camera size={20} color="#FF5500" />
                </div>
                <div>
                  <div className="text-sm font-bold text-neutral-900">
                    Take a Picture Now
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    Open your camera and snap a new headshot
                  </div>
                </div>
              </button>

              <button
                onClick={handlePickFromLibrary}
                className="flex items-center gap-3.5 p-4 rounded-2xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors text-left"
              >
                <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <ImageIcon size={20} color="#2563EB" />
                </div>
                <div>
                  <div className="text-sm font-bold text-neutral-900">
                    Choose from Camera Roll / Files
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    Select a photo and drag to fit your profile headshot
                  </div>
                </div>
              </button>

              {profileImageFile ? (
                <button
                  onClick={handleRemovePhoto}
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-red-100 bg-red-50/50 hover:bg-red-50 transition-colors text-left"
                >
                  <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Trash2 size={20} color="#EF4444" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-red-600">
                      Remove Selected Photo
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      Clear current photo selection
                    </div>
                  </div>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </Modal>

      {/* Interactive Headshot Drag & Crop Modal on Web */}
      <HeadshotCropModalWeb
        visible={isCropModalOpen}
        imageUri={cropCandidateUri}
        onClose={() => setIsCropModalOpen(false)}
        onConfirm={handleCropConfirmed}
      />
    </ScreenShell>
  );
}
