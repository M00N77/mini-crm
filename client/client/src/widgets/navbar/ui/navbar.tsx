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

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
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
      <header className="h-14 w-full sticky top-0 z-40 flex items-center justify-between border-b border-outline-variant bg-background px-gutter md:hidden shrink-0">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded hover:bg-surface-container-high cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="typo-headline text-primary font-bold tracking-tight">Nexus</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            type="button"
            onClick={() => openModal("commandPalette")}
            aria-label="Быстрый поиск"
            className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-container-high cursor-pointer"
          >
            <Search className="h-4.5 w-4.5" />
          </button>
          <NotificationsPopover />
          <ProfileDropdown />
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-background/80 backdrop-blur-sm">
          <div className="w-[280px] bg-surface border-r border-outline-variant p-container-padding flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="typo-headline text-primary font-extrabold">Nexus CRM</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-on-surface-variant hover:text-primary p-1 rounded hover:bg-surface-container-high cursor-pointer"
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

            <div className="border-t border-outline-variant pt-4 space-y-3">
              {user && (
                <div className="text-xs text-on-surface-variant">
                  <p className="font-medium text-primary">{user.name || user.email}</p>
                  <p className="text-on-surface-variant/70">{user.email}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2 text-error hover:bg-error-container/20 rounded-lg text-sm transition-colors cursor-pointer"
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
      <header className="hidden md:flex h-14 w-full sticky top-0 z-40 bg-background border-b border-outline-variant items-center justify-between px-6 shrink-0">
        <nav>
          <ol className="flex items-center space-x-2 text-on-surface-variant typo-body-sm">
            <li>
              <span className="text-primary font-medium capitalize">
                {pathname.replace("/dashboard", "").replace("/", "") || "Overview"}
              </span>
            </li>
          </ol>
        </nav>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => openModal("commandPalette")}
            className="flex items-center justify-between px-3 py-1.5 w-64 bg-surface-container-low border border-outline-variant rounded-md text-on-surface-variant hover:text-primary hover:border-outline transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2 typo-body-sm">
              <Search className="h-4 w-4" />
              Search commands...
            </span>
            <kbd className="hidden sm:inline-block typo-label-mono bg-surface-container border border-outline-variant rounded px-1.5 text-on-surface-variant text-[11px]">
              ⌘K
            </kbd>
          </button>
          
          <NotificationsPopover />
          <ProfileDropdown />
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
