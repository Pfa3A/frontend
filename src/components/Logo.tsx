import React from "react";
import logo from "@/assets/images/logo.png";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    classNameImage?: string;
}

export const Logo: React.FC<LogoProps> = ({ className, classNameImage }) => {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <img
                src={logo}
                alt="TicketChain Logo"
                className={cn("h-10 w-auto object-contain", classNameImage)}
            />
            <span className="text-xl font-bold tracking-tight text-slate-900">
                TicketChain
            </span>
        </div>
    );
};
