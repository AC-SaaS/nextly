import { Sandbox } from "e2b";

export async function getSandboxId(sandboxId: string) {
  const sandbox = await Sandbox.connect(sandboxId);
  return sandbox;
}
