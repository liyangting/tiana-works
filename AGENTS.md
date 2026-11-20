# Component Portfolio 协作说明

## 项目定位

这是一个用于沉淀和展示 Vue 3 复杂组件的个人资产库，而不是通用基础 UI 库。优先收录具有工程代表性的能力，例如动画系统、物理模拟、视觉 / 3D 渲染、虚拟列表、上传流程等。

对外只有一个统一的 Vue 3 展示站（Vite + Vue Router + Element Plus）；每个组件本身则是可独立开发、构建和交付的 workspace package。

## 目录职责

```text
apps/docs/                 # 对外的 Vue 3 作品集与在线 Demo
├── src/
│   ├── main.ts / App.vue  # 应用入口与 Element Plus 布局外壳
│   ├── router/            # 页面路由
│   ├── views/             # 首页、项目、组件、关于我、组件文档页
│   ├── data/              # 组件与项目注册表、个人资料
│   ├── demos/             # 组件在线 Demo
│   └── styles/            # 全局与页面样式
├── src/assets/            # 组件封面等图片资源（扁平存放）
├── index.html
└── vite.config.ts
packages/<组件名>/          # 独立组件项目
```

- `apps/docs` 只负责导航、组件说明页和展示用途的 Demo 包装。
- `apps/docs` 是标准 Vue 3 单页应用：页面写在 `src/views`，路由写在 `src/router/index.ts`，布局外壳在 `App.vue`。
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

新增页面时同步更新 `apps/docs/src/router/index.ts` 的路由；顶部导航在 `apps/docs/src/App.vue` 中维护，组件列表由 `apps/docs/src/data/component-registry.ts` 驱动。

文档站是统一作品集，不是微前端宿主。除非用户明确提出独立运行时部署或多团队集成需求，否则不要引入 Module Federation 或其他微前端基础设施。

## 新建组件操作清单

新增一个组件时，按以下顺序完成；不要只添加源码而遗漏独立调试、文档或统一站点入口。

1. 新建 `packages/<组件名>/`，按“新增组件包规范”准备 `src`、`playground`、`README.md`、`package.json`、`tsconfig.json`、`vite.config.ts` 和 `index.html`。
2. 在 `package.json` 中使用 `@lyt/<组件名>` 作为包名；将 `vue` 放入 `peerDependencies`，将该组件独有的运行时依赖放入 `dependencies`。
3. 从 `src/index.ts` 导出组件和所有公开类型；组件不应依赖文档站、业务接口实现或业务 mock 数据。
4. 编写 `playground/main.ts` 和一个最小交互 Demo，确保执行 `pnpm --filter @lyt/<组件名> dev` 可以单独预览组件。
5. 在 `apps/docs/package.json` 的 `dependencies` 中添加：

   ```json
   "@lyt/<组件名>": "workspace:*"
   ```

6. 新建 `apps/docs/src/demos/<组件名>Demo.vue`。Demo 只能从 `@lyt/<组件名>` 导入组件和类型，不能导入其内部 `src` 路径。
7. 新建 `apps/docs/src/views/<组件名>View.vue`，使用以下页面骨架：

   ```text
   标题 + 一句话说明问题和使用边界
   在线演示
   设计与边界
   基础用法
   Props
   Emits
   Slots
   暴露的方法
   性能、资源与可访问性
   源码与独立调试
   ```

8. 在 `apps/docs/src/data/component-registry.ts` 添加注册项。必须填写 `name`、`label`、`description`、`route`、`packageName`、`sourceUrl`、`category`、`complexity`、`tags` 和 `status`；同时在 `apps/docs/src/router/index.ts` 为已发布组件注册路由。
9. 在包 README 中说明安装 / 使用方式、设计选择、依赖和独立调试命令。
10. 执行完整验收：

    ```bash
    pnpm lint
    pnpm typecheck
    pnpm --filter @lyt/<组件名> build
    pnpm build
    ```

### 命名约定

- 目录和文档路由使用 `kebab-case`，例如 `gacha-lottery`。
- Vue 组件文件和导出名称使用 `PascalCase`，例如 `GachaLottery.vue`。
- package 名称使用 `@lyt/kebab-case`。
- 文档 Demo 命名为 `<PascalCase>Demo.vue`。
- 样式优先使用 SCSS：独立样式文件使用 `.scss`，单文件组件使用 `<style lang="scss">`。
- 单文件组件的块顺序固定为 `<template>` → `<script>` → `<style>`。
- `apps/docs/src/styles/` 只放全局样式；页面或组件专属样式写在对应 `.vue` 文件的 `<style>` 中。

## 工具与验证

- 统一使用 **pnpm**，不要新增 npm 或 yarn 锁文件。
- 依赖安装在仓库根目录执行：`pnpm install`。
- 修改后必须按需完成以下验证：

```bash
pnpm lint
pnpm typecheck
pnpm --filter @lyt/<组件名> build
pnpm build
```

- `pnpm dev`：启动统一作品集站点。
- `pnpm lint` / `pnpm format`：ESLint 校验与 Prettier 格式化。
- `pnpm --filter @lyt/<组件名> dev`：启动该组件的独立 Playground。
- 生成的 `dist/` 目录不应提交到版本控制。

## 部署

GitHub Pages 通过 `.github/workflows/deploy.yml` 发布 `apps/docs/dist`，并复制 `index.html` 为 `404.html` 以支持 SPA 路由回退。若站点产物路径发生变化，必须同步更新工作流配置，并重新执行 `pnpm build` 验证。
