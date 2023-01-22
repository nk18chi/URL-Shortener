import { useCallback, useEffect, useState } from "react";

interface useShowMessageProps {
  millisecond: number;
}

export const useShowMessage = ({ millisecond }: useShowMessageProps) => {
  const [isMessage, setIsMessage] = useState(false);

  const showMessage = useCallback(() => {
    setIsMessage(true);
  }, []);

  useEffect(() => {
    if (!isMessage) return;
    const interval = setInterval(() => setIsMessage(false), millisecond);
    return () => clearInterval(interval);
  }, [isMessage, millisecond]);

  return { isMessage, showMessage };
};
