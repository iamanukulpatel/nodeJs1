import OpenAI from "openai";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(bodyParser.json());
dotenv.config();
app.use(cors());

const port = process.env.PORT || 4000;

const openai = new OpenAI({
  apiKey: process.env.ANUKUL_KEY,
});

let data;

app.post(`/chat`, async (req, res) => {
  const { message } = req.body;

  // if (!message || typeof message !== "string") {
  //   return res.send("Invalid message type");
  // }

  // Step 1: Create an Assistant
  const myAssistant = await openai.beta.assistants.create({
    model: "gpt-4",
    instructions:
      "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
    name: "Math Tutor anukul",
    tools: [
      {
        type: "code_interpreter",
      },
    ],
  });
  console.log("This is the assistant object: ", myAssistant, "\n");

  // Step 2: Create a Thread
  const myThread = await openai.beta.threads.create();
  console.log("This is the thread object: ", myThread, "\n");

  let thread_id;
  let run_id;
  // Step 3: Add a Message to a Thread
  const myThreadMessage = await openai.beta.threads.messages.create(
    (thread_id = myThread.id),
    {
      role: "user",
      content: "hi",
    }
  );
  console.log("This is the message object: ", myThreadMessage, "\n");

  // Step 4: Run the Assistant
  const myRun = await openai.beta.threads.runs.create(
    (thread_id = myThread.id),
    {
      assistant_id: myAssistant.id,
      instructions: "Please address the user as Sai.",
    }
  );
  console.log("This is the run object: ", myRun, "\n");

  // Step 5: Periodically retrieve the Run to check on its status to see if it has moved to completed
  const retrieveRun = async () => {
    let keepRetrievingRun;

    while (myRun.status !== "completed") {
      keepRetrievingRun = await openai.beta.threads.runs.retrieve(
        (thread_id = myThread.id),
        (run_id = myRun.id)
      );

      console.log(`Run status: ${keepRetrievingRun.status}`);

      if (keepRetrievingRun.status === "completed") {
        console.log("\n");
        break;
      }
    }
  };
  retrieveRun();

  // Step 6: Retrieve the Messages added by the Assistant to the Thread

  try {
    const waitForAssistantMessage = async () => {
      await retrieveRun();

      const allMessages = await openai.beta.threads.messages.list(
        (thread_id = myThread.id)
      );

      console.log("User: ", myThreadMessage.content[0].text.value);
      const reply = allMessages.data[0];
      console.log(reply);
      data = reply;
      res.send(data);
    };
    waitForAssistantMessage();
  } catch (error) {
    res.send(error);
  }
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
