'use client';

import { type ReactNode, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppShell } from '@/src/components/layouts/AppShell';
import { MOCK_USER } from '@/src/lib/mock';
import { RouteGuard } from '@/src/components/auth/RouteGuard';

export default function MainLayout({ children }: { children: ReactNode }) {
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
      userName={MOCK_USER}
      isSidebarOpen={sidebarOpen}
      onToggleSidebar={() => setSidebarOpen((v) => !v)}
    >
      {children}
    </AppShell>
    </RouteGuard>
  );
}
