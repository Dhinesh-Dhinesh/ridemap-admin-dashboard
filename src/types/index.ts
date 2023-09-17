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

export interface UserData {
    readonly id: number | string;
    readonly name: string;
    readonly fatherName: string;
    readonly enrollNo: string;
    readonly department: string;
    readonly emailOrPhone: string;
    readonly phone: string;
    readonly gender: string;
    readonly city: string;
    readonly busStop: string;
    readonly busNo: string;
    readonly address: string;
    readonly validUpto: string;
    readonly createdAt: any;
    readonly lastLoginAt?: any;
}

export type BusUsersDatas = {
    [key: string]: UserData[] | null
}