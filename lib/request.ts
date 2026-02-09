import axios from "axios";

const request = axios.create({
  // 在 Next.js 中，由于采用了 API Routes，
  // 客户端请求通常统一指向 /api 路径，无需配置复杂的代理路径
  baseURL: "/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器：可以处理 Token 注入
request.interceptors.request.use(
  (config) => {
    // 例如：从 localStorage 获取 token
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器：统一错误提示
request.interceptors.response.use(
  (response) => response.data, // 直接返回 data 部分
  (error) => {
    const message = error.response?.data?.error || "请求失败";
    console.error("API Error:", message);
    return Promise.reject(message);
  },
);

export default request;
