---
title: GachaLottery 扭蛋机
description: 使用 Matter.js 与 GSAP 实现的可配置物理扭蛋抽奖组件。
---

<script setup>
import GachaLotteryDemo from '../demos/GachaLotteryDemo.vue'
</script>

# GachaLottery 扭蛋机

一个无业务依赖的扭蛋抽取组件。完整实现物理扭蛋堆叠、摇晃、掉落、开球与结果回收动画；奖池与开奖逻辑均由使用方注入。

> 包名：`@lyt/gacha-lottery` · 类型：动画与交互 · 难度：高阶

## 在线演示

<GachaLotteryDemo />

## 设计与边界

组件将职责拆为三层：`GachaLottery` 管理抽奖状态机和对外 API，`GachaMachine` 管理机身与 Matter.js 物理世界，`GachaBall` 管理 GSAP 开球和结果回收时间线。

- **开奖与动画解耦**：`draw` 可以调用服务端；组件不保存库存、不改变业务奖池。
- **明确状态机**：`idle → shaking → dropping → revealing → open`，防止动画未完成时重复抽取。
- **资源私有**：机身、玻璃罩、按钮和扭蛋素材都随 package 发布，不污染文档站或宿主项目。

## 基础用法

```vue
<script setup lang="ts">
import { GachaLottery, type Prize } from '@lyt/gacha-lottery'

const prizes: Prize[] = [
  { id: 'coupon', name: '满减券', weight: 50 },
  { id: 'gift', name: '神秘礼盒', weight: 10 },
]
</script>

<template>
  <GachaLottery :prizes="prizes" @result="saveResult" />
</template>
```

## 服务端抽取

为防止在客户端泄露概率或篡改库存，生产环境通常应使用 `draw` 从服务端获取抽取结果。

```vue
<GachaLottery :prizes="prizes" :draw="() => api.drawGacha()" />
```

`draw` 返回 `null` 或抛出异常时，组件会回到初始状态并触发 `error`。

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| prizes | `Prize[]` | - | 奖品列表；库存为 `0` 的奖品不会参与抽取 |
| draw | `() => Prize \| null \| Promise<…>` | - | 自定义或服务端抽取函数 |
| disabled | `boolean` | `false` | 禁用抽取 |
| machineTop | `default \| alternate` | `default` | 扭蛋机顶部样式 |
| resetDelay | `number` | `0` | 用户确认奖品后，复位前的延迟（ms） |

`Prize`：`{ id, name, description?, imageUrl?, stock?, weight? }`。未指定 `stock` 或设为负数时视为无限库存；本地抽取时 `weight` 默认为 `1`。

## Emits

| 事件 | 说明 |
| --- | --- |
| `start` | 用户开始抽取 |
| `result` | 获得有效奖品后触发，参数为奖品 |
| `complete` | 用户点击“收下奖品”后触发，参数为奖品 |
| `error` | 抽取函数返回空结果或发生异常时触发 |

## Slots

当前组件不提供插槽。机身和结果展示的视觉呈现由组件的内置动画与资源统一控制；如需完全自定义结果内容，建议在 `result` 事件中由宿主页面展示自己的结果面板。

## 暴露的方法

通过组件 `ref` 可调用 `start()`、`complete()`，并读取 `status` 和 `activePrize`。状态依次为 `idle`、`shaking`、`dropping`、`revealing`、`open`。

## 性能、资源与可访问性

- Matter.js 物理引擎、Canvas、定时器和动画时间线会在组件卸载时清理，避免在路由切换后继续占用资源。
- 机身内的扭蛋数量固定，避免物理体数量随奖池规模无限增加；奖池只影响开奖结果。
- 抽取按钮使用原生 `button` 并设置可访问名称；结果弹层使用遮罩。若用于强无障碍场景，建议在宿主侧补充焦点管理和开奖结果的 `aria-live` 提示。
- 组件运行依赖为 `matter-js` 与 `gsap`，适合强调视觉和互动效果的业务场景，不建议用于对首屏包体极其敏感的页面。

## 源码与独立调试

- [独立组件项目 @lyt/gacha-lottery](https://github.com/liyangting/vue3-pure-components/tree/main/packages/gacha-lottery)
- 本地独立运行：`pnpm --filter @lyt/gacha-lottery dev`
