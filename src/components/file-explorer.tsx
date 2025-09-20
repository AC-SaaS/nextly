import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { useState, useMemo, useCallback, Fragment } from "react";
import { Hint } from "./hint";
import { Button } from "./ui/button";
import { CodeView } from "./code-view";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "./ui/resizable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  BreadcrumbPage,
} from "./ui/breadcrumb";
import { TreeView, TreeItem } from "./tree-view";

type FileCollection = { [path: string]: string };

// extract file extension
function getLanguageFromExtension(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext || "text";
}

// Breadcrumb component
interface FileBreadcrumbProps {
  filepath: string;
}

const FileBreadcrumb = ({ filepath }: FileBreadcrumbProps) => {
  const pathSegments = filepath.split("/");
  const maxSegments = 4;

  const renderBreadcrumbItems = () => {
    if (pathSegments.length <= maxSegments) {
      return pathSegments.map((seg, i) => {
        const isLast = i === pathSegments.length - 1;
        return (
          <Fragment key={i}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage className="font-semibold text-primary">{seg}</BreadcrumbPage>
              ) : (
                <span className="text-muted-foreground">{seg}</span>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator className="text-muted-foreground">/</BreadcrumbSeparator>}
          </Fragment>
        );
      });
    } else {
      const first = pathSegments[0];
      const last = pathSegments[pathSegments.length - 1];
      return (
        <>
          <BreadcrumbItem>
            <span className="text-muted-foreground">{first}</span>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-primary">{last}</BreadcrumbPage>
          </BreadcrumbItem>
        </>
      );
    }
  };

  return (
    <Breadcrumb className="bg-background/20 dark:bg-background/30 p-1 rounded-lg shadow-sm backdrop-blur-md">
      <BreadcrumbList>{renderBreadcrumbItems()}</BreadcrumbList>
    </Breadcrumb>
  );
};

// Convert flat file list to TreeItem[]
function convertFilesToTreeItems(files: FileCollection): TreeItem[] {
  const tree: Record<string, any> = {};
  Object.keys(files).forEach((path) => {
    const parts = path.split("/");
    let curr = tree;
    parts.forEach((part, idx) => {
      if (!curr[part]) {
        curr[part] = {
          label: part,
          children: {},
          isLeaf: idx === parts.length - 1,
          value: idx === parts.length - 1 ? path : undefined,
        };
      }
      curr = curr[part].children;
    });
  });

  function toArray(node: Record<string, any>): TreeItem[] {
    return Object.values(node).map((n) => ({
      label: n.label,
      value: n.isLeaf ? n.value : undefined,
      children: n.isLeaf ? undefined : toArray(n.children),
    }));
  }

  return toArray(tree);
}

interface FileExplorerProps {
  files: FileCollection;
}

export const FileExplorer = ({ files }: FileExplorerProps) => {
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(
    () => Object.keys(files)[0] || null
  );

  const treeData = useMemo(() => convertFilesToTreeItems(files), [files]);

  const handleFileSelect = useCallback(
    (filePath: string) => {
      if (files[filePath]) setSelectedFile(filePath);
    },
    [files]
  );

  const handleCopy = useCallback(() => {
    if (selectedFile) {
      navigator.clipboard.writeText(files[selectedFile]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [selectedFile, files]);

  return (
    <ResizablePanelGroup direction="horizontal">
      {/* Sidebar */}
      <ResizablePanel
        defaultSize={22}
        minSize={15}
        maxSize={30}
        className="bg-sidebar/20 dark:bg-sidebar/30 p-2 rounded-r-2xl shadow-inner backdrop-blur-sm overflow-auto"
      >
        <TreeView
          data={treeData}
          value={selectedFile}
          onSelect={handleFileSelect}
        />
      </ResizablePanel>

      <ResizableHandle className="hover:bg-primary transition-colors duration-200 w-1 cursor-col-resize" />

      {/* Code viewer */}
      <ResizablePanel defaultSize={78} minSize={50}>
        {selectedFile && files[selectedFile] ? (
          <div className="flex flex-col h-full w-full rounded-xl overflow-hidden shadow-lg border border-border">
            {/* Breadcrumb + copy button */}
            <div className="flex justify-between items-center px-4 py-2 border-b bg-background/30 dark:bg-background/40 shadow-sm rounded-t-xl">
              <FileBreadcrumb filepath={selectedFile} />
              <Hint text={copied ? "Copied!" : "Copy to clipboard"} side="bottom">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="hover:bg-primary/20 transition-all duration-200"
                >
                  {copied ? <CopyCheckIcon /> : <CopyIcon />}
                </Button>
              </Hint>
            </div>

            {/* Code content */}
            <div className="flex-1 overflow-auto bg-background/10 dark:bg-background/20 p-4 transition-all duration-300">
              <CodeView
                lang={getLanguageFromExtension(selectedFile)}
                code={files[selectedFile]}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm font-medium">
            Select a file to view its content
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
