import { createComponent } from ".";
import { tv } from "tailwind-variants";

const tabs = tv({ base: "p-1 gap-1 flex bg-gray-100 rounded" });
const tab = tv({
  base: "flex flex-1 justify-center p-2 hover:bg-gray-50 text-gray-600",
  variants: {
    active: { true: "bg-white text-gray-900 font-bold" },
    disabled: { true: "cursor-not-allowed opacity-50" },
  },
});

export const Tabs = createComponent("ol", tabs);
export const Tab = createComponent("li", tab);
