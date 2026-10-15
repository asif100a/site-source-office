import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import type { Dispatch, SetStateAction } from "react";
import type { Control } from "react-hook-form";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import StandardSelectField from "@/components/standard_ui/form_fields/StandardSelectField";
import StandardDateInput from "@/components/standard_ui/form_fields/StandardDateInput";
import StandardTextAreaField from "@/components/standard_ui/form_fields/StandardTextAreaField";
import { ChevronDown } from "lucide-react-native";
import { TRADES } from "@/assets/data";

export type JobFormValues = {
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

type CreateJobFormProps = {
  control: Control<JobFormValues>;
  setShowWorkersModal: Dispatch<SetStateAction<boolean>>;
  tradeOptions: TradeOption[];
  workersNeeded?: number;
  startDate: Date | null;
  setStartDate: Dispatch<SetStateAction<Date | null>>;
  endDate: Date | null;
  setEndDate: Dispatch<SetStateAction<Date | null>>;
  applicationDeadline: Date | null;
  setApplicationDeadline: Dispatch<SetStateAction<Date | null>>;
  selectedTrades: string[];
  setSelectedTrades: Dispatch<SetStateAction<string[]>>;
};

const RADIUS_OPTIONS = [
  { label: "1-10 Km", value: "1-10" },
  { label: "11-20 Km", value: "11-20" },
  { label: "21-50 Km", value: "21-50" },
];

export default function UpdateJobForm({
  control,
  setShowWorkersModal,
  tradeOptions,
  workersNeeded,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  applicationDeadline,
  setApplicationDeadline,
  selectedTrades,
  setSelectedTrades,
}: CreateJobFormProps) {
  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 130,
      }}
    >
      <StandardInputField
        label="Job Title"
        id="jobTitle"
        control={control}
        placeholder="Enter Job Title"
        required={true}
        textInputProps={{ className: "text-[#222]" }}
      />

      <StandardInputField
        label="Hourly Rate"
        id="hourlyRate"
        control={control}
        placeholder="35"
        required={false}
        textInputProps={{ className: "text-[#222]", keyboardType: "numeric" }}
      />

      <View className="mb-5">
        <Text className="mb-2 text-[#333] text-sm font-semibold">Trade / Skill</Text>
        <View className="flex-row flex-wrap gap-2">
          {TRADES.map((trade) => {
            const selected = selectedTrades.includes(trade.value);
            return <Pressable key={trade.value} onPress={() => setSelectedTrades((current) => selected ? current.filter((item) => item !== trade.value) : [...current, trade.value])} className={`rounded-full px-3 py-2 ${selected ? "bg-orange-100" : "bg-neutral-100"}`}>
              <Text className={`text-xs font-bold ${selected ? "text-orange-700" : "text-neutral-600"}`}>{trade.label}</Text>
            </Pressable>;
          })}
        </View>
      </View>

      <StandardInputField
        label="Address"
        id="address"
        control={control}
        placeholder="2972 Westheimer Rd. Santa A..."
        required={true}
        textInputProps={{ className: "text-[#222]" }}
      />

      <Pressable onPress={() => setShowWorkersModal(true)}>
        <View className="mb-5">
          <Text className="text-[#333] text-sm font-semibold mb-2">
            Workers Needed
          </Text>
          <View className="h-[52px] rounded-xl border border-[#e8e8e8] bg-transparent px-4 flex-row items-center justify-between">
            <Text className="text-sm text-[#222]">{workersNeeded}</Text>
            <ChevronDown size={18} color="#999999" />
          </View>
        </View>
      </Pressable>

      <StandardDateInput
        label="Start Date"
        date={startDate}
        onDateChange={(value) => setStartDate(value)}
        placeholder="dd/mm/yyyy"
      />

      <StandardDateInput
        label="End Date"
        date={endDate}
        onDateChange={(value) => setEndDate(value)}
        placeholder="dd/mm/yyyy"
      />

      <StandardTextAreaField
        label="Work Brief"
        id="workBrief"
        control={control}
        placeholder="write here....."
        numberOfLines={8}
        required={true}
      />

      <StandardTextAreaField
        label="Notes"
        id="note"
        control={control}
        placeholder="Add notes for workers..."
        numberOfLines={6}
        required={false}
      />
    </ScrollView>
  );
}
