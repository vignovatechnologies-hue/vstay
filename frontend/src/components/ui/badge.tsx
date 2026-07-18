import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-[#A7F3D0] bg-[#ECFDF5] text-[#047857] dark:border-[rgba(52,211,153,0.28)] dark:bg-[rgba(16,185,129,0.15)] dark:text-[#6EE7B7] font-semibold text-[11px] px-[9px] py-[4px] rounded-full",
        warning: "border-[#FDE68A] bg-[#FFFBEB] text-[#B45309] dark:border-[rgba(251,191,36,0.28)] dark:bg-[rgba(245,158,11,0.15)] dark:text-[#FCD34D] font-semibold text-[11px] px-[9px] py-[4px] rounded-full",
        danger: "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C] dark:border-[rgba(248,113,113,0.28)] dark:bg-[rgba(239,68,68,0.15)] dark:text-[#FCA5A5] font-semibold text-[11px] px-[9px] py-[4px] rounded-full",
        info: "border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8] dark:border-[rgba(96,165,250,0.28)] dark:bg-[rgba(59,130,246,0.16)] dark:text-[#93C5FD] font-semibold text-[11px] px-[9px] py-[4px] rounded-full",
        category: "border-slate-300/60 bg-slate-100 text-slate-700 dark:border-[rgba(100,116,139,0.16)] dark:bg-[rgba(30,43,67,0.75)] dark:text-[#CBD5E1] font-semibold text-[11px] px-[9px] py-[4px] rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
