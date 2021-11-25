'use strict';

var React = require('react');

function identity(value) {
    return value;
}
function createAsyncState(initialValue, resolver, reducer, lazyInit = identity) {
    const valueContext = /*#__PURE__*/ React.createContext(initialValue);
    const dispatchContext = /*#__PURE__*/ React.createContext(()=>{
    // noop default
    // TODO: warn in DEV
    });
    const loadStatusContext = /*#__PURE__*/ React.createContext('loading');
    const _Provider = ({ children  })=>{
        const [state, dispatch] = React.useReducer(reducer, initialValue, lazyInit);
        const [loadStatus, setLoadStatus] = React.useState('loading');
        React.useEffect(()=>{
            let cancel = false;
            let resolverWithRetry = withRetry(resolver);
            resolverWithRetry().then((value)=>{
                if (cancel) {
                    return;
                }
                dispatch({
                    type: '$$resolve',
                    payload: {
                        value
                    }
                });
                setLoadStatus('resolved');
            }).catch((err)=>{
                if (cancel) {
                    return;
                }
                const error = err;
                dispatch({
                    type: '$$error',
                    payload: {
                        error
                    }
                });
                setLoadStatus('rejected');
                const callback = State.__internal.callback;
                if (typeof callback === 'object' && typeof callback.onLoadError === 'function') {
                    callback.onLoadError(error);
                }
            });
            return ()=>{
                cancel = true;
            };
        }, []);
        return(/*#__PURE__*/ React.createElement(valueContext.Provider, {
            value: state
        }, /*#__PURE__*/ React.createElement(dispatchContext.Provider, {
            value: dispatch
        }, /*#__PURE__*/ React.createElement(loadStatusContext.Provider, {
            value: loadStatus
        }, children))));
    };
    const State = {
        Provider: _Provider,
        __internal: {
            valueContext,
            dispatchContext,
            loadStatusContext
        },
        set displayName (name){
            {
                valueContext.displayName = `${name}_Value`;
                dispatchContext.displayName = `${name}_Dispatch`;
                loadStatusContext.displayName = `${name}_LoadStatus`;
            }
        }
    };
    return State;
}
function useLoadStatus(state) {
    return React.useContext(state.__internal.loadStatusContext);
}
const sleepMs = (ms)=>new Promise((resolve)=>setTimeout(resolve, ms)
    )
;
function withRetry(fn, maxRetries = 5) {
    return async (...args)=>{
        let run = ()=>fn(...args)
        ;
        let retries = 0;
        let error = null;
        while(true){
            try {
                const value = await run();
                return value;
            } catch (err) {
                if (retries >= maxRetries) {
                    error = err;
                    break;
                }
                await sleepMs(1000 << retries++);
            }
        }
        throw error;
    };
}
function unstable_addListener(state, callback) {
    {
        const cb = state.__internal.callback;
        if (cb) {
            throw new Error('unstable_addListener: Adding listener more than once is disallowed.');
        }
    }
    state.__internal.callback = callback;
}

exports.createAsyncState = createAsyncState;
exports.unstable_addListener = unstable_addListener;
exports.useLoadStatus = useLoadStatus;
