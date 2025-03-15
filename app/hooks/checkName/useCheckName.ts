import { useState, useCallback } from "react";

export const useCheckName = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [totalMatches, setTotalMatches] = useState<number | null>(null);
  const [cachedResults, setCachedResults] = useState<Record<string, number>>(
    {}
  );

  const checkName = useCallback(
    async (table: string, name: string, id?: number) => {
      if (!table || !name) return 0;

      if (cachedResults[name]) {
        return cachedResults[name];
      }

      setIsChecking(true);
      try {
        const url = new URL(`/api/check-name`, window.location.origin);
        url.searchParams.append("table", table);
        url.searchParams.append("name", name);
        if (id !== undefined) url.searchParams.append("id", String(id));

        const startFetch = performance.now(); // Inicia medición del tiempo de fetch

        const response = await fetch(url.toString());

        const endFetch = performance.now(); // Finaliza medición del tiempo de fetch
        const serverTiming = response.headers.get("Server-Timing");

        console.log(
          `⏱️ Tiempo total de fetch: ${(endFetch - startFetch).toFixed(2)}ms`
        );
        console.log("⏳ Server Timing Metrics:", serverTiming);

        if (!response.ok) {
          throw new Error(
            `Error verificando el nombre: ${response.statusText}`
          );
        }

        const data = await response.json();
        const total = data.total || 0;

        setCachedResults((prev) => ({ ...prev, [name]: total }));
        setTotalMatches(total);

        return total;
      } catch (error) {
        console.error(
          `Error verificando el nombre en la tabla ${table}:`,
          error
        );
        setTotalMatches(null);
        return 0;
      } finally {
        setIsChecking(false);
      }
    },
    [cachedResults]
  );

  return { isChecking, totalMatches, checkName };
};
