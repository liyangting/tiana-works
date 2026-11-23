<template>
  <div class="waterfall-demo">
    <div class="waterfall-demo__toolbar">
      <div class="waterfall-demo__group">
        <span class="waterfall-demo__label">列数</span>
        <button
          v-for="option in columnOptions"
          :key="option.value"
          type="button"
          class="waterfall-demo__chip"
          :class="{ 'is-active': columnMode === option.value }"
          :disabled="fixedWidth"
          @click="columnMode = option.value"
        >
          {{ option.label }}
        </button>
        <span v-if="fixedWidth" class="waterfall-demo__hint">列数由列宽推导</span>
      </div>

      <div class="waterfall-demo__group">
        <span class="waterfall-demo__label">间距</span>
        <input v-model.number="gap" type="range" min="8" max="28" step="2" aria-label="卡片间距" />
        <span class="waterfall-demo__value">{{ gap }}px</span>
      </div>

      <div class="waterfall-demo__group">
        <label class="waterfall-demo__switch">
          <input v-model="fixedWidth" type="checkbox" />
          固定 200px 列宽
        </label>
        <button type="button" class="waterfall-demo__chip" @click="reload">重新加载</button>
      </div>
    </div>

    <div ref="scrollEl" class="waterfall-demo__stage">
      <Waterfall
        :items="list"
        :columns="columns"
        :responsive-columns="responsiveColumns"
        :gap="gap"
        :item-width="fixedWidth ? 200 : undefined"
      >
        <template #default="{ item }">
          <article class="waterfall-card">
            <img class="waterfall-card__image" :src="item.image" :alt="item.title" loading="lazy" />
            <div class="waterfall-card__body">
              <h3>{{ item.title }}</h3>
              <p>{{ item.summary }}</p>
              <span class="waterfall-card__tag">{{ item.tag }}</span>
            </div>
          </article>
        </template>
      </Waterfall>

      <p v-if="error" class="waterfall-demo__state is-error">加载失败，请滚动到底部重试或重新加载。</p>
      <p v-else-if="loading" class="waterfall-demo__state">正在加载…</p>
      <p v-else-if="finished" class="waterfall-demo__state">没有更多了，共 {{ total ?? list.length }} 条。</p>
      <div v-else class="waterfall-demo__state">
        <button type="button" class="waterfall-demo__chip" @click="loadMore">加载更多</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Waterfall,
  getWaterfallImageDisplayHeight,
  getWaterfallImageSize,
  useWaterfall,
  type WaterfallFetchResult,
} from '@lyt/waterfall'

interface DemoItem {
  id: string
  title: string
  summary: string
  tag: string
  image: string
  height?: number
}

type ColumnMode = 'responsive' | 2 | 3 | 4

const TOTAL = 48
const PAGE_SIZE = 8

const RATIOS: Array<[number, number]> = [
  [4, 3],
  [3, 4],
  [1, 1],
  [16, 9],
  [3, 2],
  [2, 3],
  [5, 4],
  [4, 5],
]
const TITLES = ['山谷清晨', '老城午后', '海边灯塔', '雨夜窗台', '林中长路', '屋顶花园']
const SUMMARIES = [
  '按最短列优先落位，图片加载后自动重新平衡列高。',
  '列数随容器宽度切换，卡片始终进入当前最矮的一列。',
  '高度提示来自 imageSize 工具，真实高度仍以 DOM 实测为准。',
  '分页数据由 useWaterfall 注入，滚动触底继续加载。',
]
const TAGS = ['摄影', '插画', '旅行', '建筑', '灵感', '日常']

function createSvg(width: number, height: number, hue: number, label: string): string {
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    '<defs>',
    '<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">',
    `<stop offset="0" stop-color="hsl(${hue} 58% 74%)"/>`,
    `<stop offset="1" stop-color="hsl(${(hue + 46) % 360} 55% 52%)"/>`,
    '</linearGradient>',
    '</defs>',
    '<rect width="100%" height="100%" fill="url(#bg)"/>',
    `<circle cx="${width * 0.74}" cy="${height * 0.28}" r="${Math.min(width, height) * 0.16}" fill="rgba(255,255,255,0.34)"/>`,
    `<rect x="${width * 0.08}" y="${height * 0.66}" width="${width * 0.5}" height="${height * 0.12}" rx="8" fill="rgba(255,255,255,0.22)"/>`,
    `<text x="${width * 0.08}" y="${height * 0.9}" fill="rgba(255,255,255,0.82)" font-size="${Math.round(width * 0.055)}" font-family="sans-serif">${label}</text>`,
    '</svg>',
  ].join('')
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function createItem(index: number): DemoItem {
  const [widthRatio, heightRatio] = RATIOS[index % RATIOS.length]
  const width = 480
  const height = Math.round((width * heightRatio) / widthRatio)
  const title = TITLES[index % TITLES.length]
  return {
    id: `waterfall-${index + 1}`,
    title: `${title} · ${String(index + 1).padStart(2, '0')}`,
    summary: SUMMARIES[index % SUMMARIES.length],
    tag: TAGS[index % TAGS.length],
    image: createSvg(width, height, (index * 37) % 360, title),
  }
}

async function fetchFeed({
  page,
  pageSize,
}: {
  page: number
  pageSize: number
}): Promise<WaterfallFetchResult<DemoItem>> {
  await new Promise((resolve) => setTimeout(resolve, 320))

  const start = (page - 1) * pageSize
  const end = Math.min(start + pageSize, TOTAL)
  const items = Array.from({ length: Math.max(0, end - start) }, (_, offset) => createItem(start + offset))

  await Promise.all(
    items.map(async (item) => {
      const size = await getWaterfallImageSize(item.image)
      const height = size ? getWaterfallImageDisplayHeight(size, 220) : null
      if (height !== null) item.height = Math.round(height)
    }),
  )

  return { list: items, total: TOTAL }
}

const scrollEl = ref<HTMLElement | null>(null)
const columnMode = ref<ColumnMode>('responsive')
const gap = ref(16)
const fixedWidth = ref(false)

const columnOptions: Array<{ label: string; value: ColumnMode }> = [
  { label: '响应式', value: 'responsive' },
  { label: '2 列', value: 2 },
  { label: '3 列', value: 3 },
  { label: '4 列', value: 4 },
]

const columns = computed(() => (columnMode.value === 'responsive' ? 4 : columnMode.value))
const responsiveColumns = computed<Record<string, number> | undefined>(() =>
  columnMode.value === 'responsive' ? { '0': 2, '560': 3, '900': 4 } : undefined,
)

const { list, loading, finished, total, error, loadMore, refresh } = useWaterfall<DemoItem>({
  fetcher: fetchFeed,
  pageSize: PAGE_SIZE,
  target: scrollEl,
  offset: 160,
})

function reload(): void {
  void refresh()
}
</script>

<style scoped lang="scss">
.waterfall-demo {
  padding: 22px;
  border: 1px solid var(--pf-line);
  border-radius: 18px;
  background: var(--pf-surface);
}

.waterfall-demo__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 26px;
  padding-bottom: 18px;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--pf-line);
}

.waterfall-demo__group {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--pf-text-soft);
  font-size: 12.5px;
}

.waterfall-demo__label {
  color: var(--pf-text-dim);
  font-family: var(--pf-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
}

.waterfall-demo__value {
  min-width: 40px;
  color: var(--pf-text-dim);
  font-family: var(--pf-mono);
  font-size: 11px;
}

.waterfall-demo__chip {
  padding: 5px 12px;
  border: 1px solid var(--pf-line);
  border-radius: 999px;
  background: transparent;
  color: var(--pf-text-soft);
  font-size: 12px;
  cursor: pointer;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.waterfall-demo__chip:hover,
.waterfall-demo__chip.is-active {
  border-color: var(--pf-accent);
  background: var(--pf-accent-soft);
  color: var(--pf-accent);
}

.waterfall-demo__chip:disabled {
  border-color: var(--pf-line);
  background: transparent;
  color: var(--pf-text-dim);
  cursor: not-allowed;
  opacity: 0.5;
}

.waterfall-demo__hint {
  color: var(--pf-text-dim);
  font-size: 11.5px;
}

.waterfall-demo__switch {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.waterfall-demo__stage {
  max-height: 520px;
  overflow-y: auto;
  padding: 4px;
  border-radius: 12px;
  background: var(--pf-bg-soft);
}

.waterfall-card {
  overflow: hidden;
  border: 1px solid var(--pf-line);
  border-radius: 14px;
  background: var(--pf-surface);
}

.waterfall-card__image {
  display: block;
  width: 100%;
  height: auto;
}

.waterfall-card__body {
  padding: 12px 14px 16px;
}

.waterfall-card__body h3 {
  margin: 0;
  font-family: var(--pf-serif);
  font-size: 15px;
  font-weight: 600;
}

.waterfall-card__body p {
  margin: 6px 0 0;
  color: var(--pf-text-soft);
  font-size: 12.5px;
  line-height: 1.7;
}

.waterfall-card__tag {
  display: inline-block;
  margin-top: 10px;
  padding: 2px 9px;
  border-radius: 999px;
  background: var(--pf-accent-soft);
  color: var(--pf-accent);
  font-size: 10.5px;
}

.waterfall-demo__state {
  margin: 16px 0 4px;
  color: var(--pf-text-dim);
  font-size: 12.5px;
  text-align: center;
}

.waterfall-demo__state.is-error {
  color: #c8503c;
}

@media (max-width: 720px) {
  .waterfall-demo {
    padding: 16px;
  }
}
</style>
