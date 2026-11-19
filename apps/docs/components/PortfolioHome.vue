<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { componentRegistry, type ComponentEntry } from '../.vitepress/component-registry'
import '../.vitepress/theme/portfolio-home.css'

interface ProfileLink {
  label: string
  icon: 'juejin' | 'mail'
  href: string
}

/** 绝对 depth ≥ 4 的卡直接隐藏，只保留 3 层景深。 */
const MAX_DEPTH = 3

/**
 * 不同 depth 的视觉参数。
 * depth 0 是主卡；正数在右侧，负数在左侧。
 */
interface DepthParams {
  scale: number
  translateX: number  /* px 基础值，实际乘以 sign */
  translateY: number
  translateZ: number
  opacity: number
  zIndex: number
}

const DEPTH_LAYER: Record<number, Omit<DepthParams, 'translateX'>> = {
  0:  { scale: 1,    translateY: 0,   translateZ: 0,   opacity: 1,    zIndex: 10 },
  1:  { scale: 0.82, translateY: 12,  translateZ: -50, opacity: 0.88, zIndex: 9 },
  2:  { scale: 0.66, translateY: 22,  translateZ: -100, opacity: 0.55, zIndex: 8 },
  3:  { scale: 0.52, translateY: 32,  translateZ: -150, opacity: 0.28, zIndex: 7 },
}

const SIDE_OFFSET = 210  /* depth ±1 的基础偏移 */
const SIDE_GROW = 80     /* 每往外一层多偏移 */

/**
 * 个人信息占位。
 */
const profile = {
  name: 'Tiana',
  displayName: '李杨婷',
  role: '前端工程师',
  statement: '把复杂交互，做成可复用的组件。',
  subline: '手感、边界和性能，缺一个都不算完成。',
  avatar: '',
  links: [
    { label: '掘金', icon: 'juejin', href: '' },
    { label: '邮箱', icon: 'mail', href: '' },
  ] as ProfileLink[],
}

const year = new Date().getFullYear()

const stack = ['Vue 3', 'TypeScript', 'Vite', 'pnpm', 'GSAP', 'Matter.js', 'Canvas / WebGL', 'CSS 动效', '性能优化']

const aboutBlocks = [
  {
    title: '从边界开始',
    body: '先写清组件管什么、不管什么：状态怎么流转、输入输出是什么、失败和降级走哪条路。视觉实现放在这些之后。',
  },
  {
    title: '偏爱有手感的交互',
    body: '动效、物理和 Canvas 是我更愿意投入的方向，但性能预算和降级方案必须先成立，而不是最后再补。',
  },
  {
    title: '交付，而不是演示',
    body: '独立包、公开 API、Playground、文档和可访问性，缺一项就不算完成。组件应该能被别人接手，而不是只能由我维护。',
  },
]

/** 所有标记为 featured 的组件，按注册表顺序。全部参与层叠渲染。 */
const featuredWorks = computed(() => {
  return componentRegistry.filter(entry => entry.featured)
})

const total = computed(() => featuredWorks.value.length)

/** 当前主卡在 featuredWorks 中的索引。 */
const currentIndex = ref(0)

/** 当前主卡 entry（用于顶部「查看组件 →」链接）。 */
const current = computed(() => featuredWorks.value[currentIndex.value] ?? null)

/**
 * 计算每张卡的 depth（相对于 currentIndex 的有符号差）
 * 和对应的 transform / opacity / z-index 内联样式。
 */
function computeCardStyle(idx: number): Record<string, string> {
  const depth = idx - currentIndex.value
  const abs = Math.abs(depth)

  if (abs > MAX_DEPTH) {
    return {
      opacity: '0',
      zIndex: '0',
      pointerEvents: 'none',
      transform: 'translate(-50%, -50%)',
    }
  }

  const sign = Math.sign(depth)
  const layer = DEPTH_LAYER[abs] ?? DEPTH_LAYER[MAX_DEPTH]
  const translateX = sign * (SIDE_OFFSET + abs * SIDE_GROW)

  return {
    opacity: String(layer.opacity),
    zIndex: String(layer.zIndex - sign),  /* 左侧 (负) 稍高，避免被同层右侧盖住 */
    transform: `translate(-50%, -50%) translate(${translateX}px, ${layer.translateY}px) translateZ(${layer.translateZ}px) scale(${layer.scale})`,
    filter: abs === 0 ? 'none' : `grayscale(${Math.min(abs * 0.12, 0.38)})`,
  }
}

/** 点击任意侧卡 → 平滑过渡到该卡成为主卡。 */
function goTo(idx: number) {
  if (idx === currentIndex.value) return
  currentIndex.value = idx
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

/** 封面图 URL：cover → previews[0] → ''（走占位）。 */
function coverUrl(entry: ComponentEntry): string {
  if (entry.cover) return withBase(entry.cover)
  const firstPreview = entry.previews?.[0]?.src
  if (firstPreview) return withBase(firstPreview)
  return ''
}
</script>

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

          <section v-if="current" class="pf-showcase" aria-label="精选组件轮播">
            <div class="pf-showcase__head">
              <a class="pf-showcase__link" :href="withBase(current.route)">
                查看组件
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <div class="pf-carousel">
              <!-- 全部 featured 卡都在 DOM 中，通过 depth 层叠排列 -->
              <template v-for="(entry, idx) in featuredWorks" :key="entry.name">
                <!-- 主卡 → <a> 进入组件页 -->
                <a
                  v-if="idx === currentIndex"
                  class="pf-carousel__card"
                  :class="`pf-carousel__card--depth-${Math.abs(idx - currentIndex)}`"
                  :href="withBase(entry.route)"
                  :aria-label="`进入组件 ${entry.name} ${entry.label}`"
                  :style="computeCardStyle(idx)"
                >
                  <template v-if="coverUrl(entry)">
                    <img :src="coverUrl(entry)" :alt="entry.label" decoding="async" />
                  </template>
                  <span v-else class="pf-carousel__placeholder" aria-hidden="true">
                    <span class="pf-carousel__placeholder-tag">{{ entry.label }}</span>
                  </span>
                  <span class="pf-carousel__badge">当前</span>
                  <span class="pf-carousel__mask">
                    <strong>{{ entry.name }}</strong>
                    <em>{{ entry.label }}</em>
                    <span class="pf-carousel__meta">
                      {{ entry.category }} · {{ entry.complexity }} · {{ entry.status }}
                    </span>
                  </span>
                </a>

                <!-- 侧卡 / 远卡 → <button> 切换到该卡为主卡 -->
                <button
                  v-else
                  type="button"
                  class="pf-carousel__card"
                  :class="`pf-carousel__card--depth-${Math.abs(idx - currentIndex)}`"
                  :aria-label="`切换到 ${entry.name} ${entry.label}`"
                  :style="computeCardStyle(idx)"
                  @click="goTo(idx)"
                >
                  <template v-if="coverUrl(entry)">
                    <img :src="coverUrl(entry)" :alt="entry.label" decoding="async" />
                  </template>
                  <span v-else class="pf-carousel__placeholder" aria-hidden="true">
                    <span class="pf-carousel__placeholder-tag">{{ entry.label }}</span>
                  </span>
                  <span class="pf-carousel__mask">
                    <strong>{{ entry.name }}</strong>
                    <em>{{ entry.label }}</em>
                  </span>
                </button>
              </template>
            </div>

            <!-- 分页 dots -->
            <div v-if="total >= 3" class="pf-carousel__dots" role="tablist" aria-label="轮播指示器">
              <button
                v-for="(work, idx) in featuredWorks"
                :key="work.name"
                type="button"
                class="pf-carousel__dot"
                :class="{ 'is-active': idx === currentIndex }"
                :aria-label="`跳转到 ${work.name} ${work.label}`"
                :aria-selected="idx === currentIndex"
                role="tab"
                @click="goTo(idx)"
              ></button>
            </div>
          </section>
        </div>
      </header>
    </div>

    <div class="pf-home__inner">
      <section id="pf-about" class="pf-about" aria-labelledby="pf-about-title">
        <p class="pf-section-index">01 / 关于</p>
        <h2 id="pf-about-title" class="pf-about__title">关于我</h2>
        <p class="pf-about__lead">比起列出做过什么，我更想说清楚自己怎么做。</p>

        <div class="pf-about__grid">
          <article v-for="(block, index) in aboutBlocks" :key="block.title" class="pf-about__block">
            <span class="pf-about__num">{{ pad(index + 1) }}</span>
            <h3>{{ block.title }}</h3>
            <p>{{ block.body }}</p>
          </article>
        </div>

        <p class="pf-about__stack">
          <span class="pf-about__stack-label">Stack</span>
          {{ stack.join(' / ') }}
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
            <span class="pf-footer__label">02 / 联系</span>
            <template v-for="link in profile.links" :key="link.label">
              <a
                v-if="link.href"
                :href="link.href"
                target="_blank"
                rel="noreferrer"
                class="pf-footer__link"
              >
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
          <span>Built with VitePress</span>
        </div>
      </footer>
    </div>
  </main>
</template>
