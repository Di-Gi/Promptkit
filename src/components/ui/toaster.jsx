// src/components/ui/toaster.jsx
import { Toaster as SonnerToaster } from "./sonner"


export function Toaster() {
  return (
    <SonnerToaster 
      position="bottom-right"
      toastOptions={{
        className: "border border-border bg-background text-foreground",
        duration: 3000,
      }}
    />
  );
}