"use client";
import { PropsWithChildren, createContext, useContext } from "react";

import { CrossChainMessenger } from "@eth-optimism/sdk";
import { getOptimismConfiguration } from "@conduitxyz/sdk";
import { Chain, sepolia, useProvider, useSigner } from "wagmi";
import { pgn } from "@/config/chain";
import { useQuery } from "@tanstack/react-query";
import { Signer } from "ethers";
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

export function useCrossChainMessenger({
  l1AsSigner = false,
  readonly = false,
} = {}) {
  /*
  Needs to handle 3 use-cases:
  - Deposit           L1 => L2 (Signer is L1)
  - Withdraw          L2 => L1 (Signer is L2)
  - Query withdrawals L2

  The reason we need the readonly with 2 providers is:
  - To fetch withdrawals we need to be on PGN network
  - Prove and Finalize require signing an L1 transaction
  - Only 1 signer can be active per chain at a time

  */
  const { l1, l2 } = usePGN();

  let l1SignerOrProvider: Provider | Signer | null | undefined;
  let l2SignerOrProvider: Provider | Signer | null | undefined;

  let enabled;
  if (readonly) {
    l1SignerOrProvider = useProvider({ chainId: l1?.id });
    l2SignerOrProvider = useProvider({ chainId: l2?.id });
    enabled =
      Provider.isProvider(l1SignerOrProvider) &&
      Provider.isProvider(l2SignerOrProvider);
  } else if (l1AsSigner) {
    l1SignerOrProvider = useSigner({ chainId: l1?.id }).data;
    l2SignerOrProvider = useProvider({ chainId: l2?.id });
    enabled =
      Signer.isSigner(l1SignerOrProvider) &&
      Provider.isProvider(l2SignerOrProvider);
  } else {
    l1SignerOrProvider = useProvider({ chainId: l1?.id });
    l2SignerOrProvider = useSigner({ chainId: l2?.id }).data;
    enabled =
      Provider.isProvider(l1SignerOrProvider) &&
      Signer.isSigner(l2SignerOrProvider);
  }

  return useQuery(
    ["crosschain-messenger", { l1AsSigner, readonly, enabled }],
    async () =>
      createCrossChainMessenger({ l1SignerOrProvider, l2SignerOrProvider }),
    { enabled }
  );
}

export function PGNProvider({ children }: PropsWithChildren) {
  const l1 = sepolia;
  const l2 = pgn;

  const state = { l1, l2 };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}
