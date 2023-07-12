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
import { Chain } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import site from "@/config/site";
import { networks } from "@/config/networks";

const projectId = "PGN";

const infuraKey = process.env.NEXT_PUBLIC_INFURA_API_KEY;
const configuredNetworks = Object.values(networks);

const { chains, provider } = configureChains(configuredNetworks, [
  jsonRpcProvider({
    rpc: (chain) => {
      const providers = configuredNetworks.reduce(
        (acc, x) => ({ ...acc, [x.network]: x }),
        {} as { [chain: string]: Chain }
      );

      const current = chain.network as keyof typeof providers;
      const { rpcUrls } = providers[current];

      const http = rpcUrls.infura
        ? `${rpcUrls.infura.http[0]}/${infuraKey}`
        : rpcUrls.public.http[0];

      return { http };
    },
  }),
]);

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
