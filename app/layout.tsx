import { Inter } from "next/font/google";
import "./globals.css";
import site from "@/config/site";
import Link from "next/link";

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
        <main className="h-screen bg-gray-100">
          <Header />
          {children}
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
    <header className="flex p-2 bg-white">
      <div className="w-32 h-12 bg-gray-300" />
      <nav className="flex items-center ml-12">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-gray-600 hover:text-gray-900 font-bold text-sm px-4 flex items-center h-full"
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </header>
  );
}
