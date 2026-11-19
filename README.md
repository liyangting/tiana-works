# Component Portfolio

个人 Vue 3 复杂组件资产库。每个组件是可独立开发和交付的 workspace package，统一文档站负责在线演示、设计说明和源码导航。

## 当前组件

- [`@lyt/gacha-lottery`](./packages/gacha-lottery)：带 Matter.js 物理模拟与 GSAP 时间线动画的扭蛋机。

## 项目结构

```text
apps/docs/                 # 唯一对外的 VitePress 展示站
packages/gacha-lottery/    # 可独立维护的扭蛋组件项目
```

## 本地运行

```bash
pnpm install
pnpm dev
```

`pnpm build` 构建统一站点；推送 `main` 后 GitHub Actions 会发布至 GitHub Pages。
