import { inngest } from "./client";
import { openai, createAgent } from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    
    const summarizer = createAgent({
      name: "code-agent",
      system: "you are an expert nedt.js developer, you write readable, maintaainable code. you write simple Next.js & React snippets.",
      model: openai({
        model: "provider-3/gpt-4",
        apiKey: process.env.OPENAI_API_KEY,
        baseUrl: process.env.OPENAI_API_BASE
      })
    });

    try {
      const { output } = await summarizer.run(
        `Write a code snippet: ${event.data.value}`,
      );
      console.log(output);
      return { output };
    } catch (error) {
      console.error("AI Job Error:", error);
      throw error;
    }
  },
);
