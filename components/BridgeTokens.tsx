"use client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Form, Input, Select } from "@/components/ui/Form";
import { Tab, Tabs } from "@/components/ui/Tabs";
import Link from "next/link";
import z from "zod";
import { createComponent } from "./ui";
import { tv } from "tailwind-variants";
import { useFormContext } from "react-hook-form";
import { useDepositETH, useWithdrawETH } from "@/providers/PGN";

import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { ConnectWallet } from "./ConnectButton";

const BridgeSchema = z.object({
  amount: z.number(),
});
const Actions = {
  Deposit: "Deposit",
  Withdraw: "Withdraw",
};
export function BridgeTokens({ action = Actions.Deposit }) {
  const deposit = useDepositETH();
  const withdraw = useWithdrawETH();

  return (
    <Form
      defaultValues={{ amount: 0.0001 }}
      schema={BridgeSchema}
      onSubmit={(values) => {
        const amount = ethers.utils.parseEther(`${values.amount}`);

        console.log(action, Actions);
        if (action === Actions.Deposit) deposit.mutateAsync(amount);
        if (action === Actions.Withdraw) withdraw.mutateAsync(amount);
      }}
    >
      <Card className="max-w-screen-sm flex flex-col gap-4 flex-1">
        <BridgeTabs active={action} />
        <TransferTokens />
        {/* <TransferSummary /> */}
        <TransferAction action={action} />
      </Card>
    </Form>
  );
}

function BridgeTabs({ active }: { active: string }) {
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

function TransferTokens({}) {
  const form = useFormContext();
  return (
    <Well className="flex flex-col gap-2">
      <div className="flex gap-1">
        <Input
          type="number"
          step="0.00000001"
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
    </Well>
  );
}

const Well = createComponent("div", tv({ base: "bg-gray-100 p-4 rounded-lg" }));

function TransferAction({ action }: { action: string }) {
  const { address } = useAccount();

  if (!address) {
    return <ConnectWallet />;
  }
  return (
    <Button color="primary" type="submit">
      {action}
    </Button>
  );
  return <Button>Enter an amount</Button>;
  return <Button>Insufficient balance</Button>;
}
