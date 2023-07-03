"use client";
import { PropsWithChildren, createContext, useContext } from "react";

import { CrossChainMessenger } from "@eth-optimism/sdk";
import { Chain, sepolia } from "wagmi";
import { pgn } from "@/config/chain";

const Context = createContext<{
  crossChainMessenger?: CrossChainMessenger;
  l1: Chain;
  l2: Chain;
}>({ l1: sepolia, l2: pgn });

export const usePGN = () => useContext(Context);

export function PGNProvider({ children }: PropsWithChildren) {
  const l1 = sepolia;
  const l2 = pgn;

  const state = { l1, l2 };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}
