<template>
  <div class="gacha-demo">
    <GachaLottery :prizes="prizes" @result="showResult" />
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { GachaLottery, type Prize } from '@lyt/gacha-lottery'

const prizes: Prize[] = [
  { id: 'coupon', name: '满减券', description: '下次下单即可使用', weight: 50 },
  { id: 'coffee', name: '咖啡兑换券', description: '来一杯提提神', weight: 30 },
  { id: 'gift', name: '神秘礼盒', description: '惊喜正在路上', weight: 15 },
  { id: 'grand', name: '特别大奖', description: '今天的幸运主角', weight: 5 },
]
const message = ref('')
function showResult(prize: Prize) {
  message.value = `抽到了「${prize.name}」`
}
</script>

<style scoped lang="scss">
.gacha-demo {
  display: grid;
  justify-items: center;
  padding: 28px 12px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fff6e7, #ffe1de);
}
.gacha-demo p {
  margin: 14px 0 0;
  color: #a64258;
  font-weight: 600;
}
</style>
