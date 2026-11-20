import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.screenshots/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // Swiper 的实例与回调对象来自第三方运行时，保留 any 以避免噪音
      '@typescript-eslint/no-explicit-any': 'off',
      // 单页锚点与纯展示组件允许非多词命名
      'vue/multi-word-component-names': 'off',
      // 使用类型声明定义可选 Props 时，默认值由组件逻辑处理
      'vue/require-default-prop': 'off',
    },
  },
  prettier,
)
