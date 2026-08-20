import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Search,
  Map,
  List,
  SlidersHorizontal,
  ChevronLeft,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchEmployerListView from "@/components/modules/employer/search-employer/SearchEmployerListView";
import SearchEmployerMapView from "@/components/modules/employer/search-employer/SearchEmployerMapView";
import SearchEmployerFilterModal from "@/components/modules/employer/search-employer/SearchEmployerFilterModal";
import LogoWhite from "@/assets/icons/LogoWhite";
import JobDetailsBottomSheet from "@/components/modules/worker/offers/JobDetailsBottomSheet";
import type { WorkerJobItem } from "@/components/modules/worker/offers/VerticalJobListings";

export default function WorkerSearchScreen() {
  const router = useRouter();
  const { origin } = useLocalSearchParams<{ origin?: string | string[] }>();
  const originRoute = Array.isArray(origin) ? origin[0] : origin;
  const [viewType, setViewType] = useState<"list" | "map">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<WorkerJobItem | null>(null);

  // Filter States
  const [rateRange, setRateRange] = useState("");
  const [tradeSkill, setTradeSkill] = useState("Groundworker");
  const [radius, setRadius] = useState("1 - 10 miles");

  const handleViewDetails = (id: string) => {
    router.push(`/screens/employer-details/${id}`);
  };

  const handleOpenDetailsModal = (job: WorkerJobItem) => {
    setSelectedJob(job);
  };

  const handleCloseDetailsModal = () => {
    setSelectedJob(null);
  };

  const handleSendRequest = () => {
    handleCloseDetailsModal();
    router.push({
      pathname: "/auth",
      params: { role: "worker", step: "register_sso" },
    });
  };

  const goBackToOrigin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={[]}>
      {/* Search Header */}
      <View
        style={{ backgroundColor: Colors.common.BRAND }}
        className="pb-3 pt-8 px-6 z-10"
      >
        <View className="flex-row justify-between items-end">
          {/* Back button and title */}
          <TouchableOpacity
            onPress={goBackToOrigin}
            className="flex-row items-center gap-1 active:opacity-75"
          >
            <ChevronLeft size={20} color="#FFFFFF" />
            <Text className="text-white text-xl font-extrabold tracking-tight">
              Search Jobs
            </Text>
          </TouchableOpacity>

          <View
            className="-mb-3 mr-0"
            style={
              { minWidth: "100", minHeight: "72", position: "relative" } as any
            }
          >
            <View
              style={{
                position: "absolute",
                right: "37%",
              }}
            >
              <LogoWhite size={{ width: "100", height: "72" }} />
            </View>
          </View>

          {/* Map/List View Toggle */}
          <TouchableOpacity
            onPress={() => setViewType(viewType === "list" ? "map" : "list")}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center border border-white/25 active:opacity-75"
          >
            {viewType === "list" ? (
              <Map color="#FFFFFF" size={18} />
            ) : (
              <List color="#FFFFFF" size={18} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {viewType === "list" ? (
        <View className="z-10 flex-row items-center gap-3 bg-neutral-50 px-5 pb-2 pt-4">
          <View className="flex-1 flex-row items-center rounded-xl border border-neutral-200/80 bg-white px-4 py-1">
            <Search size={18} color="#A3A3A3" className="mr-2" />
            <TextInput
              className="flex-1 py-0 text-sm font-medium text-neutral-800"
              placeholder="Search Jobs"
              placeholderTextColor="#A3A3A3"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            className="items-center justify-center rounded-xl border border-neutral-200/80 bg-white p-4 active:opacity-80"
          >
            <SlidersHorizontal size={18} color="#333333" />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Content render based on toggle */}
      {viewType === "list" ? (
        /* LIST VIEW */
        <SearchEmployerListView
          handleViewDetails={handleViewDetails}
          onOpenDetails={handleOpenDetailsModal}
        />
      ) : (
        /* MAP VIEW */
        <SearchEmployerMapView
          handleViewDetails={handleViewDetails}
          searchQuery={searchQuery}
          onChangeSearchQuery={setSearchQuery}
          onOpenFilters={() => setShowFilters(true)}
          onOpenDetails={handleOpenDetailsModal}
        />
      )}

      {/* FILTERS MODAL (Bottom Sheet style) */}
      <SearchEmployerFilterModal
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        rateRange={rateRange}
        setRateRange={setRateRange}
        radius={radius}
        setRadius={setRadius}
        tradeSkill={tradeSkill}
        setTradeSkill={setTradeSkill}
      />

      <JobDetailsBottomSheet
        job={selectedJob}
        visible={!!selectedJob}
        primaryActionLabel="Send Request"
        onClose={handleCloseDetailsModal}
        onPrimaryAction={handleSendRequest}
      />
    </SafeAreaView>
  );
}
