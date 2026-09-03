import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "expo-router";
import {
  ChevronDown,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from "lucide-react-native";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import CategoryToggles from "@/components/modules/worker/offers/CategoryToggles";
import VerticalJobListings, {
  type WorkerJobItem,
} from "@/components/modules/worker/offers/VerticalJobListings";
import VerticalOfferListings from "@/components/modules/worker/offers/VerticalOfferListings";
import { Colors } from "@/constants/Colors";
import { DesktopJobDetailsModal, FilterGroup } from "@/components/modules/worker/offers/_ui";
import { useGetAllJobsQuery } from "@/store/api/jobApi";
import { getAllJobItems, mapApiJobToWorkerJobItem } from "@/utils/workerJobs";
import { useCreateJobBookmarkMutation } from "@/store/api/bookmarkApi";
import { getWorkerLoginRoute } from "@/constants/authState";
import { useIsAuthenticated } from "@/hooks/useAuthGuard";

const OFFER_JOBS: WorkerJobItem[] = [
  {
    id: "8",
    title: "Painter",
    company: "Studio Form",
    payRate: "95",
    tag: "Offer",
    location: "Hackney - 0.8 mi away",
    team: "2 painters, 1 coordinator",
    duration: "14 Jun - 10 days",
    time: "Just now",
  },
  {
    id: "9",
    title: "Event Setup Crew",
    company: "Live Works",
    payRate: "85",
    tag: "Offer",
    location: "Waterloo - 11 mi away",
    team: "8 crew members",
    duration: "15 Jun - weekend",
    time: "35 minutes ago",
  },
];

const RATE_OPTIONS = [
  "Any rate",
  "0 - 100",
  "100 - 200",
  "200 - 300",
  "300+",
];

const TRADE_OPTIONS = [
  "All trades",
  "Groundworker",
  "Electrician",
  "Painter",
  "Graphic Designer",
  "Labourer",
];

const RADIUS_OPTIONS = [
  "Any distance",
  "1 - 10 miles",
  "10 - 25 miles",
  "25 - 50 miles",
  "50+ miles",
];

export default function WorkerJobsWebScreen() {
  const router = useRouter();
  const searchInputRef = useRef<TextInput>(null);
  const [activeCategory, setActiveCategory] = useState<"browse" | "offers">(
    "browse",
  );
  const [favoriteJobIds, setFavoriteJobIds] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<WorkerJobItem | null>(null);
  const [bookmarkingJobIds, setBookmarkingJobIds] = useState<string[]>([]);
  const [createJobBookmark] = useCreateJobBookmarkMutation();
  const isAuthenticated = useIsAuthenticated();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [rateRange, setRateRange] = useState("Any rate");
  const [tradeSkill, setTradeSkill] = useState("All trades");
  const [radius, setRadius] = useState("Any distance");
  const trimmedSearchQuery = searchQuery.trim();
  const allJobsQuery = useGetAllJobsQuery({
    page: 1,
    limit: 10,
    status: "POSTED",
    ...(trimmedSearchQuery ? { searchTerm: trimmedSearchQuery } : {}),
  });
  const browseJobs = useMemo(
    () => getAllJobItems(allJobsQuery.data).map(mapApiJobToWorkerJobItem),
    [allJobsQuery.data],
  );

  useEffect(() => {
    const bookmarkedJobIds = getAllJobItems(allJobsQuery.data)
      .filter((job) => Boolean(job?.hasBookmarked))
      .map((job) => String(job.id ?? job._id));

    setFavoriteJobIds(bookmarkedJobIds);
  }, [allJobsQuery.data]);

  const handleFocusSearch = () => {
    searchInputRef.current?.focus();
  };

  const handleViewDetails = (id: string) => {
    router.push(`/screens/employer-details/${id}` as any);
  };

  const handleOpenDetailsModal = (job: WorkerJobItem) => {
    setSelectedJob(job);
  };

  const handleCloseDetailsModal = () => {
    setSelectedJob(null);
  };

  const handleApply = () => {
    router.push({
      pathname: "/auth",
      params: { role: "worker", step: "register_sso" },
    });
  };

  const handleAcceptOffer = (id: string) => {
    console.log("Accepting offer:", id);
  };

  const toggleFavoriteJob = (id: string) => {
    if (!isAuthenticated) {
      router.push(getWorkerLoginRoute(`/tabs/(worker-tabs)/jobs`) as any);
      return;
    }

    if (bookmarkingJobIds.includes(id)) {
      return;
    }

    const wasFavorite = favoriteJobIds.includes(id);

    setFavoriteJobIds((current) =>
      current.includes(id)
        ? current.filter((jobId) => jobId !== id)
        : [...current, id],
    );
    setBookmarkingJobIds((current) => [...current, id]);

    void createJobBookmark({ jobId: id })
      .unwrap()
      .then(() => {
        Toast.show({
          type: "success",
          text1: wasFavorite ? "Bookmark updated" : "Job bookmarked",
        });
        allJobsQuery.refetch();
      })
      .catch((error) => {
        setFavoriteJobIds((current) =>
          wasFavorite
            ? Array.from(new Set([...current, id]))
            : current.filter((jobId) => jobId !== id),
        );
        Toast.show({
          type: "error",
          text1: "Bookmark failed",
          text2: (error as any)?.data?.message ?? "Please try again.",
        });
      })
      .finally(() => {
        setBookmarkingJobIds((current) =>
          current.filter((jobId) => jobId !== id),
        );
      });
  };

  const visibleJobs = useMemo(() => {
    const source = activeCategory === "browse" ? browseJobs : OFFER_JOBS;
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return source.filter((job) => {
      const matchesQuery =
        !normalizedQuery ||
        [job.title, job.company, job.location, job.tag, job.team]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const payRate = Number(job.payRate);
      const matchesRate =
        rateRange === "Any rate" ||
        (rateRange === "0 - 100" && payRate >= 0 && payRate <= 100) ||
        (rateRange === "100 - 200" && payRate > 100 && payRate <= 200) ||
        (rateRange === "200 - 300" && payRate > 200 && payRate <= 300) ||
        (rateRange === "300+" && payRate > 300);

      const matchesTrade =
        tradeSkill === "All trades" ||
        job.title.toLowerCase().includes(tradeSkill.toLowerCase());

      const distance = Number(job.location.match(/(\d+(\.\d+)?)\s*mi/)?.[1] ?? "0");
      const matchesRadius =
        radius === "Any distance" ||
        (radius === "1 - 10 miles" && distance <= 10) ||
        (radius === "10 - 25 miles" && distance > 10 && distance <= 25) ||
        (radius === "25 - 50 miles" && distance > 25 && distance <= 50) ||
        (radius === "50+ miles" && distance > 50);

      return matchesQuery && matchesRate && matchesTrade && matchesRadius;
    });
  }, [activeCategory, browseJobs, radius, rateRange, searchQuery, tradeSkill]);

  const resultLabel =
    activeCategory === "browse" ? "Local Jobs" : "Favourites";

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

                <View className="relative gap-4">
                  <View className="rounded-full bg-orange-50 px-3 py-1.5 self-start">
                    <Text className="text-xs font-bold uppercase text-neutral-900">
                      Worker jobs
                    </Text>
                  </View>

                  <View className="gap-2">
                    <Text className="max-w-3xl text-2xl font-bold tracking-tight text-neutral-950 md:text-[32px]">
                      Browse open work in a desktop-friendly layout.
                    </Text>
                    <Text className="max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
                      Search and filter directly on this page, then switch
                      between opportunities and favourites without leaving the
                      web view.
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={handleFocusSearch}
                    activeOpacity={0.9}
                    className="flex-row items-center gap-2 self-start rounded-2xl bg-neutral-950 px-5 py-3.5"
                  >
                    <Search size={18} color="#FFFFFF" />
                    <Text className="text-sm font-bold text-white">
                      Search jobs
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="rounded-[28px] border border-neutral-200/80 bg-white p-5 shadow-sm md:p-6">
              <View className="mt-1 flex-row items-center gap-2">
                <View className="flex-1 flex-row items-center rounded-xl border border-neutral-200/80 bg-white px-4 py-3">
                  <Search size={18} color="#A3A3A3" />
                  <TextInput
                    ref={searchInputRef}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search jobs, companies, or locations"
                    placeholderTextColor="#A3A3A3"
                    className="flex-1 px-3 text-sm font-medium text-neutral-800"
                  />
                </View>

                <TouchableOpacity
                  onPress={() => setShowFilters((current) => !current)}
                  activeOpacity={0.85}
                  className="flex-row items-center gap-2 rounded-xl border border-neutral-200/80 bg-white px-4 py-3"
                >
                  <SlidersHorizontal size={16} color="#525252" />
                  <Text className="text-sm font-bold text-neutral-700">
                    Filters
                  </Text>
                  <ChevronDown
                    size={16}
                    color="#525252"
                    style={{
                      transform: [{ rotate: showFilters ? "180deg" : "0deg" }],
                    }}
                  />
                </TouchableOpacity>
              </View>

              {showFilters ? (
                <View className="mt-5 gap-5 rounded-2xl border border-neutral-200/80 bg-neutral-50 p-4 md:p-5">
                  <FilterGroup
                    label="Rate"
                    options={RATE_OPTIONS}
                    value={rateRange}
                    onChange={setRateRange}
                  />
                  <FilterGroup
                    label="Trade / Skill"
                    options={TRADE_OPTIONS}
                    value={tradeSkill}
                    onChange={setTradeSkill}
                  />
                  <FilterGroup
                    label="Radius"
                    options={RADIUS_OPTIONS}
                    value={radius}
                    onChange={setRadius}
                  />

                  <TouchableOpacity
                    onPress={() => {
                      setRateRange("Any rate");
                      setTradeSkill("All trades");
                      setRadius("Any distance");
                    }}
                    activeOpacity={0.85}
                    className="self-start rounded-xl bg-white px-4 py-2.5"
                  >
                    <Text className="text-sm font-bold text-neutral-700">
                      Reset filters
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              <CategoryToggles
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            </View>

            <View className="rounded-[28px] border border-neutral-200/80 bg-white p-5 shadow-sm md:p-6">
              <View className="mb-5 flex-row items-center justify-between gap-4">
                <View>
                  <Text className="text-lg font-bold tracking-tight text-neutral-900">
                    {resultLabel}
                  </Text>
                  <Text className="mt-1 text-sm text-neutral-500">
                    {visibleJobs.length} result{visibleJobs.length === 1 ? "" : "s"}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={handleFocusSearch}
                  activeOpacity={0.85}
                  className="flex-row items-center"
                >
                  <Text
                    style={{ color: Colors.common.BRAND }}
                    className="mr-1 text-xs font-bold"
                  >
                    Refine Search
                  </Text>
                  <ChevronRight size={16} color={Colors.common.BRAND} />
                </TouchableOpacity>
              </View>

              {activeCategory === "browse" && allJobsQuery.isLoading ? (
                <View className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-10">
                  <Text className="text-center text-sm font-bold text-neutral-500">
                    Loading jobs...
                  </Text>
                </View>
              ) : activeCategory === "browse" && allJobsQuery.isError ? (
                <View className="rounded-2xl border border-red-100 bg-red-50 px-5 py-10">
                  <Text className="text-center text-sm font-bold text-red-700">
                    Unable to load jobs. Please try again.
                  </Text>
                </View>
              ) : visibleJobs.length > 0 ? (
                activeCategory === "browse" ? (
                  <VerticalJobListings
                    jobs={visibleJobs}
                    handleViewDetails={handleViewDetails}
                    handleApply={handleApply}
                    favoriteJobIds={favoriteJobIds}
                    onToggleFavorite={toggleFavoriteJob}
                    onOpenDetails={handleOpenDetailsModal}
                  />
                ) : (
                  <VerticalOfferListings
                    offers={visibleJobs}
                    handleViewDetails={handleViewDetails}
                    handleAcceptOffer={handleAcceptOffer}
                    favoriteJobIds={favoriteJobIds}
                    onToggleFavorite={toggleFavoriteJob}
                    onOpenDetails={handleOpenDetailsModal}
                  />
                )
              ) : (
                <View className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-5 py-10">
                  <Text className="text-base font-bold text-neutral-900">
                    No matching jobs found
                  </Text>
                  <Text className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
                    Try a different search term or reset the current filters to
                    see more opportunities.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <DesktopJobDetailsModal
        job={selectedJob}
        visible={!!selectedJob}
        onClose={handleCloseDetailsModal}
        onPrimaryAction={() => {
          handleCloseDetailsModal();
          handleApply();
        }}
      />
    </ScreenWrapper>
  );
}
