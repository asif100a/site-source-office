import React from "react";
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  Calendar,
  FileText,
  Hash,
  Image as ImageIcon,
  MessageSquare,
  UserRound,
} from "lucide-react-native";
import { Card, ScreenShell, StatusPill } from "./_components";
import { Colors } from "@/constants/Colors";
import { useGetSingleSupportTicketQuery } from "@/store/api/supportApi";

type SupportTicket = {
  id: string;
  senderAuthId?: string;
  subject?: string;
  message?: string;
  attachments?: string[];
  createdAt?: string;
};

const getSupportTicket = (response: any): SupportTicket | null =>
  response?.data?.data ?? response?.data ?? response ?? null;

const getAttachmentUrl = (attachment: string) => {
  const markdownUrl = attachment.match(/\]\((https?:\/\/[^)]+)\)/)?.[1];
  return markdownUrl ?? attachment;
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

const getAttachmentName = (attachment: string, index: number) => {
  const fallback = `Attachment ${index + 1}`;
  const url = getAttachmentUrl(attachment);

  try {
    const pathname = new URL(url).pathname;
    return decodeURIComponent(pathname.split("/").pop() || fallback);
  } catch {
    return url.split("/").pop() || fallback;
  }
};

const getAttachmentType = (attachment: string) => {
  const url = getAttachmentUrl(attachment).split("?")[0].toLowerCase();

  if (/\.(jpg|jpeg|png|webp|gif)$/.test(url)) return "image";
  if (/\.pdf$/.test(url)) return "pdf";

  return "file";
};

export default function DisputeDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const ticketId = Array.isArray(id) ? id[0] : id;
  const ticketQuery = useGetSingleSupportTicketQuery(
    { id: ticketId ?? "" },
    { skip: !ticketId }
  );
  const ticket = getSupportTicket(ticketQuery.data);
  const attachments = ticket?.attachments ?? [];

  return (
    <ScreenShell title="Support Details" navigateBack={() => router.back()}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 34 }}
      >
        {ticketQuery.isLoading ? (
          <Card className="p-6 items-center">
            <Text className="text-sm font-semibold text-neutral-500">
              Loading support ticket...
            </Text>
          </Card>
        ) : ticketQuery.isError || !ticket ? (
          <Card className="p-6 items-center">
            <Text className="text-center text-sm font-semibold text-red-600">
              Unable to load this support ticket.
            </Text>
          </Card>
        ) : (
          <View className="gap-4">
            <Card className="p-5">
              <View className="mb-4 flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-xs font-bold uppercase text-neutral-400">
                    Support ticket
                  </Text>
                  <Text className="mt-2 text-xl font-extrabold text-neutral-950">
                    {ticket.subject ?? "Support ticket"}
                  </Text>
                </View>
                <StatusPill label="Under Review" tone="review" />
              </View>

              <View className="gap-3 border-t border-neutral-100 pt-4">
                <View className="flex-row items-center gap-3">
                  <Hash size={16} color={Colors.common.BRAND} />
                  <Text className="flex-1 text-xs font-semibold text-neutral-600">
                    {ticket.id}
                  </Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <UserRound size={16} color={Colors.common.BRAND} />
                  <Text className="flex-1 text-xs font-semibold text-neutral-600">
                    {ticket.senderAuthId ?? "Sender unavailable"}
                  </Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <Calendar size={16} color={Colors.common.BRAND} />
                  <Text className="flex-1 text-xs font-semibold text-neutral-600">
                    {formatTicketDate(ticket.createdAt)}
                  </Text>
                </View>
              </View>
            </Card>

            <Card className="p-5">
              <View className="mb-3 flex-row items-center gap-2">
                <MessageSquare size={18} color={Colors.common.BRAND} />
                <Text className="text-base font-extrabold text-neutral-950">
                  Message
                </Text>
              </View>
              <Text className="text-sm leading-6 text-neutral-700">
                {ticket.message ?? "No message provided."}
              </Text>
            </Card>

            <Card className="p-5">
              <View className="mb-3 flex-row items-center gap-2">
                <FileText size={18} color={Colors.common.BRAND} />
                <Text className="text-base font-extrabold text-neutral-950">
                  Attachments
                </Text>
              </View>

              {attachments.length === 0 ? (
                <Text className="text-sm font-semibold text-neutral-500">
                  No attachments uploaded.
                </Text>
              ) : (
                <View className="gap-3">
                  {attachments.map((attachment, index) => {
                    const attachmentUrl = getAttachmentUrl(attachment);
                    const attachmentType = getAttachmentType(attachment);
                    const attachmentName = getAttachmentName(attachment, index);

                    return (
                      <TouchableOpacity
                        key={`${attachment}-${index}`}
                        onPress={() => void Linking.openURL(attachmentUrl)}
                        className="overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50"
                        activeOpacity={0.85}
                      >
                        {attachmentType === "image" ? (
                          <Image
                            source={{ uri: attachmentUrl }}
                            className="h-44 w-full bg-neutral-100"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="h-32 items-center justify-center bg-orange-50">
                            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white">
                              <FileText
                                size={28}
                                color={Colors.common.BRAND}
                              />
                            </View>
                            <Text className="mt-2 text-xs font-extrabold uppercase text-neutral-500">
                              {attachmentType === "pdf" ? "PDF" : "File"}
                            </Text>
                          </View>
                        )}

                        <View className="flex-row items-center gap-3 p-3">
                          <View className="h-9 w-9 items-center justify-center rounded-lg bg-white">
                            {attachmentType === "image" ? (
                              <ImageIcon
                                size={17}
                                color={Colors.common.BRAND}
                              />
                            ) : (
                              <FileText
                                size={17}
                                color={Colors.common.BRAND}
                              />
                            )}
                          </View>
                          <Text
                            className="flex-1 text-xs font-bold text-neutral-800"
                            numberOfLines={2}
                          >
                            {attachmentName}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </Card>
          </View>
        )}
      </ScrollView>
    </ScreenShell>
  );
}
