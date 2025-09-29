import Image from "next/image";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ShimmerMessages = () => {
  const messages = [
    "Please wait, I'm generating your component",
    "This may take a few minutes to create the perfect solution",
    "Crafting your Next.js component with care",
    "Building something amazing for you",
    "Analyzing your request and designing the layout",
    "Optimizing components for best performance",
    "Adding interactive elements and styling",
    "Almost ready, putting the final touches"
  ];

  const [currentMessagesIndex, setCurrentMessagesIndex] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessagesIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);

    return () => clearInterval(messageInterval);
  }, [messages.length]);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <Loader2 className="h-5 w-5 animate-spin text-yellow-600" />
      <span className="text-muted-foreground text-base">
        {messages[currentMessagesIndex]}{dots}
      </span>
    </div>
  );
};

export const MessageLoading = () => {
  return (
    <div className="flex flex-col group px-4 pb-6">
      {/* Header - matching AssistantMessage style */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar - matching AssistantMessage style */}
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-muted/80 to-muted dark:from-muted/60 dark:to-muted/80 flex items-center justify-center border-2 border-border shadow-md">
              <Image 
                src="/logo.svg" 
                alt="Nextly AI" 
                width={20} 
                height={20}
              />
            </div>
            {/* Pulsing yellow indicator for generating state */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-yellow-500 rounded-full border-2 border-background animate-pulse" />
          </div>
          
          {/* Name and generating status */}
          <div className="flex items-center gap-3">
            <span className="text-base font-bold">Nextly AI</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/8 dark:bg-yellow-500/12 border border-yellow-500/20 dark:border-yellow-500/30 rounded-full">
              <Loader2 className="h-3.5 w-3.5 text-yellow-600 animate-spin" />
              <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">Generating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content - matching AssistantMessage card style */}
      <div className="pl-12 flex flex-col gap-4">
        <Card className={cn(
          "relative border-2 rounded-2xl p-5 shadow-sm",
          "border-yellow-500/25 dark:border-yellow-500/35 bg-yellow-500/3 dark:bg-yellow-500/8"
        )}>
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-yellow-500/3 dark:from-yellow-500/6 to-transparent rounded-2xl" />
          
          {/* Loading content */}
          <div className="relative">
            <ShimmerMessages />
          </div>

          {/* Message tail - matching yellow theme */}
          <div className="absolute -bottom-1 left-10 w-4 h-4 bg-yellow-500/3 dark:bg-yellow-500/8 border-l-2 border-b-2 border-yellow-500/25 dark:border-yellow-500/35 transform rotate-45" />
        </Card>

        {/* Optional: Skeleton for potential fragment card */}
        <div className="animate-pulse">
          <div className="h-20 bg-muted/30 dark:bg-muted/20 rounded-2xl border-2 border-dashed border-border/50"></div>
        </div>
      </div>
    </div>
  );
};
