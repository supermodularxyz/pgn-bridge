"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ComponentPropsWithoutRef } from "react";
import { Button } from "./ui/Button";

export function ConnectWallet(props: ComponentPropsWithoutRef<"button">) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    color="primary"
                    onClick={openConnectModal}
                    type="button"
                    {...props}
                  >
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    color="primary"
                    onClick={openChainModal}
                    type="button"
                    {...props}
                  >
                    Switch network
                  </Button>
                );
              }
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
