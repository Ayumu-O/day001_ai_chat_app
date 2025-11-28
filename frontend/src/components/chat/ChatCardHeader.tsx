import { Bot } from "lucide-react";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ChatCardHeaderProps = {
  className?: string;
};

export const ChatCardHeader = ({ className }: ChatCardHeaderProps) => {
  return (
    <CardHeader className={cn(className)}>
      <CardTitle className="flex items-center gap-2 text-xl">
        <Bot className="w-5 text-primary" />
        <span>会話</span>
      </CardTitle>
      <CardDescription>
        これまでの履歴と一緒にメッセージを送信し、モデルの返答を表示します。
      </CardDescription>
    </CardHeader>
  );
};
