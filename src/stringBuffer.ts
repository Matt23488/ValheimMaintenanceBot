export default class StringBuffer {
    private _size: number;
    private _data: string[];
    private _index: number;

    public constructor (size: number) {
        this._size = size;
        this._data = [];
        this._index = 0;
    }

    public add(data: string) {
        if (this._data.length < this._size) {
            this._data.push(data);
            this._index++;
            if (this._index === this._size) this._index = 0;
        } else {
            this._data[this._index++] = data;
            if (this._index === this._size) this._index = 0;
        }
    }

    public toArray() {
        return [...this._data.slice(this._index, this._data.length), ...this._data.slice(0, this._index)];
    }
};