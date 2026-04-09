import { Loader } from "../../components/common/Loader";
import { SectionHeading } from "../../components/common/SectionHeading";
import { ChatWindow } from "../../components/chat/ChatWindow";
import { useFetch } from "../../hooks/useFetch";
import { dataService } from "../../services/dataService";

export default function MentorMessagesPage() {
  const { data, loading } = useFetch(() => dataService.getConversations(), []);

  if (loading) return <Loader />;

  return (
    <div>
      <SectionHeading title="Messages" description="Respond to mentees and keep conversations moving." />
      <ChatWindow conversations={data || []} />
    </div>
  );
}
