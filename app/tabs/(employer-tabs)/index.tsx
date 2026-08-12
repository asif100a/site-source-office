import React from "react";
import { Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {
  Plus,
} from "lucide-react-native";
import ScreenHeader from "@/components/layout/ScreenHeader";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import MarketRate from "@/components/modules/employer/home/MarketRate";
import JobRequests from "@/components/modules/employer/home/JobRequests";

export default function EmployerHomeScreen() {
  const router = useRouter();

  const openWorkerDetails = (workerId: string) => {
    router.push({
      pathname: "/screens/worker-details/[id]",
      params: { id: workerId, origin: "employer" },
    });
  };

  const handleCreateJobPost = () => {
    router.push({
      pathname: "/screens/job/CreateJobPost",
      params: { origin: "employer" },
    });
  };

  return (
    <ScreenWrapper>
      <ScreenHeader />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 18, paddingBottom: 110 }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleCreateJobPost}
          className="flex-row items-center justify-center bg-slate-900 rounded-2xl py-4 px-5 shadow-sm"
        >
          <Plus size={20} color="#FFFFFF" />
          <Text className="text-white text-base font-medium ml-2">
            Create a Job Post
          </Text>
        </TouchableOpacity>

        {/* Market Rate */}
        {/* <MarketRate /> */}

        {/* Job Requests */}
        <JobRequests openWorkerDetails={openWorkerDetails} />
      </ScrollView>
    </ScreenWrapper>
  );
}
