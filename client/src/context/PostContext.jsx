import { createContext, useContext, useReducer, useMemo } from 'react';

const PostContext = createContext(undefined);

const ACTIONS = {
  SET_POSTS: 'SET_POSTS',
  ADD_POSTS: 'ADD_POSTS',
  UPDATE_POST: 'UPDATE_POST',
  DELETE_POST: 'DELETE_POST',
  SELECT_POST: 'SELECT_POST',
  SET_LOADING: 'SET_LOADING',
};

const initialState = {
  posts: [],
  selectedPost: null,
  isLoading: false,
};

function postReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_POSTS:
      return { ...state, posts: action.payload, isLoading: false };
    case ACTIONS.ADD_POSTS:
      return { ...state, posts: [...state.posts, ...action.payload], isLoading: false };
    case ACTIONS.UPDATE_POST:
      return {
        ...state,
        posts: state.posts.map((p) => (p.id === action.payload.id ? action.payload : p)),
        selectedPost:
          state.selectedPost?.id === action.payload.id ? action.payload : state.selectedPost,
      };
    case ACTIONS.DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((p) => p.id !== action.payload),
        selectedPost: state.selectedPost?.id === action.payload ? null : state.selectedPost,
      };
    case ACTIONS.SELECT_POST:
      return { ...state, selectedPost: action.payload };
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function PostProvider({ children }) {
  const [state, dispatch] = useReducer(postReducer, initialState);

  const actions = useMemo(
    () => ({
      setPosts: (posts) => dispatch({ type: ACTIONS.SET_POSTS, payload: posts }),
      addPosts: (posts) => dispatch({ type: ACTIONS.ADD_POSTS, payload: posts }),
      updatePost: (post) => dispatch({ type: ACTIONS.UPDATE_POST, payload: post }),
      deletePost: (id) => dispatch({ type: ACTIONS.DELETE_POST, payload: id }),
      selectPost: (post) => {
        console.log('[PostContext] selectPost called with:', post);
        dispatch({ type: ACTIONS.SELECT_POST, payload: post });
      },
      setLoading: (val) => dispatch({ type: ACTIONS.SET_LOADING, payload: val }),
    }),
    [],
  );

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions]);

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

export function usePosts() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
}
