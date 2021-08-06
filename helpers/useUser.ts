import useSWRNative from "swr-react-native";
import { apiFetcher } from "./api";

const useUser = () => {
  const { data, mutate, error } = useSWRNative("/auth/users/me", apiFetcher);

  const loading = !data && !error;
  const loggedOut = error && error.status === 401;

  return {
    loading,
    loggedOut,
    user: data,
    mutate,
  };
};

export default useUser;
