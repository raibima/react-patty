'use strict';

var React = require('react');

function createAsyncState(initialValue, resolver, reducer) {
    const valueContext = /*#__PURE__*/ React.createContext(initialValue);
    const dispatchContext = /*#__PURE__*/ React.createContext(()=>{
    // noop default
    // TODO: warn in DEV
    });
    const loadStatusContext = /*#__PURE__*/ React.createContext('loading');
    const _reducer = (prev, action)=>{
        const a = action;
        switch(a.type){
            case 'set':
                return a.value;
            default:
                const b = action;
                return reducer(prev, b);
        }
    };
    const _Provider = ({ children  })=>{
        const [state, dispatch] = React.useReducer(_reducer, initialValue);
        const [loadStatus, setLoadStatus] = React.useState('loading');
        React.useEffect(()=>{
            let cancel = false;
            resolver().then((value)=>{
                if (cancel) {
                    return;
                }
                dispatch({
                    type: 'set',
                    value
                });
                setLoadStatus('resolved');
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
    return {
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
}
function useLoadStatus(state) {
    return React.useContext(state.__internal.loadStatusContext);
}

exports.createAsyncState = createAsyncState;
exports.useLoadStatus = useLoadStatus;
