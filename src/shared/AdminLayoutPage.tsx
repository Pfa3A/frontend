import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  SidebarProvider,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Users, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const TITLE = "ADMIN";

const items = [
  {
    name: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    name: "Create Organizer",
    path: "/admin/create-organizer",
    icon: UserPlus,
  },
];

export const AdminPageLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-white text-slate-900 relative overflow-hidden">
      {/* subtle premium background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-28 -left-24 h-72 w-72 rounded-full blur-3xl opacity-35"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.14), rgba(168,85,247,0))",
          }}
        />
        <div
          className="absolute -top-24 -right-15 h-72 w-72 rounded-full blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.12), rgba(139,92,246,0))",
          }}
        />
        <div
          className="absolute -bottom-30 left-1/3 h-80 w-80 rounded-full blur-3xl opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.10), rgba(168,85,247,0))",
          }}
        />
      </div>

      <SidebarProvider>
        <AppSidebar title={TITLE}>
          {items.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    "w-full rounded-xl border border-transparent bg-transparent px-0 text-slate-700",
                    "hover:bg-slate-100 hover:text-slate-900 transition",
                    isActive &&
                      "bg-slate-900 text-white hover:bg-slate-900 border-slate-900 shadow-sm"
                  )}
                >
                  <Link to={item.path} className="flex items-center gap-3 px-3 py-2.5">
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        isActive ? "text-white" : "text-slate-500"
                      )}
                    />
                    <span className="font-semibold text-sm tracking-tight">
                      {item.name}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </AppSidebar>

        {/* Right content */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="sticky top-0 z-20 px-6 py-4 border-b border-slate-200 bg-white/80 backdrop-blur flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Admin Console
              </p>
              <h1 className="text-sm font-semibold text-slate-900 mt-1">{TITLE}</h1>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};