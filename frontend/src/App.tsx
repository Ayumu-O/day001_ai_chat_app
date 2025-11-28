import { Bot } from "lucide-react";
import { useEffect, useRef } from "react";

import { ChatForm } from "@/components/chat/ChatForm";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatHistory } from "@/components/chat/ChatHistory";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useChat } from "@/hooks/useChat";
import "./App.css";

function App() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const {
    messages,
    input,
    setInput,
    streamData,
    isLoading,
    statusText,
    canReset,
    handleSubmit,
    handleKeyDown,
    resetHistory,
  } = useChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamData]);

  return (
    <div className="bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.08),transparent_30%)]">
      <div className="h-screen flex flex-col gap-4 mx-auto max-w-5xl px-4 py-4">
        <ChatHeader
          statusText={statusText}
          onReset={resetHistory}
          canReset={canReset}
          isLoading={isLoading}
        />

        <Card className="h-full max-h-full overflow-y-hidden flex flex-col border-border/70 shadow-xl backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Bot className="w-5 text-primary" />
              <span>会話</span>
            </CardTitle>
            <CardDescription>
              これまでの履歴と一緒にメッセージを送信し、モデルの返答を表示します。
            </CardDescription>
          </CardHeader>

          <CardContent className="grow max-h-full overflow-y-hidden pb-6">
            <ChatHistory
              messages={messages}
              streamData={streamData}
              endRef={messagesEndRef}
            />
          </CardContent>

          <CardFooter className="pt-4">
            <ChatForm
              input={input}
              onInputChange={setInput}
              onSubmit={handleSubmit}
              onKeyDown={handleKeyDown}
              isLoading={isLoading}
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default App;
