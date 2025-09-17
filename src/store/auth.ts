import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

interface UserClaims {
  sub: string;
  full_name: string;
  email: string;
  role: string;
  member_since: string;
}

interface AuthStoreState {
  isAuthenticated: boolean;
  jwtPayload?: UserClaims|null;
  role: "customer" | "admin";
  login: (token: string) => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  isAuthenticated: false,
  jwtPayload: null,
  role: "customer",
  login: (token: string) => set(state=>{ 
    try {
      const claims: UserClaims = jwtDecode<UserClaims>(token);
      return {
        ...state,
        isAuthenticated: true,
        jwtPayload: claims,
        role: claims.role === "admin" ? "admin" : "customer",
      };
    } catch {
      return{
        ...state,
      }
    }
  }),
}));