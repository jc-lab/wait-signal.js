export default class WaitSignal<T = void> {
    constructor();
    wait(callback: (result: T | undefined, err: any | null) => void): void;
    wait(): Promise<T>;
    signal(v: T): void;
    throw(e: any): void;
}
//# sourceMappingURL=index.d.ts.map