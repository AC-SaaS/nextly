import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "bbcai-app", // can be any unique identifier for your app
  signingKey: process.env.INNGEST_SIGNING_KEY!,
});
