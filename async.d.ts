import { Context, Reducer } from 'react';
import type { State } from './types';
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
interface AsyncState<S, A> extends State<S, A> {
    __internal: State<S, A>['__internal'] & {
        loadStatusContext: Context<Status>;
        callback?: Callback;
    };
}
export declare function createAsyncState<S, A>(initialValue: S, resolver: () => Promise<S>, reducer: Reducer<S, A | ResolveEvent<S> | ErrorEvent>, lazyInit?: (initialValue: S) => S): AsyncState<S, A>;
declare type Status = 'loading' | 'resolved' | 'rejected';
export declare function useLoadStatus<S, A>(state: AsyncState<S, A>): Status;
interface Callback {
    onLoadError?: (err: Error) => void;
}
export declare function unstable_addListener<S, A>(state: AsyncState<S, A>, callback: Callback): void;
export {};
