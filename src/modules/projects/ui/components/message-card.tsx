"use client";

import { Fragment, MessageType, MessageRole } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { ChevronRightIcon, Code2Icon } from "lucide-react";

interface UserMessageProps {
  content: string;
}

const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <div className="flex justify-end pb-4 px-2">
      <Card className="bg-primary text-primary-foreground rounded-2xl p-4 shadow-md max-w-[75%] break-words border-none">
        {content}
      </Card>
    </div>
  );
};

interface FragmentCardProps {
  fragment: Fragment;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}

const FragmentCard = ({
  fragment,
  isActiveFragment,
  onFragmentClick,
}: FragmentCardProps) => {
  return (
    <button
      onClick={() => onFragmentClick(fragment)}
      className={cn(
        "flex items-center justify-between p-4 rounded-xl shadow hover:shadow-lg transition-all border w-full bg-background",
        isActiveFragment
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-foreground"
      )}
    >
      <div className="flex items-center gap-3">
        <Code2Icon size={20} className="text-primary" />
        <div className="flex flex-col">
          <span className="font-semibold">{fragment.title}</span>
          <span className="text-sm text-muted-foreground">Preview</span>
        </div>
      </div>
      <ChevronRightIcon size={20} className="text-muted-foreground" />
    </button>
  );
};

interface AssistantMessageProps {
  content: string;
  fragment: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  type: MessageType;
}

const AssistantMessage = ({
  content,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: AssistantMessageProps) => {
  return (
    <div
      className={cn(
        "flex flex-col group px-2 pb-6",
        type === "ERROR" && "text-red-700",
        type === "RESULT" && "text-foreground"
      )}
    >
      {/* Header with logo, name, timestamp */}
      <div className="flex items-center gap-2 pl-2 mb-3">
        <Image src="/logo.svg" alt="Vibe" width={28} height={28} />
        <span className="text-base font-medium">Vibe</span>
        <span className="text-xs text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          {format(createdAt, "HH:mm 'on' MMM dd, yyyy")}
        </span>
      </div>

      {/* Message content */}
      <div className="pl-10 flex flex-col gap-4">
        <Card className="bg-background border border-border p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
          {content}
        </Card>

        {/* Fragment */}
        {fragment && type === "RESULT" && (
          <FragmentCard
            fragment={fragment}
            isActiveFragment={isActiveFragment}
            onFragmentClick={onFragmentClick}
          />
        )}
      </div>
    </div>
  );
};

interface MessageCardProps {
  content: string;
  role: MessageRole;
  fragment: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  type: MessageType;
}

export const MessageCard = ({
  content,
  role,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: MessageCardProps) => {
  if (role === "ASSISTANT") {
    return (
      <AssistantMessage
        content={content}
        fragment={fragment}
        createdAt={createdAt}
        isActiveFragment={isActiveFragment}
        onFragmentClick={onFragmentClick}
        type={type}
      />
    );
  }

  return <UserMessage content={content} />;
};

export default MessageCard;
