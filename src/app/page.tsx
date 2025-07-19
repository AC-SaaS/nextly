"use client"

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const page = () => {

  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess: () => {
      toast.success("Background job invoked successfully");
    }
  }));
    

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Button disabled={invoke.isPending} onClick={() => invoke.mutate({ text: "John" })}>
        Invoke Background Job
      </Button>
    </div>
  )
}

export default page
