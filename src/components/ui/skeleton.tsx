import * as React from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        [
          "animate-pulse rounded-xl",
          // subtle premium skeleton on white
          "bg-slate-100",
          "ring-1 ring-slate-200/70",
        ].join(" "),
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
