import React from "react";
import { useRouter } from "expo-router";
import { ArrowRight, Plus } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import JobRequests from "@/components/modules/employer/home/JobRequests";
import { Colors } from "@/constants/Colors";

export default function EmployerHomeScreenWeb() {
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

  const handleWorkerDetails = (id: string) => {
    router.push({
      pathname: `/screens/worker-details/${id}`,
      params: { origin: "employer" },
    });
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
                        Employer home
                      </Text>
                    </View>

                    <View className="gap-2">
                      <Text className="max-w-3xl text-2xl font-bold tracking-tight text-neutral-950 md:text-[32px]">
                        Create jobs and review worker requests in one place.
                      </Text>
                      <Text className="max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
                        The same employer home flow as mobile, presented in a
                        cleaner desktop layout for faster hiring decisions.
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={handleCreateJobPost}
                    className="flex-row items-center justify-center gap-2 self-start rounded-2xl bg-slate-900 px-5 py-3.5 lg:self-auto"
                  >
                    <Plus size={20} color="#FFFFFF" />
                    <Text className="text-sm font-bold text-white">
                      Create a job post
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="rounded-[28px] border border-neutral-200/80 bg-white p-5 shadow-sm md:p-6">
              <JobRequests
                openWorkerDetails={openWorkerDetails}
                containerStyle={{
                  marginTop: 0,
                }}
              />
            </View>
          </View>
        </View>
        {/* Job Requests */}
        <JobRequests openWorkerDetails={handleWorkerDetails} />
      </ScrollView>
    </ScreenWrapper>
  );
}
