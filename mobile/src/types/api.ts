export interface PageResponse<T> {
  items: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  timestamp: string;
  errors?: Record<string, string>;
}
