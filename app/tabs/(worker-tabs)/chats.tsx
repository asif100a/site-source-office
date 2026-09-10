import ScreenHeader from "@/components/layout/ScreenHeader";
import ChatListScreen from "@/components/modules/common/chat/ChatListScreen";

export default function WorkerChatsScreen() {
  return <ChatListScreen origin="worker" header={<ScreenHeader />} />;
}
