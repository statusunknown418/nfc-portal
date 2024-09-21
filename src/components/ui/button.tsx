import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center gap-2 justify-center border border-transparent whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow hover:bg-destructive/90",
        outline: "border-border bg-white shadow hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary border-border text-secondary-foreground shadow hover:bg-secondary/80",
        secondary_ghost: "bg-primary/10 border-primary hover:bg-primary/5",
        link: "underline-offset-4 hover:underline text-muted-foreground hover:text-primary font-normal !h-max !p-0 w-max",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:border-border",
        destructive_ghost:
          "bg-destructive/10 border-destructive/30 hover:border-destructive/50 hover:bg-destructive/20 text-destructive",
        primary: "bg-indigo-600 text-indigo-50 shadow hover:bg-indigo-500",
        primary_ghost: "bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-500",
        unstyled:
          "bg-transparent border-transparent items-start hover:bg-accent !h-fit w-fit hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-6 text-base",
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
