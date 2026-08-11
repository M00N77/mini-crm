export const ORDER_DIRS = new Set(["ASC", "DESC"]);

export function resolveSort(
  sortBy: unknown,
  order: unknown,
  allowed: Record<string, string>,
  defaults: { orderBy: string; orderDir: "ASC" | "DESC" },
): { orderBy: string; orderDir: "ASC" | "DESC" } {
  let orderBy = defaults.orderBy;
  if (typeof sortBy === "string" && Object.hasOwn(allowed, sortBy)) {
    orderBy = allowed[sortBy];
  }

  let orderDir: "ASC" | "DESC" = defaults.orderDir;
  if (typeof order === "string") {
    const dir = order.toUpperCase();
    if (ORDER_DIRS.has(dir)) orderDir = dir as "ASC" | "DESC";
  }

  return { orderBy, orderDir };
}
