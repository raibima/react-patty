import {CounterProvider, useCounter} from '../Counter';

export default function Counter() {
  return (
    <CounterProvider>
      <h1>Counter</h1>
      <CounterApp />
    </CounterProvider>
  );
}

function CounterApp() {
  const {value, increment, decrement} = useCounter();
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
      <button onClick={decrement}>{'-'}</button>
      <span>{value}</span>
      <button onClick={increment}>{'+'}</button>
    </div>
  );
}
