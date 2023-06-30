import { Chain } from "wagmi/chains";

export const pgn = {
  id: 58008,
  name: "PGN",
  network: "pgn",
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
