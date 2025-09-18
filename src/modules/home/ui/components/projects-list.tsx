"use client";

import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const ProjectsList = () => {
  const trpc = useTRPC();
  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());
  const { user } = useUser();
  const router = useRouter();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-6">

      <h2 className="text-3xl font-bold text-foreground">
        {user.firstName}&apos;s Projects
      </h2>

      {projects?.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No projects found
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {projects?.map((project) => (
            <div
              key={project.id}
              className="bg-background border border-border rounded-xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-primary transition-all w-full cursor-pointer"
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-foreground truncate">
                  {project.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Created {formatDistanceToNow(new Date(project.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
