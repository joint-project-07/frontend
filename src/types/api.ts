export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
  }

  export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }

  export interface ApiError {
    statusCode: number;
    message: string;
    errors?: Record<string, string[]>;
  }
  
  export interface FilterOptions {
    [key: string]: string | number | boolean | string[] | undefined;
  }

  export interface SortOptions {
    field: string;
    order: 'asc' | 'desc';
  }
  
  export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: SortOptions;
    filter?: FilterOptions;
  }