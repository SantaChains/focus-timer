import { Calendar, History, Trash2, TrendingUp, Trophy } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { clearAllStats, getSortedStatsList, getTodayStr } from '@/lib/storage';

export const StatisticsPage: React.FC = () => {
  const [stats, setStats] = useState(getSortedStatsList());
  const today = getTodayStr();
  const todayCount = stats.find(s => s.date === today)?.count || 0;
  const totalCount = stats.reduce((acc, curr) => acc + curr.count, 0);

  const handleClear = () => {
    clearAllStats();
    setStats([]);
    toast.success('统计数据已清空');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto w-full">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">今日完成</p>
              <h3 className="text-4xl font-black gradient-text tabular-nums">{todayCount}</h3>
            </div>
            <div className="bg-primary/20 p-3 rounded-2xl">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">历史累计</p>
              <h3 className="text-4xl font-black text-blue-500 tabular-nums">{totalCount}</h3>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-2xl">
              <Trophy className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-muted to-muted/50">
          <CardContent className="p-6 flex flex-col justify-center gap-4 h-full">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all">
                  <Trash2 className="mr-2 h-4 w-4" /> 清空历史记录
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确定要清空所有数据吗？</AlertDialogTitle>
                  <AlertDialogDescription>
                    此操作不可撤销。所有历史统计数据将被永久删除。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClear} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    确定清空
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>

      {/* History List */}
      <Card className="shadow-lg border-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <History className="h-6 w-6 text-primary" /> 历史统计
            </CardTitle>
            <CardDescription>按日期排序的所有完成记录</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {stats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/20 rounded-xl border-2 border-dashed border-muted">
              <Calendar className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">暂无数据</p>
              <p className="text-sm">完成你的第一个倒计时后即可在这里看到记录</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.map((item) => (
                <div 
                  key={item.date} 
                  className="flex items-center justify-between p-5 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-background p-3 rounded-xl border border-border shadow-sm">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-lg">{item.date}</span>
                      <p className="text-xs text-muted-foreground">
                        {item.date === today ? '今天' : '已归档'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-foreground tabular-nums">{item.count}</span>
                    <span className="text-sm font-medium text-muted-foreground">次完成</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
