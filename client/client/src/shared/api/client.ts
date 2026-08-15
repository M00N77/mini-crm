import { useAuthStore } from "../store/use-auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/**
 * Thin fetch wrapper with:
 * - Base URL prefixing
 * - JSON body serialization
 * - Auth Bearer token insertion
 * - 401 interception & store cleanup
 * - Typed response parsing
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = useAuthStore.getState().accessToken;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    if (res.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") {
        if (
          !window.location.pathname.startsWith("/login") &&
          !window.location.pathname.startsWith("/register")
        ) {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/login";
        }
      }
      throw new Error("Unauthorized");
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const message =
        body.message ||
        body.error ||
        (Array.isArray(body.errors) ? body.errors[0]?.message : null) ||
        `HTTP ${res.status}`;
      throw new Error(message);
    }

    // 204 No Content
    if (res.status === 204) return undefined as T;

    return res.json();
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "GET" });
  }

  post<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
