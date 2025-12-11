export type Role = "CLIENT"|"ORGANIZER"|"ADMIN";

export interface User{
    id:string;
    firstName:string;
    lastName:string;
    username:string;
    email:string;
    role:Role;
    accountActivated:boolean;
}