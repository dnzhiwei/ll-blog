# 我的博客

基于 [Hexo](https://hexo.io/) 和 [Icarus](https://ppoffice.github.io/hexo-theme-icarus/) 主题搭建的个人博客。

仓库地址：https://github.com/dnzhiwei/ll-blog

## 环境要求

- Node.js 18+
- npm

## 安装

```bash
npm install
```

## 常用命令

```bash
hexo clean          # 清理缓存
hexo server         # 本地预览，访问 http://localhost:4000
hexo generate       # 生成静态文件到 public/
hexo new "标题"      # 新建文章
hexo new page about # 新建页面
npm run build       # 清理并构建（Cloudflare Pages 使用此命令）
```

## 目录结构

```
├── _config.yml           # Hexo 站点配置
├── _config.icarus.yml    # Icarus 主题配置
├── source/
│   ├── _posts/           # 博客文章
│   └── about/            # 关于页面
├── scaffolds/            # 文章/页面模板
├── themes/               # 主题目录（Icarus 通过 npm 安装）
└── public/               # 生成的静态文件（git 忽略）
```

## 配置说明

- 站点信息：编辑 `_config.yml` 中的 `title`、`author`、`url` 等字段
- 主题样式：编辑 `_config.icarus.yml` 中的导航、侧边栏、页脚等配置
- 生产环境 URL 当前为 `https://ll-blog.pages.dev`，若绑定自定义域名需同步修改 `_config.yml` 中的 `url`

## 部署（Cloudflare Pages）

本项目通过 Cloudflare Pages 连接 GitHub 仓库自动构建部署。

### 首次配置

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. 选择 GitHub 账号，授权并选择仓库 `dnzhiwei/ll-blog`
3. 配置构建设置：

| 配置项 | 值 |
|--------|-----|
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `public` |
| Node.js version | `20`（已通过 `.node-version` 指定，也可在环境变量中设置 `NODE_VERSION=20`） |

4. 点击 **Save and Deploy**，等待首次构建完成
5. 访问 `https://ll-blog.pages.dev` 查看站点（若项目名不同，以 Cloudflare 分配的实际域名为准）

### 自动部署

每次推送到 `main` 分支，Cloudflare Pages 会自动触发构建并发布新版本。

### 绑定自定义域名（可选）

在 Cloudflare Pages 项目 → **Custom domains** 中添加域名，并在 `_config.yml` 中将 `url` 更新为对应域名。
