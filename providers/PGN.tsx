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
import { Address, sepolia, useConnect, useProvider, useSigner } from "wagmi";
import { pgn } from "@/config/chain";
import { useMutation } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import tokens from "@/config/tokens";

const Context = createContext<{
  crossChainMessenger?: CrossChainMessenger;
}>({});

export const usePGN = () => useContext(Context);

export function useDeposit() {
  const { crossChainMessenger } = usePGN();
  return useMutation(
    async ({
      amount,
      token,
    }: {
      amount: BigNumber;
      token?: { l1Address: string; l2Address: string; name: string };
    }) => {
      if (!crossChainMessenger) {
        throw new Error("CrossChainMessenger not initialized");
      }

      const { l1Address, l2Address } = token || {};
      let res;
      console.log({ l1Address, l2Address, amount });
      // Deposit ERC20 tokens
      if (l1Address && l2Address) {
        console.log(crossChainMessenger);
        console.log("Approving ERC20");
        const allowance = await crossChainMessenger.approveERC20(
          l1Address,
          l2Address,
          amount
        );
        await allowance.wait();
        console.log("Depositing ERC20");
        res = await crossChainMessenger.depositERC20(
          l1Address,
          l2Address,
          amount
        );
      }
      // Deposit ETH
      else {
        res = await crossChainMessenger.depositETH(amount, {});
        console.log(`Transaction hash (on L1): ${res.hash}`);
      }
      await res.wait();
      console.log("Waiting for status to change to RELAYED");
      await crossChainMessenger.waitForMessageStatus(
        res.hash,
        MessageStatus.RELAYED
      );

      return res;
    }
  );
}

export function useWithdraw() {
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
  // const { data: l2 } = useSigner({ chainId: pgn.id });
  const l2 = useProvider({ chainId: pgn.id });
  const [crossChainMessenger, setCrossChainMessenger] =
    useState<CrossChainMessenger>();

  useEffect(() => {
    if (l1 && l2) {
      console.log("l1", l1);
      // const signer = l1
      // console.log("l2", l1.connect(l2));

      getOptimismConfiguration(CONDUIT_SLUG).then((config: any) => {
        console.log(l2);
        config.l1SignerOrProvider = l1;
        config.l2SignerOrProvider = l2;
        console.log(config);
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
