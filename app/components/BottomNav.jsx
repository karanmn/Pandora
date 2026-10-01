"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, Gem, Tag, Wallet } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/user/crypto/home", icon: Home },
    { label: "Markets", href: "/user/crypto/market", icon: BarChart2 },
    { label: "Promotion", href: "/user/crypto/promotion", icon: Gem },
    { label: "Offers", href: "/user/crypto/offers", icon: Tag },
    { label: "Assets", href: "/user/crypto/assets", icon: Wallet },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#13151b]/95 backdrop-blur-md border-t border-gray-800/80 px-2 py-2 flex justify-around items-center z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition ${
              isActive ? "text-[#f5a623]" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
