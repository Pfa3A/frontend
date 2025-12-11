import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    // base
    "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none",
    "font-semibold text-sm",
    "transition-all duration-200",
    "disabled:pointer-events-none disabled:opacity-50",
    "outline-none focus-visible:ring-4 focus-visible:ring-slate-900/10",
    "active:translate-y-[0.5px]",
    "rounded-xl",
    // icons
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        // ✅ premium black button (great for Next / primary actions)
        primary:
          "bg-slate-900 text-white shadow-sm hover:bg-slate-800",

        // ✅ subtle filled (for secondary actions, chips, etc.)
        soft:
          "bg-slate-100 text-slate-900 hover:bg-slate-200",

        // ✅ clean outline
        outline:
          "border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50",

        // ✅ destructive, still elegant
        danger:
          "bg-rose-600 text-white shadow-sm hover:bg-rose-500 focus-visible:ring-rose-600/20",

        // ✅ minimal hover only
        ghost:
          "bg-transparent text-slate-900 hover:bg-slate-100",

        // ✅ link
        link:
          "bg-transparent text-slate-900 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-lg",
        md: "h-10 px-4",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
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
