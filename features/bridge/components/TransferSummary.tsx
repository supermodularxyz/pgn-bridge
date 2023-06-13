"use client";
import { useFormContext } from "react-hook-form";
import { Chain } from "wagmi";
import { Well } from "@/components/ui/Well";
import { useChainBalance } from "../hooks/useChainBalance";

export function TransferSummary({ chain }: { chain: Chain }) {
  const { watch } = useFormContext();

  const { balance, symbol } = useChainBalance({ chain, token: watch("token") });

  const amount = watch("amount") || 0;
  return (
    <Well className="text-gray-500 text-sm">
      <div>
        To <span className="font-bold text-gray-900">{chain?.name}</span>
      </div>
      <div>
        You will receive: {amount} {symbol}
      </div>
      <div>
        Balance: {balance?.slice(0, 6)} {symbol}
      </div>
    </Well>
  );
}
