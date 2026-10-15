import WebChatWorkspace from "@/components/modules/common/chat/WebChatWorkspace";
import { useLocalSearchParams } from "expo-router";

export default function EmployerChatsWebScreen() {
  const { jobId, origin } = useLocalSearchParams<{ jobId?: string; origin?: string }>();
  return (
    <WebChatWorkspace
      origin={origin === "worker" ? "worker" : "employer"}
      jobId={Array.isArray(jobId) ? jobId[0] : jobId}
    />
  );
}
