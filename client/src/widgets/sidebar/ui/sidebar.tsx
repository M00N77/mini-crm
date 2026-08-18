"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  StickyNote, 
  Settings, 
  LogOut
} from "lucide-react";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { useAuthStore } from "@/shared/store/use-auth-store";
import { useModalStore } from "@/shared/store/modal-store";
import { apiClient } from "@/shared/api";
import { QuickCreateMenu } from "./quick-create-menu";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Обзор", href: "/dashboard", code: "01" },
  { icon: Users, label: "Контакты", href: "/dashboard/contacts", code: "02" },
  { icon: CheckSquare, label: "Задачи", href: "/dashboard/tasks", code: "03" },
  { icon: StickyNote, label: "Заметки", href: "/dashboard/notes", code: "04" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { openModal } = useModalStore();

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

  const handleOpenSettings = () => {
    openModal("accountSettings");
  };

  return (
    <aside className="hidden md:flex flex-col h-full w-[240px] shrink-0 border-r border-border-subtle bg-surface p-container-padding justify-between">
      <div className="space-y-4">
        {/* Brand/Logo */}
        <Link href="/dashboard" className="px-2 py-1 flex items-center gap-2.5 group">
          <div className="h-6 w-6 rounded-none bg-accent flex items-center justify-center font-mono font-bold text-accent-contrast text-xs tracking-tighter transition-transform group-hover:scale-105">
            N
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans font-bold text-text-primary tracking-tight text-sm">
              Nexus CRM
            </span>
            <span className="font-mono text-[9px] text-accent px-1 py-0.2 rounded-none border border-accent-border bg-accent-subtle">
              SYS
            </span>
          </div>
        </Link>

        {/* Quick Add / New Record Dropdown */}
        <QuickCreateMenu />

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
                  "flex items-center justify-between rounded-none px-3 py-2 text-xs transition-all duration-150 group",
                  isActive
                    ? "bg-accent-subtle text-accent font-semibold border border-accent-border"
                    : "text-text-secondary hover:text-text-primary hover:bg-subtle border border-transparent"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                <span className="font-mono text-[10px] text-text-tertiary group-hover:text-text-secondary">
                  [{item.code}]
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Session actions */}
      <div className="space-y-3">
        {user && (
          <div className="px-2.5 py-2 flex items-center gap-2 text-text-secondary bg-subtle rounded-none border border-border-subtle">
            <div className="w-6 h-6 rounded-none bg-accent text-accent-contrast font-mono font-bold text-xs flex items-center justify-center shrink-0">
              {(user.name || user.email || "U").charAt(0).toUpperCase()}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-semibold text-text-primary truncate leading-tight">
                {user.name || "Оператор"}
              </p>
              <p className="text-[10px] text-text-tertiary font-mono truncate mt-0.5">
                {user.email}
              </p>
            </div>
          </div>
        )}
        <div className="border-t border-border-subtle pt-2 space-y-0.5">
          <button
            type="button"
            onClick={handleOpenSettings}
            className="w-full flex items-center gap-2.5 rounded-none px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-subtle transition-colors cursor-pointer text-left font-medium"
          >
            <Settings className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Настройки аккаунта</span>
          </button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-2.5 text-status-danger hover:text-status-danger hover:bg-status-danger/10 px-3 py-1.5 h-auto text-xs font-medium cursor-pointer rounded-none"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            <span>Выйти из сессии</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
