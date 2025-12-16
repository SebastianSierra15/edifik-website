import { useState, useCallback } from "react";
import { NameValidationTarget } from "@/src/interfaces";
import { NameValidationService } from "@/src/services";

export function useCheckName() {
  const [isChecking, setIsChecking] = useState(false);
  const [totalMatches, setTotalMatches] = useState<number | null>(null);
  const [cachedResults, setCachedResults] = useState<Record<string, number>>(
    {}
  );

  const checkName = useCallback(
    async (
      target: NameValidationTarget,
      name: string,
      excludeId?: number
    ): Promise<number> => {
      if (!target || !name) return 0;

      const cacheKey = `${target}:${name}:${excludeId ?? "new"}`;

      if (cachedResults[cacheKey] !== undefined) {
        return cachedResults[cacheKey];
      }

      setIsChecking(true);

      try {
        const total = await NameValidationService.checkName({
          target,
          name,
          excludeId,
        });

        setCachedResults((prev) => ({
          ...prev,
          [cacheKey]: total,
        }));

        setTotalMatches(total);
        return total;
      } catch (error) {
        console.error("Error checking name:", error);
        setTotalMatches(null);
        return 0;
      } finally {
        setIsChecking(false);
      }
    },
    [cachedResults]
  );

  return {
    isChecking,
    totalMatches,
    checkName,
  };
}
