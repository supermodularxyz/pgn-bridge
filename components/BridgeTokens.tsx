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
import { useDeposit, useWithdraw } from "@/providers/PGN";

import { ethers } from "ethers";
import {
  Address,
  erc20ABI,
  useAccount,
  useContractWrite,
  useMutation,
} from "wagmi";
import { ConnectWallet } from "./ConnectButton";
import tokens from "@/config/tokens";

const BridgeSchema = z.object({
  amount: z.number(),
  token: z.string(),
});
const Actions = {
  Deposit: "Deposit",
  Withdraw: "Withdraw",
};
export function BridgeTokens({ action = Actions.Deposit }) {
  const deposit = useDeposit();
  // const withdraw = useWithdraw();

  return (
    <Form
      // defaultValues={{ amount: 0.0001 }}
      schema={BridgeSchema}
      onSubmit={(values) => {
        const amount = ethers.utils.parseEther(`${values.amount}`);

        const token = tokens.find((t) => t.l1Address === values.token);

        deposit.mutateAsync({ amount, token });
      }}
    >
      <Card className="max-w-screen-sm flex flex-col gap-4 flex-1">
        <BridgeTabs active={action} />
        <TransferTokens />
        {/* <TransferSummary /> */}
        <TransferAction isLoading={deposit.isLoading} />
        <MintTokens />
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
      disabled: true,
    },
  ];

  return (
    <Tabs>
      {tabs.map((tab) => (
        <Tab
          key={tab.href}
          as={Link}
          href={tab.href}
          disabled={tab.disabled}
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
          {tokens.map((token) => (
            <option key={token.l1Address} value={token.l1Address}>
              {token.name}
            </option>
          ))}
        </Select>
      </div>
    </Well>
  );
}

const Well = createComponent("div", tv({ base: "bg-gray-100 p-4 rounded-lg" }));

function TransferAction({ isLoading }: { isLoading: boolean }) {
  const { address } = useAccount();

  if (!address) {
    return <ConnectWallet />;
  }
  return (
    <Button color="primary" type="submit" disabled={isLoading}>
      Deposit
    </Button>
  );
  return <Button>Enter an amount</Button>;
  return <Button>Insufficient balance</Button>;
}

function MintTokens() {
  const form = useFormContext();
  const { address } = useAccount();
  const { l1Address } = tokens[1];
  const mint = useContractWrite({
    address: l1Address as Address,
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "mint",
    mode: "recklesslyUnprepared",
  });
  if (form.watch("token") !== l1Address) return null;
  return (
    <Button
      type="button"
      disabled={mint.isLoading}
      onClick={() =>
        mint.write({
          recklesslySetUnpreparedArgs: [
            address as any,
            ethers.utils.parseEther("1"),
          ],
        })
      }
    >
      Mint test tokens
    </Button>
  );
}
