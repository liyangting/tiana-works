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
        <h1 class="pf-doc__title">Waterfall 瀑布流</h1>
        <p class="pf-doc__lead">
          一个只依赖 Vue 3 + TypeScript
          的纯净瀑布流组件。最短列优先布局、容器宽度监听与卡片高度实测都在组件内完成，分页加载与图片尺寸换算由配套组合式函数提供。
        </p>
        <p class="pf-doc__meta">@lyt/waterfall · 布局与渲染 · 进阶</p>
      </header>

      <section class="pf-doc__section" aria-labelledby="doc-demo">
        <h2 id="doc-demo">在线演示</h2>
        <WaterfallDemo />
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-design">
        <h2 id="doc-design">设计与边界</h2>
        <p>
          组件只做一件事：把已给的数据稳定地放进最矮的列。它不含卡片样式、请求封装、埋点或空态
          UI，业务状态由使用方根据
          <code>useWaterfall</code> 的返回值自行渲染。
        </p>
        <ul>
          <li>
            <strong>最短列优先</strong>：按顺序遍历
            <code>items</code>，逐项放入当前累计高度最小的列；高度相同保留靠前列，不按 index 取模。
          </li>
          <li>
            <strong>高度估算有优先级</strong>：DOM 实测高度 → 数据上的 <code>item.height</code> →
            已测高度平均值 → 固定 160。
          </li>
          <li>
            <strong>尺寸变化可回收</strong>：<code>ResizeObserver</code>
            监听容器宽度与每项高度；卡片图片加载完成或内容变高后会重新平衡列高。
          </li>
          <li>
            <strong>SSR 安全</strong>：所有浏览器 API 都在挂载后访问；无 <code>ResizeObserver</code> 时降级为
            <code>window.resize</code>。
          </li>
        </ul>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-usage">
        <h2 id="doc-usage">基础用法</h2>
        <p>数据通过 <code>items</code> 传入，唯一插槽暴露当前项与索引；卡片样式完全由使用方决定。</p>
        <pre class="pf-code"><code>{{ basicUsage }}</code></pre>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-responsive">
        <h2 id="doc-responsive">响应式列与固定列宽</h2>
        <p>
          <code>responsiveColumns</code> 的 key 是容器宽度断点（px
          字符串），取所有小于等于当前容器宽度的断点中最大者的列数。 设置
          <code>itemWidth</code> 后，列数由容器宽度与列宽共同推导，每列宽度严格锁定为给定值。
        </p>
        <pre class="pf-code"><code>{{ responsiveUsage }}</code></pre>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-pagination">
        <h2 id="doc-pagination">分页加载与图片尺寸</h2>
        <p>
          <code>useWaterfall</code> 负责页码、触底检测与请求批次隔离；<code>refresh</code> /
          <code>reset</code>
          会递增批次号，旧请求返回后不会污染新列表。首屏内容不足一屏时会自动补数据。
        </p>
        <pre class="pf-code"><code>{{ hookUsage }}</code></pre>
        <p>
          图片的高度提示可以交给
          <code>getWaterfallImageSize</code>：它会读取原始尺寸并按展示宽度换算高度。即使提示缺失或偏差，
          组件仍会以 DOM 实测高度为准重新平衡。
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
                <td><code>T[]</code></td>
                <td><code>[]</code></td>
                <td>瀑布流数据，只要求是对象数组</td>
              </tr>
              <tr>
                <td><code>columns</code></td>
                <td><code>number</code></td>
                <td><code>4</code></td>
                <td>普通模式下的列数；响应式断点未命中时也回退到该值</td>
              </tr>
              <tr>
                <td><code>responsiveColumns</code></td>
                <td><code>Record&lt;string, number&gt;</code></td>
                <td>-</td>
                <td>容器宽度断点（px 字符串）到列数的映射</td>
              </tr>
              <tr>
                <td><code>gap</code></td>
                <td><code>number | string</code></td>
                <td><code>'16px'</code></td>
                <td>列间距与卡片纵向间距；number 自动补 px</td>
              </tr>
              <tr>
                <td><code>itemWidth</code></td>
                <td><code>number | string</code></td>
                <td>-</td>
                <td>设置后按容器宽度推导列数，并固定每列宽度</td>
              </tr>
              <tr>
                <td><code>itemKey</code></td>
                <td><code>keyof T | ((item, index) =&gt; string | number)</code></td>
                <td>-</td>
                <td>v-for key、高度缓存 key 与 DOM 标识；缺省回退 <code>item.id</code>，再回退 index</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          数据项上可选的 <code>height</code> 只作为首屏高度提示参与估算，实际高度以 DOM 实测为准。CSS 变量
          <code>--lyt-waterfall-gap</code> 与
          <code>--lyt-waterfall-item-width</code> 通过根节点注入，便于外部覆盖。
        </p>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-emits">
        <h2 id="doc-emits">Emits</h2>
        <p>组件不触发任何事件。滚动、加载与错误状态由 <code>useWaterfall</code> 的返回值表达。</p>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-slots">
        <h2 id="doc-slots">Slots</h2>
        <div class="pf-table-wrap">
          <table>
            <thead>
              <tr>
                <th>插槽</th>
                <th>参数</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>default</code></td>
                <td><code>{ item: T; index: number }</code></td>
                <td>唯一的默认作用域插槽，用来渲染每张卡片</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-methods">
        <h2 id="doc-methods">暴露的方法</h2>
        <p>布局组件不暴露实例方法；分页能力由 <code>useWaterfall</code> 返回：</p>
        <div class="pf-table-wrap">
          <table>
            <thead>
              <tr>
                <th>字段</th>
                <th>类型</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>list</code></td>
                <td><code>ShallowRef&lt;T[]&gt;</code></td>
                <td>已加载的数据</td>
              </tr>
              <tr>
                <td><code>loading</code></td>
                <td><code>Ref&lt;boolean&gt;</code></td>
                <td>当前批次是否有请求进行中</td>
              </tr>
              <tr>
                <td><code>finished</code></td>
                <td><code>Ref&lt;boolean&gt;</code></td>
                <td>是否已经没有更多数据</td>
              </tr>
              <tr>
                <td><code>total</code></td>
                <td><code>Ref&lt;number | null&gt;</code></td>
                <td>接口返回的总数，未提供时为 null</td>
              </tr>
              <tr>
                <td><code>error</code></td>
                <td><code>ShallowRef&lt;unknown&gt;</code></td>
                <td>当前批次的异常，旧批次异常会被忽略</td>
              </tr>
              <tr>
                <td><code>loadMore</code></td>
                <td><code>() =&gt; Promise&lt;void&gt;</code></td>
                <td>加载下一页；已结束或加载中时直接返回</td>
              </tr>
              <tr>
                <td><code>refresh</code></td>
                <td><code>() =&gt; Promise&lt;void&gt;</code></td>
                <td>递增批次、清空列表并重新加载第一页</td>
              </tr>
              <tr>
                <td><code>reset</code></td>
                <td><code>() =&gt; Promise&lt;void&gt;</code></td>
                <td>与 refresh 行为一致，用于重置并重新加载</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>hook 在组件挂载时会自动加载第一页，之后由滚动触底继续加载。</p>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-quality">
        <h2 id="doc-quality">性能、资源与可访问性</h2>
        <ul>
          <li>
            两个 <code>ResizeObserver</code> 分别监听容器与卡片；组件卸载时全部断开，并清空高度缓存与 DOM
            引用。
          </li>
          <li>
            <code>items</code> 的 key 列表变化时只保留仍存在的缓存，并对已移除项取消监听，避免缓存泄漏和重复
            observer。
          </li>
          <li>容器宽度或卡片高度没有变化时不会触发更新；实测高度向上取整后写入缓存，减少无意义的重排。</li>
          <li>
            组件不写死卡片样式与交互语义。需要键盘可达、图片替代文本或
            <code>aria-live</code> 提示时，由业务侧的卡片内容负责。
          </li>
          <li>不提供虚拟滚动；数据量特别大时建议配合分页或按需渲染，避免一次性挂载过多 DOM。</li>
        </ul>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-source">
        <h2 id="doc-source">源码与独立调试</h2>
        <div class="pf-doc__links">
          <a
            class="pf-textlink"
            href="https://github.com/liyangting/tiana-works/tree/main/packages/waterfall"
            target="_blank"
            rel="noreferrer"
          >
            独立组件项目 @lyt/waterfall →
          </a>
          <code>pnpm --filter @lyt/waterfall dev</code>
        </div>
      </section>

      <div class="pf-doc__footer-space" aria-hidden="true"></div>
    </div>
  </main>
</template>

<script setup lang="ts">
import WaterfallDemo from '../demos/WaterfallDemo.vue'

const scriptClose = '<' + '/script>'

const basicUsage = `<script setup lang="ts">
import { Waterfall } from '@lyt/waterfall'

const items = [
  { id: 'a', title: '清晨', height: 180 },
  { id: 'b', title: '潮汐', height: 240 },
  { id: 'c', title: '远山', height: 140 },
]
${scriptClose}

<template>
  <Waterfall :items="items" :columns="3" :gap="16">
    <template #default="{ item }">
      <article class="card">{{ item.title }}</article>
    </template>
  </Waterfall>
</template>`

const responsiveUsage = `<!-- 容器宽度 <= 767 用 2 列，<= 1199 用 3 列，其余 4 列 -->
<Waterfall :items="items" :responsive-columns="{ '0': 2, '768': 3, '1200': 4 }" />

<!-- 固定列宽：列数随容器宽度推导，每列宽度固定 220px -->
<Waterfall :items="items" :item-width="220" :gap="20" />`

const hookUsage = `<script setup lang="ts">
import { ref } from 'vue'
import { Waterfall, useWaterfall, getWaterfallImageSize, getWaterfallImageDisplayHeight } from '@lyt/waterfall'

const scrollEl = ref<HTMLElement | null>(null)

const { list, loading, finished, total, error, loadMore, refresh } = useWaterfall<Photo>({
  fetcher: ({ page, pageSize }) => api.fetchPhotos({ page, pageSize }),
  pageSize: 20,
  target: scrollEl,
  offset: 200,
})

async function addImageHeight(item: Photo) {
  const size = await getWaterfallImageSize(item.src)
  if (!size) return
  item.height = getWaterfallImageDisplayHeight(size, 220) ?? undefined
}
${scriptClose}

<template>
  <div ref="scrollEl" class="feed">
    <Waterfall :items="list" :responsive-columns="{ '0': 2, '900': 3 }">
      <template #default="{ item }">
        <article class="card"><img :src="item.src" :alt="item.title" /></article>
      </template>
    </Waterfall>
    <p v-if="loading">加载中…</p>
    <p v-else-if="finished">没有更多了</p>
    <button v-else @click="loadMore">加载更多</button>
  </div>
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
