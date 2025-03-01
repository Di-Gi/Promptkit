// src/hooks/useToast.jsx
import { toast } from "sonner";

export function useToast() {
  return {
    toast: ({ title, description, variant = "default", action }) => {
      if (variant === "destructive") {
        toast.error(title, {
          description: description
        });
      } else {
        toast.success(title, {
          description: description
        });
      }
    }
  };
}