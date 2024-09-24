import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

export const alertVariants = cva(
  "relative w-full rounded-lg border border-dashed px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-3 [&>svg]:text-foreground [&>svg~*]:pl-8",
  {
    variants: {
      variant: {
        default: "text-foreground bg-muted/50",
        destructive:
          "border-destructive/50 bg-destructive/5 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-green-600 bg-green-50/50 text-green-600 dark:border-green [&>svg]:text-green-600",
        indigo:
          "border-indigo-600 bg-indigo-50/50 dark:border-indigo  [&>svg]:text-indigo-600 [&>h5]:text-indigo-600",
        warning:
          "border-amber-600 bg-amber-50/50 text-amber-600 dark:border-amber [&>svg]:text-amber-600 ",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-semibold leading-none", className)} {...props} />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-foreground [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
