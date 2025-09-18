"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { PROJECT_TEMPLATES } from "../../constants";
import { useClerk } from "@clerk/nextjs";
import { Brain } from "lucide-react";

// Liquid glass wrapper
const GlassEffect: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className={`relative overflow-hidden rounded-3xl ${className}`}>
    {/* Backdrop blur */}
    <div
      className="absolute inset-0 z-0 rounded-3xl"
      style={{
        backdropFilter: "blur(14px)",
        background: "rgba(255, 255, 255, 0.15)",
      }}
    />
    {/* Inner shadows */}
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
    .max(5000, { message: "Message cannot be longer than 5000 characters" }),
});

export const ProjectForm = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const clerk = useClerk();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: "" },
    mode: "onChange",
  });

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
        router.push(`/projects/${data.id}`);
        queryClient.invalidateQueries(trpc.usage.status.queryOptions());
      },
      onError: (error) => {
        toast.error(error.message);
        if (error.data?.code === "UNAUTHORIZED") clerk.openSignIn();
        if (error.data?.code === "TOO_MANY_REQUESTS") router.push("/pricing");
      },
    })
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createProject.mutateAsync({ value: values.value });
  };

  const onSelect = (value: string) => {
    form.setValue("value", value, { shouldDirty: true, shouldValidate: true, shouldTouch: true });
  };

  const [isFocused, setIsFocused] = useState(false);
  const isPending = createProject.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;
  const [deepThinking, setDeepThinking] = useState(false);

  return (
    <Form {...form}>
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
                  minRows={3}
                  maxRows={12}
                  placeholder="Ask a question or start a conversation..."
                  className={cn(
                    "w-full resize-none border-none bg-transparent text-foreground placeholder:text-muted-foreground focus:ring-0 outline-none transition-all duration-300",
                    "scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent hover:scrollbar-thumb-primary/70"
                  )}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)(e);
                    }
                  }}
                  style={{
                    scrollbarColor: "#60a5fa66 transparent",
                  }}
                />
              )}
            />

            <div className="flex items-center justify-between gap-x-2">
              {/* Left side: Deep Thinking toggle */}
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
                {/* Tooltip on hover */}
                <span className="absolute bottom-full mb-1 hidden group-hover:block text-[9px] text-muted-foreground bg-white/80 dark:bg-black/80 px-2 py-0.5 rounded-md shadow-sm whitespace-nowrap">
                  use when you want more in-depth reasoning
                </span>
              </button>

              {/* Right side: kbd + send button */}
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

        <div className="flex-wrap justify-center gap-2 hidden md:flex mt-4">
          {PROJECT_TEMPLATES.map((template) => (
            <Button
              key={template.prompt}
              variant="outline"
              size="sm"
              className="bg-white/25 dark:bg-neutral-900/20 backdrop-blur-md border border-white/30 hover:bg-primary/40 border-primary/20 shadow-sm hover:scale-105"
              onClick={() => onSelect(template.prompt)}
              >
                {template.emoji} {template.title}
              </Button>
          ))}
        </div>
      </section>

      {/* Light mode adjustments */}
      <style jsx global>{`
        /* Scrollbar for textarea */
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
        /* Ensure light mode text is visible */
        .light-mode textarea {
          color: #1f2937; /* dark text for light background */
          caret-color: #3b82f6;
        }
      `}</style>
    </Form>
  );
};

export default ProjectForm;
