---
title: 让博客「感觉更快」的设计
excerpt: 一份可落地的体验优化清单：稳定布局、渐进渲染，以及用户真的会“感觉到”的细节。
date: 2025-09-12
category: 工程
tags: [性能, 体验, Web]
cover: linear-gradient(135deg,#22c55e,#0ea5e9)
---

# 让博客「感觉更快」的设计

速度不只是毫秒的较量，更是让用户产生 **“它很稳、很可信”** 的信心。

## 清单

- 给图片预留空间（避免布局跳动）。
- 页面拆小、组件可组合。
- 导航保持可预期（路径、标题、面包屑）。

## 一个小互动

:::counter
label: 点一下模拟“阅读热度”
start: 0
persist: true
:::

## 代码片段

```ts
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
```

## 延伸阅读

可以用 [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 做一次体检。

