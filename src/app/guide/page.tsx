import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PromptingGuide() {
  return (
    <section className="flex justify-center items-center my-24">
      <div className="relative group bg-background/90 border border-foreground/20 rounded-2xl p-12 px-16 flex flex-col items-center text-center shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
      {/* back button */}
      <Link href="/" className="absolute top-4 left-4">
        <ChevronLeft className="w-6 h-6" />
      </Link>
        <h2 className="text-4xl font-extrabold text-primary mb-4 group-hover:scale-105 transform transition-transform duration-300">
          Coming Soon
        </h2>
        <p className="text-foreground/80 text-lg group-hover:text-primary transition-colors duration-300">
          Stay tuned for more advanced guides, interactive examples, and exclusive tips.
        </p>
        <div className="mt-6 w-16 h-1 bg-primary rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>
    </section>

  );
}