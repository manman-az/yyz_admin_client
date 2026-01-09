---
title: 在 Vite 里排查代理 / Proxy 问题
excerpt: 当 `/api` 突然 404：检查 base、代理规则，以及 dev/preview 的差异点。
date: 2025-12-02
category: 工程
tags: [Vite, 排查, Web]
cover: linear-gradient(135deg,#06b6d4,#3b82f6)
---

# 在 Vite 里排查代理 / Proxy 问题

代理问题通常并不复杂，只是你需要看对地方。

## 清单

- 先确认 dev server 的日志里能看到请求。
- 检查代理 target 和路径匹配。
- 对比 `dev` 和 `preview` 的行为差异。

## 小计数器

:::counter
label: 你排查过多少次 CORS？
start: 0
persist: true
:::

