# @lyt/waterfall

纯 Vue 3 + TypeScript 的瀑布流组件包：只负责最短列优先布局、尺寸监听与高度缓存，不包含业务逻辑、UI 库或请求封装。

## 内容

- `Waterfall.vue`：瀑布流布局组件，支持响应式列数、固定列宽、容器宽度监听与卡片高度实测缓存。
- `useWaterfall.ts`：分页加载 hook，含请求批次隔离、触底检测与首屏自动补屏。
- `imageSize.ts`：图片原始尺寸读取与展示高度换算工具。

## 使用

```vue
<script setup lang="ts">
import { Waterfall, useWaterfall, getWaterfallImageSize } from '@lyt/waterfall'

const { list, loading, finished, loadMore } = useWaterfall({
  fetcher: ({ page, pageSize }) => api.fetchFeed({ page, pageSize }),
  pageSize: 20,
  target: window,
})
</script>

<template>
  <Waterfall :items="list" :columns="4" :gap="16" :responsive-columns="{ '0': 2, '960': 4 }">
    <template #default="{ item }">
      <article>{{ item.title }}</article>
    </template>
  </Waterfall>
  <button :disabled="finished" @click="loadMore">加载更多</button>
</template>
```

## 说明

- 布局按最短列优先，不按 index 取模；卡片高度优先使用 DOM 实测，其次读取数据上的可选 `height`。
- `itemKey` 缺省时依次回退 `item.id` 与 index。
- `useWaterfall` 在挂载时自动加载第一页；`refresh` / `reset` 会递增请求批次并清空列表。
- 无 `ResizeObserver` 时降级为 `window.resize`；SSR 或非浏览器环境不会访问 `window`。
- 不内置 loading / 空态 / 错误提示 UI，状态由使用方根据 hook 返回值渲染。

## 独立调试

```bash
pnpm --filter @lyt/waterfall dev
```
