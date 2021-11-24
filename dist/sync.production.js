"use strict";
var e = require("react");
exports.createState = function (t, r) {
  const a = e.createContext(t),
    n = e.createContext(() => {});
  return {
    Provider: ({ children: c }) => {
      const [o, i] = e.useReducer(r, t);
      return e.createElement(
        a.Provider,
        { value: o },
        e.createElement(n.Provider, { value: i }, c)
      );
    },
    __internal: { valueContext: a, dispatchContext: n },
    set displayName(e) {},
  };
};
