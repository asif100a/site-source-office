import { ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import ScreenHeader from "@/components/layout/ScreenHeader";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import JobOfferHorizontalCarousel from "@/components/modules/worker/home/JobOfferHorizontalCarousel";
import RecommendedVerticalList from "@/components/modules/worker/home/RecommendedVerticalList";
import { Colors } from "@/constants/Colors";

export default function WorkerHomeScreen() {
  const router = useRouter();

  const handleViewDetails = (id: string) => {
    router.push(`/screens/employer-details/${id}` as any);
  };

  return (
    <ScreenWrapper>
      <View className="flex-1" style={{ paddingBottom: 112 }}>
        <View className="px-5 py-6 md:px-8 md:py-8 xl:px-12">
          <View className="mx-auto w-full max-w-7xl">
            <View className="overflow-hidden rounded-[32px] border border-neutral-200/80 bg-white shadow-sm">
              <View className="relative px-5 py-6 md:px-8 md:py-8">
                <View
                  className="absolute -top-16 right-0 h-36 w-36 rounded-full opacity-80"
                  style={{ backgroundColor: Colors.common.BRAND_LIGHT }}
                />
                <View className="absolute -left-12 bottom-0 h-24 w-24 rounded-full bg-neutral-100" />

                <View className="relative gap-2">
                  <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-neutral-500">
                    Worker Home
                  </Text>
                  <Text className="max-w-3xl text-2xl font-bold tracking-tight text-neutral-950 md:text-[32px]">
                    Explore current opportunities in a polished space.
                  </Text>
                  <Text className="max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
                    Browse active job offers and recommended roles with more
                    space, cleaner scanning, and the same core worker
                    experience.
                  </Text>
                </View>
              </View>
            </View>

            <View className="mt-6 gap-6">
              <View className="rounded-[28px] border border-neutral-200/80 bg-white px-1 py-3 shadow-sm md:px-3 md:py-4">
                <JobOfferHorizontalCarousel
                  handleViewDetails={handleViewDetails}
                  containerStyle={{
                    marginTop: 0
                  }}
                />
              </View>

              <View className="rounded-[28px] border border-neutral-200/80 bg-white p-5 shadow-sm md:p-6">
                <RecommendedVerticalList
                  handleViewDetails={handleViewDetails}
                  containerStyle={{
                    marginTop: 0
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}
