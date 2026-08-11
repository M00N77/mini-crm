"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  Search, 
  Bell, 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  StickyNote, 
  X 
} from "lucide-react";
import { cn } from "@/shared/lib";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
  { icon: Users, label: "Контакты", href: "/dashboard/contacts" },
  { icon: CheckSquare, label: "Задачи", href: "/dashboard/tasks" },
  { icon: StickyNote, label: "Заметки", href: "/dashboard/notes" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile TopAppBar */}
      <header className="h-14 w-full sticky top-0 z-40 flex items-center justify-between border-b border-outline-variant bg-background px-gutter md:hidden shrink-0">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded hover:bg-surface-container-high"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="typo-headline text-primary font-bold tracking-tight">Nexus</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded hover:bg-surface-container-high">
            <Search className="h-5 w-5" />
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded hover:bg-surface-container-high relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-error rounded-full" />
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant overflow-hidden">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBI3DHVtAwxQIzQSd7Q_zr9aUWnTIBdtxuptMu-13JEKHCPnFh2M3WkNxBqOHUp8yyYdI4XrUxfrqFLPBiOecx9jUJdPJZe7kaPd5FiMsAeVF_oEwZ4LmVbhTWYNZ8ojuDhWTNIVmgXaccCVEpwsVCMSSvxOmNJkU_gO7iTdJVI4T3FYKxwEoQXQCvKgZP-nYncf0PJQhdXHbDjpHFkIM4AY620S3iUBm14m5wEi5dGPc_v0fvrvVYb" 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-background/80 backdrop-blur-sm">
          <div className="w-[280px] bg-surface border-r border-outline-variant p-container-padding flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="typo-headline text-primary font-extrabold">Nexus CRM</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-on-surface-variant hover:text-primary p-1 rounded hover:bg-surface-container-high"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 typo-body-lg transition-colors",
                        isActive
                          ? "bg-secondary-container text-primary"
                          : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Desktop TopBar */}
      <header className="hidden md:flex h-14 w-full sticky top-0 z-40 bg-background border-b border-outline-variant items-center justify-between px-6 shrink-0">
        <nav>
          <ol className="flex items-center space-x-2 text-on-surface-variant typo-body-sm">
            <li>
              <span className="text-primary font-medium capitalization capitalize">
                {pathname.replace("/dashboard", "").replace("/", "") || "Overview"}
              </span>
            </li>
          </ol>
        </nav>
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-between px-3 py-1.5 w-64 bg-surface-container-low border border-outline-variant rounded-md text-on-surface-variant hover:text-primary hover:border-outline transition-all">
            <span className="flex items-center gap-2 typo-body-sm">
              <Search className="h-4 w-4" />
              Search commands...
            </span>
            <kbd className="hidden sm:inline-block typo-label-mono bg-surface-container border border-outline-variant rounded px-1.5 text-on-surface-variant">
              ⌘K
            </kbd>
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-container-high relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-error rounded-full" />
          </button>
          <div className="w-8 h-8 rounded-full border border-outline-variant overflow-hidden">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBI3DHVtAwxQIzQSd7Q_zr9aUWnTIBdtxuptMu-13JEKHCPnFh2M3WkNxBqOHUp8yyYdI4XrUxfrqFLPBiOecx9jUJdPJZe7kaPd5FiMsAeVF_oEwZ4LmVbhTWYNZ8ojuDhWTNIVmgXaccCVEpwsVCMSSvxOmNJkU_gO7iTdJVI4T3FYKxwEoQXQCvKgZP-nYncf0PJQhdXHbDjpHFkIM4AY620S3iUBm14m5wEi5dGPc_v0fvrvVYb" 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Mobile BottomNavBar */}
      <nav className="md:hidden fixed bottom-0 w-full z-40 bg-surface-container-lowest border-t border-outline-variant flex justify-around items-center px-2 py-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 min-w-[64px] transition-colors rounded-xl",
                isActive
                  ? "text-primary bg-secondary-container"
                  : "text-on-surface-variant hover:text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="typo-caption mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
