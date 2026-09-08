import { View, Text } from "react-native";
import React from "react";
import { Mail, Phone } from "lucide-react-native";

export default function CompletedEmployerContact({jobDetails}: {jobDetails: any}) {
  return (
    <View className="bg-white rounded-2xl p-5 border border-neutral-200/80 mb-6">
      <Text className="text-neutral-900 font-extrabold text-base mb-4">
        Employer Contact
      </Text>

      <View className="flex-row items-center gap-3 mb-0">
        <View className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 justify-center items-center">
          <Text className="text-slate-700 font-extrabold text-sm">JH</Text>
        </View>
        <View>
          <Text className="text-neutral-900 font-extrabold text-sm">
            {jobDetails.contactName}
          </Text>
          <Text className="text-neutral-400 text-xs font-semibold">
            {jobDetails.contactTitle}
          </Text>
        </View>
      </View>

      <View className="gap-2.5 pt-3 border-t border-neutral-50">
        <View className="flex-row items-center gap-2.5">
          <Mail size={15} color="#858585" />
          <Text className="text-neutral-500 text-xs font-semibold">
            {jobDetails.contactEmail}
          </Text>
        </View>
        <View className="flex-row items-center gap-2.5">
          <Phone size={15} color="#858585" />
          <Text className="text-neutral-500 text-xs font-semibold">
            {jobDetails.contactPhone}
          </Text>
        </View>
      </View>
    </View>
  );
}
