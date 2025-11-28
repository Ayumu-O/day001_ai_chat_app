import { RotateCcw, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChatHeaderProps = {
  statusText: string;
  onReset: () => void;
  canReset: boolean;
  isLoading: boolean;
};

export const ChatHeader = ({
  statusText,
  onReset,
  canReset,
  isLoading,
}: ChatHeaderProps) => {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <ChatTitleAndDescription />
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge isLoading={isLoading} statusText={statusText} />
        <ChatResetButton onReset={onReset} disabled={!canReset} />
      </div>
    </header>
  );
};

const ChatTitleAndDescription = () => {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <Sparkles className="h-4 w-4" />
        <span>Shadcn Chat</span>
      </div>
      <p className="text-sm text-muted-foreground">
        ストリーミングで返答を描画するミニマルなチャットUIです。
      </p>
    </div>
  );
};

const StatusBadge = ({
  isLoading,
  statusText,
}: {
  isLoading: boolean;
  statusText: string;
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm",
        isLoading ? "animate-pulse" : ""
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          isLoading ? "bg-amber-500" : "bg-emerald-500"
        )}
      />
      {statusText}
    </div>
  );
};

const ChatResetButton = ({
  onReset,
  disabled,
}: {
  onReset: () => void;
  disabled: boolean;
}) => {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onReset}
      disabled={disabled}
      className="gap-2 py-1.5"
    >
      <RotateCcw className="h-4 w-4" />
      履歴リセット
    </Button>
  );
};
