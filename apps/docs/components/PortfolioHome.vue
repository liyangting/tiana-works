<script setup lang="ts">
import { withBase } from 'vitepress'
import { componentRegistry } from '../.vitepress/component-registry'
</script>

<template>
  <main class="portfolio">
    <p class="portfolio__eyebrow">Vue 3 Component Portfolio</p>
    <h1>将日常工程经验，沉淀为可独立交付的组件资产。</h1>
    <p class="portfolio__intro">每个组件都有独立源码、依赖边界、调试 Playground 与设计说明；这个站点统一呈现它们的实际效果与工程取舍。</p>

    <section class="portfolio__principles" aria-label="作品集原则">
      <article><h2>独立交付</h2><p>组件包可脱离本站独立调试、构建，并具备清晰的公开 API。</p></article>
      <article><h2>真实问题</h2><p>只收录具有代表性工程复杂度的能力，而非通用基础控件。</p></article>
      <article><h2>统一展示</h2><p>Demo、设计取舍、性能边界与源码入口在同一个站点中串联。</p></article>
    </section>

    <section aria-labelledby="component-list-title">
      <div class="portfolio__section-heading"><div><h2 id="component-list-title">组件项目</h2><p>持续从真实项目中提炼与维护。</p></div></div>
      <div class="portfolio__grid">
        <a v-for="component in componentRegistry" :key="component.name" class="portfolio-card" :href="withBase(component.route)">
          <div class="portfolio-card__top"><span class="portfolio-card__category">{{ component.category }} · {{ component.complexity }}</span><span class="portfolio-card__status">{{ component.status }}</span></div>
          <h3>{{ component.name }}</h3>
          <div class="portfolio-card__package">{{ component.packageName }}</div>
          <p class="portfolio-card__description">{{ component.description }}</p>
          <div class="portfolio-card__footer"><div class="portfolio-card__tags"><span v-for="tag in component.tags" :key="tag">{{ tag }}</span></div><span class="portfolio-card__arrow" aria-hidden="true">→</span></div>
        </a>
      </div>
    </section>
  </main>
</template>
