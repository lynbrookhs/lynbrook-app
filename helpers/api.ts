import { useEffect } from "react";
import { useSWRInfinite } from "swr";
import useSWRNative from "swr-react-native";
import { useAuth } from "../components/AuthProvider";
import { apiPath } from "./utils";

export const apiFetcher = (token: string) => async (url: string) => {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

  if (!res.ok) {
    const error = await res.json();
    error.status = res.status;
    throw error;
  }

  return await res.json();
};

const wrapAPIRequest = (func: (path: string, fetcher: (...args: any) => any) => any) => {
  return (path: string) => {
    const { signOut, state } = useAuth();
    const { token } = state;

    const ret = func(path, apiFetcher(token ?? ""));
    const loggedOut = ret.error && ret.error.status == 401;

    useEffect(() => {
      if (loggedOut) {
        signOut();
      }
    }, [loggedOut]);

    return ret;
  };
};

export const useAPIRequest = wrapAPIRequest((path: string, fetcher: typeof apiFetcher) =>
  useSWRNative(apiPath(path).toString(), fetcher)
);

export const useAPIRequestInfinite = wrapAPIRequest((path: string, fetcher: typeof apiFetcher) => {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData) return previousPageData.next;
    return apiPath(path).toString();
  };

  return useSWRInfinite(getKey, fetcher);
});

export const useUser = () => useAPIRequest("/auth/users/me/");
export const useOrgs = () => useAPIRequest("/orgs/");
export const usePosts = () => useAPIRequestInfinite("/posts/");
export const useEvents = () => useAPIRequest("/events/");
export const usePrizes = () => useAPIRequest("/prizes/");
export const useSchedules = () => useAPIRequest("/schedules/");
