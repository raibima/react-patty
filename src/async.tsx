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
  ReactNode,
} from 'react';

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

interface FetcherBase {
  (...args: any[]): Promise<any>;
}

export interface AsyncProvider<F extends FetcherBase> {
  (props: {children: ReactNode; fetcher?: F}): JSX.Element | JSX.Element[];
}

interface AsyncState<S, A, F extends FetcherBase> {
  Provider: AsyncProvider<F>;
  __internal: {
    valueContext: Context<S>;
    dispatchContext: Context<Dispatch<A>>;
    loadStatusContext: Context<Status>;
    callback?: Callback;
  };
  displayName: string;
}

function identity<T>(value: T): T {
  return value;
}

export function createAsyncState<S, A, F extends FetcherBase>(
  initialValue: S,
  resolver: (fetcher?: F) => Promise<S>,
  reducer: Reducer<S, A | ResolveEvent<S> | ErrorEvent>,
  lazyInit: (initialValue: S) => S = identity
): AsyncState<S, A, F> {
  const valueContext = createContext(initialValue);
  const dispatchContext = createContext<Dispatch<A>>(() => {
    // noop default
    // TODO: warn in DEV
  });
  const loadStatusContext = createContext<Status>('loading');
  const _Provider: AsyncProvider<F> = ({children, fetcher}) => {
    const [state, dispatch] = useReducer(reducer, initialValue, lazyInit);
    const [loadStatus, setLoadStatus] = useState<Status>('loading');
    useEffect(() => {
      let cancel = false;
      let resolverWithRetry = withRetry(resolver);
      resolverWithRetry(fetcher)
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
    }, [fetcher]);
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

  const State: AsyncState<S, A, F> = {
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

export function useLoadStatus<S, A, F extends FetcherBase>(
  state: AsyncState<S, A, F>
): Status {
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

export function unstable_addListener<S, A, F extends FetcherBase>(
  state: AsyncState<S, A, F>,
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
