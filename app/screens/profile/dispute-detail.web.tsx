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
  ArrowLeft,
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

function PdfAttachmentPreview({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  return React.createElement("iframe", {
    src: url,
    title,
    style: {
      border: 0,
      height: "100%",
      width: "100%",
    },
  });
}

export default function DisputeDetailScreenWeb() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const ticketId = Array.isArray(id) ? id[0] : id;
  const ticketQuery = useGetSingleSupportTicketQuery(
    { id: ticketId ?? "" },
    { skip: !ticketId }
  );
  const ticket = getSupportTicket(ticketQuery.data);
  const attachments = ticket?.attachments ?? [];

  return (
    <ScreenShell title="Support Details">
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
                      <FileText size={14} color={Colors.common.BRAND} />
                      <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-900">
                        Case details
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
                      <View className="h-2 w-2 rounded-full bg-amber-500" />
                      <Text className="text-xs font-semibold text-neutral-600">
                        Under review
                      </Text>
                    </View>
                  </View>

                  <View className="gap-2">
                    <Text className="text-3xl md:text-4xl font-black tracking-tight text-neutral-950">
                      {ticket?.subject ?? "Support ticket details"}
                    </Text>
                    <Text className="max-w-2xl text-sm md:text-base leading-6 text-neutral-600">
                      Review the submitted support request, sender reference,
                      and any attached evidence.
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => router.back()}
                  activeOpacity={0.88}
                  className="flex-row items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3.5"
                >
                  <ArrowLeft size={18} color="#111827" />
                  <Text className="text-sm font-semibold text-neutral-900">
                    Back
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {ticketQuery.isLoading ? (
              <Card className="p-8">
                <Text className="text-center text-sm font-semibold text-neutral-500">
                  Loading support ticket...
                </Text>
              </Card>
            ) : ticketQuery.isError || !ticket ? (
              <Card className="p-8">
                <Text className="text-center text-sm font-semibold text-red-600">
                  Unable to load this support ticket.
                </Text>
              </Card>
            ) : (
              <View className="flex-col gap-6 xl:flex-row">
                <View className="flex-[1.2] gap-4">
                  <Card className="p-6">
                    <View className="mb-5 flex-row items-start justify-between gap-4">
                      <View className="flex-1">
                        <Text className="text-xs font-bold uppercase text-neutral-400">
                          Subject
                        </Text>
                        <Text className="mt-2 text-2xl font-black text-neutral-950">
                          {ticket.subject ?? "Support ticket"}
                        </Text>
                      </View>
                      <StatusPill label="Under Review" tone="review" />
                    </View>

                    <View className="rounded-2xl bg-neutral-50 p-5">
                      <View className="mb-3 flex-row items-center gap-2">
                        <MessageSquare size={18} color={Colors.common.BRAND} />
                        <Text className="text-base font-extrabold text-neutral-950">
                          Message
                        </Text>
                      </View>
                      <Text className="text-sm leading-7 text-neutral-700">
                        {ticket.message ?? "No message provided."}
                      </Text>
                    </View>
                  </Card>
                </View>

                <View className="flex-1 gap-4">
                  <Card className="p-5">
                    <Text className="mb-4 text-base font-extrabold text-neutral-950">
                      Ticket information
                    </Text>
                    <View className="gap-4">
                      <View className="flex-row items-start gap-3">
                        <Hash size={17} color={Colors.common.BRAND} />
                        <View className="flex-1">
                          <Text className="text-xs font-bold uppercase text-neutral-400">
                            Ticket ID
                          </Text>
                          <Text className="mt-1 text-sm font-semibold text-neutral-700">
                            {ticket.id}
                          </Text>
                        </View>
                      </View>
                      <View className="h-px bg-neutral-100" />
                      <View className="flex-row items-start gap-3">
                        <UserRound size={17} color={Colors.common.BRAND} />
                        <View className="flex-1">
                          <Text className="text-xs font-bold uppercase text-neutral-400">
                            Sender Auth ID
                          </Text>
                          <Text className="mt-1 text-sm font-semibold text-neutral-700">
                            {ticket.senderAuthId ?? "Sender unavailable"}
                          </Text>
                        </View>
                      </View>
                      <View className="h-px bg-neutral-100" />
                      <View className="flex-row items-start gap-3">
                        <Calendar size={17} color={Colors.common.BRAND} />
                        <View className="flex-1">
                          <Text className="text-xs font-bold uppercase text-neutral-400">
                            Created
                          </Text>
                          <Text className="mt-1 text-sm font-semibold text-neutral-700">
                            {formatTicketDate(ticket.createdAt)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Card>

                  <Card className="p-5">
                    <View className="mb-4 flex-row items-center gap-2">
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
                          const attachmentName = getAttachmentName(
                            attachment,
                            index
                          );

                          return (
                            <TouchableOpacity
                              key={`${attachment}-${index}`}
                              onPress={() =>
                                void Linking.openURL(attachmentUrl)
                              }
                              className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
                              activeOpacity={0.9}
                            >
                              {attachmentType === "image" ? (
                                <Image
                                  source={{ uri: attachmentUrl }}
                                  className="h-52 w-full bg-neutral-100"
                                  resizeMode="cover"
                                />
                              ) : attachmentType === "pdf" ? (
                                <View className="h-64 w-full bg-neutral-100">
                                  <PdfAttachmentPreview
                                    title={attachmentName}
                                    url={attachmentUrl}
                                  />
                                </View>
                              ) : (
                                <View className="h-40 items-center justify-center bg-orange-50">
                                  <View className="h-16 w-16 items-center justify-center rounded-2xl bg-white">
                                    <FileText
                                      size={32}
                                      color={Colors.common.BRAND}
                                    />
                                  </View>
                                  <Text className="mt-3 text-xs font-extrabold uppercase text-neutral-500">
                                    {attachmentType === "pdf" ? "PDF" : "File"}
                                  </Text>
                                </View>
                              )}

                              <View className="flex-row items-center gap-3 p-4">
                                <View className="h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
                                  {attachmentType === "image" ? (
                                    <ImageIcon
                                      size={18}
                                      color={Colors.common.BRAND}
                                    />
                                  ) : (
                                    <FileText
                                      size={18}
                                      color={Colors.common.BRAND}
                                    />
                                  )}
                                </View>
                                <Text
                                  className="flex-1 text-sm font-semibold text-neutral-800"
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
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}
