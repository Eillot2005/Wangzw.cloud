# Friend Management System

一个为朋友打造的私有全栈 Web 应用，包含待办事项、留言墙、AI 助手、私有照片浏览等功能。系统仅支持两个固定账号：管理员（admin）和普通用户（friend）。

## ✨ 功能特性

### 🔐 双用户系统
- **管理员 (admin)**：完整后台管理权限
  - 查看朋友的所有操作和数据
  - 审计日志查看
  - 数据管理和删除权限
  
- **普通用户 (friend)**：丰富的应用功能
  - 待办事项管理
  - 留言墙互动
  - AI 助手对话
  - 私有照片浏览

### 📋 核心功能

#### For Friend（普通用户）
- **待办事项**：创建、编辑、完成、删除，支持筛选
- **留言墙**：发送留言、查看所有留言、删除自己的留言
- **AI 助手**：通过外部 API 获取 AI 回复（限流：20 次/分钟）
- **照片浏览**：安全访问 Picture 目录中的照片，支持放大查看

#### For Admin（管理员）
- **概览仪表板**：统计数据一目了然
  - 待办总数和未完成数
  - 留言总数
  - API 调用统计（今日/7天）
  - 照片访问统计（今日/7天）
  - 最近操作记录
- **审计日志**：完整的操作记录，支持筛选
- **朋友数据管理**：查看和删除朋友的待办、留言

### 🔒 安全特性
- JWT Bearer 认证
- 密码 bcrypt 哈希存储
- 私有照片鉴权访问（防止路径穿越）
- 外部 API 调用参数全部写死（防止滥用）
- 请求限流（20 次/分钟）
- 完整审计日志

## 🏗️ 技术栈

### 后端
- **Python 3.11**
- **FastAPI** - 现代高性能 Web 框架
- **SQLAlchemy 2.x** - ORM
- **PostgreSQL** - 生产数据库
- **JWT** - 身份认证
- **bcrypt** - 密码哈希
- **httpx** - 外部 API 调用

### 前端
- **React 18**
- **TypeScript**
- **Vite** - 构建工具
- **React Router** - 路由管理
- **Axios** - HTTP 客户端

## 📦 项目结构

```
.
├── backend/
│   ├── app/
│   │   ├── core/           # 核心配置、安全、限流、审计
│   │   ├── db/             # 数据库会话和初始化
│   │   ├── models/         # SQLAlchemy 模型
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── routers/        # API 路由
│   │   ├── services/       # 业务逻辑
│   │   └── main.py         # FastAPI 应用入口
│   ├── Picture/            # 私有照片目录（已创建）
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── api/            # API 客户端
    │   ├── router/         # 路由配置
    │   ├── pages/          # 页面组件
    │   │   ├── app/        # Friend 页面
    │   │   └── admin/      # Admin 页面
    │   ├── components/     # 共享组件
    │   └── main.tsx
    ├── package.json
    ├── .env.example
    └── vite.config.ts
```

## 🚀 本地运行

### 1. 后端设置

```bash
cd backend

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Windows CMD:
.\venv\Scripts\activate.bat
# Linux/Mac:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置必需的环境变量：
# - ADMIN_PASSWORD
# - FRIEND_PASSWORD
# - EXTERNAL_API_KEY
# - EXTERNAL_API_URL
# - DATABASE_URL (可选，默认使用 SQLite)

# 启动服务器（自动初始化数据库和创建用户）
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

后端将运行在 `http://localhost:8000`

API 文档：`http://localhost:8000/docs`

### 2. 前端设置

```bash
cd frontend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置：
# VITE_API_BASE_URL=http://localhost:8000

# 启动开发服务器
npm run dev
```

前端将运行在 `http://localhost:5173`

### 3. 添加照片（可选）

将照片文件放入 `backend/Picture/` 目录，支持的格式：
- `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.bmp`

## 🌐 生产部署

### 后端部署到 Render

1. **创建 Render 账号** 并连接 GitHub 仓库

2. **创建 PostgreSQL 数据库**
   - 在 Render 控制台创建新的 PostgreSQL 实例
   - 复制 `Internal Database URL`

3. **创建 Web Service**
   - 选择 Python 环境
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend`

4. **配置环境变量**
   在 Render 的 Environment 设置中添加：
   ```
   DATABASE_URL=<your-postgres-url>
   JWT_SECRET=<random-secret-key>
   JWT_EXPIRE_MINUTES=10080
   CORS_ORIGINS=https://your-frontend.vercel.app
   ADMIN_PASSWORD=<secure-password>
   FRIEND_PASSWORD=<secure-password>
   EXTERNAL_API_KEY=<your-api-key>
   EXTERNAL_API_URL=https://api.openai.com/v1/chat/completions
   ```

5. **部署**
   - Render 将自动构建和部署
   - 记录后端 URL（如 `https://your-app.onrender.com`）

### 前端部署到 Vercel

1. **安装 Vercel CLI** (可选)
   ```bash
   npm install -g vercel
   ```

2. **配置环境变量**
   在项目根目录或 Vercel 控制台设置：
   ```
   VITE_API_BASE_URL=https://your-app.onrender.com
   ```

3. **部署**
   ```bash
   cd frontend
   vercel --prod
   ```
   或直接在 Vercel 控制台导入 GitHub 仓库

4. **更新 CORS**
   将 Vercel 生成的前端域名添加到后端的 `CORS_ORIGINS` 环境变量中

### 前端部署到 Cloudflare Pages（备选）

1. 登录 Cloudflare Pages 控制台
2. 连接 GitHub 仓库
3. 配置构建设置：
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `frontend`
4. 添加环境变量：`VITE_API_BASE_URL`
5. 部署

## 📝 API 测试示例（curl）

### 1. 管理员登录
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your-admin-password"}'
```

响应：
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "role": "ADMIN"
}
```

### 2. 普通用户登录
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "friend", "password": "your-friend-password"}'
```

### 3. 获取当前用户信息
```bash
curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Friend - 创建待办事项
```bash
curl -X POST http://localhost:8000/todos \
  -H "Authorization: Bearer FRIEND_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "完成项目文档"}'
```

### 5. Friend - 获取待办列表
```bash
# 全部
curl -X GET http://localhost:8000/todos \
  -H "Authorization: Bearer FRIEND_TOKEN"

# 仅未完成
curl -X GET "http://localhost:8000/todos?done=0" \
  -H "Authorization: Bearer FRIEND_TOKEN"
```

### 6. Friend - 更新待办
```bash
curl -X PATCH http://localhost:8000/todos/1 \
  -H "Authorization: Bearer FRIEND_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"done": true}'
```

### 7. Friend - 删除待办
```bash
curl -X DELETE http://localhost:8000/todos/1 \
  -H "Authorization: Bearer FRIEND_TOKEN"
```

### 8. Friend - 发送留言
```bash
curl -X POST http://localhost:8000/messages \
  -H "Authorization: Bearer FRIEND_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "今天天气真好！"}'
```

### 9. Friend - 获取留言列表
```bash
curl -X GET http://localhost:8000/messages \
  -H "Authorization: Bearer FRIEND_TOKEN"
```

### 10. Friend - 删除留言
```bash
curl -X DELETE http://localhost:8000/messages/1 \
  -H "Authorization: Bearer FRIEND_TOKEN"
```

### 11. Friend - 调用外部 AI API
```bash
curl -X POST http://localhost:8000/external/call \
  -H "Authorization: Bearer FRIEND_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "解释什么是机器学习"}'
```

响应：
```json
{
  "text": "机器学习是人工智能的一个分支...",
  "raw": {...}
}
```

### 12. Friend - 获取照片列表
```bash
curl -X GET http://localhost:8000/pictures \
  -H "Authorization: Bearer FRIEND_TOKEN"
```

### 13. Friend - 请求单张照片
```bash
curl -X GET http://localhost:8000/pictures/photo1.jpg \
  -H "Authorization: Bearer FRIEND_TOKEN" \
  --output photo1.jpg
```

### 14. Admin - 获取概览
```bash
curl -X GET http://localhost:8000/admin/overview \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

响应：
```json
{
  "todo_total": 10,
  "todo_open": 3,
  "message_total": 25,
  "external_call_today": 5,
  "external_call_last_7d": 42,
  "picture_view_today": 8,
  "picture_view_last_7d": 56,
  "last_actions": [...]
}
```

### 15. Admin - 获取审计日志
```bash
# 全部日志
curl -X GET http://localhost:8000/admin/audit \
  -H "Authorization: Bearer ADMIN_TOKEN"

# 筛选特定操作
curl -X GET "http://localhost:8000/admin/audit?action=EXTERNAL_CALL" \
  -H "Authorization: Bearer ADMIN_TOKEN"

# 日期范围筛选
curl -X GET "http://localhost:8000/admin/audit?start_date=2024-01-01&end_date=2024-12-31" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 16. Admin - 查看朋友的待办
```bash
curl -X GET http://localhost:8000/admin/friend/todos \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 17. Admin - 删除朋友的待办
```bash
curl -X DELETE http://localhost:8000/admin/friend/todos/1 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 18. Admin - 查看朋友的留言
```bash
curl -X GET http://localhost:8000/admin/friend/messages \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## ⚙️ 关键配置说明

### 外部 API 调用（写死参数）

后端 `app/services/external_api.py` 中硬编码了以下参数：
```python
HARDCODED_MODEL_NAME = "gpt-3.5-turbo"
HARDCODED_SYSTEM_PROMPT = "You are a helpful AI assistant..."
HARDCODED_TEMPERATURE = 0.7
HARDCODED_MAX_TOKENS = 800
```

前端只能提交 `prompt`，其他参数不可修改。

### 限流设置

- 外部 API 调用：20 次/分钟/用户（内存实现）
- 生产环境建议使用 Redis 实现分布式限流

### 审计日志

所有关键操作都会记录审计日志：
- `LOGIN` - 用户登录
- `TODO_CREATE` / `TODO_UPDATE` / `TODO_DELETE`
- `MESSAGE_CREATE` / `MESSAGE_DELETE`
- `EXTERNAL_CALL` - AI API 调用
- `PICTURE_VIEW` - 照片查看

## 🔧 常见问题

### 1. 数据库连接失败
检查 `DATABASE_URL` 格式：
```
postgresql://user:password@host:port/database
```

### 2. 外部 API 调用失败
- 确认 `EXTERNAL_API_KEY` 和 `EXTERNAL_API_URL` 设置正确
- 检查 API 余额和速率限制
- 查看后端日志中的详细错误信息

### 3. CORS 错误
确保前端域名已添加到后端的 `CORS_ORIGINS` 环境变量中，多个域名用逗号分隔：
```
CORS_ORIGINS=http://localhost:5173,https://your-frontend.vercel.app
```

### 4. 照片无法显示
- 确认照片文件在 `backend/Picture/` 目录
- 检查文件扩展名是否支持（jpg/png/gif/webp/bmp）
- 确认已登录且 token 有效

### 5. Render 部署后首次请求慢
Render 免费套餐会在无流量时休眠实例，首次访问需要冷启动（约 30-60 秒）。

## 📄 许可证

MIT License

## 👤 作者

为朋友打造的私有系统 ❤️

---

**注意**：
- 本系统仅支持两个固定账号，不提供注册功能
- 密码务必设置强密码并妥善保管
- 生产环境建议启用 HTTPS
- 定期备份数据库
- 外部 API Key 请勿泄露
