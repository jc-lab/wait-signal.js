"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const C_STATE = Symbol('C_STATE');
const C_RESULT = Symbol('C_RESULT');
const C_LISTENERS = Symbol('C_LISTENERS');
var State;
(function (State) {
    State[State["WAIT"] = 0] = "WAIT";
    State[State["RESOLVED"] = 1] = "RESOLVED";
    State[State["REJECTED"] = 2] = "REJECTED";
})(State || (State = {}));
function getBySym(inst, sym) {
    return inst[sym];
}
function setBySym(inst, sym, value) {
    return inst[sym] = value;
}
class WaitSignal {
    constructor() {
        setBySym(this, C_STATE, State.WAIT);
        setBySym(this, C_LISTENERS, []);
    }
    wait(callback) {
        if (callback) {
            const state = getBySym(this, C_STATE);
            switch (state) {
                case State.RESOLVED:
                    callback(getBySym(this, C_RESULT), null);
                    break;
                case State.REJECTED:
                    callback(undefined, getBySym(this, C_RESULT));
                    break;
                default:
                    getBySym(this, C_LISTENERS).push({
                        resolve: (r) => callback(r, null),
                        reject: (e) => callback(undefined, e)
                    });
                    break;
            }
        }
        else {
            return new Promise((resolve, reject) => {
                const state = getBySym(this, C_STATE);
                switch (state) {
                    case State.RESOLVED:
                        resolve(getBySym(this, C_RESULT));
                        break;
                    case State.REJECTED:
                        reject(getBySym(this, C_RESULT));
                        break;
                    default:
                        getBySym(this, C_LISTENERS).push({
                            resolve: resolve,
                            reject: reject
                        });
                        break;
                }
            });
        }
    }
    signal(v) {
        const listeners = getBySym(this, C_LISTENERS);
        setBySym(this, C_RESULT, v);
        setBySym(this, C_STATE, State.RESOLVED);
        while (listeners.length > 0) {
            let listener = listeners.shift();
            listener.resolve(v);
        }
    }
    throw(e) {
        const listeners = getBySym(this, C_LISTENERS);
        setBySym(this, C_RESULT, e);
        setBySym(this, C_STATE, State.REJECTED);
        while (listeners.length > 0) {
            let listener = listeners.shift();
            listener.reject(e);
        }
    }
}
exports.default = WaitSignal;
//# sourceMappingURL=index.js.map