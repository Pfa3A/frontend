import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Users } from "lucide-react";

const TITLE = 'ORGANIZATION';

const items = [
    {
        name: 'Events',
        path: '/organization/events',
        icon: Users
    }
]

export const OrganizerPageLayout = () => {
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-background">
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
                                    className="w-full"
                                >
                                    <Link
                                        to={item.path}
                                        className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors"
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </AppSidebar>

                <div className="flex-1 flex flex-col">
                    {/*<ManagerPageHeader name="Admin"/>*/}
                    <main className="p-6 flex-1 overflow-auto">
                        <Outlet />
                    </main>
                </div>
            </SidebarProvider>
        </div>
    )
}