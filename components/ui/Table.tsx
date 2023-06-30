import { tv } from "tailwind-variants";
import { createComponent } from ".";

const table = tv({
  base: "w-full text-sm",
});

const variants = { align: { right: "text-right" } };

const tbody = tv({ base: "" });
const thead = tv({ base: "" });
const tr = tv({ base: "hover:bg-muted border-b transition-colors", variants });
const th = tv({
  base: "px-2 text-left font-medium h-10 text-muted-foreground align-middle",
  variants,
});
const td = tv({ base: "p-2 align-middle", variants });

export const Table = createComponent("table", table);
export const Thead = createComponent("thead", thead);
export const Tbody = createComponent("tbody", tbody);
export const Tr = createComponent("tr", tr);
export const Td = createComponent("td", td);
export const Th = createComponent("th", th);
