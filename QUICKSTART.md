# Quick Start Guide

## 🚀 快速开始（本地开发）

### 前置要求
- Python 3.11+
- Node.js 18+
- PostgreSQL（生产）或使用 SQLite（开发）

### 1️⃣ 一键启动后端

```powershell
# 进入后端目录
cd backend

# 创建并激活虚拟环境
python -m venv venv
.\venv\Scripts\Activate.ps1

# 安装依赖
pip install -r requirements.txt

# 复制并配置环境变量
Copy-Item .env.example .env
# 编辑 .env 文件，至少设置：
# ADMIN_PASSWORD=your-secure-admin-password
# FRIEND_PASSWORD=your-secure-friend-password
# EXTERNAL_API_KEY=your-api-key
# EXTERNAL_API_URL=https://api.openai.com/v1/chat/completions

# 启动后端（自动初始化数据库）
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

后端地址：http://localhost:8000  
API 文档：http://localhost:8000/docs

### 2️⃣ 一键启动前端

打开新的终端：

```powershell
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 复制并配置环境变量
Copy-Item .env.example .env
# 默认配置已经正确，无需修改

# 启动前端
npm run dev
```

前端地址：http://localhost:5173

### 3️⃣ 登录测试

打开浏览器访问 `http://localhost:5173`

**管理员账号：**
- 用户名：`admin`
- 密码：你在 `.env` 中设置的 `ADMIN_PASSWORD`

**普通用户账号：**
- 用户名：`friend`
- 密码：你在 `.env` 中设置的 `FRIEND_PASSWORD`

---

## 📸 添加照片

将照片文件复制到 `backend/Picture/` 目录：

```powershell
# 示例：复制照片到 Picture 目录
Copy-Item "C:\Users\YourName\Photos\photo1.jpg" "backend\Picture\"
```

支持格式：`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.bmp`

---

## 🧪 测试 API

使用 curl 或 Postman 测试 API：

### 登录获取 token
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"friend\", \"password\": \"your-password\"}"
```

### 创建待办事项
```bash
curl -X POST http://localhost:8000/todos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"测试待办\"}"
```

更多 API 示例请查看主 README.md 文件。

---

## 🔧 常见问题

### 后端启动失败
1. 检查 Python 版本：`python --version`（需要 3.11+）
2. 确认虚拟环境已激活（命令行前应有 `(venv)` 标识）
3. 检查 `.env` 文件是否存在且配置正确

### 前端启动失败
1. 检查 Node.js 版本：`node --version`（需要 18+）
2. 删除 `node_modules` 和 `package-lock.json`，重新 `npm install`
3. 确认后端已启动

### 无法登录
1. 确认 `.env` 中的密码已设置
2. 检查后端是否正常运行
3. 查看浏览器控制台和后端日志

### 外部 API 调用失败
1. 确认 `EXTERNAL_API_KEY` 和 `EXTERNAL_API_URL` 正确
2. 检查 API 余额和配额
3. 查看后端日志获取详细错误

---

## 📦 生产部署清单

### Render 后端部署
- [ ] 创建 PostgreSQL 数据库
- [ ] 创建 Web Service
- [ ] 配置所有环境变量
- [ ] 设置 Build Command 和 Start Command
- [ ] 部署并测试

### Vercel 前端部署
- [ ] 连接 GitHub 仓库
- [ ] 配置 `VITE_API_BASE_URL` 环境变量
- [ ] 部署
- [ ] 将前端域名添加到后端 `CORS_ORIGINS`

详细部署步骤请查看主 README.md 文件。

---

## 🎯 功能检查清单

登录后测试以下功能：

### Friend 用户
- [ ] 创建待办事项
- [ ] 标记待办为完成
- [ ] 编辑待办标题
- [ ] 删除待办
- [ ] 筛选待办（全部/未完成/已完成）
- [ ] 发送留言
- [ ] 查看留言列表
- [ ] 删除自己的留言
- [ ] 调用 AI 助手
- [ ] 查看照片列表
- [ ] 点击放大查看照片

### Admin 用户
- [ ] 查看概览仪表板
- [ ] 查看审计日志
- [ ] 筛选审计日志（按操作类型、日期）
- [ ] 查看朋友的所有待办
- [ ] 删除朋友的待办
- [ ] 查看所有留言
- [ ] 删除任意留言

---

## 🆘 获取帮助

如遇到问题：
1. 检查后端日志（终端输出）
2. 检查浏览器控制台（F12）
3. 查看 API 文档：http://localhost:8000/docs
4. 阅读主 README.md 中的详细文档

---

**祝你使用愉快！** 🎉
