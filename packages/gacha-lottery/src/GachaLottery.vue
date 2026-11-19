<script setup lang="ts">
import { computed, ref } from "vue";
import GachaMachine from "./components/GachaMachine.vue";
import type { DrawHandler, GachaMachineTop, MachineStatus, Prize } from "./types";

const props = withDefaults(
  defineProps<{
    prizes: Prize[];
    draw?: DrawHandler;
    disabled?: boolean;
    machineTop?: GachaMachineTop;
    resetDelay?: number;
  }>(),
  {
    disabled: false,
    machineTop: "default",
    resetDelay: 0,
  },
);

const emit = defineEmits<{
  (event: "start"): void;
  (event: "result", prize: Prize): void;
  (event: "complete", prize: Prize): void;
  (event: "error", error: unknown): void;
}>();

const status = ref<MachineStatus>("idle");
const activePrize = ref<Prize | null>(null);
const isRunning = ref(false);

const eligiblePrizes = computed(() => props.prizes.filter((prize) => (prize.stock ?? -1) !== 0));
const canStart = computed(() => !props.disabled && !isRunning.value && eligiblePrizes.value.length > 0);
const delay = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

const drawLocally = (): Prize | null => {
  const prizes = eligiblePrizes.value;
  const weights = prizes.map((prize) => Math.max(0, prize.weight ?? 1));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  if (total <= 0) return null;

  let hit = Math.random() * total;
  for (let index = 0; index < prizes.length; index += 1) {
    hit -= weights[index];
    if (hit <= 0) return prizes[index];
  }
  return prizes[prizes.length - 1] ?? null;
};

const start = async () => {
  if (!canStart.value) return;

  isRunning.value = true;
  emit("start");

  try {
    status.value = "shaking";
    await delay(1200);
    status.value = "dropping";
    await delay(900);

    const prize = props.draw ? await props.draw() : drawLocally();
    if (!prize) throw new Error("没有可用的抽奖结果");

    activePrize.value = prize;
    emit("result", prize);
    status.value = "revealing";
    await delay(1000);
    status.value = "open";
  } catch (error) {
    status.value = "idle";
    activePrize.value = null;
    isRunning.value = false;
    emit("error", error);
  }
};

const complete = async () => {
  const prize = activePrize.value;
  if (!prize) return;
  emit("complete", prize);
  if (props.resetDelay > 0) await delay(props.resetDelay);
  status.value = "idle";
  activePrize.value = null;
  isRunning.value = false;
};

defineExpose({ start, status, activePrize });
</script>

<template>
  <div class="gacha-lottery">
    <GachaMachine
      :status="status"
      :prize="activePrize"
      :disabled="!canStart"
      :top="machineTop"
      @start="start"
      @confirm="complete"
    />
    <p v-if="eligiblePrizes.length === 0" class="gacha-lottery__empty">暂无可抽取奖品</p>
  </div>
</template>

<style scoped>
.gacha-lottery {
  width: min(100%, 560px);
  position: relative;
}

.gacha-lottery__empty {
  margin: 16px 0 0;
  color: #8c5d63;
  text-align: center;
  font-size: 14px;
}
</style>
