import { type RefObject } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { type Message } from "@/types/chat";

import { ChatBubble } from "./ChatBubble";

type ChatHistoryProps = {
  messages: Message[];
  streamData: string;
  endRef: RefObject<HTMLDivElement | null>;
};

export const ChatHistory = ({
  messages,
  streamData,
  endRef,
}: ChatHistoryProps) => {
  return (
    <ScrollArea className="h-full bg-muted/40 px-4 py-3">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <ChatBubble key={`${message.role}-${index}`} message={message} />
        ))}

        {streamData && (
          <ChatBubble
            message={{ role: "model", content: streamData }}
            isStreaming
          />
        )}

        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
};
