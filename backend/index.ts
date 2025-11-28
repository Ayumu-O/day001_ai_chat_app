import { GoogleGenAI } from "@google/genai";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";

const APP_URL = "http://localhost:5173";

const chatRequestSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(["user", "model"]),
      content: z.string(),
    })
  ),
  message: z.string(),
});

const app = new Hono();

const gemini = new GoogleGenAI({});

app.use(
  "*",
  cors({
    origin: APP_URL,
    allowHeaders: ["Content-Type"],
    allowMethods: ["GET", "POST", "OPTIONS"],
  })
);

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

app.post("/chat/stream", zValidator("json", chatRequestSchema), async (c) => {
  const { history, message } = c.req.valid("json");

  const chat = gemini.chats.create({
    model: "gemini-2.5-flash",
    history: history.map((msg) => {
      return {
        role: msg.role,
        parts: [{ text: msg.content }],
      };
    }),
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
