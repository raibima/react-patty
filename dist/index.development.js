'use strict';

var react = require('react');

function useValue(state) {
    return react.useContext(state.__internal.valueContext);
}
function useDispatch(state) {
    return react.useContext(state.__internal.dispatchContext);
}

exports.useDispatch = useDispatch;
exports.useValue = useValue;
