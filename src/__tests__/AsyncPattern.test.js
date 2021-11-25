import {isValidElement} from 'react';
import {createAsyncState, useLoadStatus, unstable_addListener} from '../async';
import {useValue} from '../index';
import {render, screen, act} from '@testing-library/react';

function setupCounter({alwaysReject = false, init} = {}) {
  let resolve;
  const Counter = createAsyncState(
    0,
    () =>
      new Promise((_resolve, reject) => {
        resolve = _resolve;
        if (alwaysReject) {
          reject(new Error('hi'));
        }
      }),
    (state, action) => {
      switch (action.type) {
        case '$$resolve':
          return action.payload.value;
        case 'INCREMENT':
          return state + 1;
        case 'DECREMENT':
          return state - 1;
        default:
          return state;
      }
    },
    init
  );
  return {
    Counter,
    getResolver: () => resolve,
  };
}

afterEach(() => {
  jest.useRealTimers();
});

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

test('Error retries + onLoadError callback', async () => {
  jest.useFakeTimers();

  const {Counter} = setupCounter({alwaysReject: true});
  let error = null;
  unstable_addListener(Counter, {
    onLoadError(err) {
      error = err;
    },
  });

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

  let i = 0;
  let el;
  while (true) {
    i++;
    await act(async () => {
      jest.runAllTimers();
    });
    el = screen.queryByText('rejected');
    const INFINITE_LOOP_GUARD = i > 50;
    if (el || INFINITE_LOOP_GUARD) {
      break;
    }
    expect(el).toBeNull();
  }

  // give up
  expect(el).toBeInstanceOf(HTMLElement); // "rejected" is displayed on screen
  expect(i).toBe(6); // first attempt + 5x retries = 6 attempts
  expect(error).toBeInstanceOf(Error); // our callback is called
});

test('Cannot attach listener more than once', () => {
  globalThis.__DEV__ = true;
  const {Counter} = setupCounter();
  unstable_addListener(Counter, {});
  expect(() => unstable_addListener(Counter, {})).toThrow();
});

test('Lazy init', () => {
  // the setupCounter function initializes the counter to 0.
  // but with the following initializer, the resulting initial
  // value should be 1 instead of 0.
  const {Counter} = setupCounter({init: (x) => x + 1});
  function CounterApp() {
    const value = useValue(Counter);
    return <div>{value}</div>;
  }
  render(
    <Counter.Provider>
      <CounterApp />
    </Counter.Provider>
  );
  expect(screen.getByText('1')).toBeInstanceOf(HTMLElement);
});

test('Fetcher injection', async () => {
  let resolve;
  const Dummy = createAsyncState(
    0,
    (fetcher) => fetcher(123),
    (_, a) => a.payload.value
  );
  function DummyApp() {
    const value = useValue(Dummy);
    return <div>{value}</div>;
  }
  render(
    <Dummy.Provider
      fetcher={(val) =>
        new Promise((_resolve) => {
          resolve = () => _resolve(val);
        })
      }
    >
      <DummyApp />
    </Dummy.Provider>
  );
  expect(screen.getByText('0')).toBeInstanceOf(HTMLElement);
  await act(async () => {
    resolve();
  });
  expect(screen.getByText('123')).toBeInstanceOf(HTMLElement);
});
