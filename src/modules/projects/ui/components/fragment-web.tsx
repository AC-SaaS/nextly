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
    <div className="flex flex-col w-full h-full gap-3">
      {/* ─────────── top control bar ─────────── */}
      <div className="flex items-center gap-2 p-2 bg-background/60 dark:bg-background/40 border border-border rounded-xl shadow-sm backdrop-blur-md">
        <Hint text="Refresh">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleRefresh}
            className="hover:bg-primary/10 transition-colors"
          >
            <RefreshCcwIcon />
          </Button>
        </Hint>

        <Button
          variant="outline"
          className="flex-1 truncate font-normal bg-background/10 dark:bg-background/20 hover:bg-background/20 transition-all"
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
            className="hover:bg-primary/10 transition-colors"
          >
            <CopyIcon />
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
            className="hover:bg-primary/10 transition-colors"
          >
            <ExternalLinkIcon />
          </Button>
        </Hint>
      </div>

      {/* ─────────── sandbox iframe ─────────── */}
      <div className="flex-1 border border-border rounded-xl overflow-hidden shadow-inner">
        {data.sandboxUrl ? (
          <iframe
            key={refreshIdx}
            src={data.sandboxUrl}
            className="w-full h-full"
            sandbox="allow-scripts allow-same-origin allow-forms"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No sandbox URL available
          </div>
        )}
      </div>
    </div>
  );
}
