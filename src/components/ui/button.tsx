import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

function Button({ className, type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      data-slot="button"
      type={type}
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3.5 text-sm font-medium tracking-tight text-foreground transition-colors hover:bg-muted focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-55",
        className,
      )}
      {...props}
    />
  );
}

export { Button };
