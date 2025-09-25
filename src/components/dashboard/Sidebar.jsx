"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ReceiptText,
  PlusCircle,
  Wallet,
  PieChart,
  CalendarClock,
  Settings,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/transaction", label: "Transactions", icon: ReceiptText },
  { href: "/dashboard/add-expense", label: "Add Expense", icon: PlusCircle },
  { href: "/dashboard/budgets", label: "Budgets", icon: Wallet },
  { href: "/dashboard/reports", label: "Reports", icon: PieChart },
  { href: "/dashboard/recurring", label: "Recurring Bills", icon: CalendarClock },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      className="
        fixed rounded-r-2xl shadow border p-4 space-y-1 h-full
        bg-background border-border
      "
    >
      {nav.map(({ href, label, icon: Icon }) => {
        const active = pathname === href ;
        // || pathname?.startsWith(href + "/")
        return (
          <Link
            key={href}
            href={href}
            className={`
              flex items-center gap-3 rounded-lg px-3 py-2 transition-colors
              hover:bg-accent hover:text-accent-foreground
              ${active ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"}
            `}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
