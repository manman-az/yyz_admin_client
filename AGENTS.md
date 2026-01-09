# Admin Client Agent 规范（速度优先）

本仓库是 `React 19 + TypeScript + Vite` 的管理端项目，目标是让 agent **更快交付**、**更少废话**、**代码更简洁**。

## 默认行为（强制）

- **先做最小信息收集**：优先读 `package.json`、相关入口/配置文件；避免全仓库递归扫描。
- **先定位再动手**：先用 `rg`/文件路径定位到唯一修改点，再读文件并最小化修改。
- **最少工具调用**：能一次并行读取就不要多次串行；避免读取大文件（如 `pnpm-lock.yaml`）。
- **最少输出**：回答只给结论 + 变更点 + 下一步（最多 6–10 行）；除非用户要求，否则不贴大段代码。
- **最小 patch**：不做无关重构；不改格式、不改命名、不“顺手优化”与需求无关的内容。
- **不引入新依赖**：除非用户明确要求；网络可能受限，优先用现有依赖实现。

## 项目概览（用于快速定位）

- 构建：Vite（`npm run dev` / `pnpm dev`）
- 路由：`react-router-dom`（`createBrowserRouter`）
- 代码别名：`@/* -> src/*`（见 `tsconfig*.json`、`vite.config.ts`）
- 代理：本地 `/api/*` 代理到 `VITE_PROXY_TARGET`（默认 `http://127.0.0.1:8000`，见 `vite.config.ts`）
- 规范：TypeScript `strict`；ESLint（flat config）；Prettier 已安装

## 目录约定（新增代码放哪里）

- `src/pages/`：路由页面（页面级组件）
- `src/layouts/`：布局壳（如 Sidebar/Header/Content）
- `src/components/`：通用组件（无业务语义）
- `src/biz-components/`：业务组件（带领域语义，可复用但依赖业务）
- `src/services/`：API/请求封装（不直接在页面里散落 fetch）
- `src/stores/`：全局状态/缓存（如需要再引入）
- `src/types/`：跨模块共享类型
- `src/utils/`：纯函数工具（无副作用）
- `src/i18n/`：国际化资源（如启用）

## 编码规范（简洁高效）

- React：优先 **函数组件 + hooks**；避免不必要的 state / effect；能派生就派生。
- TypeScript：不使用 `any`；用 `unknown` + type guard；对象字面量优先用 `satisfies` 保持推导。
- 结构：单文件只做一件事；复杂逻辑提取到 `utils/` 或 `services/`；页面只编排，不堆业务细节。
- 导入：优先使用 `@/` 别名；保持导入顺序（第三方 → 本地）。
- 样式：优先复用现有样式体系；避免在页面里堆大量 inline style（除非是临时骨架）。

## 工具与命令（快速、低噪声）

- 开发：`pnpm dev`（或 `npm run dev`）
- 构建：`pnpm build`
- Lint：`pnpm lint`（如需更安静输出可用 `pnpm -s lint`）

## 交付标准（每次改动都要满足）

- 改动可解释：为什么改、改了哪里、怎么验证（给出 1 条最短命令）。
- 只改必要文件：尽量控制在 1–3 个文件内；避免“顺手整理”导致 diff 膨胀。
- 保持可回滚：不做大范围迁移；避免一次提交引入多条不相干变化。

