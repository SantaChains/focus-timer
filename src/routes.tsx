import type { ReactNode } from 'react';
import { StatisticsPage } from './pages/StatisticsPage';
import { TimerPage } from './pages/TimerPage';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: '倒计时',
    path: '/',
    element: <TimerPage />
  },
  {
    name: '每日统计',
    path: '/statistics',
    element: <StatisticsPage />
  }
];

export default routes;
