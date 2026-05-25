import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Home, AlertCircle, CheckCircle2 } from "lucide-react";

interface Room {
  id: string;
  number: string;
  floor: number;
  status: "occupied" | "available" | "maintenance";
  tenant?: string;
  price: number;
  dueDate?: string;
}

const rooms: Room[] = [
  { id: "1", number: "101", floor: 1, status: "occupied", tenant: "Nguyễn Văn A", price: 3500000, dueDate: "05/06" },
  { id: "2", number: "102", floor: 1, status: "available", price: 3200000 },
  { id: "3", number: "103", floor: 1, status: "occupied", tenant: "Lê Văn C", price: 3500000, dueDate: "10/06" },
  { id: "4", number: "201", floor: 2, status: "occupied", tenant: "Trần Thị B", price: 3800000, dueDate: "15/06" },
  { id: "5", number: "202", floor: 2, status: "maintenance", price: 3500000 },
  { id: "6", number: "203", floor: 2, status: "occupied", tenant: "Phạm Văn E", price: 3600000, dueDate: "20/06" },
];

const statusConfig = {
  occupied: {
    label: "Đang thuê",
    color: "bg-success/10 text-success border-success/20",
    icon: CheckCircle2,
  },
  available: {
    label: "Còn trống",
    color: "bg-primary/10 text-primary border-primary/20",
    icon: Home,
  },
  maintenance: {
    label: "Bảo trì",
    color: "bg-warning/10 text-warning border-warning/20",
    icon: AlertCircle,
  },
};

export function RoomOverview() {
  const occupiedCount = rooms.filter((r) => r.status === "occupied").length;
  const totalRooms = rooms.length;
  const occupancyRate = Math.round((occupiedCount / totalRooms) * 100);

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-6">
        <div>
          <h3 className="font-semibold text-foreground">Tình trạng phòng</h3>
          <p className="text-sm text-muted-foreground">
            {occupiedCount}/{totalRooms} phòng đang thuê
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{occupancyRate}%</p>
          <p className="text-xs text-muted-foreground">Tỷ lệ lấp đầy</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-6 pt-4">
        <Progress value={occupancyRate} indicatorClassName="bg-success" />
        <div className="mt-3 flex gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">Đang thuê ({occupiedCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Còn trống ({rooms.filter(r => r.status === "available").length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-warning" />
            <span className="text-xs text-muted-foreground">Bảo trì ({rooms.filter(r => r.status === "maintenance").length})</span>
          </div>
        </div>
      </div>

      {/* Room list */}
      <div className="mt-4 divide-y divide-border">
        {rooms.slice(0, 5).map((room) => {
          const config = statusConfig[room.status];
          const StatusIcon = config.icon;
          return (
            <div
              key={room.id}
              className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-accent/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <span className="text-sm font-semibold text-foreground">{room.number}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  Phòng {room.number}
                  {room.tenant && (
                    <span className="ml-2 text-muted-foreground">- {room.tenant}</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Intl.NumberFormat("vi-VN").format(room.price)}đ/tháng
                  {room.dueDate && ` • Hạn: ${room.dueDate}`}
                </p>
              </div>
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-1",
                  config.color
                )}
              >
                <StatusIcon className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{config.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border p-4">
        <Button variant="ghost" className="w-full justify-center gap-2">
          Xem tất cả phòng
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
