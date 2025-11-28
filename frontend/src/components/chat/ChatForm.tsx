import { Loader2, Send } from "lucide-react";
import { type FormEventHandler, type KeyboardEventHandler } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ChatFormProps = {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onKeyDown: KeyboardEventHandler<HTMLTextAreaElement>;
  isLoading: boolean;
};

export const ChatForm = ({
  input,
  onInputChange,
  onSubmit,
  onKeyDown,
  isLoading,
}: ChatFormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-3">
      <Textarea
        value={input}
        onChange={(event) => onInputChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="質問やメモを入力..."
        disabled={isLoading}
        className="w-full resize-none bg-card"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>Enterで送信、Shift + Enterで改行</p>
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              送信中...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              送信
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
