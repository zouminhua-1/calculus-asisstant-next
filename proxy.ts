import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy 文件在请求完成前运行，
 * 适用于身份验证、重定向等服务器端逻辑。
 */
export function proxy(request: NextRequest) {
  // 从 Cookie 中获取登录状态
  const token = request.cookies.get("auth_token");

  console.log("proxy token:", token);

  const { pathname } = request.nextUrl;

  // 1. 权限拦截：未登录用户访问非登录页面
  if (!token && pathname !== "/login") {
    // 重定向到登录页
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. 反向拦截：已登录用户访问登录页，自动跳回聊天主页
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  // 继续执行后续请求
  return NextResponse.next();
}

// 配置匹配规则，避免拦截静态资源和 API 本身
export const config = {
  matcher: [
    /*
     * 排除所有以 api, _next/static, _next/image, favicon.ico 开头的路径
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
