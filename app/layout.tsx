import { Inter } from "next/font/google";
import "./globals.css";
import site from "@/config/site";
import { PGNProvider } from "@/providers/PGN";
import { QueryProvider } from "@/providers/Query";
import { WalletProvider } from "@/providers/Wallet";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  ...site,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="h-screen bg-black">
          <QueryProvider>
            <WalletProvider>
              <PGNProvider>
                <Header />
                {children}
              </PGNProvider>
            </WalletProvider>
          </QueryProvider>
        </main>
      </body>
    </html>
  );
}
