import { Dispatch } from 'react';
import { State } from './types';
export declare function useValue<S, A>(state: State<S, A>): S;
export declare function useDispatch<S, A>(state: State<S, A>): Dispatch<A>;
