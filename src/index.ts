import {Dispatch, useContext, useDebugValue} from 'react';
import {State} from './types';

export function useValue<S, A>(state: State<S, A>): S {
  const value = useContext(state.__internal.valueContext);
  if (__DEV__) {
    // Pretty print the value in devtools.
    //
    // if displayName property is set, use it as the label.
    //    e.g., 'Counter: {value}'
    //
    // otherwise, just display the value without any label.
    //    e.g., '{value}'
    //
    let debugValue = value + '';
    let displayName = state.displayName;
    if (typeof displayName === 'string') {
      debugValue = `${displayName}: ${debugValue}`;
    }
    // this is permissible because __DEV__ is always static.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDebugValue(debugValue);
  }
  return value;
}

export function useDispatch<S, A>(state: State<S, A>): Dispatch<A> {
  return useContext(state.__internal.dispatchContext);
}
