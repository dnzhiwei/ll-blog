---
title: NAS 部署幻兽帕鲁专用服务器（Docker 版）
date: 2026-07-08 13:30:00
tags:
  - 幻兽帕鲁
  - NAS
  - Docker
categories:
  - 教程
---

想和朋友们一起联机抓帕鲁，又不想专门租一台云服务器？家里有一台 NAS，其实就能跑幻兽帕鲁专用服务器。

本文以社区广泛使用的 [palworld-server-docker](https://github.com/thijsvanloef/palworld-server-docker) 为基础，介绍如何在 NAS 上通过 Docker 部署帕鲁服务器。该项目封装了 Steam 下载、配置生成、自动备份、RCON/REST API 等能力，对 NAS 用户比较友好。

<!-- more -->

## 方案说明

[palworld-server-docker](https://github.com/thijsvanloef/palworld-server-docker) 是 Thijs van Loef 维护的 Docker 镜像，镜像地址：

- Docker Hub：`thijsvanloef/palworld-server-docker`
- 官方文档：[palworld-server-docker.loef.dev](https://palworld-server-docker.loef.dev/)

它支持 Linux、Windows、macOS，也已在 x64 和 ARM64 架构上测试通过。群晖、威联通、飞牛等支持 Docker 的 NAS，一般都可以直接部署。

## 硬件与网络要求

根据项目 README，建议配置如下：

| 资源 | 最低 | 推荐 |
|------|------|------|
| CPU | 4 核 | 4 核及以上 |
| 内存 | 16 GB | 32 GB 及以上 |
| 存储 | 8 GB | 20 GB 及以上 |

实际体验上，玩家数量、模组、是否开启自动备份都会影响占用。NAS 内存如果只有 8 GB，建议减少 `PLAYERS` 数量，并关闭不必要的自动任务。

网络方面需要准备：

- 路由器端口转发能力
- 公网 IP，或内网穿透方案
- 稳定的 UDP 连通性（帕鲁联机主要走 UDP）

## 需要开放的端口

| 端口 | 协议 | 用途 | 是否建议转发 |
|------|------|------|--------------|
| 8211 | UDP | 游戏端口 | 是 |
| 27015 | UDP | Steam 查询端口 | 是 |
| 8212 | TCP | REST API | 否，仅内网管理 |
| 25575 | TCP | RCON | 否，仅内网管理 |

官方明确说明：**不要把 REST API 端口暴露到公网**。管理操作应在 NAS 内网或通过 SSH / Docker 终端执行。

## 部署前准备

### 1. 安装 Docker

确保 NAS 已安装 Docker 或 Container Manager，并可以拉取镜像。

群晖路径一般为：**套件中心 → Container Manager**

### 2. 创建项目目录

在 NAS 共享目录中新建文件夹，例如：

```text
/docker/palworld/
```

后续会在这里放置 `compose.yaml`、`.env` 和存档数据。

### 3. 获取示例配置

可以直接参考项目仓库中的文件：

- [compose.yaml](https://github.com/thijsvanloef/palworld-server-docker/blob/main/compose.yaml)
- [.env.example](https://github.com/thijsvanloef/palworld-server-docker/blob/main/.env.example)

## 使用 Docker Compose 部署

推荐使用 `.env` 管理配置，便于后续修改。

### compose.yaml

在 `/docker/palworld/` 目录创建 `compose.yaml`：

```yaml
services:
  palworld:
    image: thijsvanloef/palworld-server-docker:latest
    restart: unless-stopped
    container_name: palworld-server
    stop_grace_period: 30s
    ports:
      - 8211:8211/udp
      - 27015:27015/udp
    env_file:
      - .env
    volumes:
      - ./palworld:/palworld/
```

### .env 基础配置

复制 `.env.example` 为 `.env`，至少修改以下关键项：

```env
PUID=1000
PGID=1000
TZ=Asia/Shanghai

PORT=8211
PLAYERS=8
MULTITHREADING=true

SERVER_NAME=我的帕鲁服务器
SERVER_DESCRIPTION=NAS 自建帕鲁服
SERVER_PASSWORD=你的联机密码
ADMIN_PASSWORD=你的管理员密码

UPDATE_ON_BOOT=true
BACKUP_ENABLED=true
REST_API_ENABLED=true
RCON_ENABLED=true
CROSSPLAY_PLATFORMS=(Steam,Xbox,PS5,Mac)
```

说明：

- `PUID` / `PGID`：容器运行用户，需与 NAS 目录权限匹配。群晖可在 SSH 中执行 `id` 查看。
- `PLAYERS`：最大玩家数，NAS 配置一般建议先设 4～8。
- `SERVER_PASSWORD`：联机密码，建议设置。
- `ADMIN_PASSWORD`：游戏内管理员密码，用于执行管理命令。
- `UPDATE_ON_BOOT`：首次启动必须为 `true`，用于下载服务器文件。

### 启动服务

在 NAS 的终端或 SSH 中进入项目目录：

```bash
cd /volume1/docker/palworld
docker compose up -d
```

群晖 Container Manager 也支持直接导入 `compose.yaml` 创建项目。

首次启动会下载 Steam 专用服务器文件，耗时取决于网络和 NAS 性能，请耐心等待日志出现 `Server is ready`。

## 群晖 Container Manager 图形化部署

如果不习惯 SSH，可以按下面步骤操作：

1. 打开 **Container Manager → 项目 → 新建**
2. 项目名称填 `palworld`
3. 路径选择 `/docker/palworld`
4. 粘贴上面的 `compose.yaml`
5. 在同目录准备好 `.env` 文件
6. 启动项目，查看容器日志

如果容器反复重启，优先检查：

- `.env` 是否存在
- `./palworld` 目录权限是否正确
- NAS 内存是否不足

## 路由器端口转发

若朋友需要从外网连接，在路由器中添加转发规则：

| 外部端口 | 内部 IP | 内部端口 | 协议 |
|----------|---------|----------|------|
| 8211 | NAS IP | 8211 | UDP |
| 27015 | NAS IP | 27015 | UDP |

连接方式：

- 游戏内选择 **加入多人游戏 → 加入码**
- 输入服务器 IP 或域名
- 输入 `SERVER_PASSWORD`

如果只能内网游玩，则直接使用 NAS 局域网 IP 即可，无需端口转发。

## 修改服务器参数

帕鲁服务器支持大量 `.env` 环境变量，例如经验倍率、捕获倍率、昼夜速度等。

完整变量列表见项目 README 的 [Environment variables](https://github.com/thijsvanloef/palworld-server-docker#environment-variables) 章节，官方参数说明也可参考 [Palworld 技术文档](https://tech.palworldgame.com/)。

如果觉得直接编辑 `.env` 不够直观，可以使用本站提供的 **[幻兽帕鲁配置工具](/tools/palworld/)**：可视化调整参数后导出 `.env`，再上传到 NAS 项目目录并重启容器。

修改配置后重启服务：

```bash
docker compose restart
```

## 常用管理命令

### 查看日志

```bash
docker logs -f palworld-server
```

### 使用 RCON 管理

RCON 适合执行踢人、广播、保存世界等命令：

```bash
docker exec -it palworld-server rcon-cli "ShowPlayers"
docker exec -it palworld-server rcon-cli "Broadcast 欢迎来捉帕鲁"
docker exec -it palworld-server rcon-cli "Save"
```

常用命令：

| 命令 | 说明 |
|------|------|
| `ShowPlayers` | 查看在线玩家 |
| `Broadcast <消息>` | 全服广播 |
| `Save` | 保存世界 |
| `Shutdown 60 即将重启` | 60 秒后关机 |
| `KickPlayer <SteamID>` | 踢出玩家 |

### 使用 REST API

容器内也提供了 `rest-cli`：

```bash
docker exec -it palworld-server rest-cli players
docker exec -it palworld-server rest-cli info
```

## 备份与更新

项目默认支持：

- 启动时更新：`UPDATE_ON_BOOT=true`
- 定时备份：`BACKUP_ENABLED=true`
- 自动删除旧备份：通过 `DELETE_OLD_BACKUPS`、`OLD_BACKUP_DAYS` 控制

存档和备份位于挂载目录 `./palworld/` 下。建议将该目录纳入 NAS 整机备份或快照策略。

更新镜像：

```bash
docker compose pull
docker compose up -d
```

## 常见问题

### 1. 首次启动很慢

正常现象。容器需要从 Steam 下载专用服务器，NAS CPU 性能较弱时可能持续 10～30 分钟。

### 2. 朋友连不上

依次检查：

- 路由器 UDP 转发是否正确
- `SERVER_PASSWORD` 是否一致
- 云厂商或运营商是否封锁 UDP
- `PUBLIC_IP` 是否需要手动填写公网地址

### 3. 容器权限报错

确认 `palworld` 数据目录的属主与 `PUID`/`PGID` 一致：

```bash
chown -R 1000:1000 ./palworld
```

### 4. 内存不足导致崩溃

尝试：

- 降低 `PLAYERS`
- 关闭 `AUTO_UPDATE_ENABLED`
- 关闭不必要的 Discord 通知
- 避免与其他重型容器同时满载运行

### 5. ARM NAS 性能较差

项目支持 ARM64，但 Box64 转译性能有限。若卡顿明显，建议减少在线人数，或改用 x86 NAS / 迷你主机部署。

## 总结

用 NAS 跑帕鲁服务器，核心步骤并不复杂：

1. 安装 Docker
2. 准备 `compose.yaml` 和 `.env`
3. 挂载数据目录并启动容器
4. 转发 UDP 端口
5. 用 RCON / REST API 做日常管理

`palworld-server-docker` 已经把最麻烦的下载、配置生成、备份更新封装好了，很适合家庭 NAS 长期挂着和朋友联机。

如果你准备开始部署，建议先在本站 [幻兽帕鲁配置工具](/tools/palworld/) 里调好参数，再导出 `.env` 上传到 NAS，会省不少时间。

## 参考链接

- 项目仓库：[thijsvanloef/palworld-server-docker](https://github.com/thijsvanloef/palworld-server-docker)
- 官方文档：[palworld-server-docker.loef.dev](https://palworld-server-docker.loef.dev/)
- 帕鲁官方技术文档：[tech.palworldgame.com](https://tech.palworldgame.com/)
- 本站配置工具：[/tools/palworld/](/tools/palworld/)
