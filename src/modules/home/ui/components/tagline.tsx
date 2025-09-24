"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export const HowItWorksSection = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl p-8 bg-gray-900/50 mt-40">
      {/* Background Image */}
      <Image
        src="https://framerusercontent.com/images/iJ55obhuijBeJ3Lq3yxzKMzvvRo.png"
        alt="How it works background"
        fill
        className="object-cover"
        quality={100}
        priority
      />

      {/* Overlay content */}
      <div className="relative z-10 flex flex-col gap-4 max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl text-white"
        >
          How <span className="text-primary font-bold italic">Nextly</span> does it
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl md:text-5xl font-semibold text-white leading-tight"
        >
          One sentence in → Whole app out
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-base text-white/80 leading-relaxed"
        >
          Say goodbye to tutorials. Forget coding headaches. Type your app idea, and in a blink, you get a full-stack app ready to run, connect, and launch—without sacrificing your sanity. Think of it as your app genie.
        </motion.p>
      </div>

      {/* Optional subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 pointer-events-none rounded-2xl"></div>
    </div>
  );
};
