import {Context, Dispatch, ReactNode} from 'react';

export interface Provider {
  (props: {children: ReactNode}): JSX.Element | JSX.Element[];
}

export interface State<S, A> {
  Provider: Provider;
  __internal: {
    valueContext: Context<S>;
    dispatchContext: Context<Dispatch<A>>;
  };
  displayName: string;
}
