"use client";
import { getTokenForChain } from "@/config/tokens";
import { Address, Chain, useAccount, useBalance } from "wagmi";

export function useChainBalance({
  chain,
  token,
}: {
  chain: Chain;
  token: Address;
}) {
  const { address } = useAccount();
  const { data } = useBalance({
    address,
    chainId: chain?.id,
    token: getTokenForChain(token, chain?.network),
    watch: true,
    enabled: Boolean(address && chain?.id),
  });

  return {
    value: data?.value,
    balance: data?.formatted,
    symbol: data?.symbol,
  };
}
