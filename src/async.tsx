import {
  Context,
  createContext,
  Dispatch,
  Reducer,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import {State, Provider} from './types';

// @ts-ignore
const DEV = process.env.NODE_ENV === 'development';

type SetAction<T> = {
  type: 'set';
  value: T;
};

interface AsyncState<S, A> extends State<S, A> {
  __internal: State<S, A>['__internal'] & {
    loadStatusContext: Context<Status>;
  };
}

export function createAsyncState<S, A>(
  initialValue: S,
  resolver: () => Promise<S>,
  reducer: Reducer<S, A>
): AsyncState<S, A> {
  const valueContext = createContext(initialValue);
  const dispatchContext = createContext<Dispatch<A>>(() => {
    // noop default
    // TODO: warn in DEV
  });
  const loadStatusContext = createContext<Status>('loading');

  const _reducer = (prev: S, action: A | SetAction<S>): S => {
    const a = action as SetAction<S>;
    switch (a.type) {
      case 'set':
        return a.value;
      default:
        const b = action as A;
        return reducer(prev, b);
    }
  };
  const _Provider: Provider = ({children}) => {
    const [state, dispatch] = useReducer(_reducer, initialValue);
    const [loadStatus, setLoadStatus] = useState<Status>('loading');
    useEffect(() => {
      let cancel = false;
      resolver().then((value) => {
        if (cancel) {
          return;
        }
        dispatch({type: 'set', value});
        setLoadStatus('resolved');
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

  return {
    Provider: _Provider,
    __internal: {
      valueContext,
      dispatchContext,
      loadStatusContext,
    },
    set displayName(name: string) {
      if (DEV) {
        valueContext.displayName = `${name}_Value`;
        dispatchContext.displayName = `${name}_Dispatch`;
        loadStatusContext.displayName = `${name}_LoadStatus`;
      }
    },
  };
}

type Status = 'loading' | 'resolved';

export function useLoadStatus<S, A>(state: AsyncState<S, A>): Status {
  return useContext(state.__internal.loadStatusContext);
}
