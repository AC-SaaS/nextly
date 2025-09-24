"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { UserControl } from "@/components/user-control";
import { useScroll } from "@/hooks/use-scroll";
import { LightPullThemeSwitcher } from "@/components/21stdev/light-pull-theme-switcher";
import { FiGithub } from "react-icons/fi";
import { InteractiveHoverButton } from "@/components/21stdev/interactive-hover-button";

export const Navbar = () => {
  const isScrolled = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: "Projects", href: "/projects" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
  ];

  return (
    <div
      className={cn(
        "fixed top-4 left-0 right-0 z-50 flex items-center px-4 transition-all duration-700",
        mounted
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4"
      )}
    >
      {/* Left outside pill: Theme Toggle */}
      <div className="flex items-center">
        <LightPullThemeSwitcher />
      </div>

      {/* Center: Pill Navbar (absolute center) */}
      <nav
        className={cn(
          "absolute left-1/2 -translate-x-1/2 flex items-center gap-3 transition-all duration-500 bg-background/90 backdrop-blur-md shadow-lg rounded-full px-3 py-1.5",
          isScrolled ? "gap-2 py-1" : "gap-3 py-1.5"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.svg"
            alt="Nextly"
            width={isScrolled ? 22 : 26}
            height={isScrolled ? 22 : 26}
            className="transition-transform duration-300 group-hover:rotate-90"
          />
          <span
            className={cn(
              "italic font-bold transition-colors duration-300",
              isScrolled ? "text-sm" : "text-base",
              "group-hover:text-primary"
            )}
          >
            Nextly
          </span>
        </Link>

        {/* Nav Items Pill */}
        <div
          className={cn(
            "flex items-center gap-2 px-2 rounded-full transition-all duration-300 font-semibold",
            isScrolled ? "gap-1.5 px-2" : "gap-2 px-2"
          )}
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative group px-2 py-1 rounded-full text-foreground hover:text-primary transition-colors duration-300 text-sm"
            >
              {item.name}
              <span className="absolute left-1/2 -bottom-1 h-0.5 w-0 bg-primary rounded-full transition-all duration-500 group-hover:w-2/3 -translate-x-1/2"></span>
            </Link>
          ))}

          {/* GitHub Icon */}
          <a
            href="https://github.com/vedantxn/nextable"
            target="_blank"
            rel="noopener noreferrer"
            className="relative group flex items-center justify-center p-1.5 rounded-full hover:bg-primary/10 transition-all duration-300"
          >
            <FiGithub
              className={cn(
                "text-foreground",
                isScrolled ? "w-4 h-4" : "w-4.5 h-4.5",
                "transition-transform duration-300 group-hover:scale-110"
              )}
            />
          </a>
        </div>
      </nav>

      {/* Right outside pill: Sign Up / User profile */}
      <div className="flex items-center ml-auto gap-2">
        <SignedOut>
          <SignUpButton>
            <InteractiveHoverButton text="Sign Up" />
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserControl />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
