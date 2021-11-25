import { Context, Reducer } from 'react';
import type { State } from './types';
interface AsyncState<S, A> extends State<S, A> {
    __internal: State<S, A>['__internal'] & {
        loadStatusContext: Context<Status>;
    };
}
export declare function createAsyncState<S, A>(initialValue: S, resolver: () => Promise<S>, reducer: Reducer<S, A>): AsyncState<S, A>;
declare type Status = 'loading' | 'resolved';
export declare function useLoadStatus<S, A>(state: AsyncState<S, A>): Status;
export {};
