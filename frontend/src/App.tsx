import { useEffect, useRef } from "react";

import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatCard } from "@/components/ChatCard";
import { GradientBackground } from "@/components/GradientBackground";
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
    <GradientBackground>
      {/* 縦を画面いっぱい使う */}
      <div className="h-screen flex flex-col gap-4 mx-auto max-w-5xl px-4 py-4">
        {/* flex flex-col により以下の2つのコンポーネントは縦に並ぶ */}
        {/* チャットヘッダー(ステータスやリセットボタンの表示) */}
        <ChatHeader
          statusText={statusText}
          onReset={resetHistory}
          canReset={canReset}
          isLoading={isLoading}
        />

        {/* チャットのメインエリア */}
        {/* max-h-full により残りを目一杯使う */}
        <ChatCard
          className="h-full max-h-full overflow-y-hidden"
          messages={messages}
          streamData={streamData}
          endRef={messagesEndRef}
          input={input}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          isLoading={isLoading}
        />
      </div>
    </GradientBackground>
  );
}

export default App;
