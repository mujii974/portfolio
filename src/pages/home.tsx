import { lazy, Suspense } from "react";
import SiteNav from "@/components/SiteNav";
import Boot from "@/components/Boot";
import Noise from "@/components/fx/Noise";
import SmoothScroll from "@/components/fx/SmoothScroll";
import Hero from "@/components/Hero";

// Everything below the fold ships in its own chunk and mounts after the
// initial paint, so the critical bundle is just Hero + nav chrome. Same
// final render — this only defers when the JS runs.
const SignalField = lazy(() => import("@/components/three/SignalField"));
const About = lazy(() => import("@/components/About"));
const Projects = lazy(() => import("@/components/Projects"));
const Trajectory = lazy(() => import("@/components/Trajectory"));
const Arsenal = lazy(() => import("@/components/Arsenal"));
const Dossier = lazy(() => import("@/components/Dossier"));
const Contact = lazy(() => import("@/components/Contact"));

export default function Home() {
  return (
    <div className="relative min-h-[100dvh] bg-background text-foreground">
      <Boot />
      <SmoothScroll />
      <Suspense fallback={null}>
        <SignalField />
      </Suspense>
      <Noise />
      <SiteNav />
      <main id="main" className="relative z-10">
        <Hero />
        <Suspense fallback={null}>
          <About />
          <Projects />
          <Trajectory />
          <Arsenal />
          <Dossier />
          <Contact />
        </Suspense>
      </main>
    </div>
  );
}
