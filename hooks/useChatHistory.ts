import { useState } from "react";
import request from "@/lib/request";
import useCurrentUser from "@/hooks/useCurrentUser";

interface UseChatHistoryReturn {
  historyList: any[];
  isListLoading: boolean;
  fetchHistoryList: () => Promise<void>;
}

export const useChatHistory = (): UseChatHistoryReturn => {
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [isListLoading, setIsListLoading] = useState(false);

  const user = useCurrentUser();
  const LOGIN_USER = user?.user_name;

  const fetchHistoryList = async () => {
    if (!LOGIN_USER) return;
    try {
      setIsListLoading(true);

      // 直接请求我们定义的 API 路由
      // Axios 会自动处理参数拼接，也可以手动拼接
      const res = await request.get("/api/conversations", {
        params: { user: LOGIN_USER, limit: 20 },
      });
      setHistoryList(res.data || []);
    } catch (e) {
      console.error("获取历史失败", e);
    } finally {
      setIsListLoading(false);
    }
  };

  return {
    historyList,
    isListLoading,
    fetchHistoryList,
  };
};
