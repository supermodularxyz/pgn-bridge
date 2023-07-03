"use client";
import { ethers } from "ethers";
import { Address, Chain, useNetwork } from "wagmi";

import { getToken } from "@/config/tokens";
import { Card } from "@/components/ui/Card";
import { Form } from "@/components/ui/Form";

import { usePGN } from "@/providers/PGN/PGNProvider";
import { useDeposit, useWithdraw } from "@/providers/PGN/hooks/bridge";

import { Actions, BridgeSchema } from "../schema";

import { ChainSelect } from "./ChainSelect";
import { MintTokens } from "./MintTestTokens";
import { TokenAmount } from "./TokenAmount";
import { TokenSelect } from "./TokenSelect";
import { TransferAction } from "./TransferAction";

export function BridgeTokens({}) {
  const deposit = useDeposit();
  const withdraw = useWithdraw();
  const network = useNetwork();

  const { l1, l2 } = usePGN();

  const action =
    network.chain?.network === "pgn" ? Actions.Withdraw : Actions.Deposit;
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
      schema={BridgeSchema}
      onSubmit={(values, form) => {
        const amount = ethers.utils.parseEther(`${values.amount}`);
        const token = getToken(values.token as Address);

        return mutateAsync({ amount, token }).then(() =>
          form.resetField("amount")
        );
      }}
    >
      <Card className="w-full min-w-[500px] max-w-lg flex flex-col gap-4">
        <TokenSelect />
        <ChainSelect chainIn={chainIn} chainOut={chainOut} />
        <TokenAmount chainIn={chainIn} chainOut={chainOut} />
        <TransferAction action={action} chain={chainIn} isLoading={isLoading} />
        <TransferLog log={log} />
        <ErrorMessage error={error as any} />
        <MintTokens />
      </Card>
    </Form>
  );
}

function ErrorMessage({ error }: { error?: { message: string } }) {
  if (!error?.message) return null;
  return (
    <div className="font-mono text-sm text-red-900 bg-red-100 whitespace-pre-wrap break-all p-2">
      {error?.message}
    </div>
  );
}

function TransferLog({ log = [] }: { log: string[] }) {
  if (!log.length) return null;
  return (
    <div className="bg-gray-900 text-gray-50 p-4 font-mono text-xs flex flex-col gap-2 overflow-y-scroll">
      {log.map((msg, i) => (
        <div key={i}>&gt; {msg}</div>
      ))}
    </div>
  );
}
