<template>
  <main class="pf-page pf-projects">
    <div class="pf-wash" aria-hidden="true"></div>
    <div class="pf-grain" aria-hidden="true"></div>

    <div class="pf-page__inner">
      <header class="pf-page-hero">
        <p class="pf-kicker">Projects</p>
        <h1 class="pf-page-title">项目经验</h1>
        <p class="pf-page-lead">按业务系统和平台基建分组，展开查看背景、职责、方案取舍和结果。</p>
        <p class="pf-page-note">{{ total }} 个项目 · 点击标题展开详情</p>
      </header>

      <section
        v-for="group in groups"
        :key="group.category"
        class="pf-group"
        :aria-labelledby="`pf-group-${group.category}`"
      >
        <div class="pf-group__head">
          <h2 :id="`pf-group-${group.category}`">{{ group.category }}</h2>
          <span class="pf-group__count">{{ group.projects.length }} 个</span>
        </div>

        <ul class="pf-acc">
          <li
            v-for="(project, index) in group.projects"
            :id="project.slug"
            :key="project.slug"
            class="pf-acc__item"
            :class="{ 'is-open': openSlug === project.slug }"
          >
            <h3 class="pf-acc__heading">
              <button
                :id="`pf-acc-trigger-${project.slug}`"
                class="pf-acc__trigger"
                type="button"
                :aria-expanded="openSlug === project.slug"
                :aria-controls="`pf-acc-panel-${project.slug}`"
                @click="toggle(project.slug)"
              >
                <span class="pf-acc__index">{{ String(index + 1).padStart(2, '0') }}</span>

                <span class="pf-acc__body">
                  <span class="pf-acc__meta">
                    <span>{{ project.period }}</span>
                    <span>{{ project.role }}</span>
                    <span class="pf-acc__audience">{{ project.audience }}</span>
                    <span v-if="project.status === '进行中'">进行中</span>
                  </span>
                  <span class="pf-acc__title">{{ project.name }}</span>
                  <span class="pf-acc__subtitle">{{ project.subtitle }}</span>
                  <span class="pf-acc__tags">
                    <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
                  </span>
                </span>

                <span class="pf-acc__metrics">
                  <span v-for="metric in project.metrics" :key="metric.label" class="pf-acc__metric">
                    <strong>{{ metric.value }}</strong>
                    <em>{{ metric.label }}</em>
                  </span>
                </span>

                <svg class="pf-acc__chevron" viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="m4 6 4 4 4-4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </h3>

            <div
              :id="`pf-acc-panel-${project.slug}`"
              class="pf-acc__panel"
              role="region"
              :aria-labelledby="`pf-acc-trigger-${project.slug}`"
            >
              <div class="pf-acc__panel-inner">
                <div class="pf-acc__content">
                  <p class="pf-acc__summary">{{ project.summary }}</p>

                  <p v-if="project.links?.length" class="pf-acc__links">
                    <a
                      v-for="link in project.links"
                      :key="link.href"
                      :href="link.href"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {{ link.label }}
                      <span aria-hidden="true">↗</span>
                    </a>
                  </p>

                  <section
                    v-for="section in project.sections"
                    :key="section.title"
                    class="pf-project-section"
                  >
                    <h4>{{ section.title }}</h4>
                    <p v-if="section.body">{{ section.body }}</p>
                    <ul v-if="section.points?.length">
                      <li v-for="point in section.points" :key="point">{{ point }}</li>
                    </ul>
                  </section>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { projectCategories, projectRegistry } from '../data/project-registry'

const route = useRoute()
const router = useRouter()

const groups = computed(() =>
  projectCategories
    .map((category) => ({
      category,
      projects: projectRegistry.filter((project) => project.category === category),
    }))
    .filter((group) => group.projects.length > 0),
)

const total = computed(() => projectRegistry.length)

/** 同一时间只展开一项；首项默认展开。 */
const openSlug = ref<string | null>(projectRegistry[0]?.slug ?? null)

watch(
  () => route.hash,
  (hash) => {
    const slug = decodeURIComponent(hash.replace(/^#/, ''))
    if (slug && projectRegistry.some((project) => project.slug === slug)) {
      openSlug.value = slug
    }
  },
  { immediate: true },
)

function toggle(slug: string) {
  const next = openSlug.value === slug ? null : slug
  openSlug.value = next
  // 用 hash 记录当前项目，保证 /projects#slug 可以直接分享并自动展开
  router.replace({ hash: next ? `#${next}` : '' })
}
</script>

<style scoped lang="scss">
/* ---------- 项目列表 ---------- */

.pf-group {
  margin-top: clamp(38px, 4.6vw, 58px);
}

.pf-group:last-child {
  padding-bottom: clamp(70px, 8vw, 104px);
}

.pf-group__head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 18px;
}

.pf-group__head h2 {
  margin: 0;
  font-family: var(--pf-serif);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.pf-group__count {
  color: var(--pf-text-dim);
  font-family: var(--pf-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
}

/* ---------- 项目手风琴 ---------- */

.pf-acc {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--pf-line);
}

.pf-acc__item {
  border-bottom: 1px solid var(--pf-line);
  scroll-margin-top: calc(var(--app-header-h) + 20px);
}

.pf-acc__heading {
  margin: 0;
}

.pf-acc__trigger {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) auto 18px;
  gap: clamp(14px, 2vw, 26px);
  align-items: start;
  width: 100%;
  padding: clamp(20px, 2.4vw, 28px) clamp(4px, 1vw, 12px);
  border: 0;
  border-radius: 14px;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 0.25s ease;
}

.pf-acc__trigger:hover {
  background: var(--pf-surface);
}

.pf-acc__trigger:focus-visible {
  outline: 2px solid var(--pf-accent);
  outline-offset: 2px;
}

.pf-acc__index {
  padding-top: 4px;
  color: var(--pf-text-dim);
  font-family: var(--pf-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  transition: color 0.25s ease;
}

.pf-acc__item.is-open .pf-acc__index {
  color: var(--pf-accent);
}

.pf-acc__body {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.pf-acc__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  color: var(--pf-text-dim);
  font-size: 11.5px;
  letter-spacing: 0.03em;
}

.pf-acc__audience {
  padding: 1px 9px;
  border: 1px solid var(--pf-line);
  border-radius: 999px;
  color: var(--pf-text-soft);
}

.pf-acc__title {
  font-family: var(--pf-serif);
  font-size: clamp(21px, 2.2vw, 27px);
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1.3;
  transition: color 0.25s ease;
}

.pf-acc__trigger:hover .pf-acc__title,
.pf-acc__item.is-open .pf-acc__title {
  color: var(--pf-accent);
}

.pf-acc__subtitle {
  color: var(--pf-text-soft);
  font-size: 13.5px;
  line-height: 1.7;
}

.pf-acc__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.pf-acc__tags > span {
  padding: 3px 10px;
  border: 1px solid var(--pf-line);
  border-radius: 999px;
  color: var(--pf-text-dim);
  font-size: 11px;
  letter-spacing: 0.02em;
}

.pf-acc__metrics {
  display: flex;
  gap: clamp(14px, 2vw, 28px);
  padding-top: 2px;
}

.pf-acc__metric {
  min-width: 64px;
}

.pf-acc__metric strong {
  display: block;
  font-family: var(--pf-serif);
  font-size: 19px;
  font-weight: 600;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.pf-acc__metric em {
  display: block;
  margin-top: 3px;
  color: var(--pf-text-dim);
  font-style: normal;
  font-size: 11px;
}

.pf-acc__chevron {
  width: 16px;
  height: 16px;
  margin-top: 6px;
  color: var(--pf-text-dim);
  transition:
    transform 0.3s ease,
    color 0.25s ease;
}

.pf-acc__item.is-open .pf-acc__chevron {
  color: var(--pf-accent);
  transform: rotate(180deg);
}

/* 展开容器：0fr → 1fr，无需测量内容高度 */
.pf-acc__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.pf-acc__item.is-open .pf-acc__panel {
  grid-template-rows: 1fr;
}

.pf-acc__panel-inner {
  overflow: hidden;
}

.pf-acc__content {
  padding: 4px 20px clamp(26px, 3vw, 38px) calc(52px + clamp(14px, 2vw, 26px) + 4px);
}

.pf-acc__summary {
  max-width: 46em;
  margin: 0 0 8px;
  color: var(--pf-text);
  font-size: 14.5px;
  line-height: 1.9;
}

.pf-acc__links {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
  margin: 14px 0 0;
  font-size: 12.5px;
}

.pf-acc__links a {
  color: var(--pf-accent);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.25s ease;
}

.pf-acc__links a:hover {
  border-bottom-color: currentcolor;
}

/* ---------- 展开内容 ---------- */

.pf-project-section {
  position: relative;
  padding-top: 22px;
  margin-top: 30px;
}

.pf-project-section:first-of-type {
  margin-top: 22px;
}

.pf-project-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 36px;
  height: 1px;
  background: var(--pf-accent);
  opacity: 0.55;
}

.pf-project-section h4 {
  margin: 0 0 12px;
  font-family: var(--pf-serif);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.pf-project-section p {
  max-width: 46em;
  margin: 0;
  color: var(--pf-text-soft);
  font-size: 14.5px;
  line-height: 1.9;
}

.pf-project-section ul {
  display: grid;
  gap: 10px;
  max-width: 46em;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pf-project-section li {
  position: relative;
  padding-left: 18px;
  color: var(--pf-text-soft);
  font-size: 14.5px;
  line-height: 1.85;
}

.pf-project-section li::before {
  content: '';
  position: absolute;
  top: 0.72em;
  left: 0;
  width: 6px;
  height: 1px;
  background: var(--pf-accent);
}

@media (max-width: 720px) {
  .pf-acc__trigger {
    grid-template-columns: 34px minmax(0, 1fr) 18px;
    gap: 10px 12px;
  }

  .pf-acc__metrics {
    grid-row: 2;
    grid-column: 2 / 4;
    flex-wrap: wrap;
    margin-top: 4px;
  }

  .pf-acc__chevron {
    grid-row: 1;
    grid-column: 3;
  }

  .pf-acc__content {
    padding: 0 4px 26px 46px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pf-acc__panel,
  .pf-acc__chevron {
    transition: none;
  }
}
</style>
