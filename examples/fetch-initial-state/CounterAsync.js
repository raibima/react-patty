import {createAsyncState, useLoadStatus} from 'react-patty/async';
import {useDispatch, useValue} from 'react-patty';
import sleep from './sleep';

const initialState = 0;
const loader = async () => {
  await sleep(1000);
  return 99;
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};
const CounterAsync = createAsyncState(initialState, loader, reducer);

if (process.env.NODE_ENV !== 'production') {
  CounterAsync.displayName = 'CounterAsync';
}

export const CounterProvider = CounterAsync.Provider;

export function useCounter() {
  const dispatch = useDispatch(CounterAsync);
  return {
    value: useValue(CounterAsync),
    increment: () => dispatch({type: 'INCREMENT'}),
    decrement: () => dispatch({type: 'DECREMENT'}),
    loadStatus: useLoadStatus(CounterAsync),
  };
}
