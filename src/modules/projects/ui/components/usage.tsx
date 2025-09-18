"use client";

import Link from "next/link";
import { CrownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDuration, intervalToDuration } from "date-fns";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface Props {
  points: number;
  msBeforeNext: number;
}

export const Usage = ({ points, msBeforeNext }: Props) => {
  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "pro" });

  const resetTime = useMemo(() => {
    try {
      return formatDuration(
        intervalToDuration({
          start: new Date(),
          end: new Date(Date.now() + msBeforeNext),
        }),
        { format: ["months", "days", "hours", "minutes"] }
      );
    } catch (error) {
      console.error("Error formatting duration", error);
      return "unknown";
    }
  }, [msBeforeNext]);

  return (
    <div className="relative w-full max-w-3xl mx-auto p-3 rounded-2xl bg-background/60 border border-border backdrop-blur-md shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-foreground">
            {points} {hasProAccess ? "credits" : "free credits"} remaining
          </p>
          <p className="text-xs text-muted-foreground">
            Resets in {resetTime}
          </p>
        </div>

        {hasProAccess && (
          <Button asChild size="sm" variant="secondary" className="flex items-center gap-1 hover:bg-primary/80 transition-colors hover:text-primary-foreground">
            <Link href="/pricing" className="flex items-center gap-1">
              <CrownIcon className="size-4 text-yellow-400" />
              Upgrade
            </Link>
          </Button>
        )}
      </div>

      {/* Optional visual progress bar for credits */}
      <div className="relative w-full h-2 rounded-full bg-muted-foreground/30 overflow-hidden mt-2">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            hasProAccess ? "bg-primary" : "bg-primary/70"
          )}
          style={{
            width: `${Math.min(points, 100)}%`,
          }}
        />
      </div>
    </div>
  );
};
