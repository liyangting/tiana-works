# Component Portfolio 协作说明

## 项目定位

这是一个用于沉淀和展示 Vue 3 复杂组件的个人资产库，而不是通用基础 UI 库。优先收录具有工程代表性的能力，例如动画系统、物理模拟、视觉 / 3D 渲染、虚拟列表、上传流程等。

对外只有一个统一的 VitePress 展示站；每个组件本身则是可独立开发、构建和交付的 workspace package。

## 目录职责

```text
apps/docs/                 # 对外的 VitePress 作品集与在线 Demo
packages/<组件名>/          # 独立组件项目
```

- `apps/docs` 只负责导航、组件说明页和展示用途的 Demo 包装。
- `packages/<组件名>` 负责可复用组件源码、类型、资源、运行依赖、README 和独立 Playground。
- 未经用户明确要求，不要新增 `BaseButton`、`BaseInput`、`BaseModal` 等轻量基础组件。
- 不要在 `apps/docs` 中复制组件包的实现或资源；文档 Demo 必须使用组件包本身的公开 API。

## 新增组件包规范

每个新组件包必须具备以下结构：

```text
packages/<组件名>/
├── src/            # 组件实现、公开类型与组件私有资源
├── playground/     # 可单独运行的调试示例
├── index.html      # Playground 入口
├── vite.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

- 包名使用 `@lyt/<组件名>`。
- `vue` 必须是 `peerDependencies`；组件专属的运行时依赖放在该包的 `dependencies`，不要放到文档站中。
- 从 `src/index.ts` 统一导出组件和对外类型。
- 不要在组件中写业务 mock 数据或业务状态。奖池、接口函数、图片地址和应用状态等，应通过显式的 Props、Emits、Slots 或暴露方法传入。

## 文档站接入规范

通过 `workspace:*` 将新增组件包写入 `apps/docs/package.json`。文档站必须从 `@lyt/<组件名>` 导入组件，确保在线 Demo 与实际消费者使用同一份公开 API。

每个组件页面至少包含：

1. 组件解决的问题和设计边界。
2. 可交互 Demo。
3. 基础用法。
4. Props、Emits、Slots 与暴露方法。
5. 依赖、性能和可访问性方面的取舍。
6. 指向 `packages/<组件名>/` 的源码链接，而不是单个 `.vue` 文件链接。

新增页面时更新 `apps/docs/.vitepress/config.ts` 的导航和侧边栏。

文档站是统一作品集，不是微前端宿主。除非用户明确提出独立运行时部署或多团队集成需求，否则不要引入 Module Federation 或其他微前端基础设施。

## 工具与验证

- 统一使用 **pnpm**，不要新增 npm 或 yarn 锁文件。
- 依赖安装在仓库根目录执行：`pnpm install`。
- 修改后必须按需完成以下验证：

```bash
pnpm typecheck
pnpm --filter @lyt/<组件名> build
pnpm build
```

- `pnpm dev`：启动统一文档站。
- `pnpm --filter @lyt/<组件名> dev`：启动该组件的独立 Playground。
- 生成的 `dist/` 目录不应提交到版本控制。

## 部署

GitHub Pages 通过 `.github/workflows/deploy.yml` 发布 `apps/docs/.vitepress/dist`。若文档站路径发生变化，必须同步更新工作流产物路径，并重新执行 `pnpm build` 验证。
