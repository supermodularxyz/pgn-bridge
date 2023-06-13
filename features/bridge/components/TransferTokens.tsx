"use client";
import { Input, Select } from "@/components/ui/Form";
import { useFormContext } from "react-hook-form";
import { tokens } from "@/config/tokens";
import { Chain } from "wagmi";
import { useChainBalance } from "../hooks/useChainBalance";
import { Well } from "@/components/ui/Well";

export function TransferTokens({ chain }: { chain: Chain }) {
  const form = useFormContext();

  const { balance, symbol } = useChainBalance({
    chain,
    token: form.watch("token"),
  });

  return (
    <Well className="flex flex-col gap-2">
      <div className="text-gray-500 text-sm">
        From <span className="font-bold text-gray-900">{chain?.name}</span>
      </div>
      <div className="flex gap-1">
        <Input
          type="number"
          step="0.00000001"
          min={0}
          size="lg"
          placeholder="0.0"
          className="flex-1"
          {...form.register("amount", { valueAsNumber: true })}
        />
        <Select className="bg-white" {...form.register("token")}>
          {tokens.map((token) => (
            <option key={token.l1Address} value={token.l1Address}>
              {token.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="text-sm text-gray-500 flex gap-1">
        Balance: {balance?.slice(0, 6)} {symbol}
        {balance ? (
          <button
            type="button"
            className="text-red-500"
            onClick={() => form.setValue("amount", balance)}
          >
            (Max)
          </button>
        ) : null}
      </div>
    </Well>
  );
}
