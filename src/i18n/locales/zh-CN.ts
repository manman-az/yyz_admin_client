import { enUS } from '@/i18n/locales/en-US'

type MessageKey = keyof typeof enUS

export const zhCN = {
  'site.description': '记录构建、写作与生活 —— 一篇一篇慢慢来。',

  'nav.home': '首页',
  'nav.archive': '归档',
  'nav.tags': '标签',
  'nav.categories': '分类',
  'nav.about': '关于',

  'a11y.skipToContent': '跳到内容',

  'search.placeholder': '搜索…',

  'pagination.aria': '分页',
  'pagination.prev': '上一页',
  'pagination.next': '下一页',

  'home.title.latest': '最新文章',
  'home.title.tag': '标签：{tag}',
  'home.title.category': '分类：{category}',
  'home.title.search': '搜索：{q}',
  'home.total_one': '{count} 篇文章',
  'home.total_other': '{count} 篇文章',
  'home.clearFilters': '清除筛选',
  'home.browseTags': '浏览标签',
  'home.browseCategories': '浏览分类',
  'home.quickLinks': '快捷入口',
  'home.noPostsTitle': '没有找到文章',
  'home.noPostsHint': '换个关键词试试，或清除筛选查看全部内容。',

  'post.backHome': '← 返回首页',
  'post.onThisPage': '本页目录',
  'post.readingTime': '预计阅读 {minutes} 分钟',

  'tags.title': '标签',
  'tags.subtitle': '按主题浏览',
  'tags.postsCount': '{count} 篇文章',

  'categories.title': '分类',
  'categories.subtitle': '按领域浏览',
  'categories.postsCount': '{count} 篇文章',

  'archive.title': '归档',
  'archive.subtitle': '按年份查看全部文章',

  'about.title': '关于',
  'about.subtitle': '这个站点为什么存在',
  'about.line.intro': '你好，我是 **{name}**。',
  'about.line.stack': '这是一个轻量的博客前端，技术栈：',
  'about.line.contact': '## 联系方式',
  'about.line.email': '- 邮箱：`{email}`',
  'about.line.github': '- GitHub：[{github}]({github})',
  'about.line.x': '- X：[{x}]({x})',

  'notfound.title': '404',
  'notfound.text': '你访问的页面不存在。',
  'notfound.back': '返回首页',

  'error.title': '出错了',
  'error.generic': '发生了一点问题',
  'error.back': '返回首页',

  'footer.builtWith': '使用 React + Vite 构建。',

  'theme.dark': '深色',
  'theme.light': '浅色',
  'theme.switchTo': '切换到{theme}主题',

  'lang.zh': '中文',
  'lang.en': 'EN',
  'lang.switchTo': '切换语言为 {lang}',

  'widget.savedLocally': '已保存在本地',
  'widget.reset': '重置',
  'widget.counter.decrease': '减少',
  'widget.counter.increase': '增加',
  'widget.poll.totalLocal': '投票总数（本地）：{total}',
  'widget.poll.total': '投票数：{total}',
} satisfies Record<MessageKey, string>
