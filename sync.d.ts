import { Reducer } from 'react';
import type { State } from './types';
export declare function createState<S, A>(initialValue: S, reducer: Reducer<S, A>, init?: (initialValue: S) => S): State<S, A>;
