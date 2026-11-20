<template>
  <main class="pf-page pf-components-page">
    <div class="pf-wash" aria-hidden="true"></div>
    <div class="pf-grain" aria-hidden="true"></div>

    <div class="pf-page__inner">
      <header class="pf-page-hero">
        <p class="pf-kicker">Components</p>
        <h1 class="pf-page-title">组件作品</h1>
        <p class="pf-page-lead">每个组件都是独立 package：有自己的依赖、Playground、文档和降级方案。</p>
        <p class="pf-page-note">共 {{ componentRegistry.length }} 个 · {{ published }} 个已发布</p>
      </header>

      <div class="pf-component-grid">
        <template v-for="entry in componentRegistry" :key="entry.name">
          <RouterLink v-if="entry.status === '已发布'" class="pf-component-card" :to="entry.route">
            <div class="pf-component-card__media">
              <img v-if="coverOf(entry)" :src="coverOf(entry)" :alt="entry.label" loading="lazy" />
              <span v-else class="pf-component-card__placeholder">{{ entry.label }}</span>
              <span class="pf-component-card__status">{{ entry.status }}</span>
            </div>
            <div class="pf-component-card__body">
              <p class="pf-component-card__meta">
                <span>{{ entry.category }}</span>
                <span>{{ entry.complexity }}</span>
              </p>
              <h2 class="pf-component-card__title">{{ entry.name }} · {{ entry.label }}</h2>
              <p class="pf-component-card__desc">{{ entry.description }}</p>
              <ul class="pf-component-card__tags">
                <li v-for="tag in entry.tags" :key="tag">{{ tag }}</li>
              </ul>
            </div>
          </RouterLink>

          <div v-else class="pf-component-card is-planned">
            <div class="pf-component-card__media">
              <img v-if="coverOf(entry)" :src="coverOf(entry)" :alt="entry.label" loading="lazy" />
              <span v-else class="pf-component-card__placeholder">{{ entry.label }}</span>
              <span class="pf-component-card__status">{{ entry.status }}</span>
            </div>
            <div class="pf-component-card__body">
              <p class="pf-component-card__meta">
                <span>{{ entry.category }}</span>
                <span>{{ entry.complexity }}</span>
              </p>
              <h2 class="pf-component-card__title">{{ entry.name }} · {{ entry.label }}</h2>
              <p class="pf-component-card__desc">{{ entry.description }}</p>
              <ul class="pf-component-card__tags">
                <li v-for="tag in entry.tags" :key="tag">{{ tag }}</li>
              </ul>
            </div>
          </div>
        </template>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { componentRegistry, type ComponentEntry } from '../data/component-registry'

const published = computed(() => componentRegistry.filter((entry) => entry.status === '已发布').length)

function coverOf(entry: ComponentEntry): string {
  return entry.cover || entry.previews?.[0]?.src || ''
}
</script>
