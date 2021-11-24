import {isValidElement} from 'react';
import {createAsyncState, useLoadStatus} from '../async';
import {useValue} from '../index';
import {render, screen, act} from '@testing-library/react';

function setupCounter() {
  let resolve;
  const Counter = createAsyncState(
    0,
    () =>
      new Promise((_resolve) => {
        resolve = _resolve;
      }),
    (state, action) => {
      switch (action.type) {
        case 'INCREMENT':
          return state + 1;
        case 'DECREMENT':
          return state - 1;
        default:
          return state;
      }
    }
  );
  return {
    Counter,
    getResolver: () => resolve,
  };
}

test('Provider is a React element', () => {
  const {Counter} = setupCounter();

  const provider = <Counter.Provider />;
  expect(isValidElement(provider)).toBe(true);
});

test('The resolved promise value replaces the initial value', async () => {
  const {Counter, getResolver} = setupCounter();

  function CounterApp() {
    const count = useValue(Counter);
    return <div>{count}</div>;
  }
  render(
    <Counter.Provider>
      <CounterApp />
    </Counter.Provider>
  );

  // initially, the value should be 0
  // then after the promise resolves, the value should be 99
  expect(screen.getByText('0')).toBeInstanceOf(HTMLElement);

  // resolve the promise
  await act(async () => {
    const resolve = getResolver();
    resolve(99);
  });

  // the value should be 99 now
  expect(screen.getByText('99')).toBeInstanceOf(HTMLElement);
});

test('Loading state is observable via useLoadStatus', async () => {
  const {Counter, getResolver} = setupCounter();

  function CounterApp() {
    const status = useLoadStatus(Counter);
    return <div>{status}</div>;
  }
  render(
    <Counter.Provider>
      <CounterApp />
    </Counter.Provider>
  );

  // initially, the status should be "loading"
  // then after the promise resolves, the status should be "resolved"
  expect(screen.getByText('loading')).toBeInstanceOf(HTMLElement);

  // resolve the promise
  await act(async () => {
    const resolve = getResolver();
    resolve(99);
  });

  // the status should be "resolved" now
  expect(screen.getByText('resolved')).toBeInstanceOf(HTMLElement);
});
