import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { DisputeLogo, ScreenShell, StatusPill } from "./_components";
import { Headphones } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import MessageSupportModal from "@/components/modules/common/MessageSupportModal";
import { useEffect, useState } from "react";
import { useGetSupportTicketsQuery } from "@/store/api/supportApi";

type SupportTicket = {
  id?: string;
  _id?: string;
  ticketId?: string;
  subject?: string;
  title?: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

const getSupportTickets = (response: any): SupportTicket[] => {
  const data =
    response?.data?.data ??
    response?.data?.tickets ??
    response?.data ??
    response?.tickets ??
    response;

  return Array.isArray(data) ? data : [];
};

const getHasNextPage = (
  response: any,
  currentPage: number,
  receivedCount: number,
  limit: number
) => {
  const meta = response?.data?.meta ?? response?.meta ?? response?.pagination;
  const totalPages = meta?.totalPages ?? meta?.totalPage ?? meta?.pages;
  const hasNext =
    meta?.hasNextPage ?? meta?.hasNext ?? meta?.nextPage ?? meta?.next;

  if (typeof hasNext === "boolean") return hasNext;
  if (typeof totalPages === "number") return currentPage < totalPages;

  return receivedCount >= limit;
};

const formatTicketDate = (value?: string) => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const isResolvedTicket = (status?: string) =>
  ["resolved", "closed", "completed"].includes(status?.toLowerCase() ?? "");

const getTicketId = (ticket: SupportTicket) =>
  ticket.id ?? ticket._id ?? ticket.ticketId;

export default function DisputesScreen() {
  const router = useRouter();
  const { origin } = useLocalSearchParams<{ origin?: string | string[] }>();
  const originRoute = Array.isArray(origin) ? origin[0] : origin;
  const [page, setPage] = useState(1);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const supportTicketsQuery = useGetSupportTicketsQuery(
    { page, limit: 10 },
    { refetchOnMountOrArgChange: true }
  );
  console.log("Support tickets query data: ", supportTicketsQuery.data);

  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportModalState, setSupportModalState] = useState<
    "form" | "submitted"
  >("form");

  useEffect(() => {
    if (
      !supportTicketsQuery.data ||
      (page > 1 && supportTicketsQuery.isFetching)
    ) {
      return;
    }

    const nextTickets = getSupportTickets(supportTicketsQuery.data);
    setTickets((current) => {
      if (page === 1) return nextTickets;

      const existingIds = new Set(
        current.map(getTicketId).filter(Boolean)
      );
      return [
        ...current,
        ...nextTickets.filter((ticket) => {
          const ticketId = getTicketId(ticket);
          if (!ticketId) return true;

          return !existingIds.has(ticketId);
        }),
      ];
    });
    setHasNextPage(
      getHasNextPage(supportTicketsQuery.data, page, nextTickets.length, 10)
    );
  }, [supportTicketsQuery.data, supportTicketsQuery.isFetching, page]);

  const refreshSupportTickets = async () => {
    if (page !== 1) {
      setPage(1);
      return;
    }

    await supportTicketsQuery.refetch();
  };

  return (
    <ScreenShell title="Profile">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={supportTicketsQuery.isFetching && page === 1}
            onRefresh={() => void refreshSupportTickets()}
          />
        }
      >
        <View className="gap-4">
          {supportTicketsQuery.isLoading ? (
            <View className="bg-white rounded-xl border border-neutral-100 p-6 items-center">
              <Text className="text-neutral-500 text-sm font-semibold">
                Loading support tickets...
              </Text>
            </View>
          ) : supportTicketsQuery.isError ? (
            <View className="bg-red-50 rounded-xl border border-red-100 p-6 items-center">
              <Text className="text-red-700 text-sm font-semibold text-center">
                Unable to load support tickets. Please try again.
              </Text>
            </View>
          ) : tickets.length === 0 ? (
            <View className="bg-white rounded-xl border border-neutral-100 p-6 items-center">
              <Text className="text-neutral-950 text-base font-extrabold">
                No support tickets yet
              </Text>
              <Text className="text-neutral-500 text-sm text-center mt-2">
                Create a ticket to contact support.
              </Text>
            </View>
          ) : (
            tickets.map((ticket, index) => {
              const resolved = isResolvedTicket(ticket.status);
              const ticketId = getTicketId(ticket) ?? `${index}`;

              return (
                <TouchableOpacity
                  key={ticketId}
                  onPress={() =>
                    router.push({
                      pathname: "/screens/profile/dispute-detail",
                      params: {
                        status: resolved ? "resolved" : "review",
                        id: ticketId,
                        origin: originRoute,
                      },
                    } as any)
                  }
                  className="bg-white rounded-xl border border-neutral-100 p-4 flex-row items-center justify-between"
                  activeOpacity={0.85}
                >
                  <View className="flex-row items-center gap-3">
                    <DisputeLogo />
                    <View>
                      <Text className="text-neutral-950 font-extrabold text-base">
                        {ticket.subject ?? ticket.title ?? "Support ticket"}
                      </Text>
                      <Text className="text-neutral-500 text-xs font-semibold mt-0.5">
                        {formatTicketDate(ticket.createdAt ?? ticket.updatedAt)}
                      </Text>
                    </View>
                  </View>
                  <StatusPill
                    label={
                      resolved ? "Resolved" : ticket.status ?? "Under Review"
                    }
                    tone={resolved ? "resolved" : "review"}
                  />
                </TouchableOpacity>
              );
            })
          )}

          {hasNextPage && tickets.length > 0 ? (
            <TouchableOpacity
              disabled={supportTicketsQuery.isFetching}
              onPress={() => setPage((current) => current + 1)}
              className="items-center rounded-xl bg-white px-4 py-3 disabled:opacity-60"
              activeOpacity={0.85}
            >
              <Text className="text-xs font-bold text-neutral-900">
                {supportTicketsQuery.isFetching
                  ? "Loading..."
                  : "Load more tickets"}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => {
          setSupportModalState("form");
          setShowSupportModal(true);
        }}
        style={{ backgroundColor: Colors.common.BRAND }}
        className="absolute bottom-16 right-6 w-14 h-14 rounded-full items-center justify-center active:opacity-90 z-20"
      >
        <Headphones size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <MessageSupportModal
        showSupportModal={showSupportModal}
        setShowSupportModal={setShowSupportModal}
        supportModalState={supportModalState}
        setSupportModalState={setSupportModalState}
        onSubmitted={() => {
          void refreshSupportTickets();
        }}
      />
    </ScreenShell>
  );
}
