"use client";
import { useState } from "react";

import { MessageStatus } from "@eth-optimism/sdk";
import { useMutation } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { useCrossChainMessenger } from "./crossChainMessenger";

type TransferRequest = {
  amount: BigNumber;
  token?: { l1Address: string; l2Address: string; name: string };
};

// Deposit L1 tokens to L2
export function useDeposit() {
  const [log, pushLog, resetLog] = useTransactionLog();

  const { data: crossChainMessenger } = useCrossChainMessenger({
    l1AsSigner: true,
  });

  const deposit = useMutation(async ({ amount, token }: TransferRequest) => {
    if (!crossChainMessenger) {
      throw new Error("CrossChainMessenger not initialized");
    }
    resetLog();

    const { l1Address, l2Address } = token || {};

    let res;

    // Deposit ERC20 tokens
    if (l1Address && l2Address) {
      pushLog("Approving ERC20...");
      const allowance = await crossChainMessenger.approveERC20(
        l1Address,
        l2Address,
        amount
      );

      pushLog(`Waiting for transaction with hash: ${allowance.hash}`);
      await allowance.wait();

      pushLog("Depositing ERC20...");
      res = await crossChainMessenger.depositERC20(
        l1Address,
        l2Address,
        amount
      );
    }
    // Deposit ETH
    else {
      pushLog(`Depositing ETH...`);
      res = await crossChainMessenger.depositETH(amount, {});
    }
    pushLog(`Transaction hash (on L1): ${res.hash}`);
    await res.wait();

    pushLog("Waiting for status to change to RELAYED");
    await crossChainMessenger.waitForMessageStatus(
      res.hash,
      MessageStatus.RELAYED
    );

    pushLog("Deposit successful!");

    return res;
  });
  return {
    ...deposit,
    log,
  };
}

// Withdraw L2 tokens to L1
export function useWithdraw() {
  const [log, pushLog, resetLog] = useTransactionLog();

  const { data: crossChainMessenger } = useCrossChainMessenger();

  const withdraw = useMutation(async ({ amount, token }: TransferRequest) => {
    if (!crossChainMessenger) {
      throw new Error("CrossChainMessenger not initialized");
    }

    resetLog();

    const { l1Address, l2Address } = token || {};
    let res;

    // Withdraw ERC20 tokens
    if (l1Address && l2Address) {
      pushLog(`Withdrawing ERC20...`);

      res = await crossChainMessenger.withdrawERC20(
        l1Address,
        l2Address,
        amount
      );
    }
    // Withdraw ETH
    else {
      pushLog(`Withdrawing ETH...`);
      res = await crossChainMessenger.withdrawETH(amount);
    }
    pushLog(`Transaction hash (on L2): ${res.hash}`);
    await res.wait();

    pushLog("Withdraw successful! Transaction will be finalized in 7 days.");

    return res;
  });
  return {
    ...withdraw,
    log,
  };
}

// Keep track of log messages to show in UI
function useTransactionLog() {
  const [log, setLog] = useState<any>([]);
  return [
    log,
    (msg: string): void =>
      setLog((s: any) => {
        console.log(msg);
        return [...s, msg];
      }),
    () => setLog([]),
  ];
}
