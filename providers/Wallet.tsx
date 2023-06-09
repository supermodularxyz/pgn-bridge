"use client";

import * as React from "react";

import "@rainbow-me/rainbowkit/styles.css";

import {
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { sepolia } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import site from "@/config/site";
import { ethers } from "ethers";
import { pgn } from "@/config/chain";

const projectId = "PGN";

const { chains, provider } = configureChains(
  [sepolia, pgn],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        console.log(chain);
        const http = {
          pgn: "https://l2-pgn-sepolia-i4td3ji6i0.t.conduit.xyz",
          sepolia: `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        }[chain.network];

        console.log({ http });
        return {
          http,
        };
      },
    }),
  ]
);

const { wallets } = getDefaultWallets({
  appName: site.title,
  projectId,
  chains,
});

const appInfo = { appName: site.title };

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} appInfo={appInfo}>
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
