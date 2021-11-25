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
      Provider: ({ children: t, fetcher: d }) => {
        const [f, v] = e.useReducer(o, n, c),
          [p, x] = e.useState("loading");
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
              })(a)(d)
                .then((t) => {
                  e ||
                    (v({ type: "$$resolve", payload: { value: t } }),
                    x("resolved"));
                })
                .catch((t) => {
                  if (e) return;
                  const r = t;
                  v({ type: "$$error", payload: { error: r } }), x("rejected");
                  const n = i.__internal.callback;
                  "object" == typeof n &&
                    "function" == typeof n.onLoadError &&
                    n.onLoadError(r);
                }),
              () => {
                e = !0;
              }
            );
          }, [d]),
          e.createElement(
            u.Provider,
            { value: f },
            e.createElement(
              l.Provider,
              { value: v },
              e.createElement(s.Provider, { value: p }, t)
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
