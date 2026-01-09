---
title: 用 CSS 变量做一个「小而美」的样式系统
excerpt: 不引入 UI 库也能统一风格：用少量变量搭出主题、间距、排版与组件一致性。
date: 2025-11-18
category: 工程
tags: [CSS, 设计]
cover: linear-gradient(135deg,#f59e0b,#ef4444)
---

# 用 CSS 变量做一个「小而美」的样式系统

只要一小组变量，就能覆盖大部分需求：

```css
:root {
  --bg: #0b0f1a;
  --fg: #e5e7eb;
  --muted: #94a3b8;
  --card: rgba(255,255,255,.06);
}
```

## 为什么有效

- 单一事实来源（改一处，全站生效）
- 深浅主题切换更轻松
- 迭代速度快

## 小投票

:::poll
question: 你最看重设计系统的哪一点？
- 一致性
- 迭代速度
- 可访问性
persist: true
:::

