import { Slot } from "expo-router";
import { ScrollView } from "react-native";
import WorkerWebFooter from "@/components/layout/WorkerWebFooter";
import WorkerWebNavbar from "@/components/layout/WorkerWebNavbar";

export default function WorkerTabsWebLayout() {
  return (
    <ScrollView className="flex-1 bg-neutral-50">
      <WorkerWebNavbar />
      <Slot />
      <WorkerWebFooter />
    </ScrollView>
  );
}
