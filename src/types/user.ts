export type Role = "CLIENT"|"ORGANIZER"|"ADMIN";

export interface User{
    id:string;
    firstName:string;
    lastName:string;
    email:string;
    phoneNumber:string;
    role:Role;
    accountActivated:boolean;
}