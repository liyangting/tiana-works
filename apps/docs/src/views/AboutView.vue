<template>
  <main class="pf-page pf-about-page">
    <svg class="pf-sprite" aria-hidden="true" width="0" height="0">
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

    <div class="pf-page__inner">
      <header class="pf-page-hero">
        <p class="pf-kicker">About</p>
        <h1 class="pf-page-title">关于我</h1>
        <p class="pf-page-lead">{{ profile.statement }}</p>
      </header>

      <section class="pf-about-page__intro" aria-label="个人简介">
        <div>
          <p v-for="paragraph in profile.intro" :key="paragraph">{{ paragraph }}</p>
        </div>

        <div class="pf-about-page__portrait">
          <span class="pf-about-page__monogram" aria-hidden="true">
            {{ profile.displayName.slice(0, 1) }}
          </span>
          <p>{{ profile.displayName }} · {{ profile.role }}<br />{{ profile.location }}</p>
        </div>
      </section>

      <section class="pf-about-section" aria-labelledby="pf-about-phases">
        <h2 id="pf-about-phases" class="pf-about-section__title">两个阶段，一种能力</h2>
        <p class="pf-about-section__lead">
          AI 让写代码变快了，但没有让判断变简单。下面这两段，是这种判断力的来源。
        </p>

        <div class="pf-phase-grid">
          <article
            v-for="phase in aboutPhases"
            :key="phase.label"
            class="pf-phase"
            :class="{ 'pf-phase--current': phase.current }"
          >
            <div class="pf-phase__head">
              <h3>{{ phase.label }}</h3>
              <span class="pf-phase__period">{{ phase.period }}</span>
            </div>
            <p class="pf-phase__title">{{ phase.title }}</p>
            <p class="pf-phase__summary">{{ phase.summary }}</p>
            <ul class="pf-phase__points">
              <li v-for="point in phase.points" :key="point">{{ point }}</li>
            </ul>
          </article>
        </div>

        <p class="pf-phase__bridge">
          <span>AI 改变的是写代码的速度，不改变判断代码好坏的标准。</span>
        </p>

        <p class="pf-about-section__caption">不变的三件事</p>
        <ul class="pf-principle-list">
          <li v-for="principle in aboutPrinciples" :key="principle.title">
            <strong>{{ principle.title }}</strong>
            <span>{{ principle.body }}</span>
          </li>
        </ul>
      </section>

      <section class="pf-about-section" aria-labelledby="pf-about-method">
        <h2 id="pf-about-method" class="pf-about-section__title">我怎么做事</h2>
        <div class="pf-block-grid">
          <article v-for="(block, index) in aboutBlocks" :key="block.title" class="pf-block">
            <span class="pf-block__num">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3>{{ block.title }}</h3>
            <p>{{ block.body }}</p>
          </article>
        </div>
      </section>

      <section class="pf-about-section" aria-labelledby="pf-about-experience">
        <h2 id="pf-about-experience" class="pf-about-section__title">工作经历</h2>
        <ol class="pf-timeline">
          <li v-for="item in experienceTimeline" :key="`${item.period}-${item.company}`">
            <span class="pf-timeline__period">{{ item.period }}</span>
            <div>
              <div class="pf-timeline__role">
                <strong>{{ item.company }}</strong>
                <span>{{ item.role }}</span>
              </div>
              <p v-if="item.desc">{{ item.desc }}</p>
            </div>
          </li>
        </ol>
      </section>

      <section class="pf-about-section" aria-labelledby="pf-about-stack">
        <h2 id="pf-about-stack" class="pf-about-section__title">技术栈</h2>
        <div class="pf-stack-grid">
          <div v-for="group in stackGroups" :key="group.label" class="pf-stack-group">
            <h3>{{ group.label }}</h3>
            <ul>
              <li v-for="item in group.items" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="pf-about-section" aria-labelledby="pf-about-contact">
        <h2 id="pf-about-contact" class="pf-about-section__title">联系我</h2>
        <p class="pf-page-note">
          项目合作、技术交流都欢迎。{{
            profile.links.some((link) => !link.href && !link.copy) ? '未填写的联系方式完成后再补。' : ''
          }}
        </p>

        <div class="pf-contact-list">
          <template v-for="link in profile.links" :key="link.label">
            <button
              v-if="link.copy"
              type="button"
              class="pf-contact"
              title="点击复制邮箱"
              @click="copyLink(link)"
            >
              <svg aria-hidden="true">
                <use :href="`#pf-icon-${link.icon}`" />
              </svg>
              {{ link.label }}
            </button>
            <a v-else-if="link.href" class="pf-contact" :href="link.href" target="_blank" rel="noreferrer">
              <svg aria-hidden="true">
                <use :href="`#pf-icon-${link.icon}`" />
              </svg>
              {{ link.label }}
            </a>
            <span v-else class="pf-contact is-placeholder" :title="`${link.label} · 待补充`">
              <svg aria-hidden="true">
                <use :href="`#pf-icon-${link.icon}`" />
              </svg>
              {{ link.label }} · 待补充
            </span>
          </template>
        </div>

        <p class="pf-page-actions">
          <RouterLink class="pf-textlink" to="/projects">查看项目经验 →</RouterLink>
          <RouterLink class="pf-textlink" to="/components">浏览组件作品 →</RouterLink>
        </p>
      </section>

      <div style="height: clamp(64px, 8vw, 104px)" aria-hidden="true"></div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import {
  aboutBlocks,
  aboutPhases,
  aboutPrinciples,
  experienceTimeline,
  profile,
  stackGroups,
  type ProfileLink,
} from '../data/site-data'
import { copyText } from '../utils/clipboard'

async function copyLink(link: ProfileLink) {
  if (!link.copy) return

  const copied = await copyText(link.copy)
  if (copied) {
    ElMessage.success({ message: '邮箱已复制', duration: 1600, offset: 72 })
  } else {
    ElMessage.error({ message: '复制失败，请手动选择邮箱', offset: 72 })
  }
}
</script>

<style scoped lang="scss">
/* ---------- 关于我 ---------- */

.pf-about-page__intro {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 0.9fr);
  gap: clamp(28px, 4.6vw, 64px);
  padding: clamp(34px, 4.4vw, 56px) 0;
}

.pf-about-page__intro p {
  margin: 0 0 16px;
  color: var(--pf-text-soft);
  font-size: 15px;
  line-height: 1.95;
}

.pf-about-page__intro p:first-child {
  font-family: var(--pf-serif);
  font-size: clamp(19px, 2vw, 23px);
  line-height: 1.75;
  color: var(--pf-text);
}

.pf-about-page__portrait {
  position: relative;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 14px;
  min-height: 240px;
  padding: 30px;
  border: 1px solid var(--pf-line);
  border-radius: 20px;
  background: radial-gradient(60% 50% at 70% 25%, var(--pf-accent-soft), transparent 62%), var(--pf-surface);
  text-align: center;
}

.pf-about-page__monogram {
  font-family: var(--pf-serif);
  font-size: 64px;
  font-weight: 600;
  line-height: 1;
}

.pf-about-page__portrait p {
  margin: 0;
  color: var(--pf-text-dim);
  font-size: 12px;
  line-height: 1.7;
}

.pf-about-section__lead {
  max-width: 48em;
  margin: 0 0 clamp(20px, 2.6vw, 28px);
  color: var(--pf-text-soft);
  font-size: 14.5px;
  line-height: 1.85;
}

.pf-phase-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(16px, 2.2vw, 24px);
}

.pf-phase {
  padding: clamp(20px, 2.4vw, 28px);
  border: 1px solid var(--pf-line);
  border-radius: 16px;
  background: var(--pf-surface);
}

.pf-phase--current {
  border-color: color-mix(in srgb, var(--pf-accent) 42%, var(--pf-line));
  background:
    radial-gradient(70% 60% at 100% 0%, var(--pf-accent-soft), transparent 64%),
    var(--pf-surface);
}

.pf-phase__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.pf-phase__head h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.pf-phase__period {
  flex: none;
  padding: 3px 10px;
  border: 1px solid var(--pf-line);
  border-radius: 999px;
  color: var(--pf-text-dim);
  font-family: var(--pf-mono);
  font-size: 10.5px;
  letter-spacing: 0.06em;
}

.pf-phase--current .pf-phase__period {
  border-color: color-mix(in srgb, var(--pf-accent) 40%, var(--pf-line));
  color: var(--pf-accent);
}

.pf-phase__title {
  margin: 18px 0 8px;
  font-family: var(--pf-serif);
  font-size: 17px;
  line-height: 1.6;
}

.pf-phase__summary {
  margin: 0;
  color: var(--pf-text-soft);
  font-size: 13.5px;
  line-height: 1.85;
}

.pf-phase__points {
  display: grid;
  gap: 10px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}

.pf-phase__points li {
  position: relative;
  padding-left: 14px;
  color: var(--pf-text-soft);
  font-size: 13.5px;
  line-height: 1.8;
}

.pf-phase__points li::before {
  content: '';
  position: absolute;
  top: 0.7em;
  left: 0;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--pf-accent);
  opacity: 0.5;
}

.pf-phase__bridge {
  display: flex;
  align-items: center;
  gap: clamp(14px, 2vw, 22px);
  margin: clamp(24px, 3vw, 34px) 0;
  color: var(--pf-text);
  font-family: var(--pf-serif);
  font-size: clamp(15px, 1.5vw, 17px);
  line-height: 1.7;
  text-align: center;
}

.pf-phase__bridge::before,
.pf-phase__bridge::after {
  content: '';
  flex: 1;
  height: 1px;
}

.pf-phase__bridge::before {
  background: linear-gradient(90deg, transparent, var(--pf-line));
}

.pf-phase__bridge::after {
  background: linear-gradient(90deg, var(--pf-line), transparent);
}

.pf-about-section__caption {
  margin: 0 0 14px;
  color: var(--pf-text-dim);
  font-family: var(--pf-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.pf-principle-list {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pf-principle-list li {
  display: grid;
  grid-template-columns: 140px minmax(0, 1fr);
  gap: 20px;
  padding: 16px 0;
  border-top: 1px solid var(--pf-line);
}

.pf-principle-list li:first-child {
  border-top: 0;
  padding-top: 0;
}

.pf-principle-list strong {
  font-size: 15px;
  font-weight: 600;
}

.pf-principle-list span {
  color: var(--pf-text-soft);
  font-size: 14px;
  line-height: 1.85;
}

.pf-block-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 44px;
}

.pf-block {
  position: relative;
  padding-top: 18px;
}

.pf-block::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 36px;
  height: 1px;
  background: var(--pf-accent);
  opacity: 0.55;
}

.pf-block__num {
  color: var(--pf-accent);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.pf-block h3 {
  margin: 14px 0 10px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.pf-block p {
  margin: 0;
  color: var(--pf-text-soft);
  font-size: 14px;
  line-height: 1.85;
}

.pf-about-section {
  position: relative;
  padding-top: clamp(28px, 3.4vw, 40px);
  margin-top: clamp(34px, 4.4vw, 56px);
}

.pf-about-section::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 1px;
  background: linear-gradient(90deg, var(--pf-line), transparent 70%);
}

.pf-about-section__title {
  margin: 0 0 24px;
  font-family: var(--pf-serif);
  font-size: clamp(24px, 2.6vw, 30px);
  font-weight: 600;
  letter-spacing: 0.01em;
}

.pf-timeline {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pf-timeline li {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  gap: 20px;
  padding: 18px 0;
  border-top: 1px solid var(--pf-line);
}

.pf-timeline li:first-child {
  border-top: 0;
  padding-top: 0;
}

.pf-timeline__period {
  color: var(--pf-accent);
  font-family: var(--pf-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
}

.pf-timeline__role {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 12px;
}

.pf-timeline__role strong {
  font-size: 15.5px;
  font-weight: 600;
}

.pf-timeline__role span {
  color: var(--pf-text-dim);
  font-size: 12px;
}

.pf-timeline p {
  max-width: 46em;
  margin: 8px 0 0;
  color: var(--pf-text-soft);
  font-size: 14px;
  line-height: 1.85;
}

.pf-stack-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px 44px;
}

.pf-stack-group h3 {
  margin: 0 0 10px;
  color: var(--pf-text-dim);
  font-family: var(--pf-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.pf-stack-group ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pf-stack-group li {
  padding: 5px 12px;
  border: 1px solid var(--pf-line);
  border-radius: 999px;
  color: var(--pf-text-soft);
  font-size: 12.5px;
}

.pf-contact-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
}

.pf-contact {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border: 1px solid var(--pf-line);
  border-radius: 999px;
  background: none;
  color: var(--pf-text-soft);
  font-family: inherit;
  font-size: 12.5px;
  text-decoration: none;
  transition:
    border-color 0.25s ease,
    color 0.25s ease;
}

button.pf-contact {
  cursor: pointer;
}

a.pf-contact:hover,
button.pf-contact:hover {
  border-color: var(--pf-accent);
  color: var(--pf-text);
}

.pf-contact.is-placeholder {
  color: var(--pf-text-dim);
}

.pf-contact svg {
  width: 15px;
  height: 15px;
}

@media (max-width: 860px) {
  .pf-about-page__intro {
    grid-template-columns: minmax(0, 1fr);
  }

  .pf-phase-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .pf-block-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }
}

@media (max-width: 720px) {
  .pf-timeline li {
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
  }

  .pf-principle-list li {
    grid-template-columns: minmax(0, 1fr);
    gap: 6px;
  }

  .pf-stack-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
