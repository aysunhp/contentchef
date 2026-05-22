import { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import { mediaService } from '../services/api';

const MediaContext = createContext(undefined);

const ACTIONS = {
  SET_MEDIA: 'SET_MEDIA',
  ADD_MEDIA: 'ADD_MEDIA',
};

const initialState = {
  items: [],
};

function mediaReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_MEDIA:
      return { ...state, items: action.payload };
    case ACTIONS.ADD_MEDIA:
      return { ...state, items: [action.payload, ...state.items] };
    default:
      return state;
  }
}

export function MediaProvider({ children }) {
  const [state, dispatch] = useReducer(mediaReducer, initialState);

  const fetchMedia = useCallback(async () => {
    const res = await mediaService.getAll();
    dispatch({ type: ACTIONS.SET_MEDIA, payload: res.data ?? [] });
  }, []);

  const addMedia = useCallback((item) => {
    dispatch({ type: ACTIONS.ADD_MEDIA, payload: item });
  }, []);

  const value = useMemo(
    () => ({
      media: state.items,
      fetchMedia,
      addMedia,
    }),
    [state.items, fetchMedia, addMedia],
  );

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
}

export function useMedia() {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
}
