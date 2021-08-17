import { useEffect, useState } from "react";

const useTime = (refreshCycle = 1000) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), refreshCycle);
    return () => clearInterval(interval);
  }, [refreshCycle]);

  return time;
};

export default useTime;
