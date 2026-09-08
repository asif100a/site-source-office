import { View, Text } from "react-native";
import React from "react";

export default function CompletedSchedule({ jobDetails }: { jobDetails: any }) {
  return (
    <View>
      <Text className="text-neutral-900 font-extrabold text-base mb-3.5">
        Project Schedule
      </Text>
      <View className="border border-neutral-200/80 rounded-xl bg-white overflow-hidden">
        <View className="flex-row justify-between items-center p-4 border-b border-neutral-50">
          <Text className="text-neutral-400 text-sm font-semibold">
            Start Date
          </Text>
          <Text className="text-neutral-800 text-sm font-extrabold">
            {jobDetails.startDate}
          </Text>
        </View>
        <View className="flex-row justify-between items-center p-4 border-b border-neutral-50">
          <Text className="text-neutral-400 text-sm font-semibold">
            End date
          </Text>
          <Text className="text-neutral-800 text-sm font-extrabold">
            {jobDetails.endDate}
          </Text>
        </View>
        <View className="flex-row justify-between items-center p-4 border-b border-neutral-50">
          <Text className="text-neutral-400 text-sm font-semibold">Hours</Text>
          <Text className="text-neutral-800 text-sm font-extrabold">
            {jobDetails.hours}
          </Text>
        </View>
        <View className="flex-row justify-between items-center p-4 border-b border-neutral-50">
          <Text className="text-neutral-400 text-sm font-semibold">
            Per Week
          </Text>
          <Text className="text-neutral-800 text-sm font-extrabold">
            {jobDetails.daysPerWeek}
          </Text>
        </View>
        {/* <View className="flex-row justify-between items-center p-4">
          <Text className="text-neutral-400 text-sm font-semibold">
            Next invoice
          </Text>
          <Text className="text-neutral-800 text-sm font-extrabold">
            {jobDetails.nextInvoice}
          </Text>
        </View> */}
      </View>
    </View>
  );
}
