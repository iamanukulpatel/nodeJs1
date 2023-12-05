import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import OpenAI from "openai";
import cors from "cors";
dotenv.config(); // Load environment variables from .env file

const app = express();
// Parse various different custom JSON types as JSON
app.use(bodyParser.json());

app.use(cors());

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
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: message },
    ],
  });

  const reply = completion.choices[0].message;

  res.send(reply);
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
