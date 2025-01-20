import { getNestedValue } from "./getNestedValue";

export const mergeSort = <T>(
  array: T[],
  key: keyof T | string,
  direction: "asc" | "desc",
): T[] => {
  if (array.length <= 1) return array;

  const middle = Math.floor(array.length / 2);
  const left = mergeSort(array.slice(0, middle), key, direction);
  const right = mergeSort(array.slice(middle), key, direction);

  return merge(left, right, key, direction);
};

const merge = <T>(
  left: T[],
  right: T[],
  key: keyof T | string,
  direction: "asc" | "desc",
): T[] => {
  const result: T[] = [];
  let indexLeft = 0;
  let indexRight = 0;

  while (indexLeft < left.length && indexRight < right.length) {
    const leftValue = getNestedValue(left[indexLeft], key as string);
    const rightValue = getNestedValue(right[indexRight], key as string);

    const comparison =
      typeof leftValue === "string"
        ? leftValue.localeCompare(rightValue as string)
        : (leftValue as number) - (rightValue as number);

    if (
      (direction === "asc" && comparison <= 0) ||
      (direction === "desc" && comparison > 0)
    ) {
      result.push(left[indexLeft++]);
    } else {
      result.push(right[indexRight++]);
    }
  }

  return result.concat(left.slice(indexLeft), right.slice(indexRight));
};
