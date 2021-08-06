import { API_BASE_URL } from "./constants";

export const apiFetcher = async (path: string) => {
  const url = new URL(path, API_BASE_URL);
  const res = await fetch(url.toString());

  if (!res.ok) {
    const error = await res.json();
    error.status = res.status;
    throw error;
  }

  return await res.json();
};
