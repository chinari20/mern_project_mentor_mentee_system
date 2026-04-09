import { SectionHeading } from "../../components/common/SectionHeading";
import { ChatWindow } from "../../components/chat/ChatWindow";
import { useSearchParams } from "react-router-dom";

export default function MentorMessagesPage() {
  const [searchParams] = useSearchParams();
  const initialUserId = searchParams.get("userId") || "";

  return (
    <div>
      <SectionHeading title="Messages" description="Respond to mentees and keep conversations moving." />
      <ChatWindow initialUserId={initialUserId} />
    </div>
  );
}
