import { Sidebar } from "@/widgets/sidebar";
import { Navbar } from "@/widgets/navbar";
import { AuthGuard } from "@/features/auth-by-email";

export const metadata = { title: "Dashboard — Nexus CRM" };

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-dvh overflow-hidden bg-background">
        {/* Desktop sidebar */}
        <Sidebar />

        {/* Main area */}
        <div className="flex flex-1 flex-col min-w-0">
          <Navbar />
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>

        {/* Mobile bottom nav — rendered inside Navbar on md:hidden */}
      </div>
    </AuthGuard>
  );
}
