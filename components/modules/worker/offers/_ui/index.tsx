import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { WorkerJobItem } from "../VerticalJobListings";
import { formatPayRate } from "@/utils";

export function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View className="gap-3">
      <Text className="text-xs font-bold uppercase tracking-[1px] text-neutral-500">
        {label}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => onChange(option)}
            activeOpacity={0.85}
            className={`rounded-full px-4 py-2 ${
              value === option ? "bg-neutral-950" : "bg-neutral-100"
            }`}
          >
            <Text
              className={`text-sm font-bold ${
                value === option ? "text-white" : "text-neutral-700"
              }`}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export function DesktopJobDetailsModal({
  job,
  visible,
  onClose,
  onPrimaryAction,
}: {
  job: WorkerJobItem | null;
  visible: boolean;
  onClose: () => void;
  onPrimaryAction: () => void;
}) {
  if (!job) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        className="flex-1 items-center justify-center px-5 py-8"
        style={{ backgroundColor: "rgba(17, 24, 39, 0.45)" }}
      >
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="w-full max-w-4xl overflow-hidden rounded-[28px] border border-neutral-200/80 bg-white shadow-2xl">
          <View className="flex-row items-start justify-between border-b border-neutral-200/80 px-6 py-5 md:px-8">
            <View className="flex-1 pr-4">
              <View className="mb-3 flex-row flex-wrap items-center gap-2">
                <View className="rounded-full bg-orange-50 px-3 py-1.5">
                  <Text className="text-xs font-bold text-neutral-900">
                    {job.tag}
                  </Text>
                </View>
                <Text className="text-xs font-medium text-neutral-400">
                  {job.time}
                </Text>
              </View>
              <Text className="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
                {job.title}
              </Text>
              <Text className="mt-2 text-sm font-bold text-neutral-500">
                {job.company}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.85}
              className="rounded-full bg-neutral-100 px-4 py-2"
            >
              <Text className="text-sm font-bold text-neutral-700">Close</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-col gap-6 px-6 py-6 md:flex-row md:px-8 md:py-8">
            <View className="flex-1 gap-4">
              <View className="rounded-[24px] bg-neutral-950 px-5 py-5">
                <Text className="text-xs font-bold uppercase tracking-[1px] text-white/60">
                  Rate
                </Text>
                <Text className="mt-2 text-3xl font-bold tracking-tight text-white">
                  {formatPayRate(job.payRate)}
                </Text>
              </View>

              <View className="rounded-[24px] border border-neutral-200/80 bg-neutral-50 p-5">
                <Text className="text-base font-bold text-neutral-950">
                  Job details
                </Text>
                <Text className="mt-3 text-sm leading-6 text-neutral-600">
                  This opportunity is a strong match for workers who can start
                  soon, collaborate well on-site, and stay reliable throughout
                  the listed shift period.
                </Text>
              </View>
            </View>

            <View className="flex-1 gap-4">
              <View className="rounded-[24px] border border-neutral-200/80 bg-white p-5">
                <Text className="text-xs font-bold uppercase tracking-[1px] text-neutral-500">
                  Location
                </Text>
                <Text className="mt-2 text-sm font-bold text-neutral-900">
                  {job.location}
                </Text>
              </View>

              <View className="rounded-[24px] border border-neutral-200/80 bg-white p-5">
                <Text className="text-xs font-bold uppercase tracking-[1px] text-neutral-500">
                  Team
                </Text>
                <Text className="mt-2 text-sm font-bold text-neutral-900">
                  {job.team}
                </Text>
              </View>

              <View className="rounded-[24px] border border-neutral-200/80 bg-white p-5">
                <Text className="text-xs font-bold uppercase tracking-[1px] text-neutral-500">
                  Duration
                </Text>
                <Text className="mt-2 text-sm font-bold text-neutral-900">
                  {job.duration}
                </Text>
              </View>

              <View className="flex-row gap-3 pt-2">
                <TouchableOpacity
                  onPress={onClose}
                  activeOpacity={0.85}
                  className="flex-1 items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-3.5"
                >
                  <Text className="text-sm font-bold text-neutral-900">
                    Keep browsing
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onPrimaryAction}
                  activeOpacity={0.9}
                  className="flex-1 items-center justify-center rounded-2xl bg-neutral-950 px-4 py-3.5"
                >
                  <Text className="text-sm font-bold text-white">Apply now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}