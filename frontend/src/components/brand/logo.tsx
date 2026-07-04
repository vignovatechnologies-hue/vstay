import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

export function Logo({ className, showWordmark = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        aria-hidden
        className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground shadow-[var(--shadow-elevation-2)]"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
        >
          <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 10.5V20h14v-9.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 20v-5h4v5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {showWordmark ? (
        <span className="text-base font-semibold tracking-tight text-foreground">Hostly</span>
      ) : null}
    </div>
  );
}
