import { Bot, Loader2, UserRound } from "lucide-react";

import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { cn } from "@/lib/utils";
import { type Message } from "@/types/chat";

type ChatBubbleProps = {
  message: Message;
  isStreaming?: boolean;
};

export const ChatBubble = ({ message, isStreaming }: ChatBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex items-start gap-3 text-sm", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot className="w-4" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed shadow-sm ring-1 ring-border/60",
          isUser ? "ml-auto bg-primary text-primary-foreground" : "bg-card text-foreground"
        )}
      >
        <div className="markdown-body">
          <MarkdownRenderer>{message.content}</MarkdownRenderer>
        </div>

        {isStreaming && (
          <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
            <Loader2 className="w-3 animate-spin" />
            <span>ストリーミング中</span>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
          <UserRound className="w-4" />
        </div>
      )}
    </div>
  );
};
