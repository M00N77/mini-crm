/** Paginated list response envelope (matches server format) */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/** Standard API error shape */
export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}
