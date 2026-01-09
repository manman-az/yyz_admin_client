---
title: Debugging a Proxy Setup in Vite
excerpt: When `/api` suddenly returns 404 — base paths, proxy rules, and the differences between dev and preview.
date: 2025-12-02
category: Engineering
tags: [Vite, Debugging, Web]
cover: linear-gradient(135deg,#06b6d4,#3b82f6)
---

# Debugging a Proxy Setup in Vite

Proxy issues are usually simple — once you look at the right place.

## Checklist

- Confirm the dev server sees the request in its log.
- Validate the proxy target and path.
- Compare `dev` vs `preview` behavior.

## Tiny counter

:::counter
label: How many times have you debugged CORS?
start: 0
persist: true
:::

