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
import {
  Address,
  Chain,
  sepolia,
  useAccount,
  useProvider,
  useSigner,
} from "wagmi";
import { pgn } from "@/config/chain";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BigNumber, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

const Context = createContext<{
  crossChainMessenger?: CrossChainMessenger;
  l1: Chain;
  l2: Chain;
}>({ l1: sepolia, l2: pgn });

export const usePGN = () => useContext(Context);

const CONDUIT_SLUG =
  process.env.NEXT_PUBLIC_CONDUIT_SLUG || "pgn-sepolia-i4td3ji6i0";

function createCrossChainMessenger({
  l1SignerOrProvider,
  l2SignerOrProvider,
}: any) {
  return getOptimismConfiguration(`conduit:${CONDUIT_SLUG}`).then(
    (config: any) =>
      new CrossChainMessenger({
        ...config,
        l1SignerOrProvider,
        l2SignerOrProvider,
      })
  );
}

function useMessenger() {
  const { l1, l2 } = usePGN();
  const l1SignerOrProvider = useProvider({ chainId: l1?.id });
  const { data: l2SignerOrProvider } = useSigner({ chainId: l2?.id });

  return useQuery(
    ["crosschain-messenger"],
    async () => {
      return createCrossChainMessenger({
        l1SignerOrProvider,
        l2SignerOrProvider,
      });
    },
    {
      enabled:
        Provider.isProvider(l1SignerOrProvider) &&
        Signer.isSigner(l2SignerOrProvider),
    }
  );
}

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
  const { l1, l2 } = usePGN();
  const { data: l1SignerOrProvider } = useSigner({ chainId: l1.id });
  const l2SignerOrProvider = useProvider({ chainId: l2.id });

  const [log, pushLog, resetLog] = useTransactionLog();
  const deposit = useMutation(async ({ amount, token }: Transfer) => {
    const crossChainMessenger = await createCrossChainMessenger({
      l1SignerOrProvider,
      l2SignerOrProvider,
    });
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
  const { l1, l2 } = usePGN();

  const l1SignerOrProvider = useProvider({ chainId: l1?.id });
  const { data: l2SignerOrProvider } = useSigner({ chainId: l2?.id });

  const [log, pushLog, resetLog] = useTransactionLog();
  const withdraw = useMutation(async ({ amount, token }: Transfer) => {
    const crossChainMessenger = await createCrossChainMessenger({
      l1SignerOrProvider,
      l2SignerOrProvider,
    });
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

    // pushLog("Waiting for status to be READY_TO_PROVE");
    // await crossChainMessenger.waitForMessageStatus(
    //   res.hash,
    //   MessageStatus.READY_TO_PROVE
    // );
    // pushLog(`Proving message...`);
    // await crossChainMessenger.proveMessage(res.hash);

    pushLog("Withdraw successful! Transaction will be finalized in 7 days.");

    return res;
  });
  return {
    ...withdraw,
    log,
  };
}

export function useWithdrawals() {
  const { address } = useAccount();
  const { data: messenger } = useMessenger();
  return useQuery(
    ["withdrawals", address],
    async () => messenger?.getWithdrawalsByAddress(address as string),

    {
      enabled: Boolean(address && messenger),
    }
  );
}

export function useWithdrawalReceipt(hash: string, status: number) {
  const { data: messenger } = useMessenger();
  console.log(hash);
  return useQuery(
    ["withdrawal-receipt", hash],
    async () => (status > 4 ? messenger?.getMessageReceipt(hash) : undefined),
    { enabled: Boolean(messenger) }
  );
}

export function useWithdrawalStatus(hash: string) {
  const { data: messenger } = useMessenger();
  return useQuery(
    ["withdrawal-status", hash],
    async () => messenger?.getMessageStatus(hash),
    { enabled: Boolean(messenger) }
  );
}

export function useCrossChainMessenger({ l1, l2 }: { l1: Chain; l2: Chain }) {
  const { data: l1SignerOrProvider } = useSigner({ chainId: l1.id });
  const l2SignerOrProvider = useProvider({ chainId: l2.id });

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
  const l1 = sepolia;
  const l2 = pgn;

  const state = { l1, l2 };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}
