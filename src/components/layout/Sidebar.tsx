"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tests", label: "Tests" },
  { href: "/packages", label: "Packages" },
  { href: "/admins", label: "Admins" },
  {href:"/bookings", label:"Bookings" }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r h-screen">
      <div className="px-6 py-5 text-xl font-semibold text-primary">
        Lab Admin
      </div>

      <nav className="px-2 space-y-1">
        {links.map((link) => {
          const active =
            pathname === link.href || pathname.startsWith(link.href + "/");

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                group relative flex items-center px-4 py-2 rounded-lg
                text-sm font-medium transition-all duration-200 cursor-pointer
                ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }
              `}
            >
              {/* Left accent bar */}
              <span
                className={`
                  absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r
                  transition-all duration-200
                  ${
                    active
                      ? "bg-blue-600"
                      : "bg-transparent group-hover:bg-slate-400"
                  }
                `}
              />

              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
