import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const badgeVariants = cva(
  "inline-flex gap-1.5 items-center rounded-full cursor-default border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-destructive bg-destructive/10 text-destructive shadow hover:bg-destructive/25",
        outline: "text-foreground",
        indigo: "border-indigo-500 bg-indigo-200 text-indigo-700 hover:bg-indigo/80",
        violet: "border-violet-500 bg-violet-200 text-violet-700 hover:bg-violet/80",
      },
      size: {
        default: "h-6 text-xs",
        md: "h-7 text-sm",
        lg: "h-8 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
