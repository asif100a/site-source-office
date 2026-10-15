import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import type { Dispatch, SetStateAction } from "react";
import type { Control } from "react-hook-form";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import StandardSelectField from "@/components/standard_ui/form_fields/StandardSelectField";
import StandardDateInput from "@/components/standard_ui/form_fields/StandardDateInput";
import StandardTextAreaField from "@/components/standard_ui/form_fields/StandardTextAreaField";
import { ChevronDown } from "lucide-react-native";

export type JobFormValues = {
  jobTitle: string;
  hourlyRate: string;
  tradeSkill: string;
  address: string;
  radius: string;
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

      <StandardSelectField
        label="Trade / Skill"
        id="tradeSkill"
        control={control}
        options={tradeOptions}
        placeholder="Select trade and number"
      />

      <StandardInputField
        label="Address"
        id="address"
        control={control}
        placeholder="2972 Westheimer Rd. Santa A..."
        required={true}
        textInputProps={{ className: "text-[#222]", editable: false }}
      />

      <StandardSelectField
        label="Radius"
        id="radius"
        control={control}
        options={RADIUS_OPTIONS}
        placeholder="1-10 Km"
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
