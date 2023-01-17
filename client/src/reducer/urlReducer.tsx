type State = {
  loading?: boolean;
  url?: string;
  shortUrl?: string;
  message?: string;
};

type Action = {
  type: ActionTypes;
  payload?: State;
};

export enum ActionTypes {
  setMessage,
  setShortenUrl,
  setUrl,
  apiCall,
  loading,
}

export const urlReducer = (state: State, action: Action) => {
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
