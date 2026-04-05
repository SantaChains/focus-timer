/**
 * 本地存储操作工具类
 */

export interface StatsData {
  [date: string]: number;
}

const STORAGE_KEY = 'countdown_stats_v1';

/**
 * 获取今日日期字符串 YYYY-MM-DD
 */
export function getTodayStr(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 获取所有统计数据
 */
export function getAllStats(): StatsData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Failed to parse stats from localStorage', error);
    return {};
  }
}

/**
 * 增加一次今日完成次数
 */
export function incrementTodayStats(): void {
  const stats = getAllStats();
  const today = getTodayStr();
  stats[today] = (stats[today] || 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

/**
 * 清空所有统计数据
 */
export function clearAllStats(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * 获取按日期倒序排列的统计列表
 */
export function getSortedStatsList(): { date: string; count: number }[] {
  const stats = getAllStats();
  return Object.entries(stats)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => b.date.localeCompare(a.date));
}
