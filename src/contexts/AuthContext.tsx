// src/contexts/AuthContext.tsx

import type { UserLoginRequest, UserSignUpRequest } from "@/types/auth";
import type { User } from "@/types/user";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import api from "@/api";

export interface AuthContextType {
  user?: User;
  token: string;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  loading: boolean;
  login: (user: UserLoginRequest) => Promise<string>;
  signup: (user: UserSignUpRequest) => Promise<void>;
  logout: () => void;
  getUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// 🔹 Helper function to extract roles
const extractRoles = (u: any): string[] => {
  if (!u) return [];

  if (typeof u.role === "string" && u.role.trim() !== "") {
    return [u.role.trim().toUpperCase()];
  }

  if (Array.isArray(u.roles) && u.roles.length > 0) {
    return u.roles.map((r: any) => String(r).trim().toUpperCase());
  }

  if (Array.isArray(u.authorities) && u.authorities.length > 0) {
    return u.authorities.map((a: any) => {
      if (typeof a === "string") return a.trim().toUpperCase();
      if (a && typeof a.authority === "string") return a.authority.trim().toUpperCase();
      return "";
    }).filter(Boolean);
  }

  if (typeof u.rolesString === "string") return [u.rolesString.trim().toUpperCase()];

  return [];
};

// 🔹 Helper function to get redirect path based on role
const getRedirectPathByRole = (user: User | undefined): string => {
  if (!user) return "/login";

  const roles = extractRoles(user).map((r) => r.replace(/^ROLE_/, ""));

  if (roles.includes("ADMIN")) return "/admin";
  if (roles.includes("ORGANIZER")) return "/organizer";
  if (roles.includes("CLIENT")) return "/client";

  return "/dashboard"; // default page if no role matches
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const baseUrl = "api/v1/users/";

  // 🔹 Hydrate from localStorage once
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  const login = async (userLogin: UserLoginRequest): Promise<string> => {
  try {
    setLoading(true);

    const response = await api.post<string>(baseUrl+"sign-in", userLogin);
    console.log("Login response token:", response.data);

    setToken(response.data);
    localStorage.setItem("token", response.data);
    //api.defaults.headers.common["Authorization"] = `Bearer ${response.data}`;

    const userResponse = await api.get<User>(baseUrl+"me");
    setUser(userResponse.data);
    console.log("Logged in user:", userResponse.data);
    localStorage.setItem("user", JSON.stringify(userResponse.data));

    const redirectPath = getRedirectPathByRole(userResponse.data);
    console.log("Determined redirect path:", redirectPath);

    return redirectPath; // ⬅️ important
  } catch (err: any) {
    setToken("");
    console.log("Error during login:", err);
    throw err;
  } finally {
    setLoading(false);
  }
};


  const signup = async (userSignup: UserSignUpRequest) => {
    try {
      setLoading(true);
      await api.post(baseUrl, userSignup);
      setToken("");
    } catch (err: any) {
      setToken("");
      console.log("Error during sign-up:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUser = async (): Promise<void> => {
    try {
      setLoading(true);

      let storedToken = token || localStorage.getItem("token");

      if (storedToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        setToken(storedToken);
      } else {
        console.log("No token found → user is not logged in");
        setUser(undefined);
        return;
      }

      const response = await api.get<User>(baseUrl+"me");
      console.log("Fetched user:", response.data);

      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (err: any) {
      console.log("Error during fetching user:", err);
      setUser(undefined);
      setToken("");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(undefined);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{ user, token, setUser, loading, login, signup, getUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
};

// 🔹 Export helper for use in components
export { getRedirectPathByRole };