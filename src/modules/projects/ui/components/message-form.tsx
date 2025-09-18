"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";
import { ArrowUpIcon, Loader2Icon, Brain } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Usage } from "./usage";

interface Props {
  projectId: string;
}

const GlassEffect: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className={`relative overflow-hidden rounded-3xl ${className}`}>
    <div
      className="absolute inset-0 z-0 rounded-3xl"
      style={{ backdropFilter: "blur(14px)", background: "rgba(255, 255, 255, 0.15)" }}
    />
    <div
      className="absolute inset-0 z-10 rounded-3xl"
      style={{
        boxShadow:
          "inset 2px 2px 6px rgba(255,255,255,0.35), inset -2px -2px 6px rgba(0,0,0,0.1)",
      }}
    />
    <div className="relative z-20">{children}</div>
  </div>
);

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Message cannot be empty" })
    .max(1000, { message: "Message cannot be longer than 1000 characters" }),
});

export const MessageForm = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isFocused, setIsFocused] = useState(false);
  const [deepThinking, setDeepThinking] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: "" },
    mode: "onChange",
  });

  const { data: usage } = useQuery(trpc.usage.status.queryOptions());

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        form.reset();
        queryClient.invalidateQueries(trpc.messages.getMany.queryOptions({ projectId }));
        queryClient.invalidateQueries(trpc.usage.status.queryOptions());
      },
      onError: () => toast.error("Failed to create message"),
    })
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createMessage.mutateAsync({ value: values.value, projectId });
  };

  const isPending = createMessage.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;

  return (
    <Form {...form}>
      {usage && <Usage points={usage.remainingPoints} msBeforeNext={usage.msBeforeNext} />}

      <section className="flex flex-col items-center w-full">
        <GlassEffect
          className={cn(
            "w-full max-w-3xl p-6 transition-all duration-500 border border-primary/20 shadow-lg",
            isFocused && "scale-[1.01] ring-2 ring-primary/40"
          )}
        >
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 relative">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <TextareaAutosize
                  {...field}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  disabled={isPending}
                  minRows={2}
                  maxRows={8}
                  placeholder="Ask a question or start a conversation..."
                  className={cn(
                    "w-full resize-none border-none bg-transparent text-foreground placeholder:text-muted-foreground focus:ring-0 outline-none transition-all duration-300",
                    "scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent hover:scrollbar-thumb-primary/70"
                  )}
                />
              )}
            />

            <div className="flex items-center justify-between gap-x-2">
              {/* Deep Thinking Toggle */}
              <button
                type="button"
                onClick={() => setDeepThinking((prev) => !prev)}
                className={cn(
                  "relative group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all",
                  "backdrop-blur-md border shadow-sm",
                  deepThinking
                    ? "bg-primary text-primary-foreground border-primary/50 shadow-md scale-105"
                    : "bg-white/20 dark:bg-white/10 border-white/20 text-muted-foreground hover:bg-white/30"
                )}
              >
                <Brain
                  className={cn(
                    "size-3 transition-transform duration-300",
                    deepThinking ? "rotate-12 text-primary-foreground" : "text-primary"
                  )}
                />
                Deep Thinking
                <span className="absolute bottom-full mb-1 hidden group-hover:block text-[9px] text-muted-foreground bg-white/80 dark:bg-black/80 px-2 py-0.5 rounded-md shadow-sm whitespace-nowrap">
                  use for more in-depth reasoning
                </span>
              </button>

              {/* Submit */}
              <div className="flex items-center gap-x-2">
                <div className="text-[10px] text-muted-foreground font-sans">
                  <kbd className="inline-flex h-5 select-none items-center gap-x-1 rounded border border-primary/20 bg-primary/10 px-1.5 font-mono text-[10px] font-medium backdrop-blur-sm">
                    <span className="text-primary font-bold">⌘</span>
                    <span className="text-primary font-bold"> + Enter</span>
                  </kbd>
                </div>

                <Button
                  className={cn(
                    "size-8 rounded-full transition-all hover:scale-105",
                    isButtonDisabled
                      ? "bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/20 shadow-sm opacity-50 cursor-not-allowed hover:scale-100 hover:bg-white/30"
                      : "bg-primary text-primary-foreground shadow-md hover:bg-primary/40"
                  )}
                  disabled={isButtonDisabled}
                  onClick={form.handleSubmit(onSubmit)}
                >
                  {isPending ? (
                    <Loader2Icon className="animate-spin size-4 text-primary bg-primary" />
                  ) : (
                    <ArrowUpIcon className="size-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </GlassEffect>
      </section>

      {/* Scrollbar tweaks */}
      <style jsx global>{`
        textarea::-webkit-scrollbar {
          width: 8px;
        }
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        textarea::-webkit-scrollbar-thumb {
          background: rgba(96, 165, 250, 0.5);
          border-radius: 9999px;
        }
        textarea::-webkit-scrollbar-thumb:hover {
          background: rgba(96, 165, 250, 0.7);
        }
      `}</style>
    </Form>
  );
};

export default MessageForm;
