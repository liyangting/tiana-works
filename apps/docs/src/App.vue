<template>
  <el-container class="app-shell">
    <el-header class="app-header">
      <RouterLink to="/" class="app-brand">Tiana</RouterLink>

      <el-menu class="app-nav" mode="horizontal" router :default-active="activeNav" :ellipsis="false">
        <el-menu-item index="/">简介</el-menu-item>
        <el-menu-item index="/projects">项目</el-menu-item>
        <el-menu-item index="/components">组件</el-menu-item>
        <el-menu-item index="/about">关于我</el-menu-item>
      </el-menu>

      <div class="app-actions">
        <el-switch
          v-model="isDark"
          :active-icon="Moon"
          :inactive-icon="Sunny"
          inline-prompt
          aria-label="切换深浅色"
        />
        <el-link
          class="app-github"
          href="https://github.com/liyangting/tiana-works"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </el-link>
      </div>
    </el-header>

    <el-main class="app-main">
      <RouterView />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Moon, Sunny } from '@element-plus/icons-vue'

const route = useRoute()
const isDark = ref(document.documentElement.classList.contains('dark'))

const activeNav = computed(() => {
  if (route.path.startsWith('/projects')) return '/projects'
  if (route.path.startsWith('/components')) return '/components'
  if (route.path.startsWith('/about')) return '/about'
  return '/'
})

watch(isDark, (value) => {
  document.documentElement.classList.toggle('dark', value)
  localStorage.setItem('pf-theme', value ? 'dark' : 'light')
})
</script>
