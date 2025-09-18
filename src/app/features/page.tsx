"use client";

import { Navbar } from "@/modules/home/ui/components/navbar";
import { Bolt, Shield, Rocket, Users } from "lucide-react";

const features = [
  {
    icon: <Bolt size={28} className="text-primary" />,
    title: "Fast Performance",
    description: "Build apps lightning-fast with AI-generated Next.js templates and components.",
  },
  {
    icon: <Shield size={28} className="text-primary" />,
    title: "Secure by Default",
    description: "All projects follow modern security best practices out-of-the-box.",
  },
  {
    icon: <Rocket size={28} className="text-primary" />,
    title: "Deploy Quickly",
    description: "Get your apps live in minutes with minimal setup.",
  },
  {
    icon: <Users size={28} className="text-primary" />,
    title: "Collaborative",
    description: "Easily collaborate with your team and manage multiple projects.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Navbar />

      <main className="pt-[16vh] px-4 md:px-12 max-w-6xl mx-auto flex flex-col gap-12">
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Features
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            BuildByChat empowers you to create stunning Next.js apps with ease. Check out what makes our platform amazing:
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-background border border-border rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-primary transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {feature.icon}
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
