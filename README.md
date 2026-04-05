# Focus Timer

专注时刻 | 倒计时与完成统计

一款简洁美观的专注倒计时工具，支持自定义倒计时时长，提供开始、暂停、重置操作，并通过本地存储记录每日完成的倒计时次数。

## 功能特性

- **自定义倒计时** - 支持设置小时、分钟、秒，默认 1 小时
- **开始/暂停/继续/重置** - 完整的倒计时控制
- **完成提醒** - 倒计时结束时视觉反馈 + 音效提醒
- **每日统计** - 自动记录每日完成次数
- **历史记录** - 查看过往日期的完成统计
- **本地存储** - 数据持久化，刷新不丢失

## 技术栈

- **框架**: React 19 + TypeScript
- **构建**: Vite (Rolldown)
- **样式**: Tailwind CSS + shadcn/ui
- **路由**: React Router v7
- **代码规范**: Biome

## 快速开始

### 环境要求

- Node.js ≥ 20
- pnpm ≥ 10

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 代码检查

```bash
pnpm lint
```

## 项目结构

```
├── public/          # 静态资源
├── src/
│   ├── components/  # UI 组件
│   ├── hooks/       # 自定义 Hooks
│   ├── lib/         # 工具函数
│   ├── pages/       # 页面组件
│   └── App.tsx      # 应用入口
├── .rules/          # 代码检查规则
├── docs/            # 文档
└── package.json
```

## 开源协议

MIT

---

GitHub: https://github.com/SantaChains/focus-timer
