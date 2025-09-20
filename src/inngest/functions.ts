import { inngest } from "./client";
import { openai,
         createAgent, 
         createTool, 
         createNetwork, 
         type Tool, 
         type Message, 
         createState } from "@inngest/agent-kit";
import { Sandbox } from "e2b";
import { getSandboxId, lastAssistantTextMessageContent } from "./utils";
import z from "zod";
import { PROMPT, RESPONSE_PROMPT } from "@/prompt";
import prisma from "@/lib/db";
import { parseAgentOutput } from "./utils";
import { SANDBOX_TIMEOUT } from "./types";

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

  // const parseAgentOutput = (value: Message[]) => {
  //   const output = value[0];
    
  //   if (output.type !== "text") {
  //     return "Fragment";
  //   }
  //   if (Array.isArray(output.content)) {
  //     return output.content.map((txt) => txt.text).join(" ");
  //   } else {
  //     return output.content;
  //   }
  // }


export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {

    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("vedant-lovable-test-1");
      await sandbox.setTimeout(SANDBOX_TIMEOUT);
      return sandbox.sandboxId;
    });

    const previousMessages = await step.run("get-previous-messages", async () => {
      const formattedMessages: Message[] = [];
    
      const messages = await prisma.message.findMany({
        where: {
          projectId: event.data.projectId,
        },
        orderBy: {
          createdAt: "desc", //channge it to asc if AI hallucinates lol
        },
        take: 5,
      });

      for (const message of messages) {
        formattedMessages.push({
          type: "text",
          role: message.role === "ASSISTANT" ? "assistant" : "user",
          content: message.content,
        });
      }

      return formattedMessages.reverse(); //use .()revrese for correct order
    });
 
    const state = createState<AgentState>({
      summary: "",
      files: {},
    },
      { messages: previousMessages },
    );

    

    const codeAgent = createAgent<AgentState>({
      name: "codeAgent",
      description: "An expert coding angent",
      system: PROMPT,
      model: openai({
        model: "x-ai/grok-4-fast:free",
        apiKey: process.env.OPENAI_API_KEY,
        baseUrl: process.env.OPENAI_API_BASE,

        defaultParameters: { temperature: 0.1 },
      }),

      tools: [
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal,", async () => {
              const buffers = { stdout: "", stderr: "" };
              
              try {
                const sandbox = await getSandboxId(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  }
                });
                return result.stdout
              } catch (e) {
                console.error(
                  `Command failed: ${e} \nstddout: ${buffers.stdout}\nstderr: ${buffers.stderr}`,
                );
                return `Command failed: ${e} \nstddout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
              }
            });
          },
        }),

        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              }),
            ),
          }),
          handler: async ({ files }, { step, network }: Tool.Options<AgentState>) => {
            /*
             * {
             * "/app.tsx" : <p>app page</p>,
             * }
             */
            const newFiles = await step?.run("createOrUpdateFiles", async () => {
              try{
                const updatedFiles = network.state.data.files || {};
                const sandbox = await getSandboxId(sandboxId);
                
                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updatedFiles[file.path] = file.content;
                }
                
                return updatedFiles;
              } catch (e) {
                return "Error: " + e;
              }
            });

            if (typeof newFiles == "object") {
              network.state.data.files = newFiles;
            }
          },
        }),
        
        createTool({
          name: "readFiles",
          description: "Read files from the sandbx",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await getSandboxId(sandboxId);
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch (e) {
                return "Error: " + e;
              }
            });
          },
        })
      ],
      lifecycle: {
       onResponse: async ({ result, network }) => {
        const lastAssistantMessageText = lastAssistantTextMessageContent(result);
        if (lastAssistantMessageText && network) {
          if (lastAssistantMessageText.includes("<task_summary>")) {
            network.state.data.summary = lastAssistantMessageText;
          }
        }

        return result;
       },
      },
    });
      
    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      defaultState: state,
      router: async ({ network }) => {
        const summary = network.state.data.summary;
      
        if (summary) {
          return;
        }
        return codeAgent;
      }
    })

    const result = await network.run(event.data.value, { state });

    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "A fragment title generator",
      system: PROMPT,
      model: openai({
        model: "x-ai/grok-4-fast:free",
        apiKey: process.env.OPENAI_API_KEY,
        baseUrl: process.env.OPENAI_API_BASE,
        defaultParameters: { temperature: 0.1 },
      }),
    });

    const responseGenerator = createAgent({
      name: "response-generator",
      description: "A response generator",
      system: RESPONSE_PROMPT,
      model: openai({
        model: "x-ai/grok-4-fast:free",
        apiKey: process.env.OPENAI_API_KEY,
        baseUrl: process.env.OPENAI_API_BASE,
        defaultParameters: { temperature: 0.1 },
      }),
    });

    const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(result.state.data.summary);
    const { output: responseOutput } = await responseGenerator.run(result.state.data.summary);

    // Alternate version                              | 
    // const generateFragmentTItle = () => {          |
    //   const output = fragmentTitleOutput[0];       |  
    // }                                             \/


    const isError = 
      !result.state.data.summary || Object.keys(result.state.data.files || {}).length === 0;

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandboxId(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    await step.run("save-result", async() => {
      if(isError) {
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "Error: " + result.state.data.summary, //something went wrong, pls try again,
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }
      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: parseAgentOutput(responseOutput),
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              title: parseAgentOutput(fragmentTitleOutput),
              files: result.state.data.files,
            }
          }
        },
      });
    })
      
    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  },
);