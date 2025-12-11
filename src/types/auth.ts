export  interface UserLoginRequest{
    email:string;
    password:string;
}

export  interface UserSignUpRequest{
    email:string;
    password:string;
    firstName:string;
    lastName:string;
    phoneNumber:string;
}