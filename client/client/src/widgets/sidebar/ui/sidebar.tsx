"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  StickyNote, 
  Settings, 
  LogOut,
  Plus
} from "lucide-react";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { useAuthStore } from "@/shared/store/use-auth-store";
import { apiClient } from "@/shared/api";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Users, label: "Контакты", href: "/dashboard/contacts" },
  { icon: CheckSquare, label: "Задачи", href: "/dashboard/tasks" },
  { icon: StickyNote, label: "Заметки", href: "/dashboard/notes" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // ignore network / api errors on logout
    } finally {
      logout();
      router.replace("/");
    }
  };

  return (
    <aside className="hidden md:flex flex-col h-full w-[240px] shrink-0 border-r border-outline-variant bg-surface-container-lowest p-container-padding justify-between">
      <div className="space-y-4">
        {/* Brand/Logo */}
        <div className="px-2 py-1 flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
            <span className="text-[14px] font-bold text-on-primary">N</span>
          </div>
          <span className="typo-headline text-primary font-extrabold tracking-tight">
            Nexus CRM
          </span>
        </div>

        {/* Quick Add / New Record Button */}
        <button
          type="button"
          className="w-full bg-primary text-on-primary rounded-lg py-2 px-3 typo-body-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Новая запись</span>
        </button>

        {/* Navigation list */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 typo-body-lg transition-all duration-150",
                  isActive
                    ? "bg-secondary-container text-primary font-medium shadow-sm"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Session actions */}
      <div className="space-y-4">
        {user && (
          <div className="px-2 py-1 flex items-center gap-2 text-on-surface-variant">
            <div className="w-7 h-7 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-xs font-semibold text-primary">
              {(user.name || user.email || "U").charAt(0).toUpperCase()}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-medium text-primary truncate">{user.name || user.email}</p>
              <p className="text-[10px] text-on-surface-variant/70 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <div className="border-t border-outline-variant pt-4">
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 typo-body-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
          >
            <Settings className="h-4 w-4 shrink-0" />
            <span className="truncate">Настройки</span>
          </Link>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-error hover:text-error hover:bg-error-container/20 px-3 py-2 h-auto typo-body-lg font-normal cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Выйти</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
