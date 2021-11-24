# React Patty

A tiny React state abstraction based on common patterns found in React applications.

Guiding principles:

- Vanilla React: States should live in React's useState / useReducer. No external stores allowed.
- No bad patterns: No skipping useEffect / useCallback / useMemo dependencies.
- DevX focused: Simple + typed APIs, devtools integration.

‼️ Forward compatibility with future React features is the top priority.

## Preview

**Counter**

```jsx
import {createState} from 'react-patty/sync';

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

reactRoot.render(
  <Counter.Provider>
    <App />
  </Counter.Provider>
);

import {useValue, useDispatch} from 'react-patty';

function useCounter() {
  const dispatch = useDispatch(Counter);
  return {
    value: useValue(Counter),
    increment: () => dispatch({type: 'INCREMENT'}),
    decrement: () => dispatch({type: 'DECREMENT'}),
  };
}
```
