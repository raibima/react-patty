'use strict';

var React = require('react');

function identity(value) {
    return value;
}
function createState(initialValue, reducer, init = identity) {
    const valueContext = /*#__PURE__*/ React.createContext(initialValue);
    const dispatchContext = /*#__PURE__*/ React.createContext(()=>{
    // noop default
    // TODO: warn in DEV
    });
    const _Provider = ({ children  })=>{
        const [state, dispatch] = React.useReducer(reducer, initialValue, init);
        return(/*#__PURE__*/ React.createElement(valueContext.Provider, {
            value: state
        }, /*#__PURE__*/ React.createElement(dispatchContext.Provider, {
            value: dispatch
        }, children)));
    };
    return {
        Provider: _Provider,
        __internal: {
            valueContext,
            dispatchContext
        },
        set displayName (name){
            {
                valueContext.displayName = `${name}_Value`;
                dispatchContext.displayName = `${name}_Dispatch`;
            }
        }
    };
}

exports.createState = createState;
