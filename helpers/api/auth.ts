import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { useCallback } from "react";
import { cache } from "swr";

import { apiPath, useRequest } from ".";
import { useAuth } from "../../components/AuthProvider";
import { UserType } from "./models";

type Provider = "schoology" | "google";

const KEEP_CALLBACK_FIELDS: { [key in Provider]: string[] } = {
  schoology: ["oauth_token"],
  google: ["code", "state"],
};

export const useSignInWithProvider = (provider: Provider, throw_on_error?: boolean) => {
  const { request, error } = useRequest(throw_on_error);
  const { setToken } = useAuth();

  const signInWithProvider = useCallback(async () => {
    const authUrl = apiPath(`/auth/o/${provider}/`);
    authUrl.searchParams.append("redirect_uri", AuthSession.makeRedirectUri({ useProxy: true }));
    const { authorization_url } = await request("GET", authUrl.toString());

    const authRes = await AuthSession.startAsync({ authUrl: authorization_url });
    if (authRes.type !== "success") return console.error(authRes);

    const body = new URLSearchParams();
    for (const field of KEEP_CALLBACK_FIELDS[provider]) {
      body.append(field, authRes.params[field]);
    }

    const { access } = await request("POST", `/auth/o/${provider}/`, body.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    if (access === undefined) return;

    await SecureStore.setItemAsync("token", access);
    setToken(access);
  }, []);

  return { signInWithProvider, error };
};

export const useSignOut = () => {
  const { setToken } = useAuth();
  return useCallback(async () => {
    await SecureStore.deleteItemAsync("token");
    setToken(undefined);
    cache.clear();
  }, []);
};

type GuestRegisterCredentials = {
  email: string;
  password: string;
  re_password: string;
};

export const useRegisterAsGuest = (throw_on_error?: boolean) => {
  const { request, error } = useRequest(throw_on_error);
  const { signInAsGuest, error: error2 } = useSignInAsGuest(throw_on_error);
  const registerAsGuest = useCallback(async (creds: GuestRegisterCredentials) => {
    const resp = await request("POST", "/auth/users/", { ...creds, type: UserType.GUEST });
    if (resp) await signInAsGuest(creds);
  }, []);
  return { registerAsGuest, error: error ?? error2 };
};

type GuestLoginCredentials = {
  email: string;
  password: string;
};

export const useSignInAsGuest = (throw_on_error?: boolean) => {
  const { request, error } = useRequest(throw_on_error);
  const { setToken } = useAuth();
  const signInAsGuest = useCallback(
    async (creds: GuestLoginCredentials) => {
      const resp = await request("POST", "/auth/jwt/create", creds);
      if (resp?.access === undefined) return;
      await SecureStore.setItemAsync("token", resp.access);
      setToken(resp.access);
    },
    [request]
  );
  return { signInAsGuest, error };
};
