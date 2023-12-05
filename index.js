import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import OpenAI from "openai";
import cors from "cors";
import { readFileSync } from "node:fs";
dotenv.config(); // Load environment variables from .env file

const app = express();

app.use(bodyParser.json());

app.use(cors());

// Read the JSON file
const configFile = "assistant.json";
const configData = JSON.parse(readFileSync(configFile, "utf8"));

const port = process.env.PORT || 4000;

const openAi = new OpenAI({ apiKey: process.env.ANUKUL_KEY });

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Invalid message format" });
  }

  const completion = await openAi.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are ${configData.assistantName} AI. Ask me about ${configData.topic}.`,
      },
      { role: "user", content: message },
    ],
  });

  const reply = completion.choices[0].message;

  res.send(reply);
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
