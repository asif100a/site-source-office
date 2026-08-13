import React, { useState } from "react";
import { useRouter } from "expo-router";
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

type JobFormValues = {
  jobTitle: string;
  tradeSkill: string;
  address: string;
  radius: string;
  workBrief: string;
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
  selectedTrade,
  setSelectedTrade,
  workersNeeded,
  setWorkersNeeded,
  publishWorkers,
}: {
  open: boolean;
  closeModal: () => void;
  selectedTrade: string;
  setSelectedTrade: React.Dispatch<React.SetStateAction<string>>;
  workersNeeded: number;
  setWorkersNeeded: React.Dispatch<React.SetStateAction<number>>;
  publishWorkers: () => void;
}) {
  if (!open) {
    return null;
  }

  const currentTradeLabel =
    TRADE_OPTIONS.find((item) => item.value === selectedTrade)?.label ??
    "Groundworker";

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

          <View className="mt-6 gap-5">
            <WebSelectField
              label="Trade / Skill"
              value={selectedTrade}
              onChange={setSelectedTrade}
              options={TRADE_OPTIONS}
              placeholder={currentTradeLabel}
            />

            <View>
              <Text className="mb-2 text-sm font-semibold text-[#333]">
                Number of workers
              </Text>
              <View className="h-[52px] flex-row items-center justify-between rounded-xl border border-[#e8e8e8] px-4">
                <Text className="text-sm text-[#222]">{workersNeeded}</Text>
                <View className="flex-row items-center gap-3">
                  <TouchableOpacity
                    onPress={() =>
                      setWorkersNeeded((value) => Math.max(1, value - 1))
                    }
                    className="h-8 w-8 items-center justify-center rounded-full bg-neutral-100"
                  >
                    <Minus size={16} color="#111827" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setWorkersNeeded((value) => value + 1)}
                    className="h-8 w-8 items-center justify-center rounded-full bg-neutral-900"
                  >
                    <Plus size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
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

export default function CreateJobPostWebScreen() {
  const router = useRouter();
  const { control, handleSubmit } = useForm<JobFormValues>({
    defaultValues: {
      jobTitle: "",
      tradeSkill: "groundworker",
      address: "",
      radius: "1-10",
      workBrief: "",
    },
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [showWorkersModal, setShowWorkersModal] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState("groundworker");
  const [workersNeeded, setWorkersNeeded] = useState(3);

  const submitJob = handleSubmit(() => {
    router.replace("/tabs/(employer-tabs)" as any);
  });

  const closeWorkersModal = () => setShowWorkersModal(false);

  const publishWorkers = () => {
    closeWorkersModal();
  };

  const onBackPress = () => {
    router.back();
  };

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
                        Create job
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

                <Controller
                  control={control}
                  name="tradeSkill"
                  render={({ field: { onChange, value } }) => (
                    <WebSelectField
                      label="Trade / Skill"
                      value={value}
                      onChange={onChange}
                      options={TRADE_OPTIONS}
                      placeholder="Select trade and number"
                    />
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

                <Controller
                  control={control}
                  name="radius"
                  render={({ field: { onChange, value } }) => (
                    <WebSelectField
                      label="Radius"
                      value={value}
                      onChange={onChange}
                      options={RADIUS_OPTIONS}
                      placeholder="1-10 Km"
                    />
                  )}
                />

                <Pressable onPress={() => setShowWorkersModal(true)}>
                  <View className="mb-5">
                    <Text className="mb-2 text-sm font-semibold text-[#333]">
                      Workers Needed
                    </Text>
                    <View className="h-[52px] flex-row items-center justify-between rounded-xl border border-[#e8e8e8] bg-transparent px-4">
                      <Text className="text-sm text-[#222]">
                        {workersNeeded}
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
                  <WebDateField
                    label="Application Deadline"
                    value={applicationDeadline}
                    onChangeText={setApplicationDeadline}
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
                    Publish Job
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
        selectedTrade={selectedTrade}
        setSelectedTrade={setSelectedTrade}
        workersNeeded={workersNeeded}
        setWorkersNeeded={setWorkersNeeded}
        publishWorkers={publishWorkers}
      />
    </ScreenWrapper>
  );
}
