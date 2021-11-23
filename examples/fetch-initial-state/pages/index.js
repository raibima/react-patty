import {CounterProvider, useCounter} from '../CounterAsync';

export default function FetchInitialState() {
  return (
    <CounterProvider>
      <h1 style={{ marginBottom: 0 }}>Fetch Initial State</h1>
      <em>(Refresh the page to see the initial loading)</em>
      <CounterApp />
    </CounterProvider>
  );
}

function CounterApp() {
  const {value, increment, decrement, loadStatus} = useCounter();
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 16}}>
      <button onClick={decrement}>{'-'}</button>
      <span>{loadStatus === 'loading' ? '...' : value}</span>
      <button onClick={increment}>{'+'}</button>
    </div>
  );
}
