"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();

  const navigation = [
    { name: "For Sell", href: "/for-sell" },
    { name: "For Rent", href: "/for-rent" },
    { name: "Agent Finder", href: "/agent-finder" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
                src="/logo.svg"
              alt="Logo"
              className="h-[150PX] w-[150PX]"
                width={150}
                height={150}
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-purple-600"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Button className="bg-purple-600 hover:bg-purple-700">
            Post Your Ad
          </Button>
          <Button variant="ghost">Login</Button>
        </div>
      </div>
    </header>
  );
}
