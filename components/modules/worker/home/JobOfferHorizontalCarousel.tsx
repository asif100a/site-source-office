import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
} from "react-native";
import React from "react";
import { ArrowRight, Briefcase, Sparkles } from "lucide-react-native";
import { Colors } from "@/constants/Colors";

const MOCK_JOB_OFFERS = [
  {
    id: "1",
    title: "Labourer",
    company: "London builder limited",
    payRate: "120",
    tag: "Market Rate",
  },
  {
    id: "2",
    title: "Labourer",
    company: "London builder limited",
    payRate: "120",
    tag: "Market Rate",
  },
];

export default function JobOfferHorizontalCarousel({
  handleViewDetails,
  containerStyle = {},
}: {
  handleViewDetails: (id: string) => void;
  containerStyle?: ViewStyle;
}) {
  return (
    <View className="mt-8" style={containerStyle}>
      <View className="flex-row justify-between items-center mb-4 px-5">
        <View className="flex-row items-center gap-2">
          <Sparkles size={18} color={Colors.common.BRAND} />
          <Text className="flex-1 text-neutral-900 font-extrabold text-lg tracking-tight">
            Job Offers
          </Text>
        </View>
        <TouchableOpacity className="flex-row items-center">
          <ArrowRight size={20} color="#737373" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-5 px-5"
      >
        {MOCK_JOB_OFFERS.map((job) => (
          <TouchableOpacity
            key={job.id}
            onPress={() => handleViewDetails(job.id)}
            activeOpacity={0.9}
            className="bg-white rounded-2xl p-4 mr-4 border border-neutral-100/80 w-64"
          >
            <View className="flex-row items-center gap-3 mb-4">
              {/* Custom Job Icon Logo */}
              <View className="w-12 h-12 bg-blue-600 rounded-xl items-center justify-center">
                <Briefcase size={20} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-neutral-900 font-extrabold text-base"
                  numberOfLines={1}
                >
                  {job.title}
                </Text>
                <Text
                  className="text-neutral-500 text-xs font-semibold"
                  numberOfLines={1}
                >
                  {job.company}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center pt-2 border-t border-neutral-50/80">
              <Text className="flex-1 text-neutral-800 font-bold text-sm">
                £{job.payRate}/hour
              </Text>
              {/* <View
                style={{ backgroundColor: Colors.common.BRAND_LIGHT }}
                className="px-2.5 py-1 rounded-md"
              >
                <Text
                  style={{ color: Colors.common.BRAND }}
                  className="text-[10px] font-extrabold"
                >
                  {job.tag}
                </Text>
              </View> */}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
