"use client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Form, FormControl, Input, Select } from "@/components/ui/Form";
import { Tab, Tabs } from "@/components/ui/Tabs";
import Link from "next/link";
import z from "zod";
import { createComponent } from "./ui";
import { tv } from "tailwind-variants";
import { useFormContext } from "react-hook-form";
const BridgeSchema = z.object({
  amount: z.number(),
});
export function BridgeTokens({ activeTab = "Deposit" }) {
  return (
    <Form schema={BridgeSchema} onSubmit={console.log}>
      <Card className="max-w-screen-sm flex flex-col gap-4 flex-1">
        <BridgeTabs active={activeTab} />
        <TransferTokens />
        <TransferSummary />
        <TransferAction />
      </Card>
    </Form>
  );
}

function BridgeTabs({ active }: { active: string }) {
  const tabs = [
    {
      label: "Deposit",
      href: "/bridge/deposit",
    },
    {
      label: "Withdraw",
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

function TransferTokens() {
  const form = useFormContext();
  console.log(form.watch());
  return (
    <Well className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        From
        <div>
          <Select className="font-bold text-gray-900">
            <option>Ethereum Sepolia</option>
          </Select>
        </div>
      </div>
      <div className="flex gap-1">
        <Input
          type="number"
          step="0.001"
          min={0}
          size="lg"
          placeholder="0.0"
          className="flex-1"
          {...form.register("amount", { valueAsNumber: true })}
        />
        <Select className="bg-white" {...form.register("token")}>
          {/* Value is token address (ETH is 0) */}
          <option value="0">ETH</option>
        </Select>
      </div>
      <div className="text-gray-500 text-sm">
        <TokenBalance />
      </div>
    </Well>
  );
}

function TokenBalance() {
  return <div>Balance: 0 ETH</div>;
}

function TransferSummary() {
  return (
    <Well className="text-gray-500 text-sm">
      <div>
        To <span className="font-bold text-gray-900">PGN</span>
      </div>
      <div>You will receive: 0 ETH</div>
      <TokenBalance />
    </Well>
  );
}

const Well = createComponent("div", tv({ base: "bg-gray-100 p-4 rounded-lg" }));

function TransferAction() {
  return <Button color="primary">Deposit</Button>;
  return <Button>Enter an amount</Button>;
  return <Button>Insufficient balance</Button>;
}
