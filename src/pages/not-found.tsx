import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import Noise from "@/components/fx/Noise";
import thinking from "@assets/character/pose-thinking.webp";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center bg-background px-6 text-center">
      <Noise />
      <img
        src={thinking}
        alt=""
        width={272}
        height={428}
        className="float-slow mb-8 w-[170px] select-none"
        draggable={false}
      />
      <p className="overline-label mb-3">
        404 <span className="text-accent">/</span> route not found
      </p>
      <h1 className="mb-4 font-display text-4xl font-extrabold tracking-tight text-foreground">
        This path isn&rsquo;t mapped<span className="text-accent">.</span>
      </h1>
      <p className="mb-9 max-w-[40ch] leading-relaxed text-muted-foreground">
        Whatever you were probing for doesn&rsquo;t exist here. The attack
        surface is intentionally small.
      </p>
      <Link
        href="/"
        className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground transition-transform hover:-translate-y-px active:scale-[0.97]"
        data-testid="link-home"
      >
        <ArrowLeft
          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
          aria-hidden="true"
          focusable="false"
        />
        Back to base
      </Link>
    </div>
  );
}
