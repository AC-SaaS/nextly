"use client";

import { ResizablePanel, 
         ResizablePanelGroup, 
         ResizableHandle 
        } from "@/components/ui/resizable"
import { MessagesContainer } from "../components/messages-container";
import { Suspense } from "react";
import { FragmentWeb } from "../components/fragment-web";
import { useState } from "react";
import { Fragment } from "@prisma/client";
import { ProjectHeader } from "../components/project-header";

interface Props {
    projectId: string;
};

export const ProjectView = ({ projectId }: Props) => {
    const  [activeFragment, setActiveFragment] = useState<Fragment | null>(null);    

    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);

    return (
      <div className="h-screen">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={35} minSize={20} className="flex flex-col min-h-0">
            <Suspense fallback={<div>Loading Project...</div>}>
              <ProjectHeader projectId={projectId} />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
              <MessagesContainer projectId={projectId} activeFragment={activeFragment} setActiveFragment={setActiveFragment} />
            </Suspense>
          </ResizablePanel>
          <ResizableHandle  withHandle/>
          <ResizablePanel defaultSize={65} minSize={50} className="flex flex-col min-h-0">
            {!!activeFragment && <FragmentWeb data={activeFragment} />}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
};

export default ProjectView;