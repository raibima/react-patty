import { Context, Reducer, Dispatch, ReactNode } from 'react';
interface ResolveEvent<T> {
    type: '$$resolve';
    payload: {
        value: T;
    };
}
interface ErrorEvent {
    type: '$$error';
    payload: {
        error: Error;
    };
}
interface FetcherBase {
    (...args: any[]): Promise<any>;
}
export interface AsyncProvider<F extends FetcherBase> {
    (props: {
        children: ReactNode;
        fetcher?: F;
    }): JSX.Element | JSX.Element[];
}
interface AsyncState<S, A, F extends FetcherBase> {
    Provider: AsyncProvider<F>;
    __internal: {
        valueContext: Context<S>;
        dispatchContext: Context<Dispatch<A>>;
        loadStatusContext: Context<Status>;
        callback?: Callback;
    };
    displayName: string;
}
export declare function createAsyncState<S, A, T, F extends FetcherBase>(initialValue: S, resolver: (fetcher?: F) => Promise<T>, reducer: Reducer<S, A | ResolveEvent<T> | ErrorEvent>, lazyInit?: (initialValue: S) => S): AsyncState<S, A, F>;
declare type Status = 'loading' | 'resolved' | 'rejected';
export declare function useLoadStatus<S, A, F extends FetcherBase>(state: AsyncState<S, A, F>): Status;
interface Callback {
    onLoadError?: (err: Error) => void;
}
export declare function unstable_addListener<S, A, F extends FetcherBase>(state: AsyncState<S, A, F>, callback: Callback): void;
export {};
