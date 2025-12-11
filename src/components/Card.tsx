import type { ReactNode } from "react"


export const Card = ({children}:{children: ReactNode}) =>{
    return (
        <div className="p-16 rounded-2xl bg-white">
            {children}
        </div>
    )
}