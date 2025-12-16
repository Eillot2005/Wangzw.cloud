# 部署指南 (Render)

本项目已配置为支持 Render 一键部署。

## 准备工作

1.  确保你的代码已提交到 GitHub 仓库。
2.  注册并登录 [Render Dashboard](https://dashboard.render.com/)。

## 部署步骤

1.  在 Render Dashboard 点击 **"New +"** 按钮。
2.  选择 **"Blueprint"**。
3.  连接你的 GitHub 仓库。
4.  Render 会自动检测到 `render.yaml` 文件。
5.  点击 **"Apply"** 开始部署。

## 部署后配置

部署完成后，Render 会自动创建：
1.  一个 PostgreSQL 数据库 (`wangzw-db`)
2.  一个后端服务 (`wangzw-backend`)
3.  一个前端静态网站 (`wangzw-frontend`)

### 验证

1.  访问前端服务的 URL（例如 `https://wangzw-frontend.onrender.com`）。
2.  使用账号 `wangzw` / `wangzw99` 登录。

### 注意事项

*   **图片存储**：Render 的免费实例文件系统是临时的。如果你上传新图片，重启后会丢失。建议将 `Picture` 文件夹包含在 Git 仓库中，这样每次部署都会包含这些图片。
*   **数据库**：Render 免费数据库会在 90 天后过期（如果不升级）。
*   **休眠**：Render 免费 Web 服务在 15 分钟不活动后会休眠，再次访问可能需要几十秒启动。

## 环境变量

如果需要修改密码或配置，可以在 Render Dashboard 的服务设置中修改 Environment Variables：

*   `ADMIN_PASSWORD`: 管理员密码
*   `FRIEND_PASSWORD`: 朋友账号密码
*   `CORS_ORIGINS`: 允许跨域的域名（默认 `*` 允许所有，生产环境建议改为前端域名）
