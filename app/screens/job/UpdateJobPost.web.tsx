import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, ChevronDown, Minus, Plus, X } from "lucide-react-native";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import StandardTextAreaField from "@/components/standard_ui/form_fields/StandardTextAreaField";
import { Colors } from "@/constants/Colors";
import ScreenLoader from "@/components/ui/screen-loader";
import { useGetSingleJobQuery, useUpdateJobMutation } from "@/store/api/jobApi";
import { getAddressFromCoordinates } from "@/utils/googlePlaces";
import Toast from "react-native-toast-message";

type JobFormValues = {
  jobTitle: string;
  hourlyRate: string;
  tradeSkill: string;
  address: string;
  workBrief: string;
  note: string;
};

type TradeOption = {
  label: string;
  value: string;
};

const TRADE_OPTIONS: TradeOption[] = [
  { label: "Groundworker", value: "groundworker" },
  { label: "Labourer", value: "labourer" },
  { label: "Carpenter", value: "carpenter" },
  { label: "Electrician", value: "electrician" },
];

const RADIUS_OPTIONS = [
  { label: "1-10 Km", value: "1-10" },
  { label: "11-20 Km", value: "11-20" },
  { label: "21-50 Km", value: "21-50" },
];

function WebSelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: TradeOption[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? placeholder;

  return (
    <View className="mb-5">
      <Text className="mb-2 text-sm font-semibold text-[#333]">{label}</Text>
      <View>
        <TouchableOpacity
          onPress={() => setOpen((current) => !current)}
          activeOpacity={0.85}
          className="h-[52px] flex-row items-center justify-between rounded-xl border border-[#e8e8e8] bg-white px-4"
        >
          <Text className="text-sm text-[#222]">{selectedLabel}</Text>
          <ChevronDown size={18} color="#999999" />
        </TouchableOpacity>

        {open ? (
          <View className="mt-2 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl">
            {options.map((option) => {
              const selected = option.value === value;

              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  activeOpacity={0.85}
                  className={`px-4 py-3 ${
                    selected ? "bg-orange-50" : "bg-white"
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      selected
                        ? "font-bold text-orange-700"
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
    </View>
  );
}

function WebDateField({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View className="mb-5">
      <Text className="mb-2 text-sm font-semibold text-[#333]">{label}</Text>
      <View className="rounded-xl border border-[#e8e8e8] bg-transparent px-4">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="dd/mm/yyyy"
          placeholderTextColor="#bbb"
          className="h-[52px] text-sm text-[#222]"
        />
      </View>
    </View>
  );
}

function WorkersRequiredWebModal({
  open,
  closeModal,
  selectedTrades,
  tradeWorkers,
  setTradeWorkers,
  publishWorkers,
}: {
  open: boolean;
  closeModal: () => void;
  selectedTrades: string[];
  tradeWorkers: Record<string, number>;
  setTradeWorkers: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  publishWorkers: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={closeModal}
    >
      <View
        className="flex-1 items-center justify-center px-5 py-8"
        style={{ backgroundColor: "rgba(17, 24, 39, 0.45)" }}
      >
        <Pressable className="absolute inset-0" onPress={closeModal} />

        <View className="w-full max-w-2xl rounded-[28px] border border-neutral-200/80 bg-white p-6 shadow-2xl md:p-8">
          <View className="flex-row items-center justify-between gap-4">
            <View>
              <Text className="text-xs font-bold uppercase tracking-[1px] text-neutral-500">
                Workers required
              </Text>
              <Text className="mt-1 text-2xl font-bold tracking-tight text-neutral-950">
                Set trade and worker count
              </Text>
            </View>

            <TouchableOpacity
              onPress={closeModal}
              activeOpacity={0.85}
              className="h-10 w-10 items-center justify-center rounded-full bg-neutral-100"
            >
              <X size={18} color="#111827" />
            </TouchableOpacity>
          </View>

          <View className="mt-6 gap-4">
            {selectedTrades.map((trade) => (
              <View key={trade}>
                <Text className="mb-2 text-sm font-semibold text-[#333]">
                  {TRADE_OPTIONS.find((item) => item.value === trade)?.label ?? trade}
                </Text>
                <View className="h-[52px] flex-row items-center justify-between rounded-xl border border-[#e8e8e8] px-4">
                  <Text className="text-sm text-[#222]">{tradeWorkers[trade] ?? 1}</Text>
                  <View className="flex-row items-center gap-3">
                    <TouchableOpacity onPress={() => setTradeWorkers((current) => ({ ...current, [trade]: Math.max(1, (current[trade] ?? 1) - 1) }))} className="h-8 w-8 items-center justify-center rounded-full bg-neutral-100"><Minus size={16} color="#111827" /></TouchableOpacity>
                    <TouchableOpacity onPress={() => setTradeWorkers((current) => ({ ...current, [trade]: (current[trade] ?? 1) + 1 }))} className="h-8 w-8 items-center justify-center rounded-full bg-neutral-900"><Plus size={16} color="#FFFFFF" /></TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View className="mt-8 flex-row justify-end gap-3">
            <TouchableOpacity
              onPress={closeModal}
              activeOpacity={0.88}
              className="rounded-2xl border border-neutral-200 bg-white px-4 py-3"
            >
              <Text className="text-sm font-bold text-neutral-700">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={publishWorkers}
              activeOpacity={0.9}
              style={{ backgroundColor: Colors.common.GRAY_DARK }}
              className="rounded-2xl px-5 py-3"
            >
              <Text className="text-sm font-bold text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function UpdateJobPostWeb() {
  const router = useRouter();
  const { id, mode } = useLocalSearchParams<{ id?: string; mode?: string }>();
  const jobId = Array.isArray(id) ? id[0] : id;
  const isEditing = mode === "edit" && Boolean(jobId);
  const { control, handleSubmit, reset, setValue } = useForm<JobFormValues>({
    defaultValues: {
      jobTitle: "",
      hourlyRate: "",
      tradeSkill: "groundworker",
      address: "",
      workBrief: "",
      note: "",
    },
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [showWorkersModal, setShowWorkersModal] = useState(false);
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
  const [tradeWorkers, setTradeWorkers] = useState<Record<string, number>>({});
  const [workersNeeded, setWorkersNeeded] = useState(3);
  const jobQuery = useGetSingleJobQuery(jobId ?? "", { skip: !isEditing });
  const currentJob = jobQuery.data?.data?.data ?? jobQuery.data?.data;
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();

  useEffect(() => {
    const job = currentJob;
    if (!job) return;
    reset({
      jobTitle: job.title ?? "",
      hourlyRate: job.hourlyRate != null ? String(job.hourlyRate) : "",
      tradeSkill: job.trades?.[0] ?? "groundworker",
      address: job.location?.address ?? job.address ?? "",
      workBrief: job.note ?? job.workBrief ?? "",
      note: job.note ?? "",
    });
    const workerEntries = Array.isArray(job.workersNeeded) ? job.workersNeeded : [];
    setWorkersNeeded(workerEntries.reduce((sum: number, item: any) => sum + Number(item.howMany ?? 0), 0) || Number(job.workersNeeded ?? 3));
    const jobTrades = Array.isArray(job.trades) && job.trades.length
      ? job.trades
      : workerEntries.map((item: any) => item.trade).filter(Boolean);
    setSelectedTrades(jobTrades);
    setTradeWorkers(Object.fromEntries(workerEntries.length ? workerEntries.map((item: any) => [item.trade, Number(item.howMany ?? 1)]) : jobTrades.map((trade: string) => [trade, Number(job.workersNeeded ?? 1)])));
    setStartDate(
      job.startDate ? new Date(job.startDate).toISOString().slice(0, 10) : "",
    );
    setEndDate(
      job.endDate ? new Date(job.endDate).toISOString().slice(0, 10) : "",
    );
    const coordinates = job.location?.coordinates;
    if (Array.isArray(coordinates) && coordinates.length === 2) {
      void getAddressFromCoordinates([
        Number(coordinates[0]),
        Number(coordinates[1]),
      ])
        .then((address) => setValue("address", address))
        .catch(() => setValue("address", "Saved location"));
    }
  }, [currentJob, reset, setValue]);

  const submitJob = handleSubmit(async (values) => {
    try {
      if (isEditing && jobId) {
        await updateJob({
          id: jobId,
          body: {
            title: values.jobTitle.trim(),
            hourlyRate: Number(values.hourlyRate),
            workersNeeded: selectedTrades.map((trade) => ({ trade, howMany: tradeWorkers[trade] ?? 1 })),
            trades: selectedTrades,
          location: currentJob?.location ? { ...currentJob.location, address: values.address.trim() } : undefined,
            endDate: endDate ? new Date(endDate).toISOString() : undefined,
            workingHours: currentJob?.workingHours ?? [],
            mustHave: currentJob?.mustHave ?? [],
            note: values.note.trim(),
            ...(startDate
              ? { startDate: new Date(startDate).toISOString() }
              : {}),
          },
        }).unwrap();
      }
      Toast.show({
        type: "success",
        text1: "Job updated successfully",
        text2: "Your job post has been updated successfully.",
      });
      router.replace("/tabs/(employer-tabs)/my-jobs");
    } catch (error) {
      console.error("Error updating job post:", error);
    }
  });

  const closeWorkersModal = () => setShowWorkersModal(false);

  const publishWorkers = () => {
    closeWorkersModal();
  };

  const onBackPress = () => {
    router.back();
  };

  if (jobQuery?.isLoading) {
    return (
      <ScreenWrapper>
        <ScreenLoader />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 112 }}
      >
        <View className="px-5 py-6 md:px-8 md:py-8 xl:px-12">
          <View className="mx-auto w-full max-w-7xl gap-6">
            <View className="overflow-hidden rounded-[30px] border border-neutral-200/80 bg-white shadow-sm">
              <View className="relative px-5 py-6 md:px-8 md:py-8">
                <View
                  className="absolute -top-14 right-0 h-36 w-36 rounded-full opacity-80"
                  style={{ backgroundColor: Colors.common.BRAND_LIGHT }}
                />
                <View className="absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-neutral-100" />

                <View className="relative flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <View className="max-w-3xl gap-3">
                    <View className="rounded-full bg-orange-50 px-3 py-1.5 self-start">
                      <Text className="text-xs font-bold uppercase text-neutral-900">
                        {isEditing ? "Update job" : "Create job"}
                      </Text>
                    </View>

                    <View className="gap-2">
                      <Text className="max-w-3xl text-2xl font-bold tracking-tight text-neutral-950 md:text-[32px]">
                        Create and manage a new job with a clear flow.
                      </Text>
                      <Text className="max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
                        Add the role, location, schedule, worker count, and work
                        brief in one organized flow built for employer web use.
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={onBackPress}
                    activeOpacity={0.88}
                    className="flex-row items-center gap-2 self-start rounded-2xl border border-neutral-200 bg-white px-5 py-3.5 lg:self-auto"
                  >
                    <ArrowLeft size={18} color="#111827" />
                    <Text className="text-sm font-bold text-neutral-900">
                      Back
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="rounded-[28px] border border-neutral-200/80 bg-white p-5 shadow-sm md:p-6 max-w-4xl w-full mx-auto">
              <View className="mx-auto w-full max-w-4xl">
                <StandardInputField
                  label="Job Title"
                  id="jobTitle"
                  control={control}
                  placeholder="Enter Job Title"
                  required
                  textInputProps={{ className: "text-[#222]" }}
                />

                <StandardInputField
                  label="Hourly Rate"
                  id="hourlyRate"
                  control={control}
                  placeholder="35"
                  required={false}
                  textInputProps={{
                    className: "text-[#222]",
                    keyboardType: "numeric",
                  }}
                />

                <Controller
                  control={control}
                  name="tradeSkill"
                  render={({ field: { onChange, value } }) => (
                    <View className="mb-5">
                      <Text className="mb-2 text-sm font-semibold text-[#333]">Trade / Skill</Text>
                      <View className="flex-row flex-wrap gap-2">
                        {TRADE_OPTIONS.map((trade) => {
                          const selected = selectedTrades.includes(trade.value);
                          return <TouchableOpacity key={trade.value} onPress={() => setSelectedTrades((current) => selected ? current.filter((item) => item !== trade.value) : [...current, trade.value])} className={`rounded-full px-3 py-2 ${selected ? "bg-orange-100" : "bg-neutral-100"}`}><Text className={`text-xs font-bold ${selected ? "text-orange-700" : "text-neutral-600"}`}>{trade.label}</Text></TouchableOpacity>;
                        })}
                      </View>
                    </View>
                  )}
                />

                <StandardInputField
                  label="Address"
                  id="address"
                  control={control}
                  placeholder="2972 Westheimer Rd. Santa A..."
                  required
                  textInputProps={{ className: "text-[#222]" }}
                />

                <Pressable onPress={() => setShowWorkersModal(true)}>
                  <View className="mb-5">
                    <Text className="mb-2 text-sm font-semibold text-[#333]">
                      Workers Needed
                    </Text>
                    <View className="h-[52px] flex-row items-center justify-between rounded-xl border border-[#e8e8e8] bg-transparent px-4">
                      <Text className="text-sm text-[#222]">
                      </Text>
                      <ChevronDown size={18} color="#999999" />
                    </View>
                  </View>
                </Pressable>

                <View className="grid gap-4 lg:grid-cols-3">
                  <WebDateField
                    label="Start Date"
                    value={startDate}
                    onChangeText={setStartDate}
                  />
                  <WebDateField
                    label="End Date"
                    value={endDate}
                    onChangeText={setEndDate}
                  />
                </View>

                <StandardTextAreaField
                  label="Work Brief"
                  id="workBrief"
                  control={control}
                  placeholder="Write here..."
                  numberOfLines={8}
                  required
                />

                <StandardTextAreaField
                  label="Notes"
                  id="note"
                  control={control}
                  placeholder="Add notes for workers..."
                  numberOfLines={6}
                  required={false}
                />
              </View>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => router.back()}
                  activeOpacity={0.88}
                  className="flex-1 items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3.5"
                >
                  <Text className="text-sm font-bold text-neutral-900">
                    Discard
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={submitJob}
                  activeOpacity={0.9}
                  style={{ backgroundColor: Colors.common.GRAY_DARK }}
                  className="flex-1 items-center justify-center rounded-2xl px-5 py-3.5"
                >
                  <Text className="text-sm font-bold text-white">
                    {isUpdating
                      ? "Saving..."
                      : isEditing
                        ? "Save Changes"
                        : "Publish Job"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <WorkersRequiredWebModal
        open={showWorkersModal}
        closeModal={closeWorkersModal}
        selectedTrades={selectedTrades}
        tradeWorkers={tradeWorkers}
        setTradeWorkers={setTradeWorkers}
        publishWorkers={publishWorkers}
      />
    </ScreenWrapper>
  );
}
