import request from "@/lib/request";
import { ApiResponse } from "@/types/api";

export const loginUser = (params: {
  name: string;
  pwd: string;
}): Promise<ApiResponse> => {
  // 请求我们在 src/app/api/login/route.ts 定义的接口
  return request.post("/api/login", params);
};

export const createUser = (params: {
  name: string;
  pwd: string;
  email?: string;
}): Promise<ApiResponse> => {
  return request.post("/api/register", params);
};

//登出
export const logoutUser = (): Promise<ApiResponse> => {
  return request.post("/api/logout");
};
