import * as React from 'react';
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  Context,
  Reducer,
  Dispatch,
} from 'react';
import type {State, Provider} from './types';

interface ResolveEvent<T> {
  type: '$$resolve';
  payload: {
    value: T;
  };
}

interface ErrorEvent {
  type: '$$error';
  payload: {
    error: Error;
  };
}

interface AsyncState<S, A> extends State<S, A> {
  __internal: State<S, A>['__internal'] & {
    loadStatusContext: Context<Status>;
    callback?: Callback;
  };
}

function identity<T>(value: T): T {
  return value;
}

export function createAsyncState<S, A>(
  initialValue: S,
  resolver: () => Promise<S>,
  reducer: Reducer<S, A | ResolveEvent<S> | ErrorEvent>,
  lazyInit: (initialValue: S) => S = identity
): AsyncState<S, A> {
  const valueContext = createContext(initialValue);
  const dispatchContext = createContext<Dispatch<A>>(() => {
    // noop default
    // TODO: warn in DEV
  });
  const loadStatusContext = createContext<Status>('loading');
  const _Provider: Provider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialValue, lazyInit);
    const [loadStatus, setLoadStatus] = useState<Status>('loading');
    useEffect(() => {
      let cancel = false;
      let resolverWithRetry = withRetry(resolver);
      resolverWithRetry()
        .then((value) => {
          if (cancel) {
            return;
          }
          dispatch({type: '$$resolve', payload: {value}});
          setLoadStatus('resolved');
        })
        .catch((err) => {
          if (cancel) {
            return;
          }
          const error = err as Error;
          dispatch({type: '$$error', payload: {error}});
          setLoadStatus('rejected');

          const callback = State.__internal.callback;
          if (
            typeof callback === 'object' &&
            typeof callback.onLoadError === 'function'
          ) {
            callback.onLoadError(error);
          }
        });
      return () => {
        cancel = true;
      };
    }, []);
    return (
      <valueContext.Provider value={state}>
        <dispatchContext.Provider value={dispatch}>
          <loadStatusContext.Provider value={loadStatus}>
            {children}
          </loadStatusContext.Provider>
        </dispatchContext.Provider>
      </valueContext.Provider>
    );
  };

  const State: AsyncState<S, A> = {
    Provider: _Provider,
    __internal: {
      valueContext,
      dispatchContext,
      loadStatusContext,
    },
    set displayName(name: string) {
      if (__DEV__) {
        valueContext.displayName = `${name}_Value`;
        dispatchContext.displayName = `${name}_Dispatch`;
        loadStatusContext.displayName = `${name}_LoadStatus`;
      }
    },
  };

  return State;
}

type Status = 'loading' | 'resolved' | 'rejected';

export function useLoadStatus<S, A>(state: AsyncState<S, A>): Status {
  return useContext(state.__internal.loadStatusContext);
}

const sleepMs = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

type PromiseType<T> = T extends Promise<infer V> ? V : never;

function withRetry<FnType extends (...args: any[]) => Promise<any>>(
  fn: FnType,
  maxRetries = 5
) {
  return async (
    ...args: Parameters<FnType>
  ): Promise<PromiseType<ReturnType<FnType>>> => {
    let run = () => fn(...args);
    let retries = 0;
    let error: Error | null = null;
    while (true) {
      try {
        const value = await run();
        return value;
      } catch (err) {
        if (retries >= maxRetries) {
          error = err as Error;
          break;
        }
        await sleepMs(1000 << retries++);
      }
    }
    throw error;
  };
}

interface Callback {
  onLoadError?: (err: Error) => void;
}

export function unstable_addListener<S, A>(
  state: AsyncState<S, A>,
  callback: Callback
) {
  if (__DEV__) {
    const cb = state.__internal.callback;
    if (cb) {
      throw new Error(
        'unstable_addListener: Adding listener more than once is disallowed.'
      );
    }
  }
  state.__internal.callback = callback;
}
