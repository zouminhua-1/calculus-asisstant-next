export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  code?: number;
}

export interface UserInfo {
  id: string;
  user_name: string;
  email?: string;
  avatar_url?: string;
}
