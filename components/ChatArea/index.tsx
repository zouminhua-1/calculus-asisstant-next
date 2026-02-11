"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { introPanelHtml } from "./introPanelHtml";
import dynamic from "next/dynamic";

const DeepChat = dynamic(
  () => import("deep-chat-react").then((mod) => mod.DeepChat),
  { ssr: false },
);

interface ChatAreaProps {
  history: any[];
  isMessageLoading: boolean;
  requestHandler: (body: any, signals: any) => Promise<void>;
}

export const ChatArea = forwardRef<any, ChatAreaProps>(
  ({ history, isMessageLoading, requestHandler }, ref) => {
    return (
      <main className="flex-1 overflow-hidden relative">
        {isMessageLoading && (
          <div className="fixed inset-0 z-100 bg-white/50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        <DeepChat
          ref={ref}
          history={history}
          className="d-chat"
          submitButtonStyles={{
            submit: {
              container: { default: { width: "30px", height: "30px" } },
              svg: { styles: { default: { width: "26px", height: "26px" } } },
            },
          }}
          images={{
            button: {
              styles: {
                container: { default: { width: "32px", height: "32px" } },
                svg: {
                  styles: { default: { width: "30px", height: "30px" } },
                },
              },
            },
            files: {
              maxNumberOfFiles: 1,
              acceptedFormats: ".png,.jpg,.jpeg",
            },
          }}
          introMessage={{
            html: introPanelHtml,
          }}
          avatars={{
            user: {
              src: "/doctor.png",
              styles: { container: { width: "35px", height: "35px" } },
            },
            ai: {
              src: "/robot.png",
              styles: { container: { width: "35px", height: "35px" } },
            },
          }}
          connect={{ handler: requestHandler, stream: true }}
          errorMessages={{
            overrides: {
              default: "请求失败，请稍后再试",
            },
          }}
          style={{
            height: "90vh",
            width: "100vw",
            border: "none",
            backgroundColor: "transparent",
          }}
          messageStyles={{
            default: {
              user: {
                bubble: {
                  backgroundColor: "#2563eb",
                  color: "white",
                  borderRadius: "20px 20px 4px 20px",
                  padding: "12px 16px",
                  fontSize: "15px",
                },
              },
              ai: {
                bubble: {
                  backgroundColor: "#f1f5f9",
                  color: "#1e293b",
                  borderRadius: "20px 20px 20px 4px",
                  padding: "12px 16px",
                  fontSize: "15px",
                  maxWidth: "90%",
                },
              },
            },
          }}
          textInput={{
            placeholder: { text: "输入问题或发送图片..." },
            characterLimit: 500,
            styles: {
              container: {
                minHeight: "40px",
              },
              text: {
                padding: "10px 6px",
              },
            },
          }}
        />
      </main>
    );
  },
);

ChatArea.displayName = "ChatArea";
