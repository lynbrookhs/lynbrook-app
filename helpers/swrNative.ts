import NetInfo from "@react-native-community/netinfo";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import useSWR, { ConfigInterface, keyInterface, responseInterface } from "swr";

type Props<Data, Error> = {
  revalidate: responseInterface<Data | null, Error>["revalidate"];
} & Pick<ConfigInterface, "revalidateOnFocus" | "revalidateOnReconnect" | "focusThrottleInterval">;

// Local replacement for swr-react-native, whose AppState.removeEventListener
// cleanup no longer exists in React Native 0.81+.
export function useSWRNativeRevalidate<Data = any, Error = any>(props: Props<Data, Error>) {
  const {
    revalidate,
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
    focusThrottleInterval = 5000,
  } = props;

  const revalidateRef = useRef(revalidate);
  revalidateRef.current = revalidate;
  const lastFocus = useRef(0);

  useEffect(() => {
    if (!revalidateOnFocus) return;
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") return;
      const now = Date.now();
      if (now - lastFocus.current < focusThrottleInterval) return;
      lastFocus.current = now;
      revalidateRef.current?.();
    });
    return () => sub.remove();
  }, [revalidateOnFocus, focusThrottleInterval]);

  useEffect(() => {
    if (!revalidateOnReconnect) return;
    let wasConnected = true;
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && !wasConnected) revalidateRef.current?.();
      wasConnected = !!state.isConnected;
    });
    return unsubscribe;
  }, [revalidateOnReconnect]);
}

export default function useSWRNative<Data = any, Error = any>(
  key: keyInterface,
  fn: ((...args: any) => Data | Promise<Data>) | null,
  config?: ConfigInterface<Data, Error>
): responseInterface<Data, Error> {
  const response = useSWR(key, fn, config);
  useSWRNativeRevalidate({
    revalidate: response.revalidate,
    revalidateOnFocus: config?.revalidateOnFocus,
    revalidateOnReconnect: config?.revalidateOnReconnect,
    focusThrottleInterval: config?.focusThrottleInterval,
  });
  return response;
}
