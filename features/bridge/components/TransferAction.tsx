"use client";
import { Button } from "@/components/ui/Button";
import { useFormContext } from "react-hook-form";
import { usePGN } from "@/providers/PGN";
import {
  Chain,
  useAccount,
  useBalance,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { ConnectWallet } from "@/components/ConnectButton";
import { parseEther } from "ethers/lib/utils.js";

export function TransferAction({
  action,
  chain,
  isLoading,
}: {
  action: string;
  chain?: Chain;
  isLoading?: boolean;
}) {
  const { address, ...account } = useAccount();
  const { watch } = useFormContext();
  const network = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const tokenAddress = watch("token");
  const { data } = useBalance({
    address,
    token: tokenAddress,
    chainId: chain?.id,
    enabled: Boolean(address),
  });

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

  const balanceOverAmount = data?.value.gte(parseEther(String(amount)));

  if (balanceOverAmount) {
    return (
      <Button
        className="w-full"
        color="primary"
        type="submit"
        disabled={isLoading}
      >
        {action}
      </Button>
    );
  }
  return (
    <Button className="w-full" disabled>
      Insufficient balance
    </Button>
  );
}
