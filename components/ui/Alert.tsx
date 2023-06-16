import { createComponent } from ".";
import { tv } from "tailwind-variants";

const alert = tv({
  base: "flex flex-col justify-center py-4 px-2 gap-4 text-center",
  variants: {
    border: {
      default: "",
    },
    variant: {
      default: "bg-zinc-700 ",
      warning: "bg-yellow-100 text-yellow-900",
      error: "bg-red-100 text-red-900",
      success: "bg-green-100 text-green-900 ",
    },
  },
  defaultVariants: {
    border: "default",
    variant: "default",
  },
});

export const Alert = createComponent("div", alert);
