import { Chain } from "wagmi/chains";

export const pgn = {
  id: 424,
  name: "PGN",
  network: "pgn",
  nativeCurrency: { name: "Ether", symbol: "pgnETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc.publicgoods.network"],
    },
    public: {
      http: ["https://rpc.publicgoods.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "PGN Explorer",
      url: "https://explorer.publicgoods.network",
    },
  },
  contracts: {},
} as const satisfies Chain;

export const pgnTestnet = {
  id: 58008,
  name: "PGN Testnet",
  network: "pgnTestnet",
  nativeCurrency: { name: "Ether", symbol: "gETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://sepolia.publicgoods.network"],
    },
    public: {
      http: ["https://sepolia.publicgoods.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "PGN Explorer",
      url: "https://explorer.sepolia.publicgoods.network",
    },
  },
  contracts: {},
} as const satisfies Chain;
