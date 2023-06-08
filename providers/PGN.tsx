"use client";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { CrossChainMessenger, MessageStatus } from "@eth-optimism/sdk";
import { getOptimismConfiguration } from "@conduitxyz/sdk";
import { sepolia, useConnect, useProvider, useSigner } from "wagmi";
import { pgn } from "@/config/chain";
import { useMutation } from "@tanstack/react-query";
import { BigNumber } from "ethers";

const Context = createContext<{
  crossChainMessenger?: CrossChainMessenger;
}>({});

export const usePGN = () => useContext(Context);

export function useDepositETH() {
  const { crossChainMessenger } = usePGN();
  return useMutation(async (amount: BigNumber) => {
    if (!crossChainMessenger) {
      throw new Error("CrossChainMessenger not initialized");
    }

    const res = await crossChainMessenger.depositETH(amount, {});
    console.log(`Transaction hash (on L1): ${res.hash}`);
    await res.wait();
    console.log("Waiting for status to change to RELAYED");
    await crossChainMessenger.waitForMessageStatus(
      res.hash,
      MessageStatus.RELAYED
    );

    return res;
  });
}

export function useWithdrawETH() {
  const { crossChainMessenger } = usePGN();
  return useMutation(async (amount: BigNumber) => {
    if (!crossChainMessenger) {
      throw new Error("CrossChainMessenger not initialized");
    }

    const res = await crossChainMessenger.withdrawETH(amount);
    console.log(`Transaction hash (on L2): ${res.hash}`);
    await res.wait();

    console.log("Waiting for status to be READY_TO_PROVE");
    await crossChainMessenger.waitForMessageStatus(
      res.hash,
      MessageStatus.READY_TO_PROVE
    );
    await crossChainMessenger.proveMessage(res.hash);

    console.log("In the challenge period, waiting for status READY_FOR_RELAY");
    await crossChainMessenger.waitForMessageStatus(
      res.hash,
      MessageStatus.READY_FOR_RELAY
    );
    console.log("Ready for relay, finalizing message now");
    await crossChainMessenger.finalizeMessage(res);
    console.log("Waiting for status to change to RELAYED");
    await crossChainMessenger.waitForMessageStatus(res, MessageStatus.RELAYED);
    return res;
  });
}

const CONDUIT_SLUG =
  process.env.NEXT_PUBLIC_CONDUIT_SLUG || "conduit:pgn-sepolia-i4td3ji6i0";

export function PGNProvider({ children }: PropsWithChildren) {
  const { data: l1 } = useSigner({ chainId: sepolia.id });
  const { data: l2 } = useSigner({ chainId: pgn.id });

  const [crossChainMessenger, setCrossChainMessenger] =
    useState<CrossChainMessenger>();

  useEffect(() => {
    if (l1 && l2) {
      getOptimismConfiguration(CONDUIT_SLUG).then((config: any) => {
        config.l1SignerOrProvider = l1;
        config.l2SignerOrProvider = l2;
        setCrossChainMessenger(new CrossChainMessenger(config as any));
      });
    }
  }, [l1, l2]);
  const state = {
    crossChainMessenger,
  };
  console.log(state);

  return <Context.Provider value={state}>{children}</Context.Provider>;
}
