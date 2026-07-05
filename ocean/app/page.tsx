import Navbar from "../components/Navbar";
import { auth } from "./lib/auth";
import { redirect } from "next/navigation";
import { HeroLivingWorkday } from "@/components/landing/hero/HeroLivingWorkday";
import { Logos } from "@/components/Logos";
import { ChapterScheduling } from "@/components/landing/ChapterScheduling";
import { ChapterDeepWork } from "@/components/landing/ChapterDeepWork";
import { ChapterHabits } from "@/components/landing/ChapterHabits";
import { ChapterTomorrow } from "@/components/landing/ChapterTomorrow";
import { ChapterInsights } from "@/components/landing/ChapterInsights";
import { ChapterSanctuary } from "@/components/landing/ChapterSanctuary";
import { ChapterFAQ } from "@/components/landing/ChapterFAQ";
import { Footer } from "@/components/landing/Footer";

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex w-full flex-grow flex-col">
        {/* Chapter 01: Hero Redesign */}
        <HeroLivingWorkday />

        {/* Supporting brand trust logos */}
        <div className="mx-auto w-full max-w-6xl px-6 pb-12">
          <Logos />
        </div>

        {/* Chapter 02: Scheduling */}
        <ChapterScheduling />

        {/* Chapter 03: Deep Work */}
        <ChapterDeepWork />

        {/* Chapter 04: Habits */}
        <ChapterHabits />

        {/* Chapter 05: Tomorrow */}
        <ChapterTomorrow />

        {/* Chapter 06: Insights */}
        <ChapterInsights />

        {/* Chapter 07: Sanctuary */}
        <ChapterSanctuary />

        {/* Chapter 08: FAQ & SignUp */}
        <ChapterFAQ />
      </main>

      <Footer />
    </div>
  );
}
