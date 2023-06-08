"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./ui/Button";

export function ConnectWallet() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        return (
          <Button color="primary" onClick={openConnectModal}>
            Connect wallet
          </Button>
        );
      }}
    </ConnectButton.Custom>
  );
}
