# @lyt/gacha-lottery

Vue 3 扭蛋抽取组件，完整保留物理扭蛋堆叠、摇晃、掉落、开球和结果回收动画。

## 特点

- 奖池由 `prizes` 显式传入；支持本地权重抽取或注入服务端 `draw`。
- 机身、玻璃罩、按钮与扭蛋素材为包私有资源。
- 使用 Matter.js 进行物理模拟，GSAP 管理出球与结果动画。

## 使用

```vue
<script setup lang="ts">
import { GachaLottery, type Prize } from '@lyt/gacha-lottery'
const prizes: Prize[] = [{ id: 'coupon', name: '优惠券', weight: 1 }]
</script>
<template><GachaLottery :prizes="prizes" /></template>
```

## 独立调试

```bash
pnpm --filter @lyt/gacha-lottery dev
```
