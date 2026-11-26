<template>
  <div class="knowledge-graph-demo" :data-theme="theme">
    <div ref="viewportRef" class="knowledge-graph-demo__viewport">
      <div class="knowledge-graph-demo__stage" :style="stageStyle">
        <div class="knowledge-graph-demo__scene" :style="sceneStyle">
          <svg
            class="knowledge-graph-demo__orbit"
            viewBox="0 0 930 930"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              cx="465"
              cy="465"
              r="464.75"
              stroke="url(#knowledge-graph-demo-orbit)"
              stroke-opacity="0.5"
              stroke-width="0.5"
              stroke-dasharray="3 5"
            />
            <defs>
              <linearGradient
                id="knowledge-graph-demo-orbit"
                x1="104.954"
                y1="-104.232"
                x2="1017.59"
                y2="336.287"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" />
                <stop offset="0.469592" stop-color="white" stop-opacity="0" />
                <stop offset="1" stop-color="white" />
              </linearGradient>
            </defs>
          </svg>

          <div class="knowledge-graph-demo__planet" aria-hidden="true"></div>

          <KnowledgeGraph
            ref="graphRef"
            v-model:active-id="activeId"
            class="knowledge-graph-demo__routes"
            :items="items"
            :focus-id="focusId"
            :theme="theme"
          />
        </div>
      </div>
    </div>

    <div class="knowledge-graph-demo__bar">
      <p class="knowledge-graph-demo__tip">
        当前高亮：{{ activeTitle }}。点击条目会切换高亮；列表支持滚轮和拖拽滚动。
      </p>
      <div class="knowledge-graph-demo__actions">
        <div class="knowledge-graph-demo__palettes" role="group" aria-label="主题">
          <button
            v-for="item in THEMES"
            :key="item.id"
            type="button"
            :class="{ 'is-active': theme === item.id }"
            @click="theme = item.id"
          >
            {{ item.label }}
          </button>
        </div>
        <button type="button" @click="scrollToActive">回到当前节点</button>
        <button type="button" @click="resetItems">重置列表</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { KnowledgeGraph, type KnowledgeGraphItem, type KnowledgeGraphTheme } from '@lyt/knowledge-graph'

/** 场景按 1400 × 940 设计，演示区按自身宽度整体缩放。 */
const SCENE_WIDTH = 1400
const SCENE_HEIGHT = 940

/** 演示统一按钮文案：点击只切换高亮，不再切换学习状态。 */
const BUTTON_TEXT = '查看详情'

/** 组件内置的两套主题，演示里可直接切换对比。 */
const THEMES: Array<{ id: KnowledgeGraphTheme; label: string }> = [
  { id: 'graphite', label: '石墨灰' },
  { id: 'amber', label: '琥珀暖沙' },
]

function createItems(): Array<KnowledgeGraphItem> {
  return [
    {
      id: 'kp-camera-image',
      title: '相机是如何把光变成照片的？',
      subtitle: '理解镜头、传感器与成像链路',
      actionText: BUTTON_TEXT,
    },
    {
      id: 'kp-aperture',
      title: '光圈和快门如何配合？',
      subtitle: '掌握曝光三角里的进光量与时间',
      actionText: BUTTON_TEXT,
    },
    {
      id: 'kp-iso',
      title: 'ISO 什么时候该调高？',
      subtitle: '在噪点与暗光之间做取舍',
      actionText: BUTTON_TEXT,
    },
    {
      id: 'kp-white-balance',
      title: '白平衡如何影响画面氛围？',
      subtitle: '用色温还原或创造光线情绪',
      actionText: BUTTON_TEXT,
    },
    {
      id: 'kp-composition',
      title: '构图有哪些经典法则？',
      subtitle: '三分法、引导线与留白的取舍',
      actionText: BUTTON_TEXT,
    },
    {
      id: 'kp-lighting',
      title: '如何用光塑造质感？',
      subtitle: '顺光、侧光与逆光的表现差异',
      actionText: BUTTON_TEXT,
    },
    {
      id: 'kp-color-grading',
      title: '后期调色从哪里入手？',
      subtitle: '先校正曝光与白平衡再谈风格',
      actionText: BUTTON_TEXT,
    },
    {
      id: 'kp-portfolio',
      title: '如何形成个人摄影风格？',
      subtitle: '从主题选择到稳定输出的路径',
      actionText: BUTTON_TEXT,
    },
  ]
}

const viewportRef = ref<HTMLElement>()
const graphRef = ref<{ scrollToActive: () => Promise<void> } | null>(null)
const items = ref<Array<KnowledgeGraphItem>>(createItems())
const focusId = ref('kp-composition')
const activeId = ref('kp-composition')
const scale = ref(0.7)
const theme = ref<KnowledgeGraphTheme>('graphite')

const activeTitle = computed(() => items.value.find((item) => item.id === activeId.value)?.title ?? '无')

const stageStyle = computed(() => ({
  width: `${SCENE_WIDTH * scale.value}px`,
  height: `${SCENE_HEIGHT * scale.value}px`,
}))

const sceneStyle = computed(() => ({ transform: `scale(${scale.value})` }))

let resizeObserver: ResizeObserver | undefined

function updateScale(width: number): void {
  scale.value = Math.min(1, width / SCENE_WIDTH)
}

function scrollToActive(): void {
  void graphRef.value?.scrollToActive()
}

function resetItems(): void {
  items.value = createItems()
  activeId.value = 'kp-composition'
  void graphRef.value?.scrollToActive()
}

onMounted(() => {
  const viewport = viewportRef.value

  if (!viewport) {
    return
  }

  updateScale(viewport.clientWidth)

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(([entry]) => {
      if (entry) {
        updateScale(entry.contentRect.width)
      }
    })
    resizeObserver.observe(viewport)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = undefined
})
</script>

<style scoped lang="scss">
/* 场景配色：两套主题只切换场景光晕与星球贴图，卡片与节点由组件内部主题资源负责。 */
.knowledge-graph-demo {
  --demo-bg: #0a0b0d;
  --demo-wash-1: rgb(200 215 220 / 7%);
  --demo-wash-2: rgb(140 160 170 / 5%);
  --demo-bar-hover-border: rgb(240 245 245 / 70%);
  --demo-bar-hover-bg: rgb(240 245 245 / 14%);

  padding: 0;
  overflow: hidden;
  border-radius: 18px;
  background: var(--demo-bg);
}

/* 琥珀暖沙：整体转暖，和页面外壳的暖色呼应。 */
.knowledge-graph-demo[data-theme='amber'] {
  --demo-bg: #0b0906;
  --demo-wash-1: rgb(255 170 100 / 11%);
  --demo-wash-2: rgb(190 110 60 / 8%);
  --demo-bar-hover-border: rgb(255 200 140 / 70%);
  --demo-bar-hover-bg: rgb(255 190 120 / 16%);
}

.knowledge-graph-demo__viewport {
  width: 100%;
  padding: 0;
  overflow: hidden;
}

.knowledge-graph-demo__stage {
  position: relative;
  max-width: 100%;
  margin: 0 auto;
  background:
    radial-gradient(70% 90% at 10% 40%, var(--demo-wash-1) 0%, transparent 60%),
    radial-gradient(60% 70% at 100% 0%, var(--demo-wash-2) 0%, transparent 55%), var(--demo-bg);
}

/* 场景按 1400×940 设计，由 JS 计算缩放比例后整体缩放。 */
.knowledge-graph-demo__scene {
  position: absolute;
  top: 0;
  left: 0;
  width: 1400px;
  height: 940px;
  transform-origin: top left;
}

/* 虚线圆圆心与半径由默认弧形锚点反推，保证每一行序号节点正好落在虚线上：
   节点中心 x = 360 + 34 + rowOffset，y = 40 + 148 * visibleIndex + 54。 */
.knowledge-graph-demo__orbit {
  position: absolute;
  top: 16px;
  left: -371px;
  width: 996px;
  height: 996px;
  pointer-events: none;
}

/* 星球贴图：左上缘光 + 暗面星点，两套主题各一张。 */
.knowledge-graph-demo__planet {
  position: absolute;
  top: 79px;
  left: -308px;
  width: 870px;
  height: 870px;
  background: url('../assets/knowledge-graph-planet-graphite.webp') center / contain no-repeat;
  pointer-events: none;
}

.knowledge-graph-demo[data-theme='amber'] .knowledge-graph-demo__planet {
  background-image: url('../assets/knowledge-graph-planet-amber.webp');
}

.knowledge-graph-demo__routes {
  position: absolute;
  top: 40px;
  left: 360px;
  width: calc(100% - 380px);
  height: 900px;
}

.knowledge-graph-demo__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 24px;
  padding: 14px 20px 18px;
  border-top: 1px solid rgb(255 255 255 / 8%);
  background: var(--demo-bg);
}

.knowledge-graph-demo__tip {
  margin: 0;
  color: rgb(255 255 255 / 58%);
  font-size: 12.5px;
  line-height: 1.7;
}

.knowledge-graph-demo__actions {
  display: flex;
  gap: 10px;
}

.knowledge-graph-demo__actions button {
  padding: 7px 15px;
  border: 1px solid rgb(255 255 255 / 22%);
  border-radius: 999px;
  background: rgb(255 255 255 / 6%);
  color: rgb(255 255 255 / 80%);
  font-size: 12.5px;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    border-color: var(--demo-bar-hover-border);
    background: var(--demo-bar-hover-bg);
  }
}

.knowledge-graph-demo__palettes {
  display: flex;
  gap: 6px;
  padding-right: 10px;
  margin-right: 2px;
  border-right: 1px solid rgb(255 255 255 / 10%);

  button.is-active {
    border-color: var(--demo-bar-hover-border);
    background: var(--demo-bar-hover-bg);
    color: #fff;
  }
}

@media (max-width: 640px) {
  .knowledge-graph-demo__bar {
    padding: 12px 14px 14px;
  }
}
</style>
