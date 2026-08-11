import { Slot } from "expo-router";
import { ScrollView, View } from "react-native";
import EmployerWebNavbar from "@/components/layout/EmployerWebNavbar";
import EmployerWebFooter from "@/components/layout/EmployerWebFooter";

export default function EmployerTabsWebLayout() {
  return (
    <ScrollView className="flex-1 bg-neutral-50">
      <EmployerWebNavbar />
      <View className="flex-1">
        <Slot />
      </View>
      <EmployerWebFooter />
    </ScrollView>
  );
}
