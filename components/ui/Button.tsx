import { createComponent } from ".";
import { tv } from "tailwind-variants";

const button = tv({
  base: "inline-flex justify-center items-center tracking-wide text-gray-50 rounded active:opacity-90 transition-colors disabled:cursor-default disabled:opacity-50 ",
  variants: {
    color: {
      ghost: "hover:bg-[rgba(255,255,255,.05)]",
      default: "bg-gray-100 hover:bg-gray-200 text-gray-900",
      dark: "bg-gray-900 text-gray-50 hover:bg-gray-700",
      primary: "bg-primary-900 text-primary-50 hover:bg-primary-800",
    },
    size: {
      sm: "p-2 text-sm",
      md: "px-4 py-2 text-md",
      lg: "px-5 py-3 text-lg",
      icon: ["px-1 py-1"],
    },
    disabled: {
      true: "opacity-50 pointer-events-none",
    },
  },
  defaultVariants: {
    size: "md",
    color: "default",
  },
});

export const Button = createComponent("button", button);
