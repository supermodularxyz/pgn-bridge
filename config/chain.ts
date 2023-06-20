import { Chain } from "wagmi/chains";

export const pgn = {
  id: 58008,
  name: "PGN",
  network: "pgn",
  nativeCurrency: { name: "Ether", symbol: "gETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://l2-pgn-sepolia-i4td3ji6i0.t.conduit.xyz"],
    },
    public: {
      http: ["https://l2-pgn-sepolia-i4td3ji6i0.t.conduit.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "PGN Explorer",
      url: "https://explorerl2new-pgn-sepolia-i4td3ji6i0.t.conduit.xyz",
    },
  },
  contracts: {},
} as const satisfies Chain;
