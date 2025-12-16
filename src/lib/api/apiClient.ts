export interface ApiResponse<T> {
  data: T;
}

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || response.statusText);
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(url: string) => request<T>(url),
  post: <T, B>(url: string, body: B) =>
    request<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: <T, B>(url: string, body: B) =>
    request<T>(url, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: <T, B = unknown>(url: string, body?: B) =>
    request<T>(url, {
      method: "DELETE",
      body: body ? JSON.stringify(body) : undefined,
    }),
};
