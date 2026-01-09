---
title: A Tiny Style System with CSS Variables
excerpt: No UI library required — build a consistent theme with a handful of variables.
date: 2025-11-18
category: Engineering
tags: [CSS, Design]
cover: linear-gradient(135deg,#f59e0b,#ef4444)
---

# A Tiny Style System with CSS Variables

You can go far with a small set of variables:

```css
:root {
  --bg: #0b0f1a;
  --fg: #e5e7eb;
  --muted: #94a3b8;
  --card: rgba(255,255,255,.06);
}
```

## Why it works

- One source of truth
- Easy dark/light themes
- Fast iteration

## Quick poll

:::poll
question: What do you value most in a design system?
- Consistency
- Speed of iteration
- Accessibility
persist: true
:::

