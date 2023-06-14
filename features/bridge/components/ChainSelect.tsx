"use client";
import { Chain, useSwitchNetwork } from "wagmi";
import { Label } from "@/components/ui/Form";
import { Well } from "@/components/ui/Well";

export function ChainSelect({
  chainIn,
  chainOut,
}: {
  chainIn: Chain;
  chainOut: Chain;
}) {
  const { switchNetwork } = useSwitchNetwork();

  return (
    <div className="flex items-end">
      <div className="flex-1">
        <Label>From</Label>
        <Well className="text-lg font-bold bg-white">{chainIn.name}</Well>
      </div>
      <button
        type="button"
        className="mb-2 -mx-2 relative z-10 text-2xl rounded-full bg-gray-900 hover:bg-gray-700 transition-color text-white flex items-center justify-center w-12 h-12"
        onClick={() => switchNetwork?.(chainOut.id)}
      >
        ⇌
      </button>
      <div className="flex-1">
        <Label>To</Label>
        <Well className="text-lg font-bold bg-white">{chainOut.name}</Well>
      </div>
    </div>
  );
}
