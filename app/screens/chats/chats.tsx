import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ChatListScreen from "@/components/modules/common/chat/ChatListScreen";
import CommonHeader from "@/components/modules/common/CommonHeader";

export default function EmployerChatsScreen() {
  return (
    <ScreenWrapper>
      <ChatListScreen
        origin="employer"
        header={<CommonHeader headerTitle="Chats" withBackButton />}
      />
    </ScreenWrapper>
  );
}
