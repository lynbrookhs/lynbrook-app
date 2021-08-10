import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Text } from "react-native";
import { useRequest } from "../helpers/api";
import { apiPath } from "../helpers/utils";

const AuthLoading = () => <Text>Loading...</Text>;

type AuthState = {
  isLoading: boolean;
  isSignout: boolean;
  token?: string;
};

type AuthContextType = {
  registerAsGuest: (creds: GuestRegisterCredentials) => void;
  signInWithSchoology: () => void;
  signInAsGuest: (creds: GuestLoginCredentials) => void;
  signOut: () => void;
  state: AuthState;
};

type GuestRegisterCredentials = {
  email: string;
  password: string;
  re_password: string;
};

type GuestLoginCredentials = {
  email: string;
  password: string;
};

const AuthContext = createContext<AuthContextType>({
  registerAsGuest: () => {},
  signInWithSchoology: () => {},
  signInAsGuest: () => {},
  signOut: () => {},
  state: {
    isLoading: true,
    isSignout: false,
    token: undefined,
  },
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const request = useRequest();

  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isSignout: false,
    token: undefined,
  });

  // Try to restore token from SecureStore
  useEffect(() => {
    (async () => {
      let token;
      try {
        token = await SecureStore.getItemAsync("token");
      } catch (e) {
        return;
      }

      if (token === null) token = undefined;

      // TODO: Validate token

      setState({ isLoading: false, isSignout: false, token });
    })();
  }, []);

  const signInWithSchoology = useCallback(async () => {
    // Get authorization url
    const auth_url = apiPath("/auth/o/schoology/");
    auth_url.searchParams.append("redirect_uri", AuthSession.makeRedirectUri({ useProxy: true }));
    const resp = await fetch(auth_url.toString());
    const { authorization_url } = await resp.json();

    // Authorize
    const auth_res = await AuthSession.startAsync({ authUrl: authorization_url });
    if (auth_res.type !== "success") {
      console.error(auth_res);
      return;
    }

    // Get JWT token
    const login_url = apiPath("/auth/o/schoology/");
    const login_res = await fetch(login_url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ oauth_token: auth_res.params.oauth_token }).toString(),
    });
    const { access } = await login_res.json();
    if (access === undefined) return;

    // Set new state
    await SecureStore.setItemAsync("token", access);
    setState({ isLoading: false, isSignout: false, token: access });
  }, []);

  const registerAsGuest = useCallback(async (creds: GuestRegisterCredentials) => {
    await request("POST", "/auth/users/", creds);
    await signInAsGuest(creds);
  }, []);

  const signInAsGuest = useCallback(
    async (creds: GuestLoginCredentials) => {
      const { access } = await request("POST", "/auth/jwt/create", creds);
      if (access === undefined) return;
      await SecureStore.setItemAsync("token", access);
      setState({ isLoading: false, isSignout: false, token: access });
    },
    [request]
  );

  const signOut = useCallback(async () => {
    await SecureStore.deleteItemAsync("token");
    setState({ isLoading: false, isSignout: true, token: undefined });
  }, []);

  const value = {
    registerAsGuest,
    signInWithSchoology,
    signInAsGuest,
    signOut,
    state,
  };

  return (
    <AuthContext.Provider value={value}>
      {state.isLoading ? <AuthLoading /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
