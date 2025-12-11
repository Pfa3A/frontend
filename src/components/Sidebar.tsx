import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarLogoutButton,
} from "@/components/ui/sidebar";

export function AppSidebar({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Sidebar
      className="
        border-r shadow-lg 
        [&_[data-slot=sidebar-inner]]:bg-gradient-to-br 
        [&_[data-slot=sidebar-inner]]:from-sky-50 
        [&_[data-slot=sidebar-inner]]:via-white 
        [&_[data-slot=sidebar-inner]]:to-blue-100
        [&_[data-slot=sidebar-inner]]:backdrop-blur
      "
    >
      {/* Header */}
      <SidebarHeader className="border-b px-5 py-4 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 border border-slate-200 backdrop-blur">
            <img  alt="FastBus logo" className="h-7 w-auto" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              FastBus
            </span>
            <span className="text-[11px] uppercase tracking-wide text-[#0071BC]">
              {title}
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-3 py-4 bg-white/50 backdrop-blur-sm">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-medium text-slate-500 mb-2">
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {children}
            </SidebarMenu>
          </SidebarGroupContent>

        </SidebarGroup>
      </SidebarContent>
      <SidebarLogoutButton />

      {/* Footer */}
      <SidebarFooter className="border-t px-4 py-3 bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col text-xs text-slate-500">
          <span>© 2025 FastBus</span>
          <span className="text-[11px] text-slate-400">
            Votre compagnon de trajet.
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}