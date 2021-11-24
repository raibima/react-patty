"use strict";
var e = require("react");
(exports.createAsyncState = function (t, r, n) {
  const a = e.createContext(t),
    o = e.createContext(() => {}),
    u = e.createContext("loading"),
    s = (e, t) => {
      const r = t;
      return "set" === r.type ? r.value : n(e, t);
    };
  return {
    Provider: ({ children: n }) => {
      const [c, l] = e.useReducer(s, t),
        [i, d] = e.useState("loading");
      return (
        e.useEffect(() => {
          let e = !1;
          return (
            r().then((t) => {
              e || (l({ type: "set", value: t }), d("resolved"));
            }),
            () => {
              e = !0;
            }
          );
        }, []),
        e.createElement(
          a.Provider,
          { value: c },
          e.createElement(
            o.Provider,
            { value: l },
            e.createElement(u.Provider, { value: i }, n)
          )
        )
      );
    },
    __internal: { valueContext: a, dispatchContext: o, loadStatusContext: u },
    set displayName(e) {},
  };
}),
  (exports.useLoadStatus = function (t) {
    return e.useContext(t.__internal.loadStatusContext);
  });
