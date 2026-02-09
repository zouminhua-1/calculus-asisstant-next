"use client";

import React, { useEffect, useRef, useState } from "react";

import { useChatHistory } from "@/hooks/useChatHistory";
import { useConversation } from "@/hooks/useConversation";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatArea } from "@/components/ChatArea";
import { HistoryDrawer } from "@/components/HistoryDrawer";
import useCurrentUser from "@/hooks/useCurrentUser";
import { DEFAULT_CHAT_USER } from "@/common/constant";
import { confirm } from "@/ui/confirm";

const Home: React.FC = () => {
  const chatRef = useRef<any>(null);
  const user = useCurrentUser();
  const LOGIN_USER = user?.user_name || DEFAULT_CHAT_USER;
  console.log("LOGIN_USER:", LOGIN_USER);
  const { historyList, isListLoading, fetchHistoryList } = useChatHistory();
  console.log("HistoryList:", historyList);
  const {
    chatHistory,
    activeId,
    setActiveId,
    isMessageLoading,
    conversationIdRef,
    loadConversation,
    startNewChat,
    deleteConversation,
  } = useConversation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchHistoryList();
  }, []);

  /**
   * 核心逻辑：拦截 Deep Chat 请求并转换为 Dify 接口调用
   */
  const requestHandler = async (body: any, signals: any) => {
    const { onResponse, onClose } = signals;

    try {
      let userText = "";
      let userFiles: File[] = [];

      // 1. 数据提取逻辑 (保持不变)
      if (body instanceof FormData) {
        const message = body.get("message1") as any;
        userText = JSON.parse(message).text;
        userFiles = body.getAll("files") as File[];
      } else {
        for (const msg of body.messages ?? []) {
          console.log("msg:", msg, typeof msg);
          if (msg.text) userText += msg.text;
          if (msg.files) userFiles.push(...msg.files);
        }
      }

      console.log("userText:", userText);
      console.log("userFiles:", userFiles);

      // 2. 调用内部文件上传接口
      let uploadedFileId = "";
      if (userFiles.length > 0) {
        const fd = new FormData();
        fd.append("file", userFiles[0]);
        fd.append("user", LOGIN_USER);

        const upRes = await fetch("/api/files/upload", {
          method: "POST",
          body: fd,
        });
        const upData = await upRes.json();
        uploadedFileId = upData.id;
      }

      // 3. 构建 Payload 并调用内部聊天接口
      const payload = {
        inputs: {},
        query: userText || "请分析这张图片",
        user: LOGIN_USER,
        response_mode: "streaming",
        conversation_id: conversationIdRef.current || undefined,
        files: uploadedFileId
          ? [
              {
                type: "image",
                transfer_method: "local_file",
                upload_file_id: uploadedFileId,
              },
            ]
          : undefined,
      };

      const chatResponse = await fetch("/api/chat-messages", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!chatResponse.ok) throw new Error("聊天请求失败");

      // 4. 流式解析逻辑 (优化后的版本)
      const reader = chatResponse.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          try {
            const data = JSON.parse(trimmed.substring(5));

            if (data.conversation_id && !conversationIdRef.current) {
              conversationIdRef.current = data.conversation_id;
            }

            if (["message", "agent_message"].includes(data.event)) {
              onResponse({ text: data.answer, overwrite: false });
            }
          } catch (e) {
            console.warn("解析流片段失败");
          }
        }
      }
    } catch (e: any) {
      onResponse({ error: e.message || "连接出错" });
    } finally {
      onClose();
    }
  };

  return (
    <>
      <div className="flex h-dvh w-full bg-white overflow-hidden text-slate-900 transition-colors">
        <HistoryDrawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            fetchHistoryList();
          }}
          historyList={historyList}
          isLoading={isListLoading}
          activeId={activeId}
          onFetchHistory={fetchHistoryList}
          onSelect={(id) => {
            setIsDrawerOpen(false);
            loadConversation(id);
          }}
          onDelete={async (e, id) => {
            e.stopPropagation();
            const ok = await confirm({
              title: "删除确认",
              message: "确认删除该记录？",
              confirmText: "删除",
              cancelText: "取消",
              danger: true,
            });
            if (ok) {
              deleteConversation(id, () => {
                if (activeId === id) {
                  startNewChat();
                  setActiveId("");
                }
                fetchHistoryList();
              });
            }
          }}
          onNewChat={() => {
            setIsDrawerOpen(false);
            startNewChat();
          }}
        />
        <div className="flex-1 flex flex-col w-full relative">
          <ChatHeader
            onMenuClick={() => {
              setIsDrawerOpen(true);
            }}
            onNewChat={startNewChat}
          />

          <ChatArea
            ref={chatRef}
            history={chatHistory}
            isMessageLoading={isMessageLoading}
            requestHandler={requestHandler}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
