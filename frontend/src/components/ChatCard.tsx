import {
  type FormEventHandler,
  type KeyboardEventHandler,
  type RefObject,
} from "react";

import { ChatCardContent } from "@/components/chat/ChatCardContent";
import { ChatCardFooter } from "@/components/chat/ChatCardFooter";
import { ChatCardHeader } from "@/components/chat/ChatCardHeader";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type Message } from "@/types/chat";

type ChatCardProps = {
  className?: string;
  messages: Message[];
  streamData: string;
  endRef: RefObject<HTMLDivElement | null>;
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onKeyDown: KeyboardEventHandler<HTMLTextAreaElement>;
  isLoading: boolean;
};

// チャットのメインエリア全体を表すコンポーネント
export const ChatCard = ({
  className,
  messages,
  streamData,
  endRef,
  input,
  onInputChange,
  onSubmit,
  onKeyDown,
  isLoading,
}: ChatCardProps) => {
  return (
    <Card
      className={cn(
        "flex flex-col border-border/70 shadow-xl backdrop-blur",
        className
      )}
    >
      <ChatCardHeader className={"pb-4"} />
      <ChatCardContent
        className={"grow max-h-full overflow-y-hidden pb-6"}
        messages={messages}
        streamData={streamData}
        endRef={endRef}
      />
      <ChatCardFooter
        className={"pt-4"}
        input={input}
        onInputChange={onInputChange}
        onSubmit={onSubmit}
        onKeyDown={onKeyDown}
        isLoading={isLoading}
      />
    </Card>
  );
};
