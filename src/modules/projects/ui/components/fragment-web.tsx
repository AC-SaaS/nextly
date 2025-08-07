import { Button } from "@/components/ui/button";
import { Fragment } from "@prisma/client";
import { CopyIcon, ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";
import { Hint } from "@/components/hint";

interface Props {
  data: Fragment;
};

export function FragmentWeb({ data }: Props) {
  
  const [fragment, setFragment] = useState(0);
  const [copied, setCopied] = useState(false);

  const onRefresh = () => {
    setFragment((prev) => prev + 1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => { setCopied(false); }, 2000);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col w-full h-full">
        <Hint text="Refresh" side="bottom" align="center">
          <Button size="icon" variant="outline" onClick={onRefresh}>
            <RefreshCcwIcon/>
          </Button>
        </Hint>
        <Button size="icon"
                variant="outline" 
                className="flex-1 justify-start text-start font-normal"
                disabled={!data.sandboxUrl || copied}
                onClick={handleCopy}
                >
          <span className="truncate">
            {data.sandboxUrl}
          </span>
        </Button>
        <Hint text="Copy URL" side="bottom" align="center">
          <Button size="icon"
                  variant="outline"
                  disabled={!data.sandboxUrl || copied}
                  onClick={handleCopy}
                  >
            <CopyIcon/>
          </Button>
        </Hint>
        <Hint text="Open in a new tab" side="bottom" align="center">
          <Button size="icon"
                variant="outline"
                disabled={!data.sandboxUrl || copied}
                onClick={() => {
                  if (!data.sandboxUrl) return;
                  window.open(data.sandboxUrl, "_blank");
                }}
                >
            <ExternalLinkIcon/>
          </Button>
        </Hint>
      </div>
      <iframe 
        src={data.sandboxUrl}
        className="w-full h-full"
        sandbox="allow-scripts allow-same-origin allow-forms"
        loading="lazy"
        />
    </div>
  )
}