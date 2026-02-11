"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { setItem } from "@analytics/storage-utils";
import { Toaster, toast } from "sonner";
import { createUser, loginUser } from "@/services/auth"; // 假设你也有 registerUser
import { useRouter } from "next/navigation";
import { LOGIN_USER } from "@/common/constant";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    // 基础校验
    if (!name || !password || (!isLogin && !confirmPassword)) {
      toast.warning("请完善表单信息内容", { position: "top-center" });
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      toast.error("两次输入的密码不一致", { position: "top-center" });
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // 登录逻辑
        const { data, error } = await loginUser({ name, pwd: password });
        if (!error) {
          setItem(LOGIN_USER, data, { storage: "sessionStorage" });
          toast.success("登录成功，正在跳转...", { position: "top-center" });
          navigate.push("/");
        } else {
          toast.error("账号或密码错误", { position: "top-center" });
        }
      } else {
        const { data, error } = await createUser({
          name,
          pwd: password,
          email,
        });
        console.log("createUser", data);
        if (!error) {
          toast.success("账号注册成功！请登录", { position: "top-center" });
          setIsLogin(true); // 注册成功后切换回登录
        } else {
          toast.error("账号注册失败", { position: "top-center" });
        }
      }
    } catch (err) {
      toast.error("服务器响应失败，请稍后再试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh w-full bg-[#f8fafc] flex flex-col items-center justify-center p-6 font-sans">
      <Toaster richColors={true} />

      {/* 顶部 Logo 区 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
          <Activity className="text-white" size={36} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          AI 影像分析
        </h1>
        <p className="text-slate-400 text-[10px] mt-1 tracking-[0.2em] uppercase font-bold opacity-80">
          Medical Intelligent Service
        </p>
      </motion.div>

      {/* 表单容器 */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              {isLogin ? "欢迎回来" : "加入我们"}
            </h2>
            <p className="text-slate-400 text-sm mb-8">
              {isLogin ? "请输入账户与密码" : "开始您的智能医疗影像辅助之旅"}
            </p>

            <div className="space-y-4">
              {/* 用户名 */}
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={18}
                />
                <input
                  placeholder="请输入账号"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                />
              </div>

              {/* 注册时额外显示的邮箱字段 */}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="relative group"
                >
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                    size={18}
                  />
                  <input
                    placeholder="邮箱地址 (可选)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                  />
                </motion.div>
              )}

              {/* 密码 */}
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                />
              </div>

              {/* 注册时额外显示的确认密码字段 */}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="relative group"
                >
                  <CheckCircle2
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                    size={18}
                  />
                  <input
                    type="password"
                    placeholder="请再次输入密码"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                  />
                </motion.div>
              )}
            </div>

            <button
              onClick={onSubmit}
              disabled={isLoading}
              className={`w-full mt-8 py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed text-white/80"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>正在处理...</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? "立即登录" : "创建账户"}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </motion.div>
        </AnimatePresence>

        {/* 切换按钮 - 修复了点击切换功能 */}
        <div className="mt-8 text-center border-t border-slate-50 pt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-slate-500 hover:text-blue-600 transition-colors group"
          >
            {isLogin ? "还没有账号？" : "已有账号？"}
            <span className="text-blue-600 font-bold ml-1 group-hover:underline">
              {isLogin ? "立即注册" : "点击登录"}
            </span>
          </button>
        </div>
      </motion.div>

      {/* 底部保障 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 flex items-center gap-2 text-slate-400"
      >
        <ShieldCheck size={14} className="text-blue-500" />
        <span className="text-xs">医疗级数据安全隔离与端到端加密保护</span>
      </motion.div>
    </div>
  );
};

export default AuthPage;
