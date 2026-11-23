<template>
  <main class="page">
    <header class="toolbar">
      <h1>@lyt/waterfall</h1>
      <label>
        列数
        <select v-model.number="columns">
          <option :value="2">2</option>
          <option :value="3">3</option>
          <option :value="4">4</option>
        </select>
      </label>
      <label>
        间距
        <input v-model.number="gap" type="range" min="8" max="32" step="2" />
        <span>{{ gap }}px</span>
      </label>
      <button type="button" @click="appendItems">追加 6 项</button>
      <button type="button" @click="resetItems">重置</button>
    </header>

    <Waterfall :items="items" :columns="columns" :gap="gap" item-key="id">
      <template #default="{ item, index }">
        <article class="card" :style="{ minHeight: `${item.height}px`, background: item.background }">
          <span class="card__index">{{ index + 1 }}</span>
          <h2>{{ item.title }}</h2>
          <p>{{ item.summary }}</p>
        </article>
      </template>
    </Waterfall>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Waterfall } from '../src'

interface DemoItem {
  id: string
  title: string
  summary: string
  height: number
  background: string
}

const TONES = ['#f6d7c3', '#efc3b2', '#e4d6c3', '#d9e2d4', '#d6dce8', '#e9d8e4']
const TITLES = ['清晨', '潮汐', '远山', '旧街', '午后', '夜航']
const SUMMARIES = [
  '最短列优先，高度相同保留靠前列。',
  'ResizeObserver 实测卡片高度后重新平衡。',
  '响应式列数随容器宽度切换。',
  '固定列宽模式下列数随容器宽度推导。',
]

let seed = 0

function createItem(): DemoItem {
  const index = seed
  seed += 1
  return {
    id: `item-${seed}`,
    title: TITLES[index % TITLES.length],
    summary: SUMMARIES[index % SUMMARIES.length],
    height: 110 + ((index * 53) % 160),
    background: TONES[index % TONES.length],
  }
}

const columns = ref(4)
const gap = ref(16)
const items = ref<DemoItem[]>(Array.from({ length: 12 }, createItem))

function appendItems(): void {
  items.value = [...items.value, ...Array.from({ length: 6 }, createItem)]
}

function resetItems(): void {
  items.value = Array.from({ length: 12 }, createItem)
}
</script>

<style scoped lang="scss">
body {
  margin: 0;
  background: #f7f1e8;
}

.page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 28px 24px 64px;
  color: #2a1f18;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px 22px;
  margin-bottom: 24px;
}

.toolbar h1 {
  margin: 0 12px 0 0;
  font-size: 20px;
}

.toolbar label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.toolbar button {
  padding: 7px 14px;
  border: 1px solid rgb(42 31 24 / 18%);
  border-radius: 999px;
  background: #fffaf3;
  color: inherit;
  font-size: 13px;
  cursor: pointer;
}

.card {
  padding: 16px;
  border-radius: 14px;
  box-shadow: 0 10px 26px rgb(42 31 24 / 8%);
}

.card__index {
  font-size: 11px;
  letter-spacing: 0.08em;
  opacity: 0.55;
}

.card h2 {
  margin: 6px 0 8px;
  font-size: 16px;
}

.card p {
  margin: 0;
  color: rgb(42 31 24 / 68%);
  font-size: 12.5px;
  line-height: 1.7;
}
</style>
