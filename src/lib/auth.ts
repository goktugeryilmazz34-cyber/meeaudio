export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role?: "admin" | "user";
};

export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === "admin";
}
