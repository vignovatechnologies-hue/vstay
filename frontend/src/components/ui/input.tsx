import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-surface-input dark:border-border-default dark:text-[#F8FAFC] dark:focus-visible:border-[#5B7CFA] dark:focus-visible:ring-[rgba(79,110,247,0.16)] dark:placeholder:text-[#8294AA] dark:hover:border-border-strong dark:disabled:bg-[rgba(15,23,42,0.60)] dark:disabled:text-[#64748B]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
