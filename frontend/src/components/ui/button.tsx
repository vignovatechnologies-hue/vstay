import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90 dark:bg-[#4F6EF7] dark:text-[#FFFFFF] dark:border dark:border-[rgba(99,102,241,0.30)] dark:hover:bg-[#5B7CFA] dark:active:bg-[#435FE5] dark:focus-visible:ring-[rgba(96,165,250,0.35)]",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 dark:bg-red-600 dark:text-white dark:hover:bg-red-700",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground dark:bg-[rgba(15,27,45,0.72)] dark:border dark:border-[rgba(148,163,184,0.26)] dark:text-[#DCE6F2] dark:hover:bg-[rgba(37,99,235,0.12)] dark:hover:border-[rgba(96,165,250,0.34)]",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 dark:bg-[#1A2A42] dark:text-[#EAF0F7] dark:border dark:border-[rgba(148,163,184,0.18)] dark:hover:bg-[#223653] dark:hover:border-[rgba(148,163,184,0.28)] dark:active:bg-[#19283E]",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:bg-transparent dark:text-[#B8C5D6] dark:hover:bg-[rgba(148,163,184,0.10)] dark:hover:text-[#F8FAFC]",
        link: "text-primary underline-offset-4 hover:underline",
        tableAction: "text-muted-foreground font-semibold hover:text-foreground hover:bg-transparent dark:text-[#A8B4C5] dark:hover:text-[#F8FAFC]",
        tableActionPrimary: "text-primary font-semibold hover:text-primary/80 hover:bg-transparent dark:text-[#E2E8F0] dark:hover:text-[#60A5FA]",
        tableActionDestructive: "text-destructive hover:text-destructive/80 hover:bg-transparent [&_svg]:stroke-[2.25] [&_svg]:opacity-100 dark:text-[#F87171] dark:hover:text-[#FCA5A5]",
        tableActionIcon: "text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-[8px] dark:text-[#A8B4C5] dark:hover:text-[#F8FAFC] dark:hover:bg-[rgba(59,130,246,0.10)]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        tableIcon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
