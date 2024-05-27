export {}

declare global {
    namespace Express {
      export interface Request {
        userId: string
        userRoles: string[]
        email: string
      }
    }
}