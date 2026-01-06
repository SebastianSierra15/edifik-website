export interface ApiResponse<T> {
  data: T;
}

const isFormDataPayload = (body: unknown): body is FormData => {
  if (!body || typeof body !== "object") return false;
  const candidate = body as FormData;
  return (
    typeof candidate.append === "function" &&
    typeof candidate.get === "function"
  );
};

const normalizeHeadersForFormData = (
  headers?: HeadersInit
): HeadersInit | undefined => {
  if (!headers) return undefined;

  if (headers instanceof Headers) {
    headers.delete("Content-Type");
    headers.delete("content-type");
    return headers;
  }

  const normalized: Record<string, string> = {};
  Object.entries(headers).forEach(([key, value]) => {
    if (key.toLowerCase() === "content-type") return;
    if (typeof value === "string") {
      normalized[key] = value;
    }
  });

  return normalized;
};

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const isFormData = isFormDataPayload(init?.body);
  const headers = isFormData
    ? normalizeHeadersForFormData(init?.headers)
    : {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      };

  const response = await fetch(input, {
    credentials: "include",
    headers,
    ...init,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || response.statusText);
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(url: string, init?: RequestInit) => request<T>(url, init),
  post: <T, B>(url: string, body: B) =>
    request<T>(url, {
      method: "POST",
      body: isFormDataPayload(body) ? body : JSON.stringify(body),
    }),
  put: <T, B>(url: string, body: B) =>
    request<T>(url, {
      method: "PUT",
      body: isFormDataPayload(body) ? body : JSON.stringify(body),
    }),
  delete: <T, B = unknown>(url: string, body?: B) =>
    request<T>(url, {
      method: "DELETE",
      body: isFormDataPayload(body)
        ? body
        : body
          ? JSON.stringify(body)
          : undefined,
    }),
};
