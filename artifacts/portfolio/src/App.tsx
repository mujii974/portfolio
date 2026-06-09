import { ThemeProvider } from "./components/ThemeProvider";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Timeline from "./components/Timeline";
import Skills from "./components/Skills";
import CV from "./components/CV";
import Contact from "./components/Contact";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="portfolio-theme">
      <TooltipProvider>
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
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
