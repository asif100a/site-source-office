import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import React from "react";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  MapPin,
  Users,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import LabourerCard from "@/components/card/LabourerCard";
import { router } from "expo-router";

const MOCK_RECOMMENDED = [
  {
    id: "3",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    payRate: "120",
    tag: "Market Rate",
    location: "Shoreditch • 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jun • 1 month",
    time: "2 hours ago",
  },
  {
    id: "4",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    payRate: "120",
    tag: "Market Rate",
    location: "Shoreditch • 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jun • 1 month",
    time: "2 hours ago",
  },
];

export default function RecommendedVerticalList({
  handleViewDetails,
  containerStyle,
}: {
  handleViewDetails: (id: string) => void;
  containerStyle?: ViewStyle;
}) {
  const handleApply = () => {
    router.push({
      pathname: "/auth",
      params: { role: "worker", step: "register_sso" },
    });
  };

  return (
    <View className="mt-8" style={containerStyle}>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-neutral-900 font-extrabold text-lg tracking-tight">
          Recommended
        </Text>
        <TouchableOpacity className="flex-row items-center">
          <ArrowRight size={20} color="#737373" />
        </TouchableOpacity>
      </View>

      {/* Labourer cards */}
      <View className="gap-4">
        {MOCK_RECOMMENDED.map((job) => (
          <LabourerCard
            key={job.id}
            job={job}
            handleViewDetails={handleViewDetails}
            handleApply={handleApply}
          />
        ))}
      </View>
    </View>
  );
}
