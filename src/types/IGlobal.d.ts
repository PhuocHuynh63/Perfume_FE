declare namespace GLOBAL {
    export interface IJWTPayload {
        _id: string;
        email: string;
        isAdmin: boolean;
        iat?: number;
        exp?: number;
    }

    export interface IChangePassword {
        password: string;
        newPassword: string;
        confirmPassword: string;
    }
}