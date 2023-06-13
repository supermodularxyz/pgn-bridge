import { createComponent } from ".";
import { tv } from "tailwind-variants";

export const Well = createComponent(
  "div",
  tv({ base: "bg-gray-100 p-4 rounded-lg" })
);
