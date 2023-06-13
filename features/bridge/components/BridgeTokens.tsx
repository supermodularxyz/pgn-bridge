"use client";
import { Card } from "@/components/ui/Card";
import { Form } from "@/components/ui/Form";
import { useDeposit, usePGN, useWithdraw } from "@/providers/PGN";

import { ethers } from "ethers";
import { getToken } from "@/config/tokens";
import { Actions, BridgeSchema } from "../schema";
import { BridgeTabs } from "./BridgeTabs";
import { MintTokens } from "./MintTokensTest";
import { TransferAction } from "./TransferAction";
import { TransferTokens } from "./TransferTokens";
import { TransferSummary } from "./TransferSummary";
import { Address, Chain } from "wagmi";

export function BridgeTokens({ action = Actions.Deposit }) {
  const deposit = useDeposit();
  const withdraw = useWithdraw();

  const { l1, l2 } = usePGN();
  const chains = {
    [Actions.Deposit]: { in: l1, out: l2 },
    [Actions.Withdraw]: { in: l2, out: l1 },
  };
  const chainIn = chains[action].in as Chain;
  const chainOut = chains[action].out as Chain;

  // Select the correct transaction action
  const { isLoading, error, log, mutateAsync } =
    { [Actions.Deposit]: deposit, [Actions.Withdraw]: withdraw }[action] || {};

  return (
    <Form
      // defaultValues={{ amount: 0.0001 }}
      schema={BridgeSchema}
      onSubmit={(values) => {
        const amount = ethers.utils.parseEther(`${values.amount}`);
        const token = getToken(values.token as Address);

        mutateAsync({ amount, token });
      }}
    >
      <Card className="max-w-screen-sm flex flex-col gap-2">
        <BridgeTabs active={action} />
        <TransferTokens chain={chainIn} />
        <TransferSummary chain={chainOut} />
        <TransferAction action={action} chain={chainIn} isLoading={isLoading} />
        <MintTokens />
        <ErrorMessage error={error as any} />
        <TransferLog log={log} />
      </Card>
    </Form>
  );
}

function ErrorMessage({ error }: { error: { message: string } }) {
  if (!error?.message) return null;
  return (
    <div className="font-mono text-sm text-red-800 bg-red-100 whitespace-pre-wrap break-all p-2">
      {error?.message}
    </div>
  );
}

function TransferLog({ log = [] }: { log: string[] }) {
  if (!log.length) return null;
  return (
    <div className="bg-gray-900 text-gray-50 p-4 font-mono text-xs flex flex-col gap-2">
      {log.map((msg, i) => (
        <div key={i}>&gt; {msg}</div>
      ))}
    </div>
  );
}
