import { SetMetadata } from "@nestjs/common";
export const ROLES_KEY = "roles";
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
export const STAFF_ROLES = ["OWNER", "ADMIN", "MANAGER"] as const;
export const StaffOnly = () => Roles(...STAFF_ROLES);
