"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const items = [
    {
      title: "Bridge",
      href: "/bridge",
    },
    {
      title: "Transactions",
      href: "/transactions",
    },
  ];
  return (
    <header className="p-2 bg-white">
      <div className="flex container mx-auto">
        <Link
          href="/"
          className="pl-4 font-bold text-3xl text-gray-800 hover:text-primary-900"
        >
          PGN
        </Link>
        <nav className="flex items-center ml-12">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "text-gray-700 hover:text-gray-700 underline-offset-4 font-bold text-sm px-4 flex items-center h-full",
                { ["text-gray-900 underline"]: item.href === pathname }
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
