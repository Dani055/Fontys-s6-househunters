export interface AccessToken {
    sub: string;
    email: string;
    roles: string[];
    iat: number;
    exp: number;
}