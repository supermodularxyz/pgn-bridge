"use client";
import { CrossChainMessenger } from "@eth-optimism/sdk";
import { getOptimismConfiguration } from "@conduitxyz/sdk";
import { useProvider, useSigner } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { usePGN } from "../PGNProvider";

const CONDUIT_SLUG = process.env.NEXT_PUBLIC_CONDUIT_SLUG;

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
  - Only 1 signer can be active at a time

  */
  const { l1, l2 } = usePGN();

  let l1SignerOrProvider: Provider | Signer | null | undefined;
  let l2SignerOrProvider: Provider | Signer | null | undefined;

  // Query transactions
  if (readonly) {
    l1SignerOrProvider = useProvider({ chainId: l1?.id });
    l2SignerOrProvider = useProvider({ chainId: l2?.id });
  }
  // Deposit, Prove, Finalize
  else if (l1AsSigner) {
    l1SignerOrProvider = useSigner({ chainId: l1?.id }).data;
    l2SignerOrProvider = useProvider({ chainId: l2?.id });
  }
  // Withdraw
  else {
    l1SignerOrProvider = useProvider({ chainId: l1?.id });
    l2SignerOrProvider = useSigner({ chainId: l2?.id }).data;
  }

  return useQuery(
    ["crosschain-messenger", { l1AsSigner, readonly }],
    async () =>
      createCrossChainMessenger({ l1SignerOrProvider, l2SignerOrProvider }),
    { enabled: Boolean(l1SignerOrProvider && l2SignerOrProvider) }
  );
}
