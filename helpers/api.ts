import { useEffect } from "react";
import useSWRNative from "swr-react-native";
import { useAuth } from "../components/AuthProvider";
import { apiPath } from "./utils";

export const apiFetcher = (token: string) => async (path: string) => {
  const res = await fetch(apiPath(path).toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const error = await res.json();
    error.status = res.status;
    throw error;
  }

  return await res.json();
};

export const useAPIRequest = (path: string) => {
  const { signOut, state } = useAuth();
  const { token } = state;

  const { data, error } = useSWRNative(path, apiFetcher(token ?? ""));
  const loggedOut = error && error.status == 401;

  useEffect(() => {
    if (loggedOut) {
      signOut();
    }
  }, [loggedOut]);

  return { error, data };
};

export const useUser = () => useAPIRequest("/auth/users/me/");
export const useOrgs = () => useAPIRequest("/orgs/");
export const usePosts = () => useAPIRequest("/posts/");
export const useEvents = () => useAPIRequest("/events/");
export const usePrizes = () => useAPIRequest("/prizes/");
export const useSchedules = () => useAPIRequest("/schedules/");
