import { createComponent } from ".";
import { tv } from "tailwind-variants";

const card = tv({
  base: "p-6 bg-gray-100",
});

export const Card = createComponent("div", card);
