class StringBuffer {
    /**
     * @type {number}
     */
    _size;

    /**
     * @type {string[]}
     */
    _data;

    /**
     * @type {number}
     */
    _index;

    /**
     * 
     * @param {number} size 
     */
    constructor (size) {
        this._size = size;
        this._data = [];
        this._index = 0;
    }

    /**
     * 
     * @param {string} data 
     */
    add(data) {
        if (this._data.length < this._size) {
            this._data.push(data);
            this._index++;
            if (this._index === this._size) this._index = 0;
        } else {
            this._data[this._index++] = data;
            if (this._index === this._size) this._index = 0;
        }
    }

    /**
     * @returns {string[]}
     */
    toArray() {
        return [...this._data.slice(this._index, this._data.length), ...this._data.slice(0, this._index)];
    }
};

module.exports = StringBuffer;