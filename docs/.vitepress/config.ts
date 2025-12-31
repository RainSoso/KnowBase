import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Sosse's Knowledge Base",
  description: "A knowledge base for frontend development",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '开发规范', link: '/' },
      { text: '接口文档规范', link: '/components/interface/base' }
    ],

    sidebar: [
      {
        text: '前端开发规范',
        items: [
          { text: 'HTML规范', link: '/markdown-examples' },
          { text: 'CSS规范', link: '/api-examples' }
        ]
      },
      {
        text: '接口文档规范',
        items: [
          { text: '概述', link: '/components/interface/intro' },
          { text: '文档规范', link: '/components/interface/base' },
        ]
      }
    ],
    outline: [2, 3], // 只显示 h2 和 h3 标题
    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ]
    base: '/KnowBase/',
  }
})
