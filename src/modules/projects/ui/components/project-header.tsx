import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  SunMoonIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

interface Props {
    projectId: string;
}

export const ProjectHeader = ({ projectId }: Props) => {
  const trpc = useTRPC();
  useSuspenseQuery(trpc.projects.getOne.queryOptions({
    id: projectId,
  }));

  const { theme, setTheme } = useTheme();

  return (
    <header className="p-2 flex items-center justify-between border-b">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="focus-visible:ring-0 hover:bg-transparent hover:opacity-75 transition-opacity pl-2!">
            <Image
              src="/logo.svg"
              alt="Vibe"
              width={24}
              height={24}
              className="shrink-0"
            />
            <span className="text-sm font-medium">Vibe</span>
            <ChevronDownIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start">
          <DropdownMenuItem asChild>
            <Link href={"/"}>
              <ChevronLeftIcon className="size-4" />
              <span className="text-sm font-medium">Back to dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuTrigger className="gap-2">
              <SunMoonIcon className="size-4 text-muted-foreground" />
              <span >Appearance</span>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value)}>
                  <DropdownMenuRadioItem value="light">
                    <span>Light</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    <span>Dark</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">
                    <span>System</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
};

