import { useAuthStore } from "../store/use-auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

/**
 * Thin fetch wrapper with:
 * - Base URL prefixing
 * - JSON body serialization
 * - Auth Bearer token insertion
 * - 401 interception with silent refresh token rotation
 * - Single-flight refresh token queue to prevent race conditions
 * - Typed response parsing
 */
class ApiClient {
  private baseUrl: string;
  private refreshPromise: Promise<string | null> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Выполняет ротацию refresh токена (HttpOnly cookie) и обновляет accessToken в сторе.
   * Если несколько запросов одновременно получают 401, они ждут один и тот же промис.
   */
  async refreshAccessToken(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const url = `${this.baseUrl}/auth/refresh`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to refresh token");
        }

        const data = (await res.json()) as { accessToken?: string };
        if (data?.accessToken) {
          useAuthStore.getState().setAccessToken(data.accessToken);
          return data.accessToken;
        }

        return null;
      } catch {
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          if (
            window.location.pathname !== "/" &&
            !window.location.pathname.startsWith("/login") &&
            !window.location.pathname.startsWith("/register")
          ) {
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination
            window.location.href = "/";
          }
        }
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry: boolean = false
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
      const isAuthEndpoint =
        endpoint.startsWith("/auth/login") ||
        endpoint.startsWith("/auth/register") ||
        endpoint.startsWith("/auth/refresh");

      // Пытаемся автоматически обновить токен через refresh cookie
      if (!isRetry && !isAuthEndpoint) {
        const newToken = await this.refreshAccessToken();
        if (newToken) {
          // Повторяем запрос с новым access токеном
          const retryHeaders = {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          };
          return this.request<T>(
            endpoint,
            { ...options, headers: retryHeaders },
            true
          );
        }
      }

      if (!isAuthEndpoint) {
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          if (
            window.location.pathname !== "/" &&
            !window.location.pathname.startsWith("/login") &&
            !window.location.pathname.startsWith("/register")
          ) {
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination
            window.location.href = "/";
          }
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
