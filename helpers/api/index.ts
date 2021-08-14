import { useCallback, useEffect, useState } from "react";
import { useSWRInfinite } from "swr";
import useSWRNative, { useSWRNativeRevalidate } from "swr-react-native";
import { useAuth } from "../../components/AuthProvider";
import { apiPath } from "../utils";
import { useSignOut } from "./auth";
import {
  APIDate,
  Event,
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

export const apiFetcher = (token?: string) => async (path: string, options?: RequestInit) => {
  const url = path.startsWith("http") ? path : apiPath(path).toString();
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
  const { token } = useAuth();
  const signOut = useSignOut();

  const ret = useSWRNative<T, Error>(path, apiFetcher(token ?? ""));
  const loggedOut = ret.error && ret.error.status === 401;

  useEffect(() => {
    if (loggedOut) signOut();
  }, [loggedOut]);

  return ret;
};

const useAPIRequestPaginated = <T>(path: string) => {
  const getKey = (_: number, previous: PaginatedResponse<T> | null) => {
    if (previous) return previous.next ?? null;
    return path;
  };

  const { token } = useAuth();
  const signOut = useSignOut();

  const ret = useSWRInfinite<PaginatedResponse<T>, Error>(getKey, apiFetcher(token ?? ""));
  const loggedOut = ret.error && ret.error.status === 401;

  useEffect(() => {
    if (loggedOut) signOut();
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
export const useEvent = (id: number) => useAPIRequest<Event>(`/events/${id}/`);

export const usePrizes = () => useAPIRequest<Prize[]>("/prizes/");

export const usePosts = () => useAPIRequestPaginated<Post>("/posts/");
export const usePost = (id: number) => useAPIRequest<Post>(`/posts/${id}/`);

export const useSchedules = () => useAPIRequest<Schedule[]>("/schedules/");

export const useCurrentSchedule = () => useAPIRequest<CurrentSchedule>("/schedules/current/");
export const useNextSchedule = () => useAPIRequest<CurrentSchedule>("/schedules/next/");

// Post Request

export const useRequest = (throw_on_error?: boolean) => {
  const [error, setError] = useState<Error | undefined>(undefined);
  const { token } = useAuth();

  const requestWithFunc = useCallback(
    async <T = any>(func: (token: string) => Promise<T>) => {
      try {
        return (await func(token ?? "")) as T;
      } catch (error) {
        setError(error);
        if (throw_on_error) throw error;
      }
    },
    [token]
  );

  const request = useCallback(
    async <T = any>(method: string, path: string, data?: any, options?: RequestInit) => {
      return await requestWithFunc<T>((token) => {
        if (options === undefined) {
          options = { headers: { "Content-Type": "application/json" } };
          if (typeof data !== "string") data = JSON.stringify(data);
        }
        return apiFetcher(token ?? "")(path, { ...options, method, body: data });
      });
    },
    [token]
  );

  return { requestWithFunc, request, error };
};
