import { createComponent } from ".";
import { tv } from "tailwind-variants";

const card = tv({
  base: "p-4 bg-white",
});

export const Card = createComponent("div", card);
