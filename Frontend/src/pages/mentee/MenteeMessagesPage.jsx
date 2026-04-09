import { SectionHeading } from "../../components/common/SectionHeading";
import { ChatWindow } from "../../components/chat/ChatWindow";
import { useSearchParams } from "react-router-dom";

export default function MenteeMessagesPage() {
  const [searchParams] = useSearchParams();
  const initialUserId = searchParams.get("userId") || "";

  return (
    <div>
      <SectionHeading title="Messages" description="Stay connected with accepted mentors through direct chat." />
      <ChatWindow initialUserId={initialUserId} />
    </div>
  );
}
