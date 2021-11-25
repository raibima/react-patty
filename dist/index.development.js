'use strict';

var react = require('react');

function useValue(state) {
    const value = react.useContext(state.__internal.valueContext);
    {
        // Pretty print the value in devtools.
        //
        // if displayName property is set, use it as the label.
        //    e.g., 'Counter: {value}'
        //
        // otherwise, just display the value without any label.
        //    e.g., '{value}'
        //
        let debugValue = value + '';
        let displayName = state.displayName;
        if (typeof displayName === 'string') {
            debugValue = `${displayName}: ${debugValue}`;
        }
        // this is permissible because true is always static.
        // eslint-disable-next-line react-hooks/rules-of-hooks
        react.useDebugValue(debugValue);
    }
    return value;
}
function useDispatch(state) {
    return react.useContext(state.__internal.dispatchContext);
}

exports.useDispatch = useDispatch;
exports.useValue = useValue;
