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
import { apiPath } from "../helpers/utils";

const AuthLoading = () => <Text>Loading...</Text>;

type AuthState = {
  isLoading: boolean;
  isSignout: boolean;
  token?: string;
};

type AuthContextType = {
  signIn: () => void;
  signOut: () => void;
  state: AuthState;
};

const AuthContext = createContext<AuthContextType>({
  signIn: () => {},
  signOut: () => {},
  state: {
    isLoading: true,
    isSignout: false,
    token: undefined,
  },
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
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

  const signIn = useCallback(async () => {
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

  const signOut = useCallback(() => {
    setState({ isLoading: false, isSignout: true, token: undefined });
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, signOut, state }}>
      {state.isLoading ? <AuthLoading /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
