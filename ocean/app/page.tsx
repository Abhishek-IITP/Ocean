import Navbar from "../components/Navbar";
import { auth } from "./lib/auth";
import { redirect } from "next/navigation";
import { Hero } from "@/components/Hero";
import { Logos } from "@/components/Logos";
import { Features } from "@/components/Features";
import { AuthModel } from "@/components/AuthModel";
import { SectionHeading } from "@/components/ui/section";
import { WorkflowSteps } from "@/components/landing/WorkflowSteps";
import { Integrations } from "@/components/landing/Integrations";
import { DashboardShowcase } from "@/components/landing/DashboardShowcase";
import { Testimonials } from "@/components/landing/Testimonials";
import { Faq } from "@/components/landing/Faq";
import { WorkspaceDemo } from "@/components/landing/WorkspaceDemo";
import { Footer } from "@/components/landing/Footer";
import { Reveal } from "@/components/landing/Reveal";

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex w-full flex-grow flex-col">
        <Hero />

        <div className="mx-auto w-full max-w-6xl border-t border-border/60 px-6">
          <Logos />
        </div>

        <div className="border-t border-border/60">
          <Features />
        </div>

        <div className="border-t border-border/60 bg-accent/10">
          <WorkspaceDemo />
        </div>

        <WorkflowSteps />
        <Integrations />
        <DashboardShowcase />
        <Testimonials />
        <Faq />

        {/* CTA */}
        <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-28 text-center md:py-36">
          <Reveal>
            <SectionHeading
              eyebrow="Begin quietly"
              title={
                <>
                  Start your <span className="accent-italic text-sage-deep">calm</span>{" "}
                  morning.
                </>
              }
              description="Join the planners who trade frantic dashboards for a single, unhurried place to think. Free to begin — no credit card."
            />
          </Reveal>
          <div className="mt-9">
            <AuthModel label="Create your space" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
