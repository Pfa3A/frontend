import * as React from "react";
import { cn } from "@/lib/utils";

function Input({
  className,
  type = "text",
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        [
          // base
          "w-full min-w-0 rounded-xl border border-slate-200 bg-white",
          "px-3 py-2 text-sm text-slate-900",
          "placeholder:text-slate-400",
          "shadow-sm transition-all duration-200",
          "outline-none",

          // file input
          "file:mr-3 file:rounded-md file:border-0",
          "file:bg-slate-100 file:px-3 file:py-1.5",
          "file:text-xs file:font-medium file:text-slate-700",

          // disabled
          "disabled:cursor-not-allowed disabled:opacity-50",

          // focus
          "focus:border-slate-900",
          "focus:ring-4 focus:ring-slate-900/10",

          // error
          "aria-invalid:border-rose-500",
          "aria-invalid:ring-4 aria-invalid:ring-rose-500/15",
        ].join(" "),
        className
      )}
      {...props}
    />
  );
}

export { Input };
