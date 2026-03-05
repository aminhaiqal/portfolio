import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center rounded-full border border-border/80 bg-background px-2.5 py-1 text-[0.68rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
