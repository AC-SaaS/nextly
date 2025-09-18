// app/projects/page.tsx
"use client";

import { ProjectsList } from "@/modules/home/ui/components/projects-list";
import { Navbar } from "@/modules/home/ui/components/navbar"; // import manually if needed

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <div className="pt-[16vh] max-w-3xl mx-auto w-full">
        <ProjectsList />
      </div>
    </>
  );
}
