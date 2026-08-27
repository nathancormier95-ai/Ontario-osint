import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex min-h-10 shrink-0 items-center justify-center gap-2 border border-transparent rounded-none px-4 text-sm font-semibold tracking-[0.01em] whitespace-nowrap transition-[transform,box-shadow,background-color,border-color,color] duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none hover:-translate-y-px active:translate-y-0 active:scale-[0.98] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "border-[#0d526a] bg-[#0f5974] text-primary-foreground shadow-[3px_3px_0_rgba(15,89,116,0.18)] hover:bg-[#104b62] hover:shadow-[5px_5px_0_rgba(15,89,116,0.14)]",
        destructive:
          "border-[#a54b40] bg-destructive text-white shadow-[3px_3px_0_rgba(169,75,62,0.14)] hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-[#7aa39d] bg-[#fffdf8] text-[#0f5974] shadow-[2px_2px_0_rgba(15,89,116,0.08)] hover:border-[#0f5974] hover:bg-[#e8f1ed] dark:bg-transparent dark:border-input dark:hover:bg-input/50",
        secondary:
          "border-[#c8b754] bg-[#e8d56b] text-[#18393f] shadow-[3px_3px_0_rgba(111,93,22,0.12)] hover:bg-[#f0df7d]",
        ghost: "text-[#46615c] hover:bg-[#e7efea] hover:text-[#0f5974] dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "min-h-9 h-9 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "min-h-11 h-11 px-6 has-[>svg]:px-4",
        icon: "min-h-0 size-10 p-0",
        "icon-sm": "min-h-0 size-9 p-0",
        "icon-lg": "min-h-0 size-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
