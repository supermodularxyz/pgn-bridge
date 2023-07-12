import { Address } from "wagmi";
import { networks } from "./networks";

export const tokens = [
  {
    name: "ETH",
    l1Address: "",
    l2Address: "",
  },
  networks.l2.network === "pgnTestnet"
    ? {
        name: "TestToken",
        l1Address: "0x10246FE5Bf3b06Fc688eD4AA1445FF52358CE3A9",
        l2Address: "0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2",
      }
    : null,
];

export const getToken = (addr?: Address) =>
  tokens.find((t) => t.l1Address === addr);

export const getTokenForChain = (addr: Address, network: string) =>
  getToken(addr)?.[
    network === "pgn" ? "l2Address" : "l1Address"
  ] as `0x${string}`;
