"use strict";
var t = require("react");
(exports.useDispatch = function (e) {
  return t.useContext(e.__internal.dispatchContext);
}),
  (exports.useValue = function (e) {
    return t.useContext(e.__internal.valueContext);
  });
