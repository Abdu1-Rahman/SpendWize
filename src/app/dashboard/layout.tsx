"use client";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen relative">
      <Sidebar />
      <main className="flex-1 overflow-y-auto ml-50 mt-2">{children}</main>
    </div>
  );
}
