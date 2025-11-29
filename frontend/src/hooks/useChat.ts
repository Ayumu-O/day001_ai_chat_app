import { type FormEvent, type KeyboardEvent, useCallback, useState } from "react";

import { type Message } from "@/types/chat";

const API_URL = "http://localhost:3000/chat/stream";

const shouldSkipSend = (input: string, isLoading: boolean) => !input.trim() || isLoading;

const buildRequest = (history: Message[], message: string): RequestInit => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ history, message }),
});

const streamResponseText = async (
  response: Response,
  onChunk: (chunk: string) => void
): Promise<string> => {
  const reader = response.body?.getReader();
  if (!reader) return "";

  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = (await reader.read()) ?? { done: true, value: null };
    if (done) break;

    const text = decoder.decode(value, { stream: true });
    onChunk(text);
    fullText += text;
  }

  return fullText;
};

const fetchChatStream = async (history: Message[], message: string) => {
  const response = await fetch(API_URL, buildRequest(history, message));
  if (!response.ok) {
    throw new Error(`リクエストに失敗しました: ${response.status}`);
  }
  return response;
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streamData, setStreamData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const appendMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const handleStream = useCallback(async (response: Response) => {
    return streamResponseText(response, (chunk) => {
      setStreamData((prev) => prev + chunk);
    });
  }, []);

  const handleError = useCallback((error: unknown) => {
    console.error("Error:", error);
    appendMessage({
      role: "model",
      content: "エラーが発生しました。もう一度お試しください。",
    });
  }, [appendMessage]);

  const sendMessage = useCallback(async () => {
    if (shouldSkipSend(input, isLoading)) return;

    const history = messages;
    const userMessage = input.trim();

    appendMessage({ role: "user", content: userMessage });
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetchChatStream(history, userMessage);
      const fullText = await handleStream(response);
      appendMessage({ role: "model", content: fullText });
    } catch (error) {
      handleError(error);
    } finally {
      setStreamData("");
      setIsLoading(false);
    }
  }, [appendMessage, handleError, handleStream, input, isLoading, messages]);

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
