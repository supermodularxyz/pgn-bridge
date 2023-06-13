import { Inter } from "next/font/google";
import "./globals.css";
import site from "@/config/site";
import Link from "next/link";
import { PGNProvider } from "@/providers/PGN";
import { QueryProvider } from "@/providers/Query";
import { WalletProvider } from "@/providers/Wallet";

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

function Header() {
  const items = [
    {
      title: "Bridge",
      href: "/bridge",
    },
  ];
  return (
    <header className="p-2 bg-white">
      <div className="flex container mx-auto">
        <Link
          href="/"
          className="font-bold text-3xl text-gray-800 hover:text-primary-900"
        >
          PGN
        </Link>
        <nav className="flex items-center ml-12">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-900 hover:text-gray-700 font-bold text-sm px-4 flex items-center h-full"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
