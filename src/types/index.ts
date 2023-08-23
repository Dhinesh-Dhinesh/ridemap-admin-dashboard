// User Slice types
export interface User {
    readonly displayName: string | null;
    readonly uid: string;
    readonly institute: string;
    readonly email: string | null;
    readonly phoneNumber: string | null;
    readonly emailVerified: boolean;
    readonly accessToken: string | null;
}

export interface AdminData {
    readonly name: string;
    readonly email: string;
    readonly phone?: string;
    readonly institute: string;
    readonly userId: string;
    readonly createdAt: string | null;
    readonly lastLoginAt?: string | null;
}

// Institute Slice types
export type Departments = string[] | null;
export type Admins = AdminData & {
    readonly id: string;
}