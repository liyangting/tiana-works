<template>
  <main class="pf-home">
    <svg class="pf-sprite" aria-hidden="true" width="0" height="0">
      <symbol
        id="pf-icon-juejin"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M4 15.2 12 19.6l8-4.4" />
        <path d="M4 11.1 12 15.5l8-4.4" />
        <path d="M12 4.4 4 8.8l8 4.4 8-4.4-8-4.4Z" />
      </symbol>
      <symbol
        id="pf-icon-mail"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3.8 6.7 8.2 5.8 8.2-5.8" />
      </symbol>
      <symbol
        id="pf-icon-github"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M9 19c-4.3 1.4-4.3-2.2-6-2.8m12 5.3v-3.9c0-1.1.1-1.6-.5-2.2 2.8-.3 5.5-1.4 5.5-6.1a4.7 4.7 0 0 0-1.3-3.2 4.4 4.4 0 0 0-.1-3.3s-1-.3-3.4 1.2a11.7 11.7 0 0 0-6.2 0C6.6 2.5 5.6 2.8 5.6 2.8a4.4 4.4 0 0 0-.1 3.3A4.7 4.7 0 0 0 4.2 9.3c0 4.7 2.7 5.8 5.5 6.1-.6.6-.6 1.2-.5 2.2v3.9"
        />
      </symbol>
    </svg>

    <div class="pf-wash" aria-hidden="true"></div>
    <div class="pf-grain" aria-hidden="true"></div>

    <div class="pf-home__inner">
      <header class="pf-hero">
        <span class="pf-hero__glow" aria-hidden="true"></span>
        <div class="pf-hero__grid">
          <div class="pf-hero__copy">
            <p class="pf-hero__signature">
              <span aria-hidden="true"></span>
              {{ profile.name }}
            </p>
            <div class="pf-hero__identity">
              <h1 class="pf-hero__name">{{ profile.displayName }}</h1>
              <span class="pf-hero__divider" aria-hidden="true"></span>
              <p class="pf-hero__role">{{ profile.role }}</p>
            </div>
            <p class="pf-hero__statement">{{ profile.statement }}</p>
            <p class="pf-hero__subline">{{ profile.subline }}</p>
          </div>

          <section
            class="pf-showcase"
            aria-label="精选组件轮播"
            @mouseenter="stopAutoPlay"
            @mouseleave="startAutoPlay"
          >
            <!-- <div v-if="total" class="pf-showcase__head">
              <RouterLink class="pf-showcase__link" to="/components">
                全部组件
                <span aria-hidden="true">→</span>
              </RouterLink>
            </div> -->

            <Swiper
              v-if="total >= 1"
              v-bind="swiperParams"
              class="pf-swiper"
              wrapper-class="pf-swiper__wrapper"
              slide-class="pf-carousel__card"
              @init="handleSwiperInit"
              @set-translate="handleSetTranslate"
              @slide-change="handleSetTranslate"
              @resize="handleSwiperResize"
            >
              <SwiperSlide
                v-for="(entry, index) in featuredWorks"
                :key="entry.name"
                class="pf-carousel__card"
                role="group"
                :aria-roledescription="'slide'"
                :aria-label="`${entry.name} ${entry.label}`"
                @click="handleCardClick(index)"
              >
                <template v-if="cardCover(entry)">
                  <img :src="cardCover(entry)" :alt="entry.label" decoding="async" draggable="false" />
                </template>
                <template v-else>
                  <span class="pf-carousel__placeholder" aria-hidden="true">
                    <span class="pf-carousel__placeholder-tag">{{ entry.label }}</span>
                  </span>
                </template>

                <span class="pf-carousel__mask">
                  <strong>{{ entry.name }}</strong>
                  <em>{{ entry.label }}</em>
                </span>
              </SwiperSlide>
            </Swiper>
          </section>
        </div>
      </header>
    </div>

    <div class="pf-home__inner">
      <section id="pf-projects" class="pf-section" aria-labelledby="pf-projects-title">
        <div class="pf-section__head">
          <div>
            <p class="pf-section-index">01 / 项目</p>
            <h2 id="pf-projects-title" class="pf-section__title">精选项目</h2>
          </div>
          <RouterLink class="pf-textlink" to="/projects">
            全部项目
            <span aria-hidden="true">→</span>
          </RouterLink>
        </div>

        <div class="pf-feature-projects">
          <RouterLink
            v-for="project in featuredProjects"
            :key="project.slug"
            class="pf-feature-project"
            :to="{ path: '/projects', hash: `#${project.slug}` }"
          >
            <span class="pf-feature-project__meta">{{ project.category }} · {{ project.period }}</span>
            <h3>{{ project.name }}</h3>
            <p>{{ project.summary }}</p>
            <span class="pf-feature-project__more">
              查看案例
              <span aria-hidden="true">→</span>
            </span>
          </RouterLink>
        </div>
      </section>

      <section id="pf-components" class="pf-section" aria-labelledby="pf-components-title">
        <div class="pf-section__head">
          <div>
            <p class="pf-section-index">02 / 组件</p>
            <h2 id="pf-components-title" class="pf-section__title">组件作品</h2>
          </div>
          <RouterLink class="pf-textlink" to="/components">
            全部组件
            <span aria-hidden="true">→</span>
          </RouterLink>
        </div>

        <div class="pf-component-grid pf-home__components">
          <template v-for="entry in componentRegistry" :key="entry.name">
            <RouterLink v-if="entry.status === '已发布'" class="pf-component-card" :to="entry.route">
              <div class="pf-component-card__media">
                <img v-if="cardCover(entry)" :src="cardCover(entry)" :alt="entry.label" loading="lazy" />
                <span v-else class="pf-component-card__placeholder">{{ entry.label }}</span>
                <span class="pf-component-card__status">{{ entry.status }}</span>
              </div>
              <div class="pf-component-card__body">
                <p class="pf-component-card__meta">
                  <span>{{ entry.category }}</span>
                  <span>{{ entry.complexity }}</span>
                </p>
                <h3 class="pf-component-card__title">{{ entry.name }} · {{ entry.label }}</h3>
                <p class="pf-component-card__desc">{{ entry.description }}</p>
              </div>
            </RouterLink>
            <div v-else class="pf-component-card is-planned">
              <div class="pf-component-card__media">
                <img v-if="cardCover(entry)" :src="cardCover(entry)" :alt="entry.label" loading="lazy" />
                <span v-else class="pf-component-card__placeholder">{{ entry.label }}</span>
                <span class="pf-component-card__status">{{ entry.status }}</span>
              </div>
              <div class="pf-component-card__body">
                <p class="pf-component-card__meta">
                  <span>{{ entry.category }}</span>
                  <span>{{ entry.complexity }}</span>
                </p>
                <h3 class="pf-component-card__title">{{ entry.name }} · {{ entry.label }}</h3>
                <p class="pf-component-card__desc">{{ entry.description }}</p>
              </div>
            </div>
          </template>
        </div>
      </section>

      <section id="pf-about" class="pf-section" aria-labelledby="pf-about-title">
        <div class="pf-section__head">
          <div>
            <p class="pf-section-index">03 / 关于</p>
            <h2 id="pf-about-title" class="pf-section__title">关于我</h2>
          </div>
          <RouterLink class="pf-textlink" to="/about">
            了解更多
            <span aria-hidden="true">→</span>
          </RouterLink>
        </div>

        <p class="pf-section__lead">比起列出做过什么，我更想说清楚自己怎么做。</p>

        <div class="pf-about__grid">
          <article v-for="(block, index) in aboutBlocks" :key="block.title" class="pf-about__block">
            <span class="pf-about__num">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3>{{ block.title }}</h3>
            <p>{{ block.body }}</p>
          </article>
        </div>

        <p class="pf-about__stack">
          <span class="pf-about__stack-label">Stack</span>
          {{ stackSummary.join(' / ') }}
        </p>
      </section>

      <footer class="pf-footer">
        <div class="pf-footer__top">
          <div class="pf-footer__brand">
            <img
              v-if="profile.avatar"
              class="pf-footer__avatar"
              :src="profile.avatar"
              :alt="`${profile.displayName} 的头像`"
            />
            <span
              v-else
              class="pf-footer__avatar pf-footer__avatar--monogram"
              role="img"
              aria-label="头像占位"
              title="头像占位"
            >
              {{ profile.displayName.slice(0, 1) }}
            </span>
            <div class="pf-footer__meta">
              <strong>{{ profile.displayName }} · {{ profile.name }}</strong>
              <span>用 Vue 3 做复杂交互，也把复杂度收进边界里。</span>
            </div>
          </div>

          <div class="pf-footer__links">
            <span class="pf-footer__label">04 / 联系</span>
            <template v-for="link in profile.links" :key="link.label">
              <a v-if="link.href" :href="link.href" target="_blank" rel="noreferrer" class="pf-footer__link">
                <svg class="pf-icon" aria-hidden="true">
                  <use :href="`#pf-icon-${link.icon}`" />
                </svg>
                {{ link.label }}
              </a>
              <span v-else class="pf-footer__link is-placeholder" :title="`${link.label} · 待补充`">
                <svg class="pf-icon" aria-hidden="true">
                  <use :href="`#pf-icon-${link.icon}`" />
                </svg>
                {{ link.label }} · 待补充
              </span>
            </template>
          </div>
        </div>

        <div class="pf-footer__bottom">
          <span>© {{ year }} {{ profile.displayName }} · {{ profile.name }}</span>
          <span>Built with Vue 3</span>
        </div>
      </footer>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Keyboard } from 'swiper/modules'
import { componentRegistry, type ComponentEntry } from '../data/component-registry'
import { featuredProjects } from '../data/project-registry'
import { aboutBlocks, profile, stackSummary } from '../data/site-data'
import 'swiper/css'

/** Swiper 实例（用于点击侧卡时切到中间位）。 */
let swiperInstance: any = null

/** Swiper 配置：我们自己接管 transform，让所有 slide 叠在一起。 */
const swiperParams = {
  modules: [Keyboard],
  slidesPerView: 1,
  spaceBetween: 0,
  speed: 450,
  loop: false /* 循环由 applyLayout 的环形 depth 实现，不依赖 Swiper 的 DOM 克隆 */,
  virtualTranslate: true /* 禁止 Swiper 自己写 translateX，完全由我们接管 */,
  autoHeight: false,
  centeredSlides: true /* active slide 在正中心（视觉上） */,
  keyboard: { enabled: true, onlyInViewport: false },
}

/*
 * Swiper Vue 只把模板上的 @init / @set-translate / @resize 监听器桥接给核心，
 * 写在 params.on 里的回调会被组件丢弃，因此布局回调统一放到模板事件上。
 */
function handleSwiperInit(swiper: any) {
  swiperInstance = swiper
  nextTick(() => {
    syncCardWidth()
    applyLayout(swiper)
    startAutoPlay()
  })
}
function handleSetTranslate(swiper: any) {
  applyLayout(swiper)
}
function handleSwiperResize(swiper: any) {
  syncCardWidth()
  nextTick(() => applyLayout(swiper))
}

/**
 * 平面扇形视觉参数（移植自作品广场 CampSwiper）：
 *
 * 深度层 | scale | opacity
 * -------|-------|--------
 * ±0 主卡 | 1.00  | 1.00
 * ±1      | 0.70  | 1.00
 * ±2      | 0.50  | 1.00
 * > ±2    | 0.50  | 0（滑出视野）
 *
 * 所有卡平铺在同一平面，不做 rotateY / translateZ；
 * 水平偏移按「相邻卡边缘重叠 OVERLAP」逐层累加，随卡片宽度自适应。
 */
const SCALE_BY_DEPTH = [1, 0.7, 0.5]
const OVERLAP = 0.46

/* ---------- 运行时工具 ---------- */

/** 从 CSS 变量 --pf-carousel-card-w 读当前卡宽。断点切换时自动更新。 */
const cardWidth = ref(320)
function syncCardWidth() {
  const root = document.querySelector('.pf-home') as HTMLElement | null
  if (!root) return
  const raw = getComputedStyle(root).getPropertyValue('--pf-carousel-card-w').trim()
  if (raw.endsWith('px')) cardWidth.value = Number.parseFloat(raw) || 320
}
onMounted(() => {
  syncCardWidth()
  window.addEventListener('resize', syncCardWidth)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', syncCardWidth)
  stopAutoPlay()
})

/** 第 abs 层的缩放值；超出 ±2 的卡片沿用最外层缩放。 */
function getScale(absDepth: number): number {
  return SCALE_BY_DEPTH[Math.min(absDepth, SCALE_BY_DEPTH.length - 1)]
}

/**
 * 计算某个 abs depth 值对应的水平中心偏移。
 * 相邻中心间距 = (scale_{i-1} + scale_i) * CARD_W/2 * (1 - OVERLAP)，逐层累加。
 */
function computeCenterOffset(absDepth: number): number {
  if (absDepth <= 0) return 0
  const w = cardWidth.value
  let offset = 0
  for (let i = 1; i <= absDepth; i++) {
    offset += (getScale(i - 1) + getScale(i)) * (w / 2) * (1 - OVERLAP)
  }
  return offset
}

/** 可见槽位半径：中间 + 左右各 2 张。 */
const MAX_DEPTH = 2
/** 过渡时长，与 CSS transition 保持一致。 */
const TRANSITION_MS = 450

/**
 * 环形深度：把 i - active 折叠到 [-floor(n/2), floor(n/2)]。
 * 这样 5 条数据永远正好填满 5 个槽位（-2 / -1 / 0 / +1 / +2），两端不会留空。
 */
function circularDepth(index: number, active: number, count: number): number {
  if (count <= 1) return 0
  const half = Math.floor(count / 2)
  let depth = (((index - active) % count) + count) % count
  if (depth > half) depth -= count
  return depth
}

/** 某个 depth 对应的目标姿态。 */
function poseOf(depth: number) {
  const abs = Math.abs(depth)
  return {
    x: abs === 0 ? 0 : (depth < 0 ? -1 : 1) * computeCenterOffset(abs),
    scale: getScale(abs),
    zIndex: abs > MAX_DEPTH ? 0 : 3 - abs,
  }
}

/** 记录上一帧每张卡的 depth，用于识别"跨越首尾"的那张卡。 */
const prevDepthOf = new WeakMap<HTMLElement, number>()
let lastActiveIndex = -1

/**
 * Swiper 回调：遍历所有 slide，按环形 depth 计算
 * transform / opacity / zIndex，形成平面扇形排布。
 * Swiper 负责切换时机，CSS transition 负责滑动动画。
 */
function applyLayout(swiper: any) {
  const slides: HTMLElement[] = swiper.slides
  const count = slides.length
  if (!count) return

  const cw = cardWidth.value

  // 双重保险：清掉 Swiper 可能写在 wrapper 上的 translate3d
  const wrapper = swiper.wrapperEl as HTMLElement | undefined
  if (wrapper) {
    wrapper.style.transform = 'translate3d(0, 0, 0)'
    wrapper.style.transition = 'none'
  }

  const activeIdx = typeof swiper.activeIndex === 'number' ? swiper.activeIndex : 0
  // 只有 active 真正变化时才判定循环，避免过渡过程中反复重置动画
  const activeChanged = activeIdx !== lastActiveIndex
  lastActiveIndex = activeIdx

  for (let i = 0; i < count; i++) {
    const slideEl = slides[i] as HTMLElement
    if (!slideEl) continue

    /*
     * Swiper 初始化时给每张 slide 写 inline width（= 容器宽）和 height，
     * 会盖掉 CSS 变量控制的卡片尺寸，必须清掉并写回我们自己的像素宽度。
     */
    slideEl.style.position = ''
    slideEl.style.left = ''
    slideEl.style.top = ''
    slideEl.style.width = `${cw}px`
    slideEl.style.height = ''
    slideEl.style.marginLeft = ''
    slideEl.style.marginRight = ''

    const imgEl = slideEl.querySelector('img') as HTMLElement | null
    if (imgEl) {
      imgEl.style.position = 'absolute'
      imgEl.style.inset = '0'
      imgEl.style.width = '100%'
      imgEl.style.height = '100%'
      imgEl.style.objectFit = 'cover'
    }

    const depth = circularDepth(i, activeIdx, count)
    const abs = Math.abs(depth)
    const pose = poseOf(depth)
    const prevDepth = prevDepthOf.get(slideEl)
    const wrapped = activeChanged && prevDepth !== undefined && Math.abs(depth - prevDepth) > MAX_DEPTH

    slideEl.style.zIndex = String(pose.zIndex)
    slideEl.style.pointerEvents = abs > MAX_DEPTH ? 'none' : 'auto'
    prevDepthOf.set(slideEl, depth)

    // 目标姿态始终写入 inline：无论动画是否被打断，最终落点都是正确的
    slideEl.style.transform = poseStr(pose.x, pose.scale)
    slideEl.style.opacity = abs > MAX_DEPTH ? '0' : '1'

    if (wrapped) {
      /*
       * 跨越首尾的卡片：从原侧滑出淡出，再在目标槽位原地淡入。
       * 用 CSS keyframes 而不是 setTimeout 两段式：无锁无定时器，
       * 连点导致的重入只是重播一次动画，不会把卡片卡在半路。
       */
      const outSign = prevDepth < 0 ? -1 : 1
      const edge = computeCenterOffset(MAX_DEPTH)
      const nudge = cardWidth.value * 0.14
      slideEl.style.setProperty('--pf-ws', String(getScale(MAX_DEPTH)))
      slideEl.style.setProperty('--pf-wf', `${outSign * computeCenterOffset(Math.abs(prevDepth))}px`)
      slideEl.style.setProperty('--pf-we', `${outSign * (edge + nudge)}px`)
      slideEl.style.setProperty('--pf-wt', `${pose.x}px`)

      slideEl.style.animation = 'none'
      void slideEl.offsetWidth // 强制重排，保证同名动画从头重播
      slideEl.style.animation = `pf-wrap ${TRANSITION_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1) both`
    } else {
      // 新一轮切换开始时，回收上一轮的循环动画，交回给 transition 驱动
      if (activeChanged && slideEl.style.animation && slideEl.style.animation !== 'none') {
        slideEl.style.animation = 'none'
      }
      // 过渡写在 inline 上，优先级高于 swiper/css 和全局降级规则，确保平移一定被动画化
      slideEl.style.transition = `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 320ms ease`
    }
  }
}

/** 生成一张卡的目标 transform 字符串。 */
function poseStr(x: number, scale: number): string {
  return `translate(-50%, -50%) translate3d(${x}px, 0, 0) scale(${scale})`
}

/** 当前点击驱动的单步序列令牌，新的一次点击会作废上一轮 */
let stepToken = 0
/** 上一次点击的时间戳，用于节流 */
let lastClickAt = 0

/**
 * 切到指定卡片。
 * 跨多张时拆成连续的"单步"执行 —— 一次跨越 2 个以上槽位会让中间的卡片
 * 从主卡上方横穿过去，视觉很乱；拆开后就永远是标准的"整排左移一格"。
 */
function handleCardClick(index: number) {
  const count = featuredWorks.value.length
  if (!swiperInstance || count < 2) return

  // 节流：一次完整切换动画结束前忽略新的点击，避免动画被打断/叠加
  const now = performance.now()
  if (now - lastClickAt < TRANSITION_MS) return
  lastClickAt = now

  const cur = swiperInstance.activeIndex
  if (index === cur) return

  // 取环形最短方向
  let delta = (((index - cur) % count) + count) % count
  if (delta > Math.floor(count / 2)) delta -= count

  const dir = delta > 0 ? 1 : -1
  let remaining = Math.abs(delta)
  const token = ++stepToken

  const runStep = () => {
    if (token !== stepToken || !swiperInstance) return
    swiperInstance.slideTo((swiperInstance.activeIndex + dir + count) % count)
    remaining -= 1
    if (remaining > 0) window.setTimeout(runStep, TRANSITION_MS + 20)
  }
  runStep()
}

/* ---------- 自动轮播 ---------- */

const AUTOPLAY_DELAY = 32000000
let autoTimer: number | null = null

function stopAutoPlay() {
  if (autoTimer !== null) {
    window.clearInterval(autoTimer)
    autoTimer = null
  }
}

function startAutoPlay() {
  stopAutoPlay()
  if (!swiperInstance || featuredWorks.value.length < 2) return
  autoTimer = window.setInterval(() => {
    if (!swiperInstance) return
    const next = (swiperInstance.activeIndex + 1) % featuredWorks.value.length
    swiperInstance.slideTo(next)
  }, AUTOPLAY_DELAY)
}

/* ---------- 业务数据 ---------- */

/** featured 组件列表（registry 里用 featured: true 标记）。 */
const featuredWorks = computed(() => componentRegistry.filter((entry) => entry.featured))

const total = computed(() => featuredWorks.value.length)

const year = new Date().getFullYear()

function cardCover(entry: ComponentEntry): string {
  return entry.cover || entry.previews?.[0]?.src || ''
}
</script>

<style lang="scss">
/**
 * 首页专用样式 —— 平面扇形卡片轮播版。
 * 只由 HomeView 引入，不随其他页面加载。
 */

.pf-home {
  --pf-bg: #1a1411;
  --pf-bg-soft: #221b16;
  --pf-text: #f4eadc;
  --pf-text-soft: #c9bbaa;
  --pf-text-dim: #948674;
  --pf-line: rgb(244 234 220 / 10%);
  --pf-line-strong: rgb(244 234 220 / 20%);
  --pf-accent: #f2704f;
  --pf-accent-soft: rgb(242 112 79 / 15%);
  --pf-serif: 'Songti SC', 'Noto Serif SC', 'Source Han Serif SC', 'Iowan Old Style', Georgia, serif;
  --pf-mono: ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, monospace;

  /* 轮播卡片宽度，JS 读取后按比例计算扇形位移。 */
  --pf-carousel-card-w: 320px;

  position: relative;
  isolation: isolate;
  min-height: calc(100vh - var(--app-header-h));
  overflow: clip;
  background: var(--pf-bg);
  color: var(--pf-text);
  font-family: var(--app-font);

  padding: 0 50px;
}

html:not(.dark) .pf-home {
  --pf-bg: #f8f2e8;
  --pf-bg-soft: #f1e8da;
  --pf-text: #241a14;
  --pf-text-soft: #5e5045;
  --pf-text-dim: #91826f;
  --pf-line: rgb(36 26 20 / 12%);
  --pf-line-strong: rgb(36 26 20 / 22%);
  --pf-accent: #cf4a2b;
  --pf-accent-soft: rgb(207 74 43 / 12%);
}

.pf-sprite {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

/* ---------- 背景：暖光 + 纸感颗粒 ---------- */

.pf-wash {
  position: absolute;
  inset: -160px -10% auto;
  z-index: 0;
  height: 920px;
  background:
    radial-gradient(34% 42% at 80% 22%, rgb(244 234 220 / 8%), transparent 72%),
    radial-gradient(44% 50% at 14% 4%, rgb(242 112 79 / 12%), transparent 74%);
  pointer-events: none;
}

html:not(.dark) .pf-wash {
  background:
    radial-gradient(34% 42% at 80% 22%, rgb(255 255 255 / 70%), transparent 72%),
    radial-gradient(44% 50% at 14% 4%, rgb(207 74 43 / 9%), transparent 74%);
}

.pf-grain {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
  opacity: 0.035;
  pointer-events: none;
}

html:not(.dark) .pf-grain {
  opacity: 0.05;
}

.pf-home__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1720px;
  margin: 0 auto;
}

/* ---------- Hero ---------- */

.pf-hero {
  position: relative;
  padding: clamp(18px, 2.4vw, 30px) 0 clamp(34px, 4.2vw, 54px);
}

.pf-hero::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 1px;
  background: linear-gradient(90deg, var(--pf-line), transparent 72%);
}

.pf-hero__glow {
  position: absolute;
  top: -60px;
  right: -20px;
  width: 560px;
  height: 560px;
  border-radius: 50%;
  background: radial-gradient(circle, rgb(242 112 79 / 16%), transparent 64%);
  filter: blur(46px);
  pointer-events: none;
}

.pf-hero__signature {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 11px;
  margin: 0 0 16px;
  color: var(--pf-text-dim);
  font-family: var(--pf-mono);
  font-size: 10.5px;
  letter-spacing: 0.14em;
}

.pf-hero__signature span {
  width: 24px;
  height: 1px;
  background: var(--pf-accent);
}

.pf-hero__grid {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.72fr) minmax(0, 1.28fr);
  align-items: center;
  gap: clamp(28px, 3.6vw, 56px);
  margin-top: clamp(12px, 1.6vw, 20px);
}

.pf-hero__copy {
  min-width: 0;
  max-width: 460px;
}

.pf-hero__identity {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}

.pf-hero__name {
  display: inline-block;
  margin: 0;
  font-family: var(--pf-serif);
  font-size: clamp(40px, 4.2vw, 56px);
  font-weight: 600;
  letter-spacing: 0.015em;
  line-height: 1.08;
}

.pf-hero__divider {
  width: 1px;
  height: 18px;
  background: var(--pf-line-strong);
}

.pf-hero__role {
  margin: 0;
  color: var(--pf-text-soft);
  font-size: 14px;
  letter-spacing: 0.06em;
}

.pf-hero__divider,
.pf-hero__role {
  transform: translateY(3px);
}

.pf-hero__statement {
  max-width: 18em;
  margin: 22px 0 0;
  font-family: var(--pf-serif);
  font-size: clamp(22px, 2vw, 27px);
  font-weight: 400;
  letter-spacing: 0.005em;
  line-height: 1.6;
}

.pf-hero__subline {
  max-width: 30em;
  margin: 12px 0 0;
  color: var(--pf-text-soft);
  font-size: 14px;
  letter-spacing: 0.02em;
  line-height: 1.7;
}

/* ---------- Showcase 外框 ---------- */

.pf-showcase {
  min-width: 0;
}

.pf-showcase__head {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
}

.pf-showcase__link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--pf-accent);
  font-size: 12px;
  text-decoration: none;
  white-space: nowrap;
  transition:
    gap 0.25s ease,
    color 0.25s ease;
}

.pf-showcase__link:hover {
  gap: 12px;
  color: var(--pf-text);
}

.pf-showcase__link span {
  margin: 0;
  color: inherit;
  font-size: 13px;
}

/* ---------- Swiper 驱动的平面扇形卡片轮播 ---------- */

/* 容器：所有卡片平铺在同一平面，focus 在水平位移与缩放上 */
.pf-swiper {
  position: relative;
  width: 100%;
  height: 560px;
  /* 不设 overflow：两侧卡片会超出容器，保留 overflow: visible 让完整的扇形可见 */
}

/* 中心下方柔和阴影，模拟层叠立体投影 */
.pf-swiper::after {
  content: '';
  position: absolute;
  bottom: 60px;
  left: 50%;
  z-index: 0;
  width: 72%;
  height: 36px;
  background: radial-gradient(ellipse, rgb(0 0 0 / 22%), transparent 70%);
  filter: blur(14px);
  transform: translateX(-50%);
  pointer-events: none;
}

html:not(.dark) .pf-swiper::after {
  background: radial-gradient(ellipse, rgb(0 0 0 / 12%), transparent 70%);
}

/* wrapper：
   - 保持 display: flex + 完整宽度 —— Swiper 内部导航逻辑依赖
   - transform 归零 —— 我们接管每张 slide 的位移 */
.pf-swiper .pf-swiper__wrapper {
  transition-property: none;
  transform: translate3d(0, 0, 0) !important;
}

.pf-carousel__card {
  position: absolute;
  top: 50%;
  left: 50%;
  /* width 由 applyLayout 里写 inline style 控制（用 cardWidth 像素值），
     CSS 里的 width / max-width 是兜底 */
  max-width: var(--pf-carousel-card-w);
  height: 100%;
  aspect-ratio: 3 / 4.4;
  overflow: hidden;
  background: #f8f2e8;
  border: 1px solid rgb(36 26 20 / 10%);
  border-radius: 20px;
  box-shadow:
    0 40px 80px -28px rgb(0 0 0 / 38%),
    0 8px 20px -8px rgb(0 0 0 / 18%);
  color: #241a14;
  text-decoration: none;
  cursor: pointer;
  transform-origin: center center;
  /* 关键：让 applyLayout 写入的 transform / opacity 平滑过渡，
     duration 与 Swiper.speed 保持一致（450ms），缓动对齐作品广场 */
  transition:
    transform 0.45s cubic-bezier(0.22, 0.61, 0.36, 1),
    opacity 0.3s ease,
    box-shadow 0.4s ease,
    border-color 0.35s ease;
  will-change: transform, opacity;
  padding: 0;
  font: inherit;
  box-sizing: border-box;
}

html:not(.dark) .pf-carousel__card {
  background: #ffffff;
  border-color: rgb(36 26 20 / 12%);
  box-shadow:
    0 40px 80px -28px rgb(0 0 0 / 20%),
    0 8px 20px -8px rgb(0 0 0 / 12%);
}

/* swiper/css 会给 .swiper-slide 写 position: relative 和 transition-property: transform，
   优先级与 .pf-carousel__card 相同且后加载，这里显式提权，保证卡片按扇形基准绝对定位。 */
.pf-swiper .pf-carousel__card {
  position: absolute;
  transition:
    transform 0.45s cubic-bezier(0.22, 0.61, 0.36, 1),
    opacity 0.3s ease,
    box-shadow 0.4s ease,
    border-color 0.35s ease;
}

/* 跨越首尾：原侧滑出淡出（0→30%），再在目标槽位原地淡入（30%→100%）。
   变量由 applyLayout 写入：
   --pf-wf 起点位置 / --pf-we 滑出终点 / --pf-wt 目标槽位 / --pf-ws 缩放 */
@keyframes pf-wrap {
  0% {
    transform: translate(-50%, -50%) translate3d(var(--pf-wf), 0, 0) scale(var(--pf-ws));
    opacity: 1;
  }
  30% {
    transform: translate(-50%, -50%) translate3d(var(--pf-we), 0, 0) scale(var(--pf-ws));
    opacity: 0;
  }
  30.01% {
    transform: translate(-50%, -50%) translate3d(var(--pf-wt), 0, 0) scale(var(--pf-ws));
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) translate3d(var(--pf-wt), 0, 0) scale(var(--pf-ws));
    opacity: 1;
  }
}

.pf-carousel__card:focus-visible {
  outline: 2px solid var(--pf-accent);
  outline-offset: 3px;
}

/* hover 主卡：加深边框 + 强化阴影 */
.swiper-slide-active.pf-carousel__card:hover,
.swiper-slide-active.pf-carousel__card:focus-visible {
  border-color: var(--pf-accent);
  box-shadow:
    0 56px 110px -26px rgb(0 0 0 / 52%),
    0 14px 32px -8px rgb(0 0 0 / 24%);
}

/* hover 侧卡：去灰度 + 轻微提亮 */
.pf-carousel__card:not(.swiper-slide-active):hover,
.pf-carousel__card:not(.swiper-slide-active):focus-visible {
  filter: none !important;
  opacity: 0.92 !important;
}

/* 按压反馈：只压暗，不改 transition-duration。
   之前在这里写 transition-duration: 0.08s !important 会把整个切换动画压成瞬间跳。 */
.pf-carousel__card:active {
  filter: brightness(0.94);
}

/* 卡片封面图 */
.pf-carousel__card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}

/* 占位卡（无 cover 时的盒子） */
.pf-carousel__placeholder {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background:
    radial-gradient(60% 48% at 70% 28%, rgb(242 112 79 / 20%), transparent 60%),
    radial-gradient(55% 50% at 30% 72%, rgb(217 160 91 / 16%), transparent 55%), #f8f2e8;
}

.pf-carousel__placeholder-tag {
  padding: 10px 24px;
  border: 1px solid rgb(36 26 20 / 12%);
  border-radius: 999px;
  color: rgb(36 26 20 / 55%);
  font-family: var(--pf-serif);
  font-size: 18px;
  letter-spacing: 0.04em;
  background: rgb(255 255 255 / 45%);
  backdrop-filter: blur(4px);
}

html:not(.dark) .pf-carousel__placeholder {
  background:
    radial-gradient(60% 48% at 70% 28%, rgb(207 74 43 / 12%), transparent 60%),
    radial-gradient(55% 50% at 30% 72%, rgb(217 160 91 / 12%), transparent 55%), #ffffff;
}

/* 底部渐变蒙版：从透明渐变到卡片底色，叠加在封面图之上 */
.pf-carousel__mask {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  padding: 56px 20px 16px;
  background: linear-gradient(transparent 0%, #f8f2e8 52%, #f8f2e8 100%);
  color: #241a14;
  pointer-events: none;
}

html:not(.dark) .pf-carousel__mask {
  background: linear-gradient(transparent 0%, #ffffff 52%, #ffffff 100%);
}

.pf-carousel__mask strong {
  display: block;
  font-family: var(--pf-serif);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.pf-carousel__mask em {
  display: block;
  margin-top: 3px;
  color: rgb(36 26 20 / 62%);
  font-style: normal;
  font-size: 13px;
  letter-spacing: 0.02em;
}

/* reduced-motion 降级：跳过所有 transition，直接 snap 到目标状态 */
/* reduced-motion 降级：关掉循环 keyframes，但保留一段很短的位置过渡。
   之前这里写 transition: none，会让轮播完全失去位移动画，看起来像直接跳格。 */
@media (prefers-reduced-motion: reduce) {
  .pf-swiper,
  .pf-swiper *,
  .pf-swiper *::before,
  .pf-swiper *::after {
    animation: none !important;
    transition-duration: 0.18s !important;
  }
}

/* ---------- 首页分区 ---------- */

.pf-section {
  position: relative;
  padding-top: clamp(56px, 6.4vw, 88px);
}

.pf-section::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 1px;
  background: linear-gradient(90deg, var(--pf-line), transparent 68%);
}

.pf-section__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 24px;
}

.pf-section-index {
  margin: 0 0 10px;
  color: var(--pf-text-dim);
  font-family: var(--pf-mono);
  font-size: 10.5px;
  letter-spacing: 0.14em;
}

.pf-section__title {
  margin: 0;
  font-family: var(--pf-serif);
  font-size: clamp(30px, 3.4vw, 42px);
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1.15;
}

.pf-section__lead {
  max-width: 26em;
  margin: 18px 0 0;
  font-family: var(--pf-serif);
  font-size: clamp(19px, 2vw, 24px);
  line-height: 1.55;
}

/* 精选项目 */

.pf-feature-projects {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: clamp(24px, 3vw, 34px);
}

.pf-feature-project {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: clamp(20px, 2.2vw, 26px);
  background: var(--pf-surface);
  border: 1px solid var(--pf-line);
  border-radius: 18px;
  color: inherit;
  text-decoration: none;
  transition:
    border-color 0.3s ease,
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.pf-feature-project:hover {
  border-color: var(--pf-accent);
  transform: translateY(-3px);
  box-shadow: 0 22px 50px -30px rgb(0 0 0 / 45%);
}

.pf-feature-project__meta {
  color: var(--pf-text-dim);
  font-size: 11px;
  letter-spacing: 0.04em;
}

.pf-feature-project h3 {
  margin: 0;
  font-family: var(--pf-serif);
  font-size: clamp(19px, 1.8vw, 22px);
  font-weight: 600;
  line-height: 1.35;
}

.pf-feature-project p {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: var(--pf-text-soft);
  font-size: 13px;
  line-height: 1.8;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.pf-feature-project__more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  padding-top: 6px;
  color: var(--pf-accent);
  font-size: 12px;
  letter-spacing: 0.02em;
  transition: gap 0.25s ease;
}

.pf-feature-project:hover .pf-feature-project__more {
  gap: 11px;
}

.pf-home__components {
  padding: 0;
  margin-top: clamp(24px, 3vw, 34px);
}

/* ---------- 关于我 ---------- */

.pf-about__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 44px;
  margin-top: clamp(36px, 4.6vw, 58px);
}

.pf-about__block {
  position: relative;
  padding-top: 18px;
}

.pf-about__block::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 36px;
  height: 1px;
  background: var(--pf-accent);
  opacity: 0.55;
}

.pf-about__num {
  color: var(--pf-accent);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.pf-about__block h3 {
  margin: 14px 0 10px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.pf-about__block p {
  margin: 0;
  color: var(--pf-text-soft);
  font-size: 14px;
  line-height: 1.85;
}

.pf-about__stack {
  margin: 40px 0 0;
  color: var(--pf-text-dim);
  font-size: 11px;
  letter-spacing: 0.03em;
  line-height: 1.8;
}

.pf-about__stack-label {
  margin-right: 14px;
  color: var(--pf-accent);
}

/* ---------- Footer ---------- */

.pf-footer {
  position: relative;
  margin-top: clamp(68px, 8.4vw, 104px);
  padding: 30px 0 40px;
}

.pf-footer::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 1px;
  background: linear-gradient(90deg, var(--pf-line), transparent 68%);
}

.pf-footer__top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.pf-footer__brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.pf-footer__avatar {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border: 1px solid var(--pf-line-strong);
  border-radius: 50%;
  object-fit: cover;
  color: var(--pf-text-dim);
}

.pf-footer__avatar--monogram {
  border: 0;
  background: radial-gradient(circle at 32% 26%, var(--pf-accent-soft), var(--pf-bg-soft));
  color: var(--pf-text);
  font-family: var(--pf-serif);
  font-size: 19px;
}

.pf-footer__meta strong {
  display: block;
  font-size: 15px;
  font-weight: 600;
}

.pf-footer__meta span {
  display: block;
  margin-top: 4px;
  color: var(--pf-text-dim);
  font-size: 12px;
}

.pf-footer__links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 18px;
}

.pf-footer__label {
  color: var(--pf-accent);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.pf-footer__link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--pf-text-soft);
  font-size: 12px;
  letter-spacing: 0.02em;
  text-decoration: none;
  transition: color 0.2s ease;
}

.pf-footer__link:hover {
  color: var(--pf-text);
}

.pf-footer__link.is-placeholder {
  color: var(--pf-text-dim);
}

.pf-icon {
  width: 15px;
  height: 15px;
}

.pf-footer__bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  margin-top: 28px;
  padding-top: 16px;
  border-top: 1px solid var(--pf-line);
  color: var(--pf-text-dim);
  font-size: 11px;
  letter-spacing: 0.02em;
}

/* ---------- 响应式 ---------- */

@media (max-width: 1080px) {
  .pf-hero__grid {
    grid-template-columns: minmax(0, 1fr);
    align-items: start;
    gap: 40px;
  }

  .pf-hero__copy {
    max-width: 560px;
  }

  .pf-swiper {
    height: 500px;
  }

  .pf-home {
    --pf-carousel-card-w: 280px;
  }
}

@media (max-width: 860px) {
  .pf-about__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }

  .pf-feature-projects {
    grid-template-columns: minmax(0, 1fr);
  }

  .pf-swiper {
    height: 420px;
  }

  .pf-home {
    --pf-carousel-card-w: 240px;
  }
}

@media (max-width: 720px) {
  .pf-home__inner {
    padding: 0 20px;
  }

  .pf-hero__glow {
    top: -80px;
    right: -140px;
    width: 380px;
    height: 380px;
  }

  .pf-swiper {
    height: 380px;
  }

  .pf-home {
    --pf-carousel-card-w: 200px;
  }

  .pf-footer__top {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 520px) {
  .pf-hero__name {
    font-size: 40px;
  }

  .pf-hero__divider {
    height: 16px;
  }

  .pf-hero__role {
    font-size: 13px;
  }

  .pf-hero__divider,
  .pf-hero__role {
    transform: translateY(2px);
  }

  .pf-hero__statement {
    max-width: none;
    font-size: 22px;
  }

  .pf-swiper {
    height: 340px;
  }

  .pf-home {
    --pf-carousel-card-w: 176px;
  }

  .pf-carousel__mask strong {
    font-size: 16px;
  }

  .pf-carousel__mask em {
    font-size: 11px;
  }
}

/* ---------- 动效降级 ---------- */

@media (prefers-reduced-motion: reduce) {
  .pf-home *,
  .pf-home *::before,
  .pf-home *::after {
    animation: none !important;
    /* 保留 0.18s 过渡，避免连位置变化都变成"直接跳格" */
    transition-duration: 0.18s !important;
  }
}
</style>
