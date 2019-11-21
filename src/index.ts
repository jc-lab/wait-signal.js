const C_STATE: symbol = Symbol('C_STATE');
const C_RESULT: symbol = Symbol('C_RESULT');
const C_LISTENERS: symbol = Symbol('C_LISTENERS');

enum State {
    WAIT = 0,
    RESOLVED,
    REJECTED
}

function getBySym<T>(inst: any, sym: symbol): T {
    return inst[sym];
}

function setBySym<T>(inst: any, sym: symbol, value: T): T {
    return inst[sym] = value;
}

interface IListener {
    resolve: any;
    reject: any;
}

export default class WaitSignal<T = void> {
    constructor() {
        setBySym(this, C_STATE, State.WAIT);
        setBySym(this, C_LISTENERS, [] as IListener[]);
    }

    wait(callback?: (result: T | undefined, err: any | null) => void): void;
    wait(): Promise<T>;

    wait(callback?: (result: T | undefined, err: any | null) => void): any {
        if(callback) {
            const state: State = getBySym<State>(this, C_STATE);
            switch(state) {
                case State.RESOLVED:
                    callback(getBySym<T>(this, C_RESULT), null);
                    break;
                case State.REJECTED:
                    callback(undefined, getBySym<T>(this, C_RESULT));
                    break;
                default:
                    getBySym<IListener[]>(this, C_LISTENERS).push({
                        resolve: (r: T) => callback(r, null),
                        reject: (e: any) => callback(undefined, e)
                    });
                    break;
            }
        }else{
            return new Promise<T>((resolve, reject) => {
                const state: State = getBySym<State>(this, C_STATE);
                switch(state) {
                    case State.RESOLVED:
                        resolve(getBySym<T>(this, C_RESULT));
                        break;
                    case State.REJECTED:
                        reject(getBySym(this, C_RESULT));
                        break;
                    default:
                        getBySym<IListener[]>(this, C_LISTENERS).push({
                            resolve: resolve,
                            reject: reject
                        });
                        break;
                }
            });
        }
    }

    signal(v: T): void {
        const listeners = getBySym<IListener[]>(this, C_LISTENERS);
        setBySym(this, C_RESULT, v);
        setBySym(this, C_STATE, State.RESOLVED);
        while(listeners.length > 0) {
            let listener: IListener = listeners.shift() as IListener;
            listener.resolve(v);
        }
    }

    throw(e: any): void {
        const listeners = getBySym<IListener[]>(this, C_LISTENERS);
        setBySym(this, C_RESULT, e);
        setBySym(this, C_STATE, State.REJECTED);
        while(listeners.length > 0) {
            let listener: IListener = listeners.shift() as IListener;
            listener.reject(e);
        }
    }
}

if(module) {
    module.exports = WaitSignal;
}
