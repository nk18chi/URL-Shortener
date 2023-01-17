import { useCallback, useEffect, useReducer } from "react";
import { ActionTypes, urlReducer } from "../reducer/urlReducer";

interface useShortenUrlApiProps {
  url: string;
}

export const useShortenUrlApi = ({ url }: useShortenUrlApiProps) => {
  const [{ shortUrl, message, loading }, dispatch] = useReducer(urlReducer, { loading: false, url: "", shortUrl: "", message: "" });
  const handleClick = useCallback(async () => {
    dispatch({ type: ActionTypes.apiCall });
    if (!url) dispatch({ type: ActionTypes.setMessage, payload: { message: "Please set a URL" } });
    const res = await fetch("http://localhost:4000/shorten-url", {
      method: "POST",
      body: JSON.stringify({ longUrl: url }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      dispatch({ type: ActionTypes.setMessage, payload: { message: await res.text() } });
      return;
    }
    const { shortUrl } = (await res.json()) || {};
    if (!shortUrl) {
      dispatch({ type: ActionTypes.setMessage, payload: { message: "something went wrong." } });
      return;
    }
    dispatch({ type: ActionTypes.setShortenUrl, payload: { shortUrl } });
  }, [url]);

  useEffect(() => {
    dispatch({ type: ActionTypes.setUrl, payload: { url } });
  }, [url]);
  return { shortUrl, message, loading, handleClick };
};
