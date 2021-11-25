import * as React from 'react';
import {createContext, useReducer, Reducer, Dispatch} from 'react';
import type {State, Provider} from './types';

function identity<T>(value: T): T {
  return value;
}

export function createState<S, A>(
  initialValue: S,
  reducer: Reducer<S, A>,
  init: (initialValue: S) => S = identity
): State<S, A> {
  const valueContext = createContext(initialValue);
  const dispatchContext = createContext<Dispatch<A>>(() => {
    // noop default
    // TODO: warn in DEV
  });
  const _Provider: Provider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialValue, init);
    return (
      <valueContext.Provider value={state}>
        <dispatchContext.Provider value={dispatch}>
          {children}
        </dispatchContext.Provider>
      </valueContext.Provider>
    );
  };

  return {
    Provider: _Provider,
    __internal: {
      valueContext,
      dispatchContext,
    },
    set displayName(name: string) {
      if (__DEV__) {
        valueContext.displayName = `${name}_Value`;
        dispatchContext.displayName = `${name}_Dispatch`;
      }
    },
  };
}
