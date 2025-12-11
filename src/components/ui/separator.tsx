import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        [
          "shrink-0",
          "bg-slate-200/70",

          // horizontal
          "data-[orientation=horizontal]:h-px",
          "data-[orientation=horizontal]:w-full",

          // vertical
          "data-[orientation=vertical]:w-px",
          "data-[orientation=vertical]:h-full",
        ].join(" "),
        className
      )}
      {...props}
    />
  );
}

export { Separator };
