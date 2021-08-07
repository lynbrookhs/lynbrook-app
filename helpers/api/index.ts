import { useEffect } from "react";
import { useSWRInfinite } from "swr";
import useSWRNative, { useSWRNativeRevalidate } from "swr-react-native";
import { useAuth } from "../../components/AuthProvider";
import { apiPath } from "../utils";
import { APIDate, NestedSchedule, Organization, Post, Prize, Schedule, User } from "./models";

export type Error = {
  url: string;
  status: number;
};

type PaginatedResponse<T> = {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
};

export const apiFetcher = (token: string) => async (url: string) => {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

  if (!res.ok) {
    const error = await res.json();
    error.status = res.status;
    error.url = url;
    throw error;
  }

  return await res.json();
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

export const useUser = () => useAPIRequest<User>("/auth/users/me/");
export const useOrgs = () => useAPIRequest<Organization[]>("/orgs/");
export const useEvents = () => useAPIRequest<Event[]>("/events/");
export const usePrizes = () => useAPIRequest<Prize[]>("/prizes/");

export const usePosts = () => useAPIRequestPaginated<Post>("/posts/");
export const usePost = (id: number) => useAPIRequest<Post>(`/posts/${id}/`);

export const useSchedules = () => useAPIRequest<Schedule[]>("/schedules/");

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

export const useCurrentSchedule = () => useAPIRequest<CurrentSchedule>("/schedules/current/");
