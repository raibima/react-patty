import {createState} from 'react-patty/sync';
import {useDispatch, useValue} from 'react-patty';

const Counter = createState(0, (prev, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return prev + 1;
    case 'DECREMENT':
      return prev - 1;
    default:
      return prev;
  }
});

if (process.env.NODE_ENV === 'development') {
  Counter.displayName = 'Counter';
}

export const CounterProvider = Counter.Provider;

export function useCounter() {
  const dispatch = useDispatch(Counter);
  return {
    value: useValue(Counter),
    increment: () => dispatch({type: 'INCREMENT'}),
    decrement: () => dispatch({type: 'DECREMENT'}),
  };
}
