"use client";
import { useAccount } from "wagmi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCrossChainMessenger } from "./crossChainMessenger";

export function useChallengePeriod() {
  const { data: crossChainMessenger } = useCrossChainMessenger({
    readonly: true,
  });
  return useQuery(
    ["challenge-period"],
    async () =>
      crossChainMessenger?.getChallengePeriodSeconds().then((n) => n * 1000),
    { enabled: Boolean(crossChainMessenger) }
  );
}
export function useWithdrawals() {
  const { address } = useAccount();

  const { data: crossChainMessenger } = useCrossChainMessenger({
    readonly: true,
  });
  return useQuery(
    ["withdrawals", address],
    async () =>
      crossChainMessenger?.getWithdrawalsByAddress(address as `0x${string}`),
    { enabled: Boolean(crossChainMessenger && address) }
  );
}

export function useWithdrawalReceipt(hash: string, status: number) {
  const { data: crossChainMessenger } = useCrossChainMessenger({
    readonly: true,
  });
  return useQuery(
    ["withdrawal-receipt", hash],
    async () => {
      return status > 4 ? crossChainMessenger?.getMessageReceipt(hash) : null;
    },
    { enabled: Boolean(crossChainMessenger && hash) }
  );
}

export function useWithdrawalStatus(hash: string) {
  const { data: crossChainMessenger } = useCrossChainMessenger({
    readonly: true,
  });
  return useQuery(
    ["withdrawal-status", hash],
    async () => {
      return crossChainMessenger?.getMessageStatus(hash);
    },
    { enabled: Boolean(crossChainMessenger) }
  );
}

export function useBlock(block: number) {
  const { data: crossChainMessenger } = useCrossChainMessenger({
    readonly: true,
  });
  return useQuery(
    ["block", block],
    () =>
      crossChainMessenger?.l2Provider
        .getBlock(block)
        .then((tx) => tx.timestamp * 1000),
    { enabled: Boolean(block && crossChainMessenger) }
  );
}

export function useProve() {
  const { data: crossChainMessenger } = useCrossChainMessenger({
    l1AsSigner: true,
  });
  return useMutation(async (hash: string) =>
    crossChainMessenger?.proveMessage(hash).then((tx) => tx.wait())
  );
}
export function useFinalize() {
  const { data: crossChainMessenger } = useCrossChainMessenger({
    l1AsSigner: true,
  });
  return useMutation(async (hash: string) =>
    crossChainMessenger?.finalizeMessage(hash).then((tx) => tx.wait())
  );
}
