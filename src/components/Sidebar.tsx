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
  SidebarLogoutButton
} from "@/components/ui/sidebar";

import Logo from "@/assets/images/logo.png";

export function AppSidebar({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Sidebar
      className={`
        bg-white
        border-r border-slate-200
        shadow-[0_0_0_1px_rgba(15,23,42,0.04),0_12px_40px_rgba(15,23,42,0.06)]
        [&_[data-slot=sidebar-inner]]:bg-white
        [&_[data-slot=sidebar-inner]]:relative
      `}
    >
      {/* Header */}
      <SidebarHeader className="border-b px-5 py-4 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 border border-slate-200 backdrop-blur">
            <img src={Logo} alt="FastBus logo" className="h-7 w-auto" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              OnChain Tickets
            </span>
            <span className="text-[11px] uppercase tracking-wide text-[#0071BC]">
              {title}
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="relative z-10 px-3 py-4 bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {children}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Logout */}
      <SidebarLogoutButton
        className="
          relative z-10
          border-t border-slate-200
          bg-white
          text-slate-500
          hover:bg-slate-50
        "
      />

      {/* Footer */}
      <SidebarFooter className="relative z-10 border-t border-slate-200 px-4 py-3 bg-white">
        <div className="flex flex-col text-[11px] text-slate-500">
          <span className="text-slate-600">
            © {new Date().getFullYear()} OnChain Tickets
          </span>
          <span className="text-[10px] text-slate-400">
            Secure · Verifiable · Tradeable
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
