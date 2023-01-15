import { useReducer } from "react";
import "./App.css";

type State = {
  loading?: boolean;
  url?: string;
  shortUrl?: string;
  message?: string;
};

enum ActionTypes {
  setMessage,
  setShortenUrl,
  setUrl,
  apiCall,
  loading,
}

type Action = {
  type: ActionTypes;
  payload?: State;
};

const urlReducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionTypes.setMessage:
      return { ...state, loading: false, shortUrl: "", message: action.payload?.message };
    case ActionTypes.setShortenUrl:
      return { ...state, loading: false, shortUrl: action.payload?.shortUrl, message: "" };
    case ActionTypes.setUrl:
      return { ...state, loading: false, url: action.payload?.url, shortUrl: "", message: "" };
    case ActionTypes.apiCall:
      return { ...state, loading: true, shortUrl: "", message: "" };
    default:
      throw new Error("invalid action type in urlReducer");
  }
};

const App = () => {
  const [{ url, shortUrl, message, loading }, dispatch] = useReducer(urlReducer, { loading: false, url: "", shortUrl: "", message: "" });
  const handleClick = () => {
    (async () => {
      dispatch({ type: ActionTypes.apiCall });
      if (!url) dispatch({ type: ActionTypes.setMessage, payload: { message: "Please set a URL" } });
      const res = await fetch("http://localhost:4000/shorten-url", {
        method: "POST",
        body: JSON.stringify({ url }),
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
    })();
  };
  return (
    <div className='App'>
      <input
        type='text'
        onChange={(e) => {
          dispatch({ type: ActionTypes.setUrl, payload: { url: e.target.value } });
        }}
      />
      {loading ? (
        <p>loading</p>
      ) : (
        <>
          <button onClick={handleClick}>Shorten</button>
          {shortUrl && (
            <p>
              shortUrl:{" "}
              <a href={shortUrl} target='_blank' rel='noreferrer'>
                {shortUrl}
              </a>
            </p>
          )}
          {message && <p>message: {message}</p>}
        </>
      )}
    </div>
  );
};

export default App;
