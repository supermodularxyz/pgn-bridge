"use client";
import { Input, Label } from "@/components/ui/Form";
import { useFormContext } from "react-hook-form";
import { Chain } from "wagmi";
import { useChainBalance } from "../hooks/useChainBalance";

export function TokenAmount({
  chainIn,
  chainOut,
}: {
  chainIn: Chain;
  chainOut: Chain;
}) {
  const form = useFormContext();

  const balanceIn = useChainBalance({
    chain: chainIn,
    token: form.watch("token"),
  });
  const balanceOut = useChainBalance({
    chain: chainOut,
    token: form.watch("token"),
  });

  return (
    <div>
      <div className="flex justify-between">
        <Label htmlFor="amount">Amount</Label>
        <div className="text-gray-500 text-sm tracking-wider">
          Balance: {balanceIn.balance?.slice(0, 6)} {balanceIn.symbol}
        </div>
      </div>
      <div className="flex relative gap-2 mb-1">
        <Input
          autoComplete="off"
          type="number"
          step="0.00000001"
          min={0}
          size="lg"
          placeholder="0.0"
          className="flex-1"
          disabled={form.formState.isSubmitting}
          {...form.register("amount", { valueAsNumber: true })}
        />
        <button
          onClick={() => form.setValue("amount", balanceIn.balance)}
          type="button"
          className="p-2 h-10 w-16 absolute right-1 top-1 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          MAX
        </button>
      </div>
      <div className="text-sm text-gray-500 tracking-wider">
        You will receive: {form.watch("amount") || 0} {balanceOut.symbol}
      </div>
    </div>
  );
}
