"use client";

import { Button } from "@/components/ui/button";
import { Fragment } from "@prisma/client";
import { CopyIcon, ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";
import { Hint } from "@/components/hint";

interface Props {
  data: Fragment;
}

export function FragmentWeb({ data }: Props) {
  const [refreshIdx, setRefreshIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleRefresh = () => setRefreshIdx((i) => i + 1);

  const handleCopy = () => {
    if (!data.sandboxUrl) return;
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col w-full h-full gap-4 p-2">
      {/* ─────────── Top Control Bar ─────────── */}
      <div className="flex items-center gap-3 p-3 bg-background/30 dark:bg-background/50 border border-border rounded-2xl shadow-lg backdrop-blur-md hover:shadow-xl transition-all">
        <Hint text="Refresh">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleRefresh}
            className="hover:bg-primary/20 transition-colors duration-200"
          >
            <RefreshCcwIcon className="h-5 w-5" />
          </Button>
        </Hint>

        <Button
          variant="outline"
          className="flex-1 truncate font-medium bg-background/20 dark:bg-background/30 hover:bg-background/25 dark:hover:bg-background/40 transition-all text-sm rounded-lg shadow-sm hover:shadow-md"
          disabled={!data.sandboxUrl || copied}
          onClick={handleCopy}
        >
          {data.sandboxUrl || "No URL available"}
        </Button>

        <Hint text={copied ? "Copied!" : "Copy URL"}>
          <Button
            size="icon"
            variant="ghost"
            disabled={!data.sandboxUrl || copied}
            onClick={handleCopy}
            className="hover:bg-primary/20 transition-colors duration-200 rounded-lg"
          >
            <CopyIcon className="h-5 w-5" />
          </Button>
        </Hint>

        <Hint text="Open in new tab">
          <Button
            size="icon"
            variant="ghost"
            disabled={!data.sandboxUrl}
            onClick={() =>
              data.sandboxUrl && window.open(data.sandboxUrl, "_blank")
            }
            className="hover:bg-primary/20 transition-colors duration-200 rounded-lg"
          >
            <ExternalLinkIcon className="h-5 w-5" />
          </Button>
        </Hint>
      </div>

      {/* ─────────── Sandbox Iframe ─────────── */}
      <div className="flex-1 relative border border-border rounded-2xl overflow-hidden shadow-inner bg-background/10 dark:bg-background/20">
        {data.sandboxUrl ? (
          <iframe
            key={refreshIdx}
            src={data.sandboxUrl}
            className="w-full h-full border-none rounded-2xl"
            sandbox="allow-scripts allow-same-origin allow-forms"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground text-sm font-medium gap-2">
            <span className="text-lg">🚫</span>
            <span>No sandbox URL available</span>
          </div>
        )}

        {/* Optional: subtle glass overlay */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-b from-white/5 to-white/0 dark:from-black/5 dark:to-black/0" />
      </div>
    </div>
  );
}
