import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useForm } from "react-hook-form";
import {
  Clock3,
  Headphones,
  Mail,
  MessageSquareMore,
  PhoneCall,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import StandardTextAreaField from "@/components/standard_ui/form_fields/StandardTextAreaField";
import { Card, ScreenShell, StatusPill } from "./_components";

type ContactFormValues = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

const HELP_TOPICS = [
  "Account access and login support",
  "Payments, invoices, and billing questions",
  "Job disputes, cancellations, and policy guidance",
];

const CONTACT_CHANNELS = [
  {
    icon: Mail,
    title: "Email support",
    value: "support@sitesource.app",
    note: "Best for account, billing, and document issues.",
  },
  {
    icon: PhoneCall,
    title: "Phone line",
    value: "+44 20 5555 0198",
    note: "Available Monday to Friday, 9:00 AM to 6:00 PM.",
  },
  {
    icon: MessageSquareMore,
    title: "Priority assistance",
    value: "Live response in under 2 hours",
    note: "For active-job or urgent worker and employer issues.",
  },
];

function ChannelCard({
  icon: Icon,
  title,
  value,
  note,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  value: string;
  note: string;
}) {
  return (
    <View className="rounded-2xl border border-neutral-200 bg-white p-4">
      <View className="flex-row items-start gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100">
          <Icon size={18} color="#0F172A" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-neutral-950">{title}</Text>
          <Text className="mt-1 text-sm font-semibold text-slate-700">
            {value}
          </Text>
          <Text className="mt-1.5 text-xs leading-5 text-slate-500">{note}</Text>
        </View>
      </View>
    </View>
  );
}

export default function ContactWeb() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { control, handleSubmit, reset } = useForm<ContactFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const submitContactForm = handleSubmit(() => {
    setIsSubmitted(true);
    reset();
  });

  return (
    <ScreenShell title="Contact Us">
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
                      <Headphones size={14} color={Colors.common.BRAND} />
                      <Text className="text-xs font-semibold uppercase tracking-[0px] text-neutral-900">
                        Support
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
                      <View className="h-2 w-2 rounded-full bg-emerald-500" />
                      <Text className="text-xs font-semibold text-neutral-600">
                        Team online
                      </Text>
                    </View>
                  </View>

                  <View className="gap-2">
                    <Text className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-950">
                      Support that keeps work moving.
                    </Text>
                    <Text className="max-w-2xl text-sm md:text-base leading-6 text-neutral-600">
                      Reach the SiteSource team for account help, job support,
                      policy questions, or urgent platform issues. Share a few
                      details and we will route your request to the right team.
                    </Text>
                  </View>
                </View>

                <View className="flex-row flex-wrap gap-3">
                  <View className="rounded-2xl bg-neutral-950 px-5 py-3.5">
                    <Text className="text-xs font-semibold uppercase tracking-[0px] text-white/60">
                      Avg response
                    </Text>
                    <Text className="mt-1 text-lg font-semibold tracking-tight text-white">
                      Under 24h
                    </Text>
                  </View>
                  <View className="rounded-2xl border border-neutral-200 bg-white px-5 py-3.5">
                    <Text className="text-xs font-semibold uppercase tracking-[0px] text-neutral-500">
                      Priority
                    </Text>
                    <Text className="mt-1 text-lg font-semibold tracking-tight text-neutral-950">
                      2h
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="flex-col gap-6 xl:flex-row">
              <View className="flex-[1.15] gap-4">
                <Card className="p-5">
                  <View className="flex-row items-center gap-2 mb-4">
                    <StatusPill label="Support Team Online" tone="approved" />
                    <View className="flex-row items-center gap-1">
                      <Clock3 size={14} color="#64748B" />
                      <Text className="text-slate-500 text-xs font-semibold">
                        Average response under 24 hours
                      </Text>
                    </View>
                  </View>

                  <Text className="text-neutral-950 text-2xl font-semibold">
                    How we can help
                  </Text>
                  <View className="mt-4 gap-3">
                    {HELP_TOPICS.map((topic) => (
                      <View
                        key={topic}
                        className="flex-row items-start gap-3 rounded-2xl bg-neutral-50 px-4 py-3"
                      >
                        <View className="h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white">
                          <ShieldCheck size={16} color="#12365A" />
                        </View>
                        <Text className="flex-1 text-sm font-medium leading-5 text-slate-700">
                          {topic}
                        </Text>
                      </View>
                    ))}
                  </View>
                </Card>

                <Card className="p-5">
                  <Text className="text-neutral-950 text-lg font-semibold mb-4">
                    Contact channels
                  </Text>
                  <View className="gap-3">
                    {CONTACT_CHANNELS.map((channel) => (
                      <ChannelCard
                        key={channel.title}
                        icon={channel.icon}
                        title={channel.title}
                        value={channel.value}
                        note={channel.note}
                      />
                    ))}
                  </View>
                </Card>
              </View>

              <View className="flex-[1.35] gap-4">
                <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
                  <View className="flex-row items-center gap-3">
                    <View className="h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
                      <Sparkles size={18} color={Colors.common.BRAND} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-neutral-900">
                        Send a message
                      </Text>
                      <Text className="mt-1 text-sm leading-6 text-neutral-600">
                        Include as much context as possible so our support team
                        can help you faster.
                      </Text>
                    </View>
                  </View>
                </View>

                <Card className="p-5 md:p-6">
                  {isSubmitted && (
                    <View className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                      <Text className="text-sm font-semibold text-emerald-700">
                        Your support request has been prepared successfully.
                      </Text>
                      <Text className="mt-1 text-xs leading-5 text-emerald-700/80">
                        A support specialist will review it and follow up through
                        your registered contact details.
                      </Text>
                    </View>
                  )}

                  <View className="gap-5">
                    <StandardInputField<ContactFormValues>
                      label="Full Name"
                      id="fullName"
                      control={control}
                      placeholder="Enter your full name"
                    />

                    <StandardInputField<ContactFormValues>
                      label="Email Address"
                      id="email"
                      type="email"
                      control={control}
                      placeholder="Enter your email address"
                    />

                    <StandardInputField<ContactFormValues>
                      label="Subject"
                      id="subject"
                      control={control}
                      placeholder="Briefly describe your issue"
                    />

                    <StandardTextAreaField<ContactFormValues>
                      label="Message"
                      id="message"
                      control={control}
                      placeholder="Tell us what happened, what you need, and any relevant job or account details."
                      numberOfLines={7}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={submitContactForm}
                    style={{ backgroundColor: Colors.common.GRAY_DARK }}
                    className="mt-5 w-full flex-row items-center justify-center gap-2 rounded-2xl py-4 active:opacity-90"
                  >
                    <Send size={16} color="#FFFFFF" />
                    <Text className="text-sm font-semibold text-white">
                      Submit Request
                    </Text>
                  </TouchableOpacity>
                </Card>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}
