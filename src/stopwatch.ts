export default class Stopwatch {
    private _state = STATES.INIT;
    private _performance = new performance();
    private _startTimeDelta = 0;
    private _startTime = 0;
    private _stopTime = 0;

    public constructor(autostart = false, delta = 0) {
        this.reset();
        this.setStartTimeDelta(delta);
        if (autostart) this.start();
    }

    private setStartTimeDelta(startTimeDelta: number) {
        if (this._state !== STATES.STOPPED && this._state !== STATES.INIT) {
            throw new Error(`Cannot set an initial start time delta on a stopwatch that is currently running (${this._state})`);
        }

        this._startTimeDelta = startTimeDelta;
    }

    public start() {
        if (this._state !== STATES.STOPPED && this._state !== STATES.INIT) {
            throw new Error(`Cannot start a stopwatch that is currently running (${this._state})`);
        }

        this._state = STATES.RUNNING;
        this._startTime = this._performance.now();
    }

    public stop() {
        this._stopTime = this._performance.now();
        this._state = STATES.STOPPED;
        return this.read();
    }

    public split() {
        if (this._state !== STATES.RUNNING) {
            throw new Error(`Cannot split time on a stopwatch that is not currently running (${this._state})`);
        }

        this._stopTime = this._performance.now();
        this._state = STATES.SPLIT;
        return this.read();
    }

    public unsplit() {
        if (this._state !== STATES.SPLIT) {
            throw new Error(`Cannot unsplit time on a stopwatch that is not currently split (${this._state})`);
        }

        this._stopTime = 0; // original sets this to null.
        this._state = STATES.RUNNING;
        return this.read();
    }

    public get state() { return this._state; }

    public reset() {
        this._state = STATES.INIT;
        this._startTime = 0; // original sets this to null.
        this._stopTime = 0; // original sets this to null.
    }

    public splitTime() {
        if (this._state !== STATES.SPLIT) {
            throw new Error(`Cannot get split time on a stopwatch that is not currently split (${this._state})`);
        }

        return calculateDelta(this._startTime, this._stopTime);
    }

    public read() {
        if (this._startTime) {
            const nowTime = this._stopTime || this._performance.now();
            return calculateDelta(this._startTime, nowTime) + this._startTimeDelta;
        } else return NaN;
    }
}

export enum STATES {
    INIT,
    RUNNING,
    STOPPED,
    SPLIT
}

const calculateDelta = (start: number, end: number) => end - start;

class performance {
    private _moduleLoadTime: number;
    private _upTime: number;
    private _nodeLoadTime: number;

    public constructor() {
        this._moduleLoadTime = this.getNanoSeconds();
        this._upTime = process.uptime() * 1e9;
        this._nodeLoadTime = this._moduleLoadTime - this._upTime;
    }

    public now() {
        return (this.getNanoSeconds() - this._nodeLoadTime) / 1e6;
    }

    private getNanoSeconds() {
        const hr = process.hrtime();
        return hr[0] * 1e9 + hr[1];
    }
};