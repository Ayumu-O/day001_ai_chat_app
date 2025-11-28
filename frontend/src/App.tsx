import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3000/chat/stream";

type Message = {
  role: "user" | "model";
  content: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streamData, setStreamData] = useState(""); // ストリームデータを一時的に格納
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 最後のメッセージまでスクロール（必須機能ではないです）
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ユーザからメッセージが送信された際の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const history = messages;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ history: history, message: input }),
      });
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = (await reader?.read()) || {
          done: true,
          value: null,
        };
        if (done) break; // ストリームの終了が宣言されたらループ終了
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

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.role === "user" ? "user" : "assistant"
            }`}
          >
            <div className="message-content">{message.content}</div>
          </div>
        ))}
        {streamData && (
          <div className="message ai">
            <div className="message-content">{streamData}</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          送信
        </button>
      </form>
    </div>
  );
}

export default App;
