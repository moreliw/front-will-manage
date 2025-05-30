export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Tenant {
  id: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  tenant?: Tenant;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
} 