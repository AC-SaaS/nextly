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

  return (
    <Form {...form}>
      <section className="flex flex-col items-center w-full">
        <GlassEffect
          className={cn(
            "w-full max-w-3xl p-6 transition-all duration-500",
            isFocused && "scale-[1.01] ring-2 ring-blue-400/40"
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
                    "scrollbar-thin scrollbar-thumb-blue-400/50 scrollbar-track-transparent hover:scrollbar-thumb-blue-500/70"
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
              <div className="text-[10px] text-muted-foreground font-mono">
                <kbd className="inline-flex h-5 select-none items-center gap-x-1 rounded border border-white/20 bg-white/10 px-1.5 font-mono text-[10px] font-medium backdrop-blur-sm">
                  <span>⌘</span>
                  <span> + Enter</span>
                </kbd>
                &nbsp;to submit
              </div>
              <Button
                className={cn(
                  "size-8 rounded-full transition-all hover:scale-105",
                  "bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/20 shadow-sm",
                  isButtonDisabled &&
                    "opacity-50 cursor-not-allowed hover:scale-100 hover:bg-white/30"
                )}
                disabled={isButtonDisabled}
                onClick={form.handleSubmit(onSubmit)}
              >
                {isPending ? <Loader2Icon className="animate-spin size-4" /> : <ArrowUpIcon className="size-4" />}
              </Button>
            </div>
          </form>
        </GlassEffect>

        <div className="flex-wrap justify-center gap-2 hidden md:flex mt-4">
          {PROJECT_TEMPLATES.map((template) => (
            <Button
              variant="outline"
              size="sm"
              className="bg-white/25 dark:bg-neutral-900/20 backdrop-blur-md border border-white/30"
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
