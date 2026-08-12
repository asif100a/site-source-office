import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, CircleAlert } from 'lucide-react-native';
import {
  Avatar,
  Card,
  DisputeSummary,
  proofPhoto,
  ScreenShell,
  StatusPill,
  WorkSummaryList,
} from './_components';

export default function DisputeDetailScreen() {
  const { status } = useLocalSearchParams<{ status?: string }>();
  const resolved = status === 'resolved';

  return (
    <ScreenShell title="Support Details" navigateBack={() => {
      router.back();
    }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 34 }}>
        <DisputeSummary resolved={resolved} />

        {resolved ? (
          <Card className="p-6 items-center mb-4">
            <View className="w-14 h-14 rounded-full bg-orange-100 items-center justify-center mb-3">
              <View className="w-10 h-10 rounded-full bg-orange-400 items-center justify-center">
                <Check size={25} color="#FFFFFF" strokeWidth={3} />
              </View>
            </View>
            <Text className="text-slate-900 font-extrabold text-base">Support Resolved</Text>
            <Text className="text-neutral-500 text-sm text-center mt-2 leading-5">
              After Reviewing The Case, The Admin Approved Your Invoice Payment. Your Payment Has Been Released Successfully.
            </Text>
          </Card>
        ) : (
          <>
            <Card className="p-4 mb-4">
              <Text className="text-slate-900 font-extrabold text-base mb-3">Support Information</Text>
              <View className="gap-3">
                <View className="flex-row justify-between">
                  <Text className="text-neutral-500 text-xs">Raised By</Text>
                  <Text className="text-neutral-600 text-xs">Employer</Text>
                </View>
                <View className="h-px bg-neutral-100" />
                <View className="flex-row justify-between">
                  <Text className="text-neutral-500 text-xs">Raised Date</Text>
                  <Text className="text-neutral-600 text-xs">May 17</Text>
                </View>
                <View className="h-px bg-neutral-100" />
                <View className="flex-row justify-between items-center">
                  <Text className="text-neutral-500 text-xs">Current Status</Text>
                  <StatusPill label="Under Review" />
                </View>
              </View>
            </Card>

            <Card className="p-4 mb-4">
              <View className="flex-row items-center gap-2 mb-4">
                <CircleAlert size={18} color="#FFBA08" fill="#FFBA08" />
                <Text className="text-slate-900 font-extrabold text-base">Employer Reason</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Avatar uri="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=80&h=80&fit=crop" size={32} />
                <View>
                  <Text className="text-neutral-900 text-sm font-semibold">ABC Construction Ltd</Text>
                  <Text className="text-neutral-700 text-sm mt-1">"Worker missed Friday shift."</Text>
                </View>
              </View>
            </Card>

            <Card className="p-4 mb-4">
              <View className="flex-row items-center gap-2 mb-3">
                <CircleAlert size={18} color="#FFBA08" fill="#FFBA08" />
                <Text className="text-slate-900 font-extrabold text-base">Worker Reason</Text>
              </View>
              <Text className="text-neutral-700 text-sm mb-4">I completed all assigned tasks before leaving site</Text>
              <Text className="text-slate-900 font-extrabold text-sm mb-3">Uploaded proof</Text>
              <Image source={{ uri: proofPhoto }} className="w-44 h-24 rounded-xl" />
            </Card>
          </>
        )}

        <WorkSummaryList resolved={resolved} />

        {resolved && (
          <Card className="p-4">
            <Text className="text-slate-900 font-extrabold text-base mb-3">Admin Resolution Note</Text>
            <Text className="text-neutral-700 text-sm leading-5">
              Worker provided sufficient proof of completed work. Full payment approved.
            </Text>
          </Card>
        )}
      </ScrollView>
    </ScreenShell>
  );
}
