const DEFAULT_NEWEST_FIELDS = [
  "updatedAt",
  "lastModifiedDate",
  "createdAt",
  "billingDate",
  "paymentDate",
  "expenseDate",
  "startDate",
  "id",
];

const toSortableValue = (item, field) => {
  const value = item?.[field];
  if (value === undefined || value === null || value === "") return null;
  if (field === "id" && !Number.isNaN(Number(value))) return Number(value);

  const timestamp = new Date(value).getTime();
  if (!Number.isNaN(timestamp)) return timestamp;

  return null;
};

export const sortNewestFirst = (items, fields = DEFAULT_NEWEST_FIELDS) => {
  return [...(items || [])].sort((a, b) => {
    for (const field of fields) {
      const aValue = toSortableValue(a, field);
      const bValue = toSortableValue(b, field);
      if (aValue !== null || bValue !== null) {
        return (bValue ?? -Infinity) - (aValue ?? -Infinity);
      }
    }
    return 0;
  });
};

export const paginateRows = (rows, page, rowsPerPage) => {
  if (rowsPerPage === -1) return rows;
  const start = page * rowsPerPage;
  return rows.slice(start, start + rowsPerPage);
};
