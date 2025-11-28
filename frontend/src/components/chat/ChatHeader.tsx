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
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Sparkles className="h-4 w-4" />
          <span>Shadcn Chat</span>
        </div>
        <p className="text-sm text-muted-foreground">
          ストリーミングで返答を描画するミニマルなチャットUIです。
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              isLoading ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
            )}
          />
          {statusText}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={!canReset || isLoading}
          className="gap-2 py-1.5"
        >
          <RotateCcw className="h-4 w-4" />
          履歴リセット
        </Button>
      </div>
    </header>
  );
};
