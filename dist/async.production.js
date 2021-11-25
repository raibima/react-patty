"use strict";
var e = require("react");
const t = (e) => new Promise((t) => setTimeout(t, e));
(exports.createAsyncState = function (r, n, a) {
  const o = e.createContext(r),
    c = e.createContext(() => {}),
    u = e.createContext("loading"),
    l = (e, t) => {
      const r = t;
      return "$$resolve" === r.type ? r.value : a(e, r);
    },
    s = {
      Provider: ({ children: a }) => {
        const [i, d] = e.useReducer(l, r),
          [v, f] = e.useState("loading");
        return (
          e.useEffect(() => {
            let e = !1;
            return (
              (function (e, r = 5) {
                return async (...n) => {
                  let a = 0,
                    o = null;
                  for (;;)
                    try {
                      return await e(...n);
                    } catch (e) {
                      if (a >= r) {
                        o = e;
                        break;
                      }
                      await t(1e3 << a++);
                    }
                  throw o;
                };
              })(n)()
                .then((t) => {
                  e || (d({ type: "$$resolve", value: t }), f("resolved"));
                })
                .catch((t) => {
                  if (e) return;
                  const r = t;
                  d({ type: "$$error", value: r }), f("rejected");
                  const n = s.__internal.callback;
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
            o.Provider,
            { value: i },
            e.createElement(
              c.Provider,
              { value: d },
              e.createElement(u.Provider, { value: v }, a)
            )
          )
        );
      },
      __internal: { valueContext: o, dispatchContext: c, loadStatusContext: u },
      set displayName(e) {},
    };
  return s;
}),
  (exports.unstable_addListener = function (e, t) {
    e.__internal.callback = t;
  }),
  (exports.useLoadStatus = function (t) {
    return e.useContext(t.__internal.loadStatusContext);
  });
