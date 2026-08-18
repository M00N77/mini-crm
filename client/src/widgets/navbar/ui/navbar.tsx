"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Menu, 
  Search, 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  StickyNote, 
  X, 
  LogOut 
} from "lucide-react";
import { cn } from "@/shared/lib";
import { useAuthStore } from "@/shared/store/use-auth-store";
import { useModalStore } from "@/shared/store/modal-store";
import { apiClient } from "@/shared/api";
import { ProfileDropdown } from "./profile-dropdown";
import { NotificationsPopover } from "./notifications-popover";
import { QuickCreateMenu } from "@/widgets/sidebar/ui/quick-create-menu";
import { ThemeToggle } from "@/shared/ui";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Обзор", href: "/dashboard" },
  { icon: Users, label: "Контакты", href: "/dashboard/contacts" },
  { icon: CheckSquare, label: "Задачи", href: "/dashboard/tasks" },
  { icon: StickyNote, label: "Заметки", href: "/dashboard/notes" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { openModal } = useModalStore();

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // ignore
    } finally {
      logout();
      router.replace("/");
    }
  };

  return (
    <>
      {/* Mobile TopAppBar */}
      <header className="h-14 w-full sticky top-0 z-40 flex items-center justify-between border-b border-border-subtle bg-surface px-container-padding md:hidden shrink-0">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Открыть меню"
            className="text-text-secondary hover:text-text-primary transition-colors p-1.5 rounded-none hover:bg-subtle cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-sans text-text-primary font-bold tracking-tight text-sm">Nexus CRM</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            type="button"
            onClick={() => openModal("commandPalette")}
            aria-label="Быстрый поиск ⌘K"
            className="text-text-secondary hover:text-text-primary transition-colors p-1.5 rounded-none hover:bg-subtle cursor-pointer"
          >
            <Search className="h-4.5 w-4.5" />
          </button>
          <ThemeToggle />
          <NotificationsPopover />
          <ProfileDropdown />
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-canvas/80 backdrop-blur-xs">
          <div className="w-[280px] bg-surface border-r border-border-subtle p-container-padding flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-sans text-text-primary font-extrabold text-sm">Nexus CRM</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Закрыть меню"
                  className="text-text-secondary hover:text-text-primary p-1 rounded-none hover:bg-subtle cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Quick Add Button with Dropdown */}
              <QuickCreateMenu onActionSelect={() => setMobileMenuOpen(false)} />

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
                        "flex items-center gap-3 rounded-none px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-accent-subtle text-accent border border-accent-border"
                          : "text-text-secondary hover:text-text-primary hover:bg-subtle"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-border-subtle pt-4 space-y-3">
              {user && (
                <div className="text-xs text-text-secondary">
                  <p className="font-medium text-text-primary">{user.name || user.email}</p>
                  <p className="text-text-tertiary font-mono text-[11px]">{user.email}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2 text-status-danger hover:bg-status-danger/10 rounded-none text-sm font-medium transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Выйти</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Desktop TopBar */}
      <header className="hidden md:flex h-14 w-full sticky top-0 z-40 bg-surface border-b border-border-subtle items-center justify-between px-6 shrink-0">
        <nav>
          <ol className="flex items-center space-x-2 text-text-secondary text-xs font-mono">
            <li>
              <span>root://</span>
              <span className="text-text-primary font-bold capitalize">
                {pathname.replace("/dashboard", "").replace("/", "") || "overview"}
              </span>
            </li>
          </ol>
        </nav>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => openModal("commandPalette")}
            className="flex items-center justify-between px-3 py-1.5 w-64 bg-subtle border border-border-subtle rounded-none text-text-secondary hover:text-text-primary hover:border-border-strong transition-all cursor-pointer shadow-2xs"
          >
            <span className="flex items-center gap-2 text-xs font-mono">
              <Search className="h-3.5 w-3.5 text-text-tertiary" />
              Команды и поиск...
            </span>
            <kbd className="hidden sm:inline-block font-mono bg-surface border border-border-subtle rounded-none px-1.5 text-text-tertiary text-[10px]">
              ⌘K
            </kbd>
          </button>
          
          <ThemeToggle />
          <NotificationsPopover />
          <ProfileDropdown />
        </div>
      </header>

      {/* Mobile BottomNavBar */}
      <nav className="md:hidden fixed bottom-0 w-full z-40 bg-surface border-t border-border-subtle flex justify-around items-center px-2 py-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 min-w-[64px] transition-colors rounded-none",
                isActive
                  ? "text-accent font-bold"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              <Icon className="h-4.5 w-4.5" />
              <span className="text-[11px] font-mono mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
