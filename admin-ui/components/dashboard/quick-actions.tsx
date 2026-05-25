import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Home,
  FileText,
  Receipt,
  Users,
  Plus,
  TrendingUp,
  Wrench,
  Calendar,
} from "lucide-react";

const quickActions = [
  {
    title: "Thêm phòng",
    description: "Tạo phòng mới",
    icon: Plus,
    href: "/rooms/new",
    color: "bg-primary/10 text-primary hover:bg-primary/20",
  },
  {
    title: "Tạo hợp đồng",
    description: "Ký hợp đồng mới",
    icon: FileText,
    href: "/contracts/new",
    color: "bg-success/10 text-success hover:bg-success/20",
  },
  {
    title: "Tạo hóa đơn",
    description: "Xuất hóa đơn tháng",
    icon: Receipt,
    href: "/invoices/new",
    color: "bg-warning/10 text-warning hover:bg-warning/20",
  },
  {
    title: "Báo cáo",
    description: "Xem báo cáo tài chính",
    icon: TrendingUp,
    href: "/finance/reports",
    color: "bg-chart-5/10 text-chart-5 hover:bg-chart-5/20",
  },
];

export function QuickActions() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 font-semibold text-foreground">Thao tác nhanh</h3>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <Link key={action.title} href={action.href}>
            <div
              className={`flex items-center gap-3 rounded-lg p-3 transition-all duration-200 ${action.color}`}
            >
              <action.icon className="h-5 w-5" />
              <div>
                <p className="text-sm font-medium">{action.title}</p>
                <p className="text-xs opacity-70">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

interface UpcomingItem {
  id: string;
  title: string;
  date: string;
  type: "contract" | "invoice" | "maintenance";
}

const upcomingItems: UpcomingItem[] = [
  { id: "1", title: "Hết hạn HĐ phòng 101", date: "28/05/2026", type: "contract" },
  { id: "2", title: "Thu tiền phòng 201", date: "01/06/2026", type: "invoice" },
  { id: "3", title: "Bảo trì định kỳ", date: "05/06/2026", type: "maintenance" },
  { id: "4", title: "Hết hạn HĐ phòng 302", date: "15/06/2026", type: "contract" },
];

const typeConfig = {
  contract: { color: "bg-primary", icon: FileText },
  invoice: { color: "bg-warning", icon: Receipt },
  maintenance: { color: "bg-success", icon: Wrench },
};

export function UpcomingEvents() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">Sắp tới</h3>
      </div>
      <div className="space-y-3">
        {upcomingItems.map((item) => {
          const config = typeConfig[item.type];
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3"
            >
              <div className={`h-2 w-2 rounded-full ${config.color}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
