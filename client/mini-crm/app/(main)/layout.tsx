'use client';

import { type ReactNode, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppShell } from '@/src/components/layouts/AppShell';
import { RouteGuard } from '@/src/components/auth/RouteGuard';
import { useAuth } from '@/src/context/AuthProvider';

export default function MainLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeRoute = pathname.split('/').filter(Boolean)[0] || 'dashboard';

  return (
    <RouteGuard>
    <AppShell
      activeRoute={activeRoute}
      onNavigate={(route) => { setSidebarOpen(false); router.push(`/${route}`); }}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      userName={user?.name ?? ''}
      isSidebarOpen={sidebarOpen}
      onToggleSidebar={() => setSidebarOpen((v) => !v)}
    >
      {children}
    </AppShell>
    </RouteGuard>
  );
}
