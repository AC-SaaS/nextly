import ProjectForm from "@/modules/home/ui/components/project-form";
import Image from "next/image";
// import { HeroPill } from "@/components/21stdev/hero-pill";
import { Announcement } from "@/components/21stdev/announcement";
import { AnnouncementTitle } from "@/components/21stdev/announcement";
import { ArrowUpRightIcon } from "lucide-react";
import BlurText from "@/components/21stdev/blur-text";
// import WorldText from "@/modules/home/ui/components/world-text";
// import TextPressure from "@/components/21stdev/TextPressure";
// import { ProjectsList } from "@/modules/home/ui/components/projects-list";


const Page = () => {
  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full bg-transparent">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center">
          <Announcement className="hover:bg-primary hover:text-primary-foreground">
            <AnnouncementTitle>
              Now with Gemini 2.5 Pro
              <ArrowUpRightIcon size={16} className="shrink-0 text-muted-foreground" />
            </AnnouncementTitle>
          </Announcement>
        </div>
        <BlurText 
          text="Build Next.js Apps at the Speed of Thought"
          className="font-bold text-4xl md:text-5xl text-center transition-all duration-300 pl-4"
        />
        {/* <TextPressure text="Imagine, Build, Code with Nextly" /> */}
        <p className="text-lg md:text-xl text-muted-foreground text-center hover:italic">
          From prompt to production-ready code — powered by <strong className="text-primary italic">Nextly</strong>
        </p>
        <div className="max-w-3xl mx-auto w-full">
          <ProjectForm />
        </div>
        {/* <LogoLoopUI /> */}
      </section>
    </div>
  );
};

export default Page;
