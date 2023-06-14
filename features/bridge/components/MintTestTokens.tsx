"use client";
import { ethers } from "ethers";
import { useFormContext } from "react-hook-form";
import {
  Address,
  sepolia,
  useAccount,
  useContractWrite,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";

import { Button } from "@/components/ui/Button";
import { getToken } from "@/config/tokens";

export function MintTokens() {
  const form = useFormContext();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const { name, l1Address } = getToken(form.watch("token")) || {};

  const mint = useContractWrite({
    address: l1Address as Address,
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "mint",
    mode: "recklesslyUnprepared",
  });

  // Hide if test token hasn't been selected
  if (!l1Address || form.watch("token") !== l1Address) return null;

  // Must be on L1
  if (chain?.network !== "sepolia") {
    return (
      <Button type="button" onClick={() => switchNetwork?.(sepolia.id)}>
        Switch to Sepolia to mint {name}
      </Button>
    );
  }
  return (
    <Button
      type="button"
      disabled={mint.isLoading}
      onClick={() =>
        mint.write({
          recklesslySetUnpreparedArgs: [
            address as any,
            ethers.utils.parseEther("10"),
          ],
        })
      }
    >
      Mint 10 {name}
    </Button>
  );
}
