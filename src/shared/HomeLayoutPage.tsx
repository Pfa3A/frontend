import { ClientHomePageHeader } from "@/components/ClientHomePageHeader";
import { Outlet } from "react-router-dom";


export const HomePageLayout = () => {

    
    return (
        <>
            <ClientHomePageHeader />
            <main className="layout-content">
                <Outlet />
            </main>
        </>
    )
}