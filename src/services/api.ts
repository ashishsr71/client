// Define types for responses
import { ProductType } from "@/types";

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export const api = {
  // Auth
  login: async (email: string, password: string):Promise<{user: User, message: string}> => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to login");
    }
    return res.json();
  },

  register: async (name: string, email: string, password: string):Promise<{user: User, message: string}> => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to register");
    }
    return res.json();
  },

  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
  },

  getMe: async ():Promise<{user: User}> => {
    const res = await fetch("/api/auth/me");
    if (!res.ok) throw new Error("Not authenticated");
    return res.json();
  },

  // Products
  getProducts: async (searchParams?: URLSearchParams):Promise<ProductType[]> => {
    const queryString = searchParams ? `?${searchParams.toString()}` : "";
    const res = await fetch(`/api/products${queryString}`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },

  getProduct: async (id: string):Promise<ProductType> => {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error("Failed to fetch product");
    return res.json();
  },
};
