"use client";

import { Announcement } from "@/components/21stdev/announcement";
import { AnnouncementTitle } from "@/components/21stdev/announcement";
import { ArrowUpRightIcon, ArrowLeftIcon } from "lucide-react";
import { InteractiveHoverButton } from "@/components/21stdev/interactive-hover-button";
import { useRouter } from "next/navigation";
import { LightPullThemeSwitcher } from "@/components/21stdev/light-pull-theme-switcher";

const Page = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full px-6 md:px-16 py-8 md:py-16 text-foreground">
      
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-sm md:text-base font-medium mb-6 hover:text-primary dark:hover:text-primary transition-colors"
      >
        <ArrowLeftIcon size={16} className="mr-2" />
        Back
      </button>
      <LightPullThemeSwitcher />

      <section className="space-y-6 md:space-y-8">
        {/* Announcement bar */}
        <div className="flex flex-col items-start">
          <Announcement className="hover:bg-primary hover:text-primary-foreground transition-all">
            <AnnouncementTitle className="flex items-center">
              About <span className="font-bold text-primary italic">Nextly</span>
              <ArrowUpRightIcon
                size={16}
                className="shrink-0 text-muted-foreground ml-2"
              />
            </AnnouncementTitle>
          </Announcement>
        </div>

        {/* Main Text */}
        <div className="space-y-4 md:space-y-6">
          <p className="text-sm md:text-base leading-relaxed md:leading-7 text-left">
            I’m not from the <span className="italic text-primary">“right school.”</span> I didn’t inherit wealth, status, or a golden ticket into the tech world. I’m a <span className="font-bold">college dropout</span> who decided that instead of waiting for permission, I’d build my own future with nothing but curiosity, stubbornness, and code.
          </p>

          <p className="text-sm md:text-base leading-relaxed md:leading-7 text-left">
            <strong className="text-primary">Nextly</strong> is more than just a project. It’s <span className="underline">proof</span>. Proof that a single person, with no safety net, can create tools that rival what companies with millions in funding are still trying to figure out. It’s not about hype or buzzwords—it’s about <span className="font-bold text-primary">execution, creativity</span>, and belief that ideas are worthless until they’re built.
          </p>

          <p className="text-sm md:text-base leading-relaxed md:leading-7 text-left">
            Every line of code in this app is a declaration: you don’t need a degree from Ivy League schools, you don’t need billions in venture funding, you don’t need approval from gatekeepers. You just need <span className="italic font-bold text-primary">fire</span>.
          </p>

          <p className="text-sm md:text-base leading-relaxed md:leading-7 text-left">
            This is my story so far. From nothing, I’m <span className="underline font-bold">building</span>. From nowhere, I’m aiming everywhere. And BuildByChat is only the beginning.
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-start pt-4" onClick={() => router.push("/")}>
          <InteractiveHoverButton text="Try Now" />
        </div>
      </section>
    </div>
  );
};

export default Page;
