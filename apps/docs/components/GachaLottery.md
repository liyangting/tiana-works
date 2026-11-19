<script setup>
import GachaLotteryDemo from './GachaLotteryDemo.vue'
</script>

# GachaLottery 扭蛋机

一个无业务依赖的扭蛋抽取组件。完整迁移物理堆叠、摇晃、掉落、开球与结果回收动画；内置加权本地抽取，也可将抽取结果交给接口或父组件决定。

## 演示

<GachaLotteryDemo />

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

## 暴露的方法

通过组件 `ref` 可调用 `start()`、`complete()`，并读取 `status` 和 `activePrize`。状态依次为 `idle`、`shaking`、`dropping`、`revealing`、`open`。

抽取进行时会禁用重复操作；没有可用奖品时会显示空状态。

该组件依赖 `matter-js` 和 `gsap` 来保留原扭蛋机的物理运动与时间线动画，机身、玻璃罩、按钮和扭蛋 PNG 素材均收录在组件目录中。

源码：[独立组件项目 @lyt/gacha-lottery](https://github.com/liyangting/vue3-pure-components/tree/main/packages/gacha-lottery)
