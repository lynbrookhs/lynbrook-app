import * as SecureStore from "expo-secure-store";
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Text } from "react-native";

type AuthContextType = {
  token?: string;
  setToken: (token?: string) => void;
};

const AuthContext = createContext<AuthContextType>({
  token: undefined,
  setToken: () => {},
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      let token;
      try {
        token = await SecureStore.getItemAsync("token");
      } catch (e) {
        return;
      }

      if (token === null) token = undefined;

      setToken(token);
      setLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {loading ? <Text>Loading...</Text> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
