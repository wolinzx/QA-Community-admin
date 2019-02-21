// 菜单 侧边栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '话题管理',
    icon: 'comment-o',
    children: [
      { path: '/demo/page1', icon: 'circle-thin', title: '话题查询' },
      { path: '/demo/page2', icon: 'circle-thin', title: '添加话题' }
    ]
  },
  {
    title: '举报管理',
    icon: 'flag-o',
    path: '/report'
  }
]
