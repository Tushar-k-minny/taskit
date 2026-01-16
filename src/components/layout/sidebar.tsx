"use client";

import {
  CheckSquare,
  Kanban,
  List,
  ListChecks,
  SquaresFour,
  X,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: SquaresFour },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/projects", label: "Projects", icon: Kanban },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button - only shown when sidebar is closed */}
      {!isMobileOpen && (
        <Button
          className="fixed top-4 left-4 z-50 lg:hidden"
          onClick={() => setIsMobileOpen(true)}
          size="icon"
          variant="ghost"
        >
          <List className="h-5 w-5" weight="bold" />
        </Button>
      )}

      {/* Mobile overlay */}
      {isMobileOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-md lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          type="button"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-sidebar-border border-r bg-card transition-transform duration-300 lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-sidebar-border border-b px-6">
          <div className="flex items-center gap-2">
            <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-lg">
              <ListChecks className="h-5 w-5 text-white" weight="bold" />
            </div>
            <span className="font-bold text-sidebar-foreground text-xl">
              Taskit
            </span>
          </div>
          {/* Close button - only shown on mobile when open */}
          <Button
            className="lg:hidden"
            onClick={() => setIsMobileOpen(false)}
            size="icon"
            variant="ghost"
          >
            <X className="h-5 w-5" weight="bold" />
          </Button>
        </div>
        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-sm transition-all duration-200 hover:bg-white/10",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "bg-foreground-accent-foreground/10 text-sidebar-foreground/70 hover:translate-x-1 hover:text-sidebar-foreground"
                )}
                href={item.href}
                key={item.href}
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon
                  className="h-5 w-5"
                  weight={isActive ? "fill" : "regular"}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
