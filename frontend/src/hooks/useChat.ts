import { type FormEvent, type KeyboardEvent, useCallback, useState } from "react";

import { type Message } from "@/types/chat";

const API_URL = "http://localhost:3000/chat/stream";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streamData, setStreamData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const history = messages;
    const userMessage = input;

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, message: userMessage }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = (await reader?.read()) ?? { done: true, value: null };
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        setStreamData((prev) => prev + text);
        fullText += text;
      }

      setMessages((prev) => [...prev, { role: "model", content: fullText }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "エラーが発生しました。もう一度お試しください。" },
      ]);
    } finally {
      setStreamData("");
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      sendMessage();
    },
    [sendMessage]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  const resetHistory = useCallback(() => {
    if (isLoading) return;
    setMessages([]);
    setStreamData("");
  }, [isLoading]);

  const statusText = isLoading ? "応答を生成中..." : "待機中";
  const canReset = messages.length > 0 || Boolean(streamData);

  return {
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
  };
};

export type UseChatReturn = ReturnType<typeof useChat>;
