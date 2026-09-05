import React from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import LabourerCard from "@/components/card/LabourerCard";
import { Colors } from "@/constants/Colors";
import type { WorkerJobItem } from "@/components/modules/worker/offers/VerticalJobListings";

export default function SearchEmployerListView({
  jobs,
  isLoading,
  isLoadingMore,
  isError,
  refreshing,
  handleViewDetails,
  handleApply,
  onOpenDetails,
  onRefresh,
  onLoadMore,
}: {
  jobs: WorkerJobItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  isError: boolean;
  refreshing: boolean;
  handleViewDetails: (id: string) => void;
  handleApply?: (id: string) => void;
  onOpenDetails?: (job: WorkerJobItem) => void;
  onRefresh: () => void;
  onLoadMore: () => void;
}) {
  const renderHeader = () => (
    <View className="my-4 flex-row items-center justify-between">
      <Text className="text-base font-extrabold tracking-tight text-neutral-900">
        Search Result
      </Text>
      <Text
        style={{ color: Colors.common.BRAND }}
        className="text-xs font-extrabold"
      >
        {jobs.length} Results
      </Text>
    </View>
  );

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View className="rounded-2xl border border-neutral-100 bg-white px-5 py-8">
          <Text className="text-center text-sm font-semibold text-neutral-500">
            Loading jobs...
          </Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View className="rounded-2xl border border-red-100 bg-red-50 px-5 py-8">
          <Text className="text-center text-sm font-semibold text-red-700">
            Unable to load jobs. Please try again.
          </Text>
        </View>
      );
    }

    return (
      <View className="rounded-2xl border border-dashed border-neutral-200 bg-white px-5 py-8">
        <Text className="text-center text-sm font-semibold text-neutral-500">
          No content available.
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      className="flex-1 bg-neutral-50 px-5 pt-2"
      data={jobs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <LabourerCard
          job={item}
          handleViewDetails={handleViewDetails}
          handleApply={handleApply}
          onOpenDetails={onOpenDetails}
        />
      )}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmptyState}
      ListFooterComponent={
        isLoadingMore ? (
          <View className="py-5">
            <ActivityIndicator color={Colors.common.BRAND} />
          </View>
        ) : null
      }
      ItemSeparatorComponent={() => <View className="h-4" />}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.35}
    />
  );
}
