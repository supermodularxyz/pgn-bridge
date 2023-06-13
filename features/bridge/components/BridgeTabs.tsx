import { Tab, Tabs } from "@/components/ui/Tabs";
import Link from "next/link";
import { Actions } from "../schema";

export function BridgeTabs({ active }: { active: string }) {
  const tabs = [
    {
      label: Actions.Deposit,
      href: "/bridge/deposit",
    },
    {
      label: Actions.Withdraw,
      href: "/bridge/withdraw",
    },
  ];

  return (
    <Tabs>
      {tabs.map((tab) => (
        <Tab
          key={tab.href}
          as={Link}
          href={tab.href}
          active={tab.label === active}
        >
          {tab.label}
        </Tab>
      ))}
    </Tabs>
  );
}
