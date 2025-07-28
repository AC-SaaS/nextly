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

interface Props {
  projectId: string;
};

const formSchema = z.object({
  value: z.string()
    .min(1, {message: "Message cannot be empty"})
    .max(1000, {message: "Message cannot be longer than 1000 characters"}),
});

export const MessageForm = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();    
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const createMessage = useMutation(trpc.messages.create.mutationOptions(
    {
      onSuccess: (data) => {
        form.reset();
        queryClient.invalidateQueries(trpc.messages.getMany.queryOptions({
          projectId: data.projectId,
        }));
        //todo: invalid usage status
      },
      onError: () => {
        toast.error("Failed to create message");
      },
    }
  ));

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
   await createMessage.mutateAsync({
    value: values.value,
    projectId,
   });
  };

  const [isFocused, setIsFocused] = useState(false);
  const showUsage = useState(false);
  const isPending = createMessage.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}
            className={cn("relative-border p-4 pt-1 rounded -xl bg-sidebar dark:bg-sidebar transition-all",
            isFocused && 'shadow-xs',
            showUsage && 'rounded-t-none',
        )}
      > 
        <FormField  control={form.control} name="value" render={({ field}) => (
            <TextareaAutosize
              {...field}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isPending}
              minRows={2}
              maxRows={8}
              placeholder="Ask a question or start a conversation..."
              className="w-full resize-none border-none bg-transparent focus:ring-0 focus:ring-offset-0 outline-none placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)(e);
                }
            }}
            />
          )} 
        />
        <div className="flex gap-x-2 items-end justify-between pt-2">
          <div className="text-[10px] text-muted-foreground font-mono">
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-x-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span>⌘</span>
              <span> + Enter</span>
            </kbd>
            &nbsp;to submit
          </div>
          <Button className={cn( "size-8 rounded-full", isButtonDisabled && "opacity-50 bg-muted-foreground cursor-not-allowed")}
                  disabled={isButtonDisabled}
                  onClick={form.handleSubmit(onSubmit)}>
            {isPending ? <Loader2Icon className="animate-spin size-4" /> :
            <ArrowUpIcon className="size-4" />}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MessageForm;