import {createContext, Dispatch, Reducer, useReducer} from 'react';
import {State, Provider} from './types';

export function createState<S, A>(
  initialValue: S,
  reducer: Reducer<S, A>
): State<S, A> {
  const valueContext = createContext(initialValue);
  const dispatchContext = createContext<Dispatch<A>>(() => {
    // noop default
    // TODO: warn in DEV
  });
  const _Provider: Provider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialValue);
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
