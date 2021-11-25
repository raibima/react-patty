import {isValidElement} from 'react';
import {createState} from '../sync';
import {useDispatch, useValue} from '../index';
import {render, screen, act} from '@testing-library/react';

const Counter = createState(0, (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
});

test('Provider is a React element', () => {
  const provider = <Counter.Provider />;
  expect(isValidElement(provider)).toBe(true);
});

test('useValue returns the latest value + useDispatch can be used to update the value', () => {
  let dispatch;
  function CounterApp() {
    const count = useValue(Counter);
    dispatch = useDispatch(Counter);
    return count;
  }
  render(
    <Counter.Provider>
      <CounterApp />
    </Counter.Provider>
  );
  const el = screen.getByText('0');
  expect(el).toBeInstanceOf(HTMLElement);

  act(() => {
    dispatch({type: 'INCREMENT'});
  });

  const el = screen.getByText('1');
  expect(el).toBeInstanceOf(HTMLElement);
});

test('Lazy init', () => {
  // this should initializes to 1 instead of 0
  const Dummy = createState(
    0,
    (x) => x, // reducer
    (x) => x + 1 // initializer
  );
  function DummyApp() {
    const value = useValue(Dummy);
    return value;
  }
  render(
    <Dummy.Provider>
      <DummyApp />
    </Dummy.Provider>
  );
  const el = screen.getByText('1');
  expect(el).toBeInstanceOf(HTMLElement);
});
