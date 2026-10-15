import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ChatListScreen from "@/components/modules/common/chat/ChatListScreen";
import CommonHeader from "@/components/modules/common/CommonHeader";
import { useLocalSearchParams } from "expo-router";

export default function EmployerChatsScreen() {
  const { jobId, origin } = useLocalSearchParams<{ jobId?: string; origin?: string }>();
  const chatOrigin = origin === "worker" ? "worker" : "employer";

  return (
    <ScreenWrapper>
      <ChatListScreen
        origin={chatOrigin}
        jobId={Array.isArray(jobId) ? jobId[0] : jobId}
        header={<CommonHeader headerTitle="Chats" withBackButton />}
      />
    </ScreenWrapper>
  );
}
