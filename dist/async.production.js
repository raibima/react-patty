"use strict";
var e = require("react");
function t(e) {
  return e;
}
const r = (e) => new Promise((t) => setTimeout(t, e));
(exports.createAsyncState = function (n, a, o, c = t) {
  const u = e.createContext(n),
    l = e.createContext(() => {}),
    s = e.createContext("loading"),
    i = {
      Provider: ({ children: t }) => {
        const [d, f] = e.useReducer(o, n, c),
          [v, p] = e.useState("loading");
        return (
          e.useEffect(() => {
            let e = !1;
            return (
              (function (e, t = 5) {
                return async (...n) => {
                  let a = 0,
                    o = null;
                  for (;;)
                    try {
                      return await e(...n);
                    } catch (e) {
                      if (a >= t) {
                        o = e;
                        break;
                      }
                      await r(1e3 << a++);
                    }
                  throw o;
                };
              })(a)()
                .then((t) => {
                  e ||
                    (f({ type: "$$resolve", payload: { value: t } }),
                    p("resolved"));
                })
                .catch((t) => {
                  if (e) return;
                  const r = t;
                  f({ type: "$$error", payload: { error: r } }), p("rejected");
                  const n = i.__internal.callback;
                  "object" == typeof n &&
                    "function" == typeof n.onLoadError &&
                    n.onLoadError(r);
                }),
              () => {
                e = !0;
              }
            );
          }, []),
          e.createElement(
            u.Provider,
            { value: d },
            e.createElement(
              l.Provider,
              { value: f },
              e.createElement(s.Provider, { value: v }, t)
            )
          )
        );
      },
      __internal: { valueContext: u, dispatchContext: l, loadStatusContext: s },
      set displayName(e) {},
    };
  return i;
}),
  (exports.unstable_addListener = function (e, t) {
    e.__internal.callback = t;
  }),
  (exports.useLoadStatus = function (t) {
    return e.useContext(t.__internal.loadStatusContext);
  });
