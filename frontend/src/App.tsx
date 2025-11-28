import { Bot, Loader2, Send, Sparkles, UserRound } from "lucide-react";
import {
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import "./App.css";

const API_URL = "http://localhost:3000/chat/stream";

type Message = {
  role: "user" | "model";
  content: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streamData, setStreamData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom, streamData]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const history = messages;
    const userMessage = input;

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ history, message: userMessage }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = (await reader?.read()) || {
          done: true,
          value: null,
        };

        if (done) break;

        const text = decoder.decode(value, { stream: true });
        setStreamData((prev) => prev + text);
        fullText += text;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: fullText,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: "エラーが発生しました。もう一度お試しください。",
        },
      ]);
    } finally {
      setStreamData("");
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const statusText = isLoading ? "応答を生成中..." : "待機中";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.08),transparent_30%)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
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
          <div className="flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                isLoading ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
              )}
            />
            {statusText}
          </div>
        </header>

        <Card className="border-border/70 shadow-xl backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Bot className="h-5 w-5 text-primary" />
              <span>会話</span>
            </CardTitle>
            <CardDescription>
              これまでの履歴と一緒にメッセージを送信し、モデルの返答を表示します。
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-6">
            <ScrollArea className="h-[520px] bg-muted/40 px-4 py-3">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <ChatBubble key={index} message={message} />
                ))}
                {streamData && (
                  <ChatBubble
                    message={{ role: "model", content: streamData }}
                    isStreaming
                  />
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="pt-4">
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col gap-3"
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
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
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default App;

type ChatBubbleProps = {
  message: Message;
  isStreaming?: boolean;
};

function ChatBubble({ message, isStreaming }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-start gap-3 text-sm",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed shadow-sm ring-1 ring-border/60",
          isUser
            ? "ml-auto bg-primary text-primary-foreground"
            : "bg-card text-foreground"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {isStreaming && (
          <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>ストリーミング中</span>
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
          <UserRound className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
