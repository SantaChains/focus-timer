# Task: 倒计时工具开发

## Plan
- [x] 基础架构与配置
  - [x] 初始化 TODO.md
  - [x] 更新 index.css 定义主题色和全局样式
- [x] 数据持久化与逻辑封装
  - [x] 创建 `src/lib/storage.ts` 处理统计数据
  - [x] 创建 `src/hooks/use-countdown.ts` 倒计时核心 Hook
- [x] 布局组件实现
  - [x] 创建 `src/components/layout/AppLayout.tsx` 实现响应式导航
- [x] 页面开发
  - [x] 实现 `src/pages/TimerPage.tsx` (主操作页)
  - [x] 实现 `src/pages/StatisticsPage.tsx` (统计页)
- [x] 路由集成
  - [x] 配置 `src/routes.tsx` 并更新 `src/App.tsx`
- [x] 体验优化与验证
  - [x] 添加倒计时结束后的视觉反馈、通知和音效
  - [x] 运行 `npm run lint` 进行代码质量检查
- [x] 最终检查

## Notes
- 数据存储格式: `{ "YYYY-MM-DD": number }`
- 默认倒计时: 1小时 (3600秒)
- 适配移动端和桌面端
- 使用 shadcn/ui 组件库
