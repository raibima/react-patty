"use strict";
var e = require("react");
function t(e) {
  return e;
}
exports.createState = function (r, n, a = t) {
  const c = e.createContext(r),
    o = e.createContext(() => {});
  return {
    Provider: ({ children: t }) => {
      const [u, i] = e.useReducer(n, r, a);
      return e.createElement(
        c.Provider,
        { value: u },
        e.createElement(o.Provider, { value: i }, t)
      );
    },
    __internal: { valueContext: c, dispatchContext: o },
    set displayName(e) {},
  };
};
