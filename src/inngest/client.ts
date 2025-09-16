import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "lovable-clone",
  signingKey: process.env.INNGEST_SIGNING_KEY,
});
