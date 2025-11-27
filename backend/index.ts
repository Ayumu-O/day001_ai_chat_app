import { GoogleGenAI } from "@google/genai";
import { Hono } from "hono";

const app = new Hono();

const gemini = new GoogleGenAI({});

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

app.post("/gemini/stream", async (c) => {
  const { history, message } = await c.req.json();
  if (!history) {
    return c.json({ error: "history is required" }, 400);
  }
  if (!message) {
    return c.json({ error: "message is required" }, 400);
  }

  const chat = gemini.chats.create({
    model: "gemini-2.5-flash",
    history: history,
  });

  const stream = await chat.sendMessageStream({
    message: message,
  });

  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(chunk.text);
        }
        controller.close();
      },
    }),
    {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    }
  );
});

export default {
  port: 3000,
  fetch: app.fetch,
};
