// src/components/ui/toast.jsx
import * as React from "react";
import { cn } from "../../lib/utils";

export const Toast = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "group pointer-events-auto relative flex w-full items-center justify-between overflow-hidden rounded-md p-4 pr-8 shadow-md",
      className
    )}
    {...props}
  />
));
Toast.displayName = "Toast";