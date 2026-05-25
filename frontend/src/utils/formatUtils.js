export const formatCurrency = (amount) => {
  const n = Number(amount);
  const value = Number.isFinite(n) ? n : 0;
  return `${value.toLocaleString("vi-VN")}₫`;
};

