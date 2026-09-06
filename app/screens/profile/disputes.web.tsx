import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowRight,
  AlertTriangle,
  Headphones,
  MessageCircle,
} from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/Colors";
import MessageSupportModal from "@/components/modules/common/MessageSupportModal";
import { DisputeLogo, ScreenShell, StatusPill } from "./_components";
import { useGetSupportTicketsQuery } from "@/store/api/supportApi";

type SupportTicket = {
  id?: string;
  _id?: string;
  ticketId?: string;
  subject?: string;
  title?: string;
  description?: string;
  message?: string;
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

function DisputeRow({
  title,
  period,
  status,
  tone,
  summary,
  onPress,
}: {
  title: string;
  period: string;
  status: string;
  tone: "review" | "resolved";
  summary: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      className="rounded-2xl border border-neutral-200 bg-white p-4"
    >
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-row flex-1 items-center gap-3">
          <DisputeLogo />
          <View className="flex-1">
            <Text className="text-base font-semibold text-neutral-950">
              {title}
            </Text>
            <Text className="mt-0.5 text-xs font-semibold text-neutral-500">
              {period}
            </Text>
            <Text className="mt-2 text-sm leading-6 text-neutral-600">
              {summary}
            </Text>
          </View>
        </View>

        <View className="items-end gap-2">
          <StatusPill label={status} tone={tone} />
          <View className="flex-row items-center gap-1.5">
            <Text className="text-sm font-semibold text-neutral-500">Open</Text>
            <ArrowRight size={16} color="#737373" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function DisputesScreenWeb() {
  const router = useRouter();
  const { origin } = useLocalSearchParams<{ origin?: string | string[] }>();
  const originRoute = Array.isArray(origin) ? origin[0] : origin;
  const supportTicketsQuery = useGetSupportTicketsQuery(undefined);
  const tickets = getSupportTickets(supportTicketsQuery.data);
  const resolvedCount = tickets.filter((ticket) =>
    isResolvedTicket(ticket.status)
  ).length;
  const openCount = tickets.length - resolvedCount;
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportModalState, setSupportModalState] = useState<
    "form" | "submitted"
  >("form");

  const handleOpenSupport = () => {
    setSupportModalState("form");
    setShowSupportModal(true);
  };

  return (
    <ScreenShell title="My Supports">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-6 pt-6 md:px-10 xl:px-12 md:pt-8">
          <View className="mx-auto w-full max-w-7xl gap-6">
            <View className="rounded-[28px] border border-neutral-200 bg-white p-6 md:p-8">
              <View className="flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <View className="max-w-3xl gap-4">
                  <View className="flex-row flex-wrap items-center gap-2">
                    <View className="flex-row items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
                      <AlertTriangle size={14} color={Colors.common.BRAND} />
                      <Text className="text-xs font-semibold uppercase tracking-[0px] text-neutral-900">
                        Support cases
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
                      <View className="h-2 w-2 rounded-full bg-emerald-500" />
                      <Text className="text-xs font-semibold text-neutral-600">
                        {resolvedCount} resolved, {openCount} under review
                      </Text>
                    </View>
                  </View>

                  <View className="gap-2">
                    <Text className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-950">
                      Track support cases from one place.
                    </Text>
                    <Text className="max-w-2xl text-sm md:text-base leading-6 text-neutral-600">
                      Review open disputes, inspect the details, and keep the web
                      view clean while the mobile experience stays unchanged.
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleOpenSupport}
                  activeOpacity={0.9}
                  className="flex-row items-center gap-2 self-start rounded-2xl bg-neutral-950 px-5 py-3.5 lg:self-auto"
                >
                  <MessageCircle size={18} color="#FFFFFF" />
                  <Text className="text-sm font-semibold text-white">
                    Message support
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
              <View className="flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <View className="max-w-2xl">
                  <Text className="text-base font-semibold text-neutral-950">
                    Need help with a case?
                  </Text>
                  <Text className="mt-1 text-sm leading-6 text-neutral-600">
                    Send a message with evidence, notes, or payment questions.
                    Support will attach it to your case history.
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={handleOpenSupport}
                  activeOpacity={0.9}
                  className="flex-row items-center justify-center gap-2 rounded-2xl px-5 py-3"
                  style={{ backgroundColor: Colors.common.BRAND }}
                >
                  <Headphones size={18} color="#FFFFFF" />
                  <Text className="text-sm font-semibold text-white">
                    Open ticket
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="gap-4">
              {supportTicketsQuery.isLoading ? (
                <View className="rounded-2xl border border-neutral-200 bg-white p-6">
                  <Text className="text-center text-sm font-semibold text-neutral-500">
                    Loading support tickets...
                  </Text>
                </View>
              ) : supportTicketsQuery.isError ? (
                <View className="rounded-2xl border border-red-100 bg-red-50 p-6">
                  <Text className="text-center text-sm font-semibold text-red-700">
                    Unable to load support tickets. Please try again.
                  </Text>
                </View>
              ) : tickets.length === 0 ? (
                <View className="rounded-2xl border border-neutral-200 bg-white p-8">
                  <Text className="text-center text-base font-semibold text-neutral-950">
                    No support tickets yet
                  </Text>
                  <Text className="mt-2 text-center text-sm text-neutral-500">
                    Open a ticket and it will appear here.
                  </Text>
                </View>
              ) : (
                tickets.map((ticket, index) => {
                  const resolved = isResolvedTicket(ticket.status);
                  const ticketId =
                    ticket.id ?? ticket._id ?? ticket.ticketId ?? `${index}`;

                  return (
                    <DisputeRow
                      key={ticketId}
                      title={ticket.subject ?? ticket.title ?? "Support ticket"}
                      period={formatTicketDate(
                        ticket.createdAt ?? ticket.updatedAt
                      )}
                      status={
                        resolved ? "Resolved" : ticket.status ?? "Under Review"
                      }
                      tone={resolved ? "resolved" : "review"}
                      summary={
                        ticket.description ??
                        ticket.message ??
                        (resolved
                          ? "Admin reviewed this support ticket."
                          : "Waiting for admin review.")
                      }
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
                    />
                  );
                })
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={handleOpenSupport}
        activeOpacity={0.9}
        className="absolute bottom-8 right-8 h-14 w-14 items-center justify-center rounded-full shadow-lg"
        style={{ backgroundColor: Colors.common.BRAND }}
      >
        <Headphones size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <MessageSupportModal
        showSupportModal={showSupportModal}
        setShowSupportModal={setShowSupportModal}
        supportModalState={supportModalState}
        setSupportModalState={setSupportModalState}
        presentation="dialog"
        onSubmitted={() => supportTicketsQuery.refetch()}
      />
    </ScreenShell>
  );
}
