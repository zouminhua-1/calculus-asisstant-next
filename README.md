# 🪨 StoneChat — 基于 AI 大模型的结石智能识别助手

> 利用 **Dify 工作流** 与 **多模态 AI 模型**，自动分析用户上传的结石显微图像，智能判断结石类型（如草酸钙、尿酸、磷酸铵镁等），为临床辅助诊断提供参考。

![示例截图](/public/images/login.png)
![示例截图](/public/images/应用.png)

---

## ✨ 核心功能

- 📷 **上传结石图像**：支持 JPG/PNG 等常见格式
- 🧠 **AI 自动分析**：通过 Dify 编排的多步工作流（图像理解 → 特征提取 → 类型分类）
- 📊 **结构化结果**：清晰展示结石类型、置信度及医学建议
- 🌐 **响应式设计**：适配桌面与移动端，使用 Tailwind CSS 构建

---

## 🛠 技术栈

| 类别          | 技术                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| **主要技术**  | Next.js 16 + React 19 + TypeScript + Dify + Prisma + Supabase + Axios 一站式开发，加Vercel一键快速部署 |
| **UI 组件库** | DeepChat + Lucide React 图标                                                                           |
| **样式方案**  | Tailwind CSS v4 + PostCSS                                                                              |
| **图像处理**  | Dify 工作流（内置多模态模型）                                                                          |

---

## 🚀 快速开始

### 前置要求

- Node.js ≥ 18.x
- 申请 [Supabase](https://supabase.com/) 账号，以及 [Dify](https://cloud.dify.ai/) 账号
- 创建一个 Supabase 项目，并获取PUBLISHABLE_KEY
- 获取Dify API KEY
- npm / pnpm / yarn（推荐 pnpm）
- 已在 [Dify](https://cloud.dify.ai/) 创建应用并配置好**结石识别工作流**

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或 npm
npm install
```
