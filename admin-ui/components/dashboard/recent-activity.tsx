import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowRight } from "lucide-react";

interface Activity {
  id: string;
  type: "payment" | "contract" | "maintenance" | "tenant";
  title: string;
  description: string;
  time: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

const activities: Activity[] = [
  {
    id: "1",
    type: "payment",
    title: "Thanh toán tiền phòng",
    description: "Phòng 101 - Nguyễn Văn A đã thanh toán 3,500,000đ",
    time: "5 phút trước",
    user: { name: "Nguyễn Văn A" },
  },
  {
    id: "2",
    type: "contract",
    title: "Hợp đồng mới",
    description: "Phòng 205 - Ký hợp đồng với Trần Thị B",
    time: "1 giờ trước",
    user: { name: "Trần Thị B" },
  },
  {
    id: "3",
    type: "maintenance",
    title: "Yêu cầu bảo trì",
    description: "Phòng 302 - Sửa điều hòa",
    time: "2 giờ trước",
  },
  {
    id: "4",
    type: "payment",
    title: "Thanh toán tiền điện nước",
    description: "Phòng 103 - Lê Văn C đã thanh toán 850,000đ",
    time: "3 giờ trước",
    user: { name: "Lê Văn C" },
  },
  {
    id: "5",
    type: "tenant",
    title: "Khách thuê mới",
    description: "Phòng 401 - Đăng ký thuê phòng",
    time: "5 giờ trước",
    user: { name: "Phạm Thị D" },
  },
];

const typeStyles = {
  payment: "bg-success/10 text-success",
  contract: "bg-primary/10 text-primary",
  maintenance: "bg-warning/10 text-warning",
  tenant: "bg-chart-5/10 text-chart-5",
};

export function RecentActivity() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-6">
        <div>
          <h3 className="font-semibold text-foreground">Hoạt động gần đây</h3>
          <p className="text-sm text-muted-foreground">Cập nhật mới nhất</p>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>
      <div className="divide-y divide-border">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-4 transition-colors hover:bg-accent/50"
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                typeStyles[activity.type]
              )}
            >
              {activity.user ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.avatar} />
                  <AvatarFallback className="text-xs">
                    {activity.user.name.split(" ").pop()?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <span className="text-sm font-semibold">
                  {activity.type === "maintenance" ? "BT" : "?"}
                </span>
              )}
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-foreground">
                {activity.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {activity.description}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">{activity.time}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-border p-4">
        <Button variant="ghost" className="w-full justify-center gap-2">
          Xem tất cả
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
