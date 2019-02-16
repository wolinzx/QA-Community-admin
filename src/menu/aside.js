// 菜单 侧边栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '话题管理',
    icon: 'folder-o',
    children: [
      { path: '/demo/page1', title: '话题查询' },
      { path: '/demo/page2', title: '添加话题' }
    ]
  },
  {
    title: '举报管理',
    icon: 'folder-o',
    path: '/report'
    // children: [
    //   { path: '/demo/page1', title: '话题查询' },
    //   { path: '/demo/page2', title: '添加话题' }
    // ]
  }
]
