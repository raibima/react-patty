import {Dispatch, useContext} from 'react';
import {State} from './types';

export function useValue<S, A>(state: State<S, A>): S {
  return useContext(state.__internal.valueContext);
}

export function useDispatch<S, A>(state: State<S, A>): Dispatch<A> {
  return useContext(state.__internal.dispatchContext);
}
