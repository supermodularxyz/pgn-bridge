"use client";
import { Button } from "@/components/ui/Button";
import { useFormContext } from "react-hook-form";

import { ethers } from "ethers";
import { Address, useAccount, useContractWrite } from "wagmi";
import { tokens } from "@/config/tokens";

export function MintTokens() {
  const form = useFormContext();
  const { address } = useAccount();
  const { l1Address } = tokens[1];
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
  if (form.watch("token") !== l1Address) return null;
  return (
    <Button
      type="button"
      disabled={mint.isLoading}
      onClick={() =>
        mint.write({
          recklesslySetUnpreparedArgs: [
            address as any,
            ethers.utils.parseEther("1"),
          ],
        })
      }
    >
      Mint test tokens
    </Button>
  );
}
