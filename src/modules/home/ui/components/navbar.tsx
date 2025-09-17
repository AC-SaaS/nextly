"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  // SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { UserControl } from "@/components/user-control";
import { useScroll } from "@/hooks/use-scroll";
import { InteractiveHoverButton } from "@/components/21stdev/interactive-hover-button";
import { LightPullThemeSwitcher } from "@/components/21stdev/light-pull-theme-switcher";

export const Navbar = () => {
  const isScrolled = useScroll();

  const navItems = [
    { name: "Projects", href: "/projects" },
    { name: "Pricing", href: "/pricing" },
    { name: "Community", href: "/community" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav
      className={cn(
        "p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        {
          "bg-background/80 backdrop-blur-md border-border/40 shadow-sm": isScrolled,
        }
      )}
    >
      <div className="max-w-6xl mx-auto w-full flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.svg"
            alt="Vibe"
            width={28}
            height={28}
            className="transition-transform duration-300 group-hover:rotate-90"
          />
          <span className="italic text-xl font-bold tracking-tight group-hover:text-primary transition-colors duration-300">
            Nextly
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex gap-8 font-medium">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative group transition-colors hover:text-primary"
            >
              {item.name}
              <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Auth controls */}
        <div className="flex items-center gap-3">
          {/* <LightPullThemeSwitcher /> */}
          <SignedOut>
            <div className="flex gap-2">
              <SignUpButton>
                <InteractiveHoverButton text="Sign Up"/>
              </SignUpButton>
              {/* <SignInButton>
                <Button variant="outline" size="sm" className="hover:scale-105 transition">
                  Sign In
                </Button>
              </SignInButton> */}
            </div>
          </SignedOut>
          <SignedIn>
            <UserControl />
          </SignedIn>
          <LightPullThemeSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
