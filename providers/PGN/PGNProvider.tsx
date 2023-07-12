"use client";
import { PropsWithChildren, createContext, useContext } from "react";

import { CrossChainMessenger } from "@eth-optimism/sdk";
import { Chain } from "wagmi";
import { networks } from "@/config/networks";

const Context = createContext<{
  crossChainMessenger?: CrossChainMessenger;
  l1: Chain;
  l2: Chain;
}>(networks);

export const usePGN = () => useContext(Context);

export function PGNProvider({ children }: PropsWithChildren) {
  return <Context.Provider value={networks}>{children}</Context.Provider>;
}
