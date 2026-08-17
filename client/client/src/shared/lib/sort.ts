/**
 * Направление сортировки:
 * - "asc" — по возрастанию (А -> Я, 0 -> 9, старые -> новые)
 * - "desc" — по убыванию (Я -> А, 9 -> 0, новые -> старые)
 */
export type SortOrder = "asc" | "desc";

/**
 * Базовый алгоритм Merge Sort (Сортировка слиянием) с гарантированной сложностью O(n log n).
 * Создает новый отсортированный массив (не мутирует исходный).
 */
export function mergeSort<T>(
  array: readonly T[],
  compareFn: (a: T, b: T) => number
): T[] {
  // Базовый случай: массив из 0 или 1 элемента уже отсортирован
  if (array.length <= 1) {
    return [...array];
  }

  // 1. Деление массива пополам — log(n) уровней
  const middle = Math.floor(array.length / 2);
  const left = array.slice(0, middle);
  const right = array.slice(middle);

  // 2. Рекурсивная сортировка обеих половин и их слияние за O(n)
  return merge(
    mergeSort(left, compareFn),
    mergeSort(right, compareFn),
    compareFn
  );
}

/**
 * Слияние двух отсортированных массивов в один за O(n)
 */
function merge<T>(
  left: T[],
  right: T[],
  compareFn: (a: T, b: T) => number
): T[] {
  const result: T[] = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (compareFn(left[leftIndex], right[rightIndex]) <= 0) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  // Добавляем оставшиеся элементы, если один из списков закончился раньше
  while (leftIndex < left.length) {
    result.push(left[leftIndex]);
    leftIndex++;
  }

  while (rightIndex < right.length) {
    result.push(right[rightIndex]);
    rightIndex++;
  }

  return result;
}

/**
 * Сравнивает два значения любого типа (строки, даты, числа, null/undefined).
 */
function compareValues(a: unknown, b: unknown): number {
  // Обработка null и undefined (пустые значения отправляем в конец)
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  // Сравнение чисел
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  // Сравнение дат или ISO-строк
  if (
    typeof a === "string" &&
    typeof b === "string" &&
    (a.includes("-") || a.includes("T"))
  ) {
    const aTime = Date.parse(a);
    const bTime = Date.parse(b);
    if (!isNaN(aTime) && !isNaN(bTime)) {
      return aTime - bTime;
    }
  }

  // Сравнение строк (русский/английский алфавит с учетом регистра и чисел в строке)
  const aStr = String(a).trim();
  const bStr = String(b).trim();

  return aStr.localeCompare(bStr, "ru", {
    sensitivity: "base",
    numeric: true,
  });
}

/**
 * Главная утилита сортировки для сущностей (контакты, задачи, заметки).
 * 
 * @param array Исходный массив объектов
 * @param sortBy Ключ объекта, по которому сортируем (например "name", "createdAt", "company")
 * @param order Направление: "asc" (возрастание) или "desc" (убывание)
 * @returns Новый отсортированный массив O(n log n)
 * 
 * @example
 * sortByField(contacts, "name", "asc")       // По алфавиту А -> Я
 * sortByField(contacts, "createdAt", "desc") // Сначала самые новые
 * sortByField(contacts, "company", "asc")   // По названию компании
 */
export function sortByField<T, K extends keyof T>(
  array: readonly T[],
  sortBy: K,
  order: SortOrder = "asc"
): T[] {
  if (!array || array.length <= 1) {
    return array ? [...array] : [];
  }

  return mergeSort(array, (a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];

    const comparison = compareValues(valA, valB);

    // Если порядок "desc" (по убыванию), инвертируем результат
    return order === "desc" ? -comparison : comparison;
  });
}
