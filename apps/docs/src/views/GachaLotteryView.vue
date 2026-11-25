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
        <h1 class="pf-doc__title">GachaLottery 抽奖交互</h1>
        <p class="pf-doc__lead">
          一个无业务依赖的扭蛋抽取组件。完整实现物理扭蛋堆叠、摇晃、掉落、开球与结果回收动画；奖池与开奖逻辑均由使用方注入。
        </p>
        <p class="pf-doc__meta">@lyt/gacha-lottery · 动画与交互 · 高阶</p>
      </header>

      <section class="pf-doc__section" aria-labelledby="doc-demo">
        <h2 id="doc-demo">在线演示</h2>
        <GachaLotteryDemo />
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-design">
        <h2 id="doc-design">设计与边界</h2>
        <p>
          组件将职责拆为三层：<code>GachaLottery</code> 管理抽奖状态机和对外 API，<code>GachaMachine</code>
          管理机身与 Matter.js 物理世界，<code>GachaBall</code> 管理 GSAP 开球和结果回收时间线。
        </p>
        <ul>
          <li>
            <strong>开奖与动画解耦</strong>：<code>draw</code>
            可以调用服务端；组件不保存库存、不改变业务奖池。
          </li>
          <li>
            <strong>明确状态机</strong>：<code>idle → shaking → dropping → revealing → open</code
            >，防止动画未完成时重复抽取。
          </li>
          <li><strong>资源私有</strong>：机身、玻璃罩、按钮和扭蛋素材都随 package 发布，不污染宿主项目。</li>
        </ul>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-usage">
        <h2 id="doc-usage">基础用法</h2>
        <pre class="pf-code"><code>{{ basicUsage }}</code></pre>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-server">
        <h2 id="doc-server">服务端抽取</h2>
        <p>为防止在客户端泄露概率或篡改库存，生产环境通常应使用 <code>draw</code> 从服务端获取抽取结果。</p>
        <pre class="pf-code"><code>{{ serverDrawUsage }}</code></pre>
        <p>
          <code>draw</code> 返回 <code>null</code> 或抛出异常时，组件会回到初始状态并触发 <code>error</code>。
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
                <td><code>prizes</code></td>
                <td><code>Prize[]</code></td>
                <td>-</td>
                <td>奖品列表；库存为 <code>0</code> 的奖品不会参与抽取</td>
              </tr>
              <tr>
                <td><code>draw</code></td>
                <td><code>() =&gt; Prize | null | Promise&lt;…&gt;</code></td>
                <td>-</td>
                <td>自定义或服务端抽取函数</td>
              </tr>
              <tr>
                <td><code>disabled</code></td>
                <td><code>boolean</code></td>
                <td><code>false</code></td>
                <td>禁用抽取</td>
              </tr>
              <tr>
                <td><code>machineTop</code></td>
                <td><code>default | alternate</code></td>
                <td><code>default</code></td>
                <td>扭蛋机顶部样式</td>
              </tr>
              <tr>
                <td><code>resetDelay</code></td>
                <td><code>number</code></td>
                <td><code>0</code></td>
                <td>用户确认奖品后，复位前的延迟（ms）</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <code>Prize</code>：<code>{ id, name, description?, imageUrl?, stock?, weight? }</code>。未指定
          <code>stock</code> 或设为负数时视为无限库存；本地抽取时 <code>weight</code> 默认为 <code>1</code>。
        </p>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-emits">
        <h2 id="doc-emits">Emits</h2>
        <div class="pf-table-wrap">
          <table>
            <thead>
              <tr>
                <th>事件</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>start</code></td>
                <td>用户开始抽取</td>
              </tr>
              <tr>
                <td><code>result</code></td>
                <td>获得有效奖品后触发，参数为奖品</td>
              </tr>
              <tr>
                <td><code>complete</code></td>
                <td>用户点击“收下奖品”后触发，参数为奖品</td>
              </tr>
              <tr>
                <td><code>error</code></td>
                <td>抽取函数返回空结果或发生异常时触发</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-slots">
        <h2 id="doc-slots">Slots</h2>
        <p>
          当前组件不提供插槽。机身和结果展示的视觉呈现由组件的内置动画与资源统一控制；如需完全自定义结果内容，建议在
          <code>result</code> 事件中由宿主页面展示自己的结果面板。
        </p>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-methods">
        <h2 id="doc-methods">暴露的方法</h2>
        <p>
          通过组件 <code>ref</code> 可调用 <code>start()</code>、<code>complete()</code>，并读取
          <code>status</code> 和 <code>activePrize</code>。状态依次为
          <code>idle</code
          >、<code>shaking</code>、<code>dropping</code>、<code>revealing</code>、<code>open</code>。
        </p>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-quality">
        <h2 id="doc-quality">性能、资源与可访问性</h2>
        <ul>
          <li>
            Matter.js 物理引擎、Canvas、定时器和动画时间线会在组件卸载时清理，避免在路由切换后继续占用资源。
          </li>
          <li>机身内的扭蛋数量固定，避免物理体数量随奖池规模无限增加；奖池只影响开奖结果。</li>
          <li>
            抽取按钮使用原生
            <code>button</code>
            并设置可访问名称；结果弹层使用遮罩。若用于强无障碍场景，建议在宿主侧补充焦点管理和开奖结果的
            <code>aria-live</code> 提示。
          </li>
          <li>
            组件运行依赖为 <code>matter-js</code> 与
            <code>gsap</code>，适合强调视觉和互动效果的业务场景，不建议用于对首屏包体极其敏感的页面。
          </li>
        </ul>
      </section>

      <section class="pf-doc__section" aria-labelledby="doc-source">
        <h2 id="doc-source">源码与独立调试</h2>
        <div class="pf-doc__links">
          <a
            class="pf-textlink"
            href="https://github.com/liyangting/tiana-works/tree/main/packages/gacha-lottery"
            target="_blank"
            rel="noreferrer"
          >
            独立组件项目 @lyt/gacha-lottery →
          </a>
          <code>pnpm --filter @lyt/gacha-lottery dev</code>
        </div>
      </section>

      <div class="pf-doc__footer-space" aria-hidden="true"></div>
    </div>
  </main>
</template>

<script setup lang="ts">
import GachaLotteryDemo from '../demos/GachaLotteryDemo.vue'

const scriptClose = '<' + '/script>'

const basicUsage = `<script setup lang="ts">
import { GachaLottery, type Prize } from '@lyt/gacha-lottery'

const prizes: Prize[] = [
  { id: 'coupon', name: '满减券', weight: 50 },
  { id: 'gift', name: '神秘礼盒', weight: 10 },
]
${scriptClose}

<template>
  <GachaLottery :prizes="prizes" @result="saveResult" />
</template>`

const serverDrawUsage = `<GachaLottery :prizes="prizes" :draw="() => api.drawGacha()" />`
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
