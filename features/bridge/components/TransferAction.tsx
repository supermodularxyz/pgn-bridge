"use client";
import { Button } from "@/components/ui/Button";
import { useFormContext } from "react-hook-form";
import { Chain, useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { ConnectWallet } from "@/components/ConnectButton";
import { parseEther } from "ethers/lib/utils.js";
import { useChainBalance } from "../hooks/useChainBalance";

export function TransferAction({
  chain,
  isLoading,
}: {
  chain: Chain;
  isLoading?: boolean;
}) {
  const { watch } = useFormContext();
  const { address } = useAccount();
  const network = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const { value } = useChainBalance({ chain, token: watch("token") });

  if (!address || network.chain?.unsupported) {
    return <ConnectWallet className="w-full" />;
  }

  if (chain?.id !== network.chain?.id) {
    return (
      <Button
        color="primary"
        type="button"
        className="w-full"
        onClick={() => switchNetwork?.(chain?.id)}
      >
        Switch to {chain?.name}
      </Button>
    );
  }

  const amount = watch("amount");
  if (!amount || Number.isNaN(amount)) {
    return (
      <Button className="w-full" disabled>
        Enter an amount
      </Button>
    );
  }

  const balanceOverAmount = value?.gte(parseEther(String(amount)));

  if (balanceOverAmount) {
    return (
      <Button
        className="w-full"
        color="primary"
        type="submit"
        disabled={isLoading}
      >
        Transfer
      </Button>
    );
  }
  return (
    <Button className="w-full" disabled>
      Insufficient balance
    </Button>
  );
}
