import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, Clock, CheckCircle, ArrowRight } from "lucide-react";

interface Invoice {
  id: string;
  roomNumber: string;
  tenant: string;
  amount: number;
  dueDate: string;
  status: "overdue" | "pending" | "paid";
  type: string;
}

const invoices: Invoice[] = [
  { id: "1", roomNumber: "101", tenant: "Nguyễn Văn A", amount: 3500000, dueDate: "01/06/2026", status: "overdue", type: "Tiền phòng" },
  { id: "2", roomNumber: "103", tenant: "Lê Văn C", amount: 850000, dueDate: "05/06/2026", status: "pending", type: "Điện nước" },
  { id: "3", roomNumber: "201", tenant: "Trần Thị B", amount: 3800000, dueDate: "10/06/2026", status: "pending", type: "Tiền phòng" },
  { id: "4", roomNumber: "203", tenant: "Phạm Văn E", amount: 720000, dueDate: "15/06/2026", status: "paid", type: "Điện nước" },
  { id: "5", roomNumber: "302", tenant: "Hoàng Thị F", amount: 3600000, dueDate: "20/06/2026", status: "pending", type: "Tiền phòng" },
];

const statusConfig = {
  overdue: {
    label: "Quá hạn",
    color: "text-destructive bg-destructive/10",
    icon: AlertTriangle,
  },
  pending: {
    label: "Chờ thu",
    color: "text-warning bg-warning/10",
    icon: Clock,
  },
  paid: {
    label: "Đã thu",
    color: "text-success bg-success/10",
    icon: CheckCircle,
  },
};

export function PendingInvoices() {
  const overdueCount = invoices.filter((i) => i.status === "overdue").length;
  const pendingCount = invoices.filter((i) => i.status === "pending").length;
  const totalPending = invoices
    .filter((i) => i.status !== "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-6">
        <div>
          <h3 className="font-semibold text-foreground">Hóa đơn cần thu</h3>
          <p className="text-sm text-muted-foreground">
            {overdueCount} quá hạn • {pendingCount} chờ thu
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-warning">
            {new Intl.NumberFormat("vi-VN").format(totalPending)}đ
          </p>
          <p className="text-xs text-muted-foreground">Tổng cần thu</p>
        </div>
      </div>

      <div className="divide-y divide-border">
        {invoices
          .filter((i) => i.status !== "paid")
          .slice(0, 4)
          .map((invoice) => {
            const config = statusConfig[invoice.status];
            const StatusIcon = config.icon;
            return (
              <div
                key={invoice.id}
                className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-accent/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <span className="text-sm font-semibold text-foreground">
                    {invoice.roomNumber}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {invoice.tenant}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {invoice.type} • Hạn: {invoice.dueDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {new Intl.NumberFormat("vi-VN").format(invoice.amount)}đ
                  </p>
                  <div
                    className={cn(
                      "mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                      config.color
                    )}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {config.label}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <div className="border-t border-border p-4">
        <Button variant="ghost" className="w-full justify-center gap-2">
          Xem tất cả hóa đơn
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
