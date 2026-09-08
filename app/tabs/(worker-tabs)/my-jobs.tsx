import { useEffect, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import SearchAndFilterInput from "@/components/modules/common/job/SearchAndFilterInput";
import MyJobToggleChips from "@/components/modules/worker/my-jobs/MyJobToggleChips";
import AppliedJobsList from "@/components/modules/worker/my-jobs/AppliedJobsList";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ScreenHeader from "@/components/layout/ScreenHeader";
import { useGetAppliedJobsQuery } from "@/store/api/jobApplicationApi";
import {
  AppliedJobApplication,
  getAppliedJobApplications,
  getAppliedJobsHasNextPage,
  getReceivedJobOffers,
  ReceivedJobOffer,
} from "@/utils/jobApplications";
import {
  useGetReceivedJobOffersQuery,
  useUpdateJobOfferStatusMutation,
} from "@/store/api/jobOfferApi";
import Toast from "react-native-toast-message";

const tabOptions = ["My Offers", "My Applications", "Active Jobs", "Completed"];
const tabByQueryParam: Record<string, string> = {
  offers: "My Offers",
  offer: "My Offers",
  applications: "My Applications",
  application: "My Applications",
  confirmed: "Active Jobs",
  active: "Active Jobs",
  completed: "Completed",
  cancelled: "Completed",
};

export default function MyJobsScreen() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<string>(tabOptions[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [offersPage, setOffersPage] = useState(1);
  const [applications, setApplications] = useState<AppliedJobApplication[]>([]);
  const [offers, setOffers] = useState<ReceivedJobOffer[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [offersHasNextPage, setOffersHasNextPage] = useState(false);
  const [acceptingOfferIds, setAcceptingOfferIds] = useState<string[]>([]);
  const appliedJobsQuery = useGetAppliedJobsQuery({ page, limit: 10 });
  const myOffersQuery = useGetReceivedJobOffersQuery({
    page: offersPage,
    limit: 10,
  });
  const [updateJobOfferStatus] = useUpdateJobOfferStatusMutation();
  // console.log("appliedJobsQuery from the my jobs screen: ", appliedJobsQuery);

  useEffect(() => {
    if (!appliedJobsQuery.data || (page > 1 && appliedJobsQuery.isFetching)) {
      return;
    }

    const nextApplications = getAppliedJobApplications(appliedJobsQuery.data);
    setApplications((current) => {
      if (page === 1) return nextApplications;

      const existingIds = new Set(current.map((application) => application.id));
      return [
        ...current,
        ...nextApplications.filter((application) => !existingIds.has(application.id)),
      ];
    });
    setHasNextPage(getAppliedJobsHasNextPage(appliedJobsQuery.data, nextApplications.length, 10));
  }, [appliedJobsQuery.data, appliedJobsQuery.isFetching, page]);

  useEffect(() => {
    if (!myOffersQuery.data || (offersPage > 1 && myOffersQuery.isFetching)) {
      return;
    }

    const nextOffers = getReceivedJobOffers(myOffersQuery.data);
    setOffers((current) => {
      if (offersPage === 1) return nextOffers;

      const existingIds = new Set(current.map((offer) => offer.id));
      return [
        ...current,
        ...nextOffers.filter((offer) => !existingIds.has(offer.id)),
      ];
    });
    setOffersHasNextPage(
      getAppliedJobsHasNextPage(myOffersQuery.data, nextOffers.length, 10)
    );
  }, [myOffersQuery.data, myOffersQuery.isFetching, offersPage]);

  useEffect(() => {
    const requestedTab = Array.isArray(tab) ? tab[0] : tab;
    if (requestedTab && tabByQueryParam[requestedTab]) {
      setActiveTab(tabByQueryParam[requestedTab]);
    }
  }, [tab]);

  const handleOpenJobDetails = (id: string, status: string) => {
    if (activeTab === "Active Jobs") {
      router.push({
        pathname: "/screens/active-jobs/[id]",
        params: { id, status: "active" },
      } as any);
      return;
    }

    router.push({
      pathname: "/screens/job/[id]",
      params: { id, applicationStatus: status },
    } as any);
  };

  const refreshAppliedJobs = async () => {
    if (activeTab === "My Offers") {
      if (offersPage !== 1) {
        setOffersPage(1);
        return;
      }

      await myOffersQuery.refetch();
      return;
    }

    if (page !== 1) {
      setPage(1);
      return;
    }

    await appliedJobsQuery.refetch();
  };

  const handleAcceptOffer = (offerId: string) => {
    if (acceptingOfferIds.includes(offerId)) return;

    setAcceptingOfferIds((current) => [...current, offerId]);

    void updateJobOfferStatus({ id: offerId, status: "ACCEPTED" })
      .unwrap()
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Offer accepted",
        });
        setOffers((current) =>
          current.map((offer) =>
            offer.id === offerId ? { ...offer, status: "ACCEPTED" } : offer
          )
        );
        myOffersQuery.refetch();
        appliedJobsQuery.refetch();
      })
      .catch((error) => {
        Toast.show({
          type: "error",
          text1: "Accept failed",
          text2: (error as any)?.data?.message ?? "Please try again.",
        });
      })
      .finally(() => {
        setAcceptingOfferIds((current) =>
          current.filter((id) => id !== offerId)
        );
      });
  };

  return (
    <ScreenWrapper>
      {/* Header */}
      <ScreenHeader />

      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={
              activeTab === "My Offers"
                ? myOffersQuery.isFetching
                : appliedJobsQuery.isFetching
            }
            onRefresh={() => void refreshAppliedJobs()}
          />
        }
      >
        {/* Search / Filter Input */}
        <SearchAndFilterInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          shouldHideFilters
        />

        {/* Toggle Chips */}
        <MyJobToggleChips
          tabOptions={tabOptions}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Jobs List */}
        <AppliedJobsList
          applications={applications}
          offers={offers}
          activeTab={activeTab}
          searchQuery={searchQuery}
          onOpenJobDetails={handleOpenJobDetails}
          onAcceptOffer={handleAcceptOffer}
          acceptingOfferIds={acceptingOfferIds}
          isLoading={
            activeTab === "My Offers"
              ? myOffersQuery.isLoading ||
                (myOffersQuery.isFetching && offers.length === 0)
              : appliedJobsQuery.isLoading ||
                (appliedJobsQuery.isFetching && applications.length === 0)
          }
          isError={
            activeTab === "My Offers"
              ? myOffersQuery.isError
              : appliedJobsQuery.isError
          }
          isFetching={
            activeTab === "My Offers"
              ? myOffersQuery.isFetching
              : appliedJobsQuery.isFetching
          }
          hasNextPage={
            activeTab === "My Offers" ? offersHasNextPage : hasNextPage
          }
          onLoadMore={() =>
            activeTab === "My Offers"
              ? setOffersPage((current) => current + 1)
              : setPage((current) => current + 1)
          }
        />
      </ScrollView>
    </ScreenWrapper>
  );
}
