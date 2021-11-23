import * as React from 'react';
import { State } from './types';
export declare function createState<S, A>(initialValue: S, reducer: React.Reducer<S, A>): State<S, A>;
