import { Button } from "@/components/ui/button";
import { Fragment } from "@prisma/client";
import {
  CopyIcon,
  ExternalLinkIcon,
  RefreshCcwIcon,
} from "lucide-react";
import { useState } from "react";
import { Hint } from "@/components/hint";

interface Props {
  data: Fragment;
}

export function FragmentWeb({ data }: Props) {
  const [refreshIdx, setRefreshIdx] = useState(0);   // used to re-mount iframe
  const [copied, setCopied] = useState(false);

  const handleRefresh = () => setRefreshIdx((i) => i + 1);

  const handleCopy = () => {
    if (!data.sandboxUrl) return;
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2_000);
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* ─────────── top control bar ─────────── */}
      <div className="flex items-center gap-2 mb-4">
        <Hint text="Refresh">
          <Button size="icon" variant="outline" onClick={handleRefresh}>
            <RefreshCcwIcon />
          </Button>
        </Hint>

        {/* URL (grows to fill space) */}
        <Button
          variant="outline"
          className="flex-1 justify-start truncate font-normal"
          disabled={!data.sandboxUrl || copied}
          onClick={handleCopy}
        >
          {data.sandboxUrl}
        </Button>

        <Hint text={copied ? "Copied!" : "Copy URL"}>
          <Button
            size="icon"
            variant="outline"
            disabled={!data.sandboxUrl || copied}
            onClick={handleCopy}
          >
            <CopyIcon />
          </Button>
        </Hint>

        <Hint text="Open in new tab">
          <Button
            size="icon"
            variant="outline"
            disabled={!data.sandboxUrl}
            onClick={() => data.sandboxUrl && window.open(data.sandboxUrl, "_blank")}
          >
            <ExternalLinkIcon />
          </Button>
        </Hint>
      </div>

      {/* ─────────── sandbox ─────────── */}
      <iframe
        key={refreshIdx}            // re-mounts on refresh
        src={data.sandboxUrl}
        className="w-full h-full flex-1"
        sandbox="allow-scripts allow-same-origin allow-forms"
        loading="lazy"
      />
    </div>
  );
}
