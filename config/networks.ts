import { mainnet, sepolia } from "wagmi/chains";
import { pgn, pgnTestnet } from "@/config/chain";

const supportedChains = {
  mainnet,
  sepolia,
  pgn,
  pgnTestnet,
};

const L1 = process.env.NEXT_PUBLIC_L1 as keyof typeof supportedChains;

const L2 = process.env.NEXT_PUBLIC_L2 as keyof typeof supportedChains;

export const networks = {
  l1: supportedChains[L1],
  l2: supportedChains[L2],
};
