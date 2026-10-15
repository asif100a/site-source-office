import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import type { Dispatch, SetStateAction } from "react";
import type { Control } from "react-hook-form";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import StandardSelectField from "@/components/standard_ui/form_fields/StandardSelectField";
import StandardDateInput from "@/components/standard_ui/form_fields/StandardDateInput";
import StandardTextAreaField from "@/components/standard_ui/form_fields/StandardTextAreaField";
import { ChevronDown } from "lucide-react-native";
import JobLocationPicker from "@/components/modules/employer/home/JobLocationPicker";

export type JobFormValues = {
  jobTitle: string;
  hourlyRate: string;
  workersNeeded: string;
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
  selectedTrade: string;
  location: string;
  onLocationChange: (details: any) => void;
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
  selectedTrade,
  location,
  onLocationChange,
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
        <View className="h-[52px] justify-center rounded-xl border border-[#e8e8e8] px-4 bg-neutral-50">
          <Text className="text-sm text-[#222]">{selectedTrade || "Not set"}</Text>
        </View>
      </View>

      <View className="mb-5">
        <Text className="mb-2 text-[#333] text-sm font-semibold">Address</Text>
        <JobLocationPicker address={location} onChange={onLocationChange} onlyField />
      </View>

      <StandardInputField label="Workers Needed" id="workersNeeded" control={control} placeholder="3" textInputProps={{ className: "text-[#222]", keyboardType: "numeric" }} />

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
