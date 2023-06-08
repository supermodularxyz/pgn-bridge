"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./ui/Button";

export function ConnectWallet() {
  return (
    <ConnectButton.Custom>
      {({}) => {
        return <Button color="primary">Connect wallet</Button>;
      }}
    </ConnectButton.Custom>
  );
}
