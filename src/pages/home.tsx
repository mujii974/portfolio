import { lazy, Suspense } from "react";
import SiteNav from "@/components/SiteNav";
import Boot from "@/components/Boot";
import Noise from "@/components/fx/Noise";
import SmoothScroll from "@/components/fx/SmoothScroll";

// three.js stays out of the critical bundle; the field fades in when ready.
const SignalField = lazy(() => import("@/components/three/SignalField"));
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Trajectory from "@/components/Trajectory";
import Arsenal from "@/components/Arsenal";
import Dossier from "@/components/Dossier";
import Contact from "@/components/Contact";

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
        <About />
        <Projects />
        <Trajectory />
        <Arsenal />
        <Dossier />
        <Contact />
      </main>
    </div>
  );
}
