import React from "react";
import { BackgroundBlobs } from "@/components/BackgroundBlobs";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  SidebarProvider,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { CreativeCommonsIcon, LayoutDashboard, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const TITLE = "ORGANIZATION";

const items = [
  {
    name: "Dashboard",
    path: "/organizer/dashboard",
    icon: LayoutDashboard
  },
  {
    name: "Events",
    path: "/organizer/events",
    icon: Users,
  },
  {
    name: "Create Event",
    path: "/organizer/create-event",
    icon: CreativeCommonsIcon,
  }
];

export const OrganizerPageLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-white text-slate-900 relative overflow-hidden">
      {/* subtle premium background */}
      <BackgroundBlobs />

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
                Organizer Console
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