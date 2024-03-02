export const hasRequiredRoles = (roles: string[], requiredRoles: string[]): boolean => {
    return requiredRoles.every(requiredRole => roles.includes(requiredRole));
};
