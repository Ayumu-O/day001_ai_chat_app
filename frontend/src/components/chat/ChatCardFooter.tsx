import { type FormEventHandler, type KeyboardEventHandler } from "react";

import { ChatForm } from "@/components/chat/ChatForm";
import { CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ChatCardFooterProps = {
  className?: string;
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onKeyDown: KeyboardEventHandler<HTMLTextAreaElement>;
  isLoading: boolean;
};

export const ChatCardFooter = ({
  className,
  input,
  onInputChange,
  onSubmit,
  onKeyDown,
  isLoading,
}: ChatCardFooterProps) => {
  return (
    <CardFooter className={cn(className)}>
      <ChatForm
        input={input}
        onInputChange={onInputChange}
        onSubmit={onSubmit}
        onKeyDown={onKeyDown}
        isLoading={isLoading}
      />
    </CardFooter>
  );
};
