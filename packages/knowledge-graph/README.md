# @lyt/knowledge-graph

纯 Vue 3 + TypeScript 的知识图谱组件包：把知识点沿弧形轨道排布，滚动时按锚点插值计算横向偏移与缩放，只负责视觉与滚动定位，不包含接口、路由或业务状态。

## 特点

- 数据、按钮文案与交互全部通过 Props / Emits 传入，组件不请求、不持久化。
- 弧形轨道由 `layout.anchors` 描述，可在相邻锚点间线性插值，默认配置贴合设计稿弧线。
- 滚轮滚动做了受控缓动，快速滚动时仍按帧同步计算轨道位置，避免 transform 过渡滞后。
- 进入时把 `focusId` 或第一条滚到视觉锚点，`ResizeObserver` 跟随容器尺寸重新校准。
- 卡片与节点为包私有资源，随 package 发布，不污染宿主项目。

## 使用

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { KnowledgeGraph, type KnowledgeGraphItem } from '@lyt/knowledge-graph'

const items = ref<KnowledgeGraphItem[]>([
  { id: 'a', title: '相机是如何把光变成照片的？', actionText: '查看详情' },
  { id: 'b', title: '光圈和快门如何配合？', actionText: '查看详情' },
])

function handleSelect(item: KnowledgeGraphItem) {
  console.log(item.id)
}
</script>

<template>
  <div class="route-stage">
    <KnowledgeGraph v-model:active-id="activeId" :items="items" focus-id="b" @select="handleSelect" />
  </div>
</template>
```

组件根节点占满父容器的高度，需要由使用方给出明确高度，例如 `height: 720px`。

## Props

| 参数         | 类型                   | 默认值         | 说明                                |
| ------------ | ---------------------- | -------------- | ----------------------------------- |
| `items`      | `KnowledgeGraphItem[]` | -              | 知识点数据，必传                    |
| `activeId`   | `string`               | `''`           | 当前高亮 ID，可 `v-model:active-id` |
| `focusId`    | `string`               | `''`           | 初始滚动聚焦的 ID                   |
| `layout`     | `KnowledgeGraphLayout` | 默认弧形锚点   | 弧形轨道配置                        |
| `showAction` | `boolean`              | `true`         | 是否展示右侧操作按钮                |
| `emptyText`  | `string`               | `'暂无知识点'` | 空数据提示                          |
| `theme`      | `'graphite' \| 'amber'` | `'graphite'`   | 内置主题：石墨灰 / 琥珀暖沙         |

## Emits

| 事件               | 参数                 | 说明                              |
| ------------------ | -------------------- | --------------------------------- |
| `select`           | `KnowledgeGraphItem` | 点击操作按钮，交互由使用方决定    |
| `update:active-id` | `string`             | 高亮 ID 变化，支持 `v-model` 写法 |

## 暴露的方法

| 方法             | 说明                             |
| ---------------- | -------------------------------- |
| `scrollToActive` | 把当前聚焦节点滚动到视觉锚点位置 |

## 样式变量

`theme` 决定卡片、节点与悬停高亮的整套配色，目前内置 `graphite`（石墨灰）与 `amber`（琥珀暖沙）两套，切换时只替换包内资源与派生颜色，不改变布局。

`actionText` 可统一或逐条覆盖按钮文案，未传时使用内置默认文案。组件通过根节点注入 `--kg-card-*`、`--kg-node-*` 背景变量，条目上还会写入 `--kg-row-offset`、`--kg-card-scale` 等轨道变量；顶部/底部渐隐高度可用 `--kg-edge-fade` 调整（默认 `72px`）。

内部实现按 `requestAnimationFrame` 合并滚动计算，卸载时会取消所有帧、定时器与 observer。

## 独立调试

```bash
pnpm --filter @lyt/knowledge-graph dev
```
