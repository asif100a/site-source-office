import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DisputeLogo, ScreenShell, StatusPill } from './_components';

export default function DisputesScreen() {
  const router = useRouter();
  const { origin } = useLocalSearchParams<{ origin?: string | string[] }>();
  const originRoute = Array.isArray(origin) ? origin[0] : origin;
  const items = Array.from({ length: 6 });

  return (
    <ScreenShell title="Profile">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        <View className="gap-4">
          {items.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                router.push({
                  pathname: "/screens/profile/dispute-detail",
                  params: {
                    status: index === 5 ? "resolved" : "review",
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
                  <Text className="text-neutral-950 font-extrabold text-base">Hartley Construction</Text>
                  <Text className="text-neutral-500 text-xs font-semibold mt-0.5">May 12 - May 16</Text>
                </View>
              </View>
              <StatusPill label="Under Review" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenShell>
  );
}
