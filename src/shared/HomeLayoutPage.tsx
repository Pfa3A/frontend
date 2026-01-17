import { ClientHomePageHeader } from "@/components/ClientHomePageHeader";
import { Outlet } from "react-router-dom";
import { BackgroundBlobs } from "@/components/BackgroundBlobs";
import { Footer } from "@/components/Footer";

export const HomePageLayout = () => {
    return (
        <div className="relative min-h-screen flex flex-col bg-white">
            <BackgroundBlobs />
            <ClientHomePageHeader />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}