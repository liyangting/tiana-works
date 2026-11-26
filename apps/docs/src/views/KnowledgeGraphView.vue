<template>
  <main class="pf-page pf-doc">
    <div class="pf-wash" aria-hidden="true"></div>
    <div class="pf-grain" aria-hidden="true"></div>

    <div class="pf-page__inner pf-doc__inner">
      <header class="pf-doc__hero">
        <RouterLink class="pf-backlink" to="/components">
          <span aria-hidden="true">←</span>
          全部组件
        </RouterLink>
        <h1 class="pf-doc__title">KnowledgeGraph 知识图谱</h1>
        <p class="pf-doc__lead">
          把知识点沿弧形轨道排布，滚动时按锚点插值计算横向偏移与缩放。组件只负责视觉与滚动定位，数据、掌握状态和点击行为都由使用方注入。
        </p>
        <p class="pf-doc__meta">@lyt/knowledge-graph · 布局与渲染 · 进阶</p>
      </header>

      <section class="pf-doc__section" aria-labelledby="doc-demo">
        <h2 id="doc-demo">在线演示</h2>
        <KnowledgeGraphDemo />
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-design">
        <h2 id="doc-design">设计与边界</h2>
        <p>
          组件把知识点渲染成“节点 +
          卡片”的一行，整行沿弧形轨道平移与缩放。它不请求数据、不保存学习进度，也不决定点击后做什么，
          只通过事件把当前知识点抛给使用方。
        </p>
        <ul>
          <li>
            <strong>数据驱动视觉</strong>：节点统一使用未开始样式，<code>actionText</code>
            自定义操作按钮文案，<code>disabled</code> 只禁用操作按钮，不改变滚动行为。
          </li>
          <li>
            <strong>轨道由锚点描述</strong>：<code>layout.anchors</code> 用“可视区域第几条 + 横向偏移 +
            缩放”描述弧线， 相邻锚点之间线性插值，越界位置只保留半行缓冲，避免高速滚动时横向飞出。
          </li>
          <li>
            <strong>受控滚动</strong>：滚轮事件被接管并拆到多帧缓动，滚动中关闭逐条 transform
            过渡，结束后再恢复，保证轨道位置跟手。
          </li>
          <li>
            <strong>尺寸自适应</strong>：<code>ResizeObserver</code>
            监听列表与父容器；宽度变化时重新计算可视行与初始聚焦位置。
          </li>
        </ul>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-usage">
        <h2 id="doc-usage">基础用法</h2>
        <p>
          组件根节点撑满父容器，需要由使用方给出高度；高亮通过 <code>v-model:active-id</code> 双向绑定，
          <code>focus-id</code> 只决定进入时的滚动位置。
        </p>
        <pre class="pf-code"><code>{{ basicUsage }}</code></pre>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-layout">
        <h2 id="doc-layout">自定义弧形轨道</h2>
        <p>
          默认锚点贴合演示中的虚线与星球位置。传入自己的
          <code>layout.anchors</code> 即可改成更平缓或更夸张的弧线：
          <code>visibleIndex</code> 表示当前滚动位置上第几条，<code>offset</code> 是整行的横向偏移，<code
            >scale</code
          >
          是卡片缩放。
        </p>
        <pre class="pf-code"><code>{{ layoutUsage }}</code></pre>
        <p>
          锚点不必覆盖所有行，组件会在相邻锚点之间插值；有序排列即可，不需要按
          <code>visibleIndex</code> 预先排序。
        </p>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-props">
        <h2 id="doc-props">Props</h2>
        <div class="pf-table-wrap">
          <table>
            <thead>
              <tr>
                <th>参数</th>
                <th>类型</th>
                <th>默认值</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>items</code></td>
                <td><code>KnowledgeGraphItem[]</code></td>
                <td>-</td>
                <td>知识点数据，必传</td>
              </tr>
              <tr>
                <td><code>activeId</code></td>
                <td><code>string</code></td>
                <td><code>''</code></td>
                <td>当前高亮的 ID，支持 <code>v-model:active-id</code>；为空时不额外高亮</td>
              </tr>
              <tr>
                <td><code>focusId</code></td>
                <td><code>string</code></td>
                <td><code>''</code></td>
                <td>进入或数据变化时滚动到视觉锚点的知识点 ID</td>
              </tr>
              <tr>
                <td><code>layout</code></td>
                <td><code>KnowledgeGraphLayout</code></td>
                <td>默认锚点</td>
                <td>弧形轨道配置，缺省使用内置弧线</td>
              </tr>
              <tr>
                <td><code>showAction</code></td>
                <td><code>boolean</code></td>
                <td><code>true</code></td>
                <td>是否展示右侧操作按钮</td>
              </tr>
              <tr>
                <td><code>emptyText</code></td>
                <td><code>string</code></td>
                <td><code>'暂无知识点'</code></td>
                <td>数据为空时的提示文案</td>
              </tr>
              <tr>
                <td><code>theme</code></td>
                <td><code>'graphite' | 'amber'</code></td>
                <td><code>'graphite'</code></td>
                <td>内置主题：石墨灰 / 琥珀暖沙</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          条目上的 <code>actionText</code> 可覆盖按钮文案；不传时使用统一默认文案。高度、间距和上下边缘渐隐通过 CSS 变量
          <code>--kg-item-height</code>、<code>--kg-item-gap</code>、<code>--kg-edge-fade</code> 控制。
        </p>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-emits">
        <h2 id="doc-emits">Emits</h2>
        <div class="pf-table-wrap">
          <table>
            <thead>
              <tr>
                <th>事件</th>
                <th>参数</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>select</code></td>
                <td><code>KnowledgeGraphItem</code></td>
                <td>点击操作按钮时触发；禁用项不会触发</td>
              </tr>
              <tr>
                <td><code>update:active-id</code></td>
                <td><code>string</code></td>
                <td>点击操作按钮后同步高亮 ID</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-slots">
        <h2 id="doc-slots">Slots</h2>
        <p>
          不提供插槽。卡片结构、节点图标和按钮都由组件统一渲染，避免外部插入节点后破坏轨道测量；
          需要个性化时请覆盖 CSS 变量或在外层容器上做二次包装。
        </p>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-methods">
        <h2 id="doc-methods">暴露的方法</h2>
        <div class="pf-table-wrap">
          <table>
            <thead>
              <tr>
                <th>方法</th>
                <th>类型</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>scrollToActive</code></td>
                <td><code>() =&gt; Promise&lt;void&gt;</code></td>
                <td>把当前聚焦节点滚动到视觉锚点，可用于工具栏的“回到当前节点”</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-quality">
        <h2 id="doc-quality">性能、资源与可访问性</h2>
        <ul>
          <li>滚动计算经 <code>requestAnimationFrame</code> 合并，每帧只写 CSS 变量，不重建节点。</li>
          <li>快速滚动时移除逐条 <code>transform</code> 过渡，停止滚动 120ms 后恢复，避免轨道位置滞后。</li>
          <li>卸载时统一取消动画帧、定时器、<code>ResizeObserver</code> 与 <code>wheel</code> 监听。</li>
          <li>
            卡片与节点共 8 张 PNG 资源随 package 发布，并按 <code>theme</code> 切换；宿主无需复制资源，也不会与业务图片冲突。
          </li>
          <li>
            列表使用 <code>ul / li</code> 语义，操作按钮为原生 <code>button</code> 并响应
            <code>disabled</code>。 列表本身没有
            <code>tabindex</code
            >，键盘用户滚动依赖外层容器；需要完全键盘可达时，建议在业务侧提供上下切换按钮。
          </li>
        </ul>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-source">
        <h2 id="doc-source">源码与独立调试</h2>
        <div class="pf-doc__links">
          <a
            class="pf-textlink"
            href="https://github.com/liyangting/tiana-works/tree/main/packages/knowledge-graph"
            target="_blank"
            rel="noreferrer"
          >
            独立组件项目 @lyt/knowledge-graph →
          </a>
          <code>pnpm --filter @lyt/knowledge-graph dev</code>
        </div>
      </section>

      <div class="pf-doc__footer-space" aria-hidden="true"></div>
    </div>
  </main>
</template>

<script setup lang="ts">
import KnowledgeGraphDemo from '../demos/KnowledgeGraphDemo.vue'

const scriptClose = '<' + '/script>'

const basicUsage = `<script setup lang="ts">
import { ref } from 'vue'
import { KnowledgeGraph, type KnowledgeGraphItem } from '@lyt/knowledge-graph'

const items = ref<KnowledgeGraphItem[]>([
  { id: 'kp-camera', title: '相机是如何把光变成照片的？', actionText: '查看详情' },
  { id: 'kp-aperture', title: '光圈和快门如何配合？', actionText: '查看详情' },
  { id: 'kp-composition', title: '构图有哪些经典法则？', actionText: '查看详情' },
])
const activeId = ref('kp-composition')
${scriptClose}

<template>
  <div class="route-stage">
    <KnowledgeGraph
      v-model:active-id="activeId"
      :items="items"
      focus-id="kp-composition"
      @select="openDetail"
    />
  </div>
</template>

<style>
/* 组件占满父容器，需要显式高度 */
.route-stage {
  height: 640px;
}
</style>`

const layoutUsage = `<script setup lang="ts">
import { KnowledgeGraph, type KnowledgeGraphLayout } from '@lyt/knowledge-graph'

const layout: KnowledgeGraphLayout = {
  anchors: [
    { visibleIndex: 0, offset: -40, scale: 0.95 },
    { visibleIndex: 2, offset: 180, scale: 1 },
    { visibleIndex: 4, offset: 60, scale: 0.96 },
  ],
}
${scriptClose}

<template>
  <KnowledgeGraph :items="items" :layout="layout" />
</template>`
</script>

<style scoped lang="scss">
/* 组件文档页 */

.pf-doc__inner {
  max-width: 980px;
}

.pf-doc__hero {
  position: relative;
  padding: clamp(36px, 4.6vw, 58px) 0 clamp(26px, 3.2vw, 38px);
}

.pf-doc__hero::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 1px;
  background: linear-gradient(90deg, var(--pf-line), transparent 72%);
}

.pf-backlink {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--pf-text-dim);
  font-size: 12px;
  letter-spacing: 0.03em;
  text-decoration: none;
  transition:
    color 0.2s ease,
    gap 0.2s ease;
}

.pf-backlink:hover {
  gap: 11px;
  color: var(--pf-text);
}

.pf-doc__title {
  margin: 20px 0 0;
  font-family: var(--pf-serif);
  font-size: clamp(32px, 4vw, 46px);
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1.15;
}

.pf-doc__lead {
  max-width: 42em;
  margin: 14px 0 0;
  color: var(--pf-text-soft);
  font-size: 15px;
  line-height: 1.9;
}

.pf-doc__meta {
  display: inline-block;
  margin: 18px 0 0;
  padding: 5px 12px;
  border: 1px solid var(--pf-line);
  border-radius: 999px;
  color: var(--pf-text-dim);
  font-family: var(--pf-mono);
  font-size: 11px;
  letter-spacing: 0.03em;
}

.pf-doc__section {
  position: relative;
  padding-top: 22px;
  margin-top: clamp(38px, 4.4vw, 54px);
}

.pf-doc__section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 36px;
  height: 1px;
  background: var(--pf-accent);
  opacity: 0.55;
}

.pf-doc__section h2 {
  margin: 0 0 14px;
  font-family: var(--pf-serif);
  font-size: clamp(20px, 2.2vw, 25px);
  font-weight: 600;
  letter-spacing: 0.01em;
}

.pf-doc__section p,
.pf-doc__section li {
  max-width: 46em;
  color: var(--pf-text-soft);
  font-size: 14.5px;
  line-height: 1.9;
}

.pf-doc__section p {
  margin: 12px 0 0;
}

.pf-doc__section ul {
  display: grid;
  gap: 10px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

.pf-doc__section li {
  position: relative;
  padding-left: 18px;
}

.pf-doc__section li::before {
  content: '';
  position: absolute;
  top: 0.72em;
  left: 0;
  width: 6px;
  height: 1px;
  background: var(--pf-accent);
}

.pf-doc__section code {
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--pf-surface);
  border: 1px solid var(--pf-line);
  font-family: var(--pf-mono);
  font-size: 0.9em;
}

.pf-code {
  max-width: 100%;
  margin: 16px 0 0;
  padding: 18px 20px;
  overflow-x: auto;
  background: #241a14;
  border: 1px solid var(--pf-line);
  border-radius: 14px;
  color: #f4eadc;
  font-family: var(--pf-mono);
  font-size: 12.5px;
  line-height: 1.8;
  tab-size: 2;
}

.pf-table-wrap {
  margin-top: 16px;
  overflow-x: auto;
}

.pf-doc__section table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

.pf-doc__section th,
.pf-doc__section td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--pf-line);
  text-align: left;
  vertical-align: top;
}

.pf-doc__section th {
  color: var(--pf-text-dim);
  font-weight: 500;
  white-space: nowrap;
}

.pf-doc__section td {
  color: var(--pf-text-soft);
  line-height: 1.7;
}

.pf-doc__links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin-top: 14px;
}

.pf-doc__footer-space {
  height: clamp(64px, 8vw, 104px);
}
</style>
