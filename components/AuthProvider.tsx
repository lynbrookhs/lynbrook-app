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

export const useAuthState = () => useContext(AuthContext);

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

      setState({ ...state, isLoading: false, token });
    })();
  }, []);

  const signIn = useCallback(() => {
    // Sign in
  }, []);

  const signOut = useCallback(() => {
    setState({ ...state, isSignout: true, token: undefined });
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, signOut, state }}>
      {state.isLoading ? <AuthLoading /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
