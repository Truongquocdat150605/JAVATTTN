export const formatVND = (value) => {
  const num = typeof value === "string" ? Number(value) : value;
  if (num === null || num === undefined || Number.isNaN(num)) return "0 VNĐ";
  return `${num.toLocaleString("vi-VN")} VNĐ`;
};

