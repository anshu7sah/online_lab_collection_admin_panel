"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tests", label: "Tests" },
  { href: "/packages", label: "Packages" },
  { href: "/admins", label: "Admins" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r">
      <div className="px-6 py-5 text-xl font-semibold text-primary">
        Lab Admin
      </div>

      <nav className="px-3 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition
                ${
                  active
                    ? "bg-blue-50 text-accent"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
