import { ConnectWallet } from "@/components/ConnectButton";
import { PGNProvider } from "@/providers/PGN";
import { QueryProvider } from "@/providers/Query";
import { WalletProvider } from "@/providers/Wallet";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <WalletProvider>
        <PGNProvider>
          <div className="flex justify-center pt-12">{children}</div>
        </PGNProvider>
      </WalletProvider>
    </QueryProvider>
  );
}
