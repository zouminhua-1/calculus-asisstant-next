import { useState, useRef } from "react";
import request from "@/lib/request";
import useCurrentUser from "@/hooks/useCurrentUser";
import { MessageFile } from "@/types/analytics";

export const useConversation = () => {
  const conversationIdRef = useRef<string>("");
  const [activeId, setActiveId] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isMessageLoading, setIsMessageLoading] = useState(false);

  const user = useCurrentUser();
  const LOGIN_USER = user?.user_name;

  // 加载消息内容
  const loadConversation = async (convId: string) => {
    if (isMessageLoading || !LOGIN_USER) return;
    setActiveId(convId);
    setIsMessageLoading(true);
    conversationIdRef.current = convId;

    try {
      const res: any = await request.get("/api/messages", {
        params: { user: LOGIN_USER, conversation_id: convId },
      });

      // 格式化消息 [与原逻辑保持一致]
      const formattedMessages = res.data.reverse().flatMap((m: any) => {
        const userFiles =
          m.message_files
            ?.filter((f: MessageFile) => f.belongs_to == "user")
            ?.map((f: MessageFile) => ({
              ...f,
              src: f.url,
            })) || [];

        const aiFiles =
          m.message_files
            ?.filter((f: MessageFile) => f.belongs_to !== "user")
            ?.map((f: MessageFile) => ({
              ...f,
              src: f.url,
            })) || [];

        return [
          { role: "user", text: m.query, files: userFiles },
          { role: "ai", text: m.answer, files: aiFiles },
        ];
      });
      setChatHistory(formattedMessages);
    } catch (e) {
      console.error("加载消息失败", e);
    } finally {
      setIsMessageLoading(false);
    }
  };

  const startNewChat = () => {
    conversationIdRef.current = "";
    setActiveId("");
    setChatHistory([]);
  };

  // 删除会话
  const deleteConversation = async (convId: string, callback?: () => void) => {
    try {
      // 使用动态路径请求 API 路由
      await request.delete(`/api/conversations/${convId}`, {
        data: { user: LOGIN_USER },
      });

      if (activeId === convId) {
        startNewChat();
      }
      callback?.();
    } catch (e) {
      console.error("删除失败", e);
    }
  };

  return {
    chatHistory,
    activeId,
    isMessageLoading,
    conversationIdRef,
    loadConversation,
    startNewChat,
    deleteConversation,
    setActiveId,
  };
};
