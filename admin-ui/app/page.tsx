import {
  DollarSign,
  Home,
  Receipt,
  FileText,
  Users,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { Sidebar, Header } from "@/components/layout/sidebar";
import { StatsCard, MiniStats } from "@/components/dashboard/stats-card";
import { RevenueChart, OccupancyChart } from "@/components/dashboard/charts";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RoomOverview } from "@/components/dashboard/room-overview";
import { PendingInvoices } from "@/components/dashboard/pending-invoices";
import { QuickActions, UpcomingEvents } from "@/components/dashboard/quick-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Tổng quan
                </h1>
                <p className="text-sm text-muted-foreground">
                  Xin chào, Admin! Đây là tổng quan hoạt động của bạn.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Làm mới
                </Button>
                <Tabs defaultValue="today" className="w-auto">
                  <TabsList className="h-9">
                    <TabsTrigger value="today" className="text-xs">
                      Hôm nay
                    </TabsTrigger>
                    <TabsTrigger value="week" className="text-xs">
                      Tuần này
                    </TabsTrigger>
                    <TabsTrigger value="month" className="text-xs">
                      Tháng này
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Tổng doanh thu"
                value="89,500,000đ"
                change="+12.5%"
                changeType="positive"
                icon={DollarSign}
                iconColor="bg-success/10 text-success"
              />
              <StatsCard
                title="Phòng đang thuê"
                value="18/20"
                subtitle="90% tỷ lệ lấp đầy"
                icon={Home}
                iconColor="bg-primary/10 text-primary"
              />
              <StatsCard
                title="Hóa đơn chưa thu"
                value="5"
                change="-2"
                changeType="positive"
                icon={Receipt}
                iconColor="bg-warning/10 text-warning"
              />
              <StatsCard
                title="Hợp đồng hiệu lực"
                value="18"
                change="+3"
                changeType="positive"
                icon={FileText}
                iconColor="bg-chart-5/10 text-chart-5"
              />
            </div>

            {/* Charts section */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Revenue chart - takes 2 columns */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-base font-semibold">
                      Doanh thu & Chi phí
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Biểu đồ tài chính theo tháng
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-primary" />
                      <span className="text-xs text-muted-foreground">Doanh thu</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-warning" />
                      <span className="text-xs text-muted-foreground">Chi phí</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <RevenueChart />
                </CardContent>
              </Card>

              {/* Side cards */}
              <div className="space-y-6">
                <QuickActions />
                <UpcomingEvents />
              </div>
            </div>

            {/* Second row */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Room overview */}
              <RoomOverview />

              {/* Pending invoices */}
              <PendingInvoices />

              {/* Recent activity */}
              <RecentActivity />
            </div>

            {/* Occupancy chart */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">
                      Tỷ lệ lấp đầy
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Theo dõi tỷ lệ phòng được thuê theo thời gian
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-success" />
                    <span className="text-xs text-muted-foreground">Tỷ lệ (%)</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <OccupancyChart />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
