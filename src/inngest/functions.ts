import { inngest } from "./client";
import { openai, createAgent } from "@inngest/agent-kit";

import { Sandbox } from "e2b";
import { getSandboxId } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {

    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("vedant-lovable-test-1");
      return sandbox.sandboxId;
    });
    
    const summarizer = createAgent({
      name: "code-agent",
      system: "you are an expert nedt.js developer, you write readable, maintaainable code. you write simple Next.js & React snippets.",
      model: openai({
        model: "provider-3/gpt-4",
        apiKey: process.env.OPENAI_API_KEY,
        baseUrl: process.env.OPENAI_API_BASE
      })
    });

    const { output } = await summarizer.run(
      `Write a code snippet: ${event.data.value}`,
    );

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandboxId(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    return { output, sandboxUrl };
  },
);
