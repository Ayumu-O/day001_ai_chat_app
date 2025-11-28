import { type RefObject } from "react";

import { ChatHistory } from "@/components/chat/ChatHistory";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type Message } from "@/types/chat";

type ChatCardContentProps = {
  className?: string;
  messages: Message[];
  streamData: string;
  endRef: RefObject<HTMLDivElement | null>;
};

export const ChatCardContent = ({
  className,
  messages,
  streamData,
  endRef,
}: ChatCardContentProps) => {
  return (
    <CardContent className={cn(className)}>
      <ChatHistory
        messages={messages}
        streamData={streamData}
        endRef={endRef}
      />
    </CardContent>
  );
};
