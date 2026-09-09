import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import RenderHTML from "react-native-render-html";
import { useGetLegalsQuery } from "@/store/api/legalApi";
import { ScreenShell } from "./_components";

const legalTagsStyles = {
  h1: {
    color: "#0A0A0A",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 32,
    marginBottom: 12,
  },
  h2: {
    color: "#0A0A0A",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 26,
    marginBottom: 8,
    marginTop: 16,
  },
  p: {
    color: "#475569",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 12,
  },
  li: {
    color: "#475569",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 8,
  },
  a: {
    color: "#FF5A1F",
  },
};

export default function TermsScreen() {
  const { width } = useWindowDimensions();
  const legalQuery = useGetLegalsQuery({});
  const legalData = legalQuery.data?.data ?? legalQuery.data;
  const html = legalData?.termsCondition || "<p>No Content Found</p>";

  return (
    <ScreenShell title="Terms & Conditions">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-4 pb-12"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={legalQuery.isFetching}
            onRefresh={() => void legalQuery.refetch()}
            tintColor="#000000"
            colors={["#000000"]}
          />
        }
      >
        <View className="rounded-2xl bg-white p-5">
          {legalQuery.isLoading ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <RenderHTML
              contentWidth={width - 58}
              tagsStyles={legalTagsStyles as any}
              source={{ html }}
            />
          )}
        </View>

        <View className="pb-12" />
      </ScrollView>
    </ScreenShell>
  );
}
