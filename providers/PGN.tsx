"use client";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import { CrossChainMessenger, MessageStatus } from "@eth-optimism/sdk";
import { getOptimismConfiguration } from "@conduitxyz/sdk";
import { sepolia, useProvider, useSigner } from "wagmi";
import { pgn } from "@/config/chain";
import { useMutation } from "@tanstack/react-query";
import { BigNumber } from "ethers";

const Context = createContext<{
  crossChainMessenger?: CrossChainMessenger;
}>({});

export const usePGN = () => useContext(Context);

type Transfer = {
  amount: BigNumber;
  token?: { l1Address: string; l2Address: string; name: string };
};

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
export function useDeposit() {
  const { crossChainMessenger } = usePGN();
  const [log, pushLog, resetLog] = useTransactionLog();
  const deposit = useMutation(async ({ amount, token }: Transfer) => {
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

export function useWithdraw() {
  const { crossChainMessenger } = usePGN();
  const [log, pushLog, resetLog] = useTransactionLog();
  return useMutation(async ({ amount, token }: Transfer) => {
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

    pushLog("Waiting for status to be READY_TO_PROVE");
    await crossChainMessenger.waitForMessageStatus(
      res.hash,
      MessageStatus.READY_TO_PROVE
    );

    pushLog("Proving message...");
    await crossChainMessenger.proveMessage(res.hash);

    pushLog("In the challenge period, waiting for status READY_FOR_RELAY");
    await crossChainMessenger.waitForMessageStatus(
      res.hash,
      MessageStatus.READY_FOR_RELAY
    );

    pushLog("Ready for relay, finalizing message...");
    await crossChainMessenger.finalizeMessage(res);

    pushLog("Waiting for status to change to RELAYED");
    await crossChainMessenger.waitForMessageStatus(res, MessageStatus.RELAYED);

    pushLog("Withdraw successful!");

    return res;
  });
}

const CONDUIT_SLUG =
  process.env.NEXT_PUBLIC_CONDUIT_SLUG || "pgn-sepolia-i4td3ji6i0";

export function useCrossChainMessenger() {
  const { data: l1SignerOrProvider } = useSigner({ chainId: sepolia.id });
  const l2SignerOrProvider = useProvider({ chainId: pgn.id });

  const [crossChainMessenger, setCrossChainMessenger] =
    useState<CrossChainMessenger>();

  useEffect(() => {
    if (l1SignerOrProvider && l2SignerOrProvider) {
      getOptimismConfiguration(`conduit:${CONDUIT_SLUG}`).then((config: any) =>
        setCrossChainMessenger(
          new CrossChainMessenger({
            ...config,
            l1SignerOrProvider,
            l2SignerOrProvider,
          })
        )
      );
    }
  }, [l1SignerOrProvider, l2SignerOrProvider]);

  return crossChainMessenger;
}

export function PGNProvider({ children }: PropsWithChildren) {
  const crossChainMessenger = useCrossChainMessenger();

  const state = { crossChainMessenger };

  console.log(state);

  return <Context.Provider value={state}>{children}</Context.Provider>;
}
