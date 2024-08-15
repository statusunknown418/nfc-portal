import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center gap-2 justify-center border border-transparent whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow hover:bg-destructive/90",
        outline: "border-border bg-background shadow hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary border-border text-secondary-foreground shadow hover:bg-secondary/80",
        link: "underline-offset-4 hover:underline text-muted-foreground hover:text-primary font-normal !h-max !p-0 w-max",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:border-border",
        destructive_ghost:
          "bg-transparent hover:border-destructive/50 hover:bg-destructive/10 text-destructive",
        primary: "bg-indigo-600 text-indigo-50 shadow hover:bg-indigo-500",
        primary_ghost: "bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-500",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8",
        icon: "h-9 w-9 items-center justify-center flex p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
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
