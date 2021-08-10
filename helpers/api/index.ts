import { useCallback, useEffect } from "react";
import { useSWRInfinite } from "swr";
import useSWRNative, { useSWRNativeRevalidate } from "swr-react-native";
import { useAuth } from "../../components/AuthProvider";
import { apiPath } from "../utils";
import {
  APIDate,
  Membership,
  NestedSchedule,
  Organization,
  Post,
  Prize,
  Schedule,
  User,
} from "./models";

export type Error = {
  url: string;
  status: number;
  inner?: any;
};

type PaginatedResponse<T> = {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
};

export const apiFetcher = (token?: string) => async (url: string, options?: RequestInit) => {
  const auth_headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(url, {
    ...options,
    headers: {
      ...auth_headers,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let error: Error = { status: res.status, url };
    try {
      error.inner = await res.json();
    } catch {}
    throw error;
  }

  try {
    return await res.json();
  } catch {
    return undefined;
  }
};

const useAPIRequest = <T>(path: string) => {
  const { signOut, state } = useAuth();
  const { token } = state;

  const ret = useSWRNative<T, Error>(apiPath(path).toString(), apiFetcher(token ?? ""));
  const loggedOut = ret.error && ret.error.status === 401;

  useEffect(() => {
    if (loggedOut) {
      signOut();
    }
  }, [loggedOut]);

  return ret;
};

const useAPIRequestPaginated = <T>(path: string) => {
  const getKey = (_: number, previous: PaginatedResponse<T> | null) => {
    if (previous) return previous.next ?? null;
    return apiPath(path).toString();
  };

  const { signOut, state } = useAuth();
  const { token } = state;

  const ret = useSWRInfinite<PaginatedResponse<T>, Error>(getKey, apiFetcher(token ?? ""));
  const loggedOut = ret.error && ret.error.status === 401;

  useEffect(() => {
    if (loggedOut) {
      signOut();
    }
  }, [loggedOut]);

  useSWRNativeRevalidate(ret);
  return ret;
};

type CurrentSchedule = {
  start: APIDate;
  end: APIDate;
  weekdays: [
    NestedSchedule,
    NestedSchedule,
    NestedSchedule,
    NestedSchedule,
    NestedSchedule,
    NestedSchedule,
    NestedSchedule
  ];
};

// Get Requests

export const useUser = () => useAPIRequest<User>("/users/me/");
export const useMemberships = () => useAPIRequest<Membership[]>("/users/me/orgs/");

export const useOrgs = () => useAPIRequest<Organization[]>(`/orgs/`);
export const useOrg = (id: number) => useAPIRequest<Organization>(`/orgs/${id}/`);

export const useEvents = () => useAPIRequest<Event[]>("/events/");
export const usePrizes = () => useAPIRequest<Prize[]>("/prizes/");

export const usePosts = () => useAPIRequestPaginated<Post>("/posts/");
export const usePost = (id: number) => useAPIRequest<Post>(`/posts/${id}/`);

export const useSchedules = () => useAPIRequest<Schedule[]>("/schedules/");

export const useCurrentSchedule = () => useAPIRequest<CurrentSchedule>("/schedules/current/");

// Post Request

export const useRequest = () => {
  const { state } = useAuth();
  const { token } = state;

  return useCallback(
    async (method: string, path: string, data?: any) => {
      const fetcher = apiFetcher(token ?? "");
      return await fetcher(apiPath(path).toString(), {
        method,
        headers: { "Content-Type": "application/json" },
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [token]
  );
};
