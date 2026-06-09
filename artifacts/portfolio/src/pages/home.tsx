import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Timeline from "@/components/Timeline";
import Skills from "@/components/Skills";
import CV from "@/components/CV";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent/30">
      <Navbar />
      <main className="flex flex-col relative z-10">
        <Hero />
        <About />
        <Projects />
        <Timeline />
        <Skills />
        <CV />
        <Contact />
      </main>
    </div>
  );
}
