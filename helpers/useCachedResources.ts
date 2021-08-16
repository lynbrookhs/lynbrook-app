import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

const useCachedResources = () => {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    try {
      SplashScreen.preventAutoHideAsync();
    } finally {
      setLoadingComplete(true);
      SplashScreen.hideAsync();
    }
  }, []);

  return isLoadingComplete;
};

export default useCachedResources;
