"use client";
import { Button } from "@/components/ui/Button";
import { useFormContext } from "react-hook-form";
import { Chain, useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { ConnectWallet } from "@/components/ConnectButton";
import { parseEther } from "ethers/lib/utils.js";
import { useChainBalance } from "../hooks/useChainBalance";
import { Alert } from "@/components/ui/Alert";

export function TransferAction({
  action,
  chain,
  isLoading,
}: {
  action: string;
  chain: Chain;
  isLoading?: boolean;
}) {
  const { watch } = useFormContext();
  const { address } = useAccount();
  const network = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const { value } = useChainBalance({ chain, token: watch("token") });

  if (!address || network.chain?.unsupported) {
    return (
      <>
        {network.chain?.unsupported ? (
          <Alert variant="error">{`You're on the wrong network. Please switch to ${chain.name}.`}</Alert>
        ) : null}
        <ConnectWallet className="w-full" />
      </>
    );
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
  const balanceOverAmount =
    amount && value?.gte(parseEther(String(parseFloat(amount).toFixed(18))));

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
