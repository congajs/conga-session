/*
 * This file is part of the conga-session module.
 *
 * (c) Anthony Matarazzo <email@anthonymatarazzo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * FlashBag is an iterable map that only allows getting a value once
 */
class FlashBag {

    constructor(data = null) {
        this.__data = data || {};
    }

    set(name, value) {
        this.__data[name] = value;
        return this;
    }

    get(name, defaultValue = null) {
        if (!(name in this.__data)) {
            return defaultValue;
        }
        const value = this.__data[name];
        this.delete(name);
        return value;
    }

    has(name) {
        return name in this.__data;
    }

    keys() {
        return Object.keys(this.__data);
    }

    forEach(callback, thisArg) {
        if (thisArg) {
            callback = callback.bind(thisArg);
        }
        this.keys().forEach(key => {
            callback(key, this.__data[key]);
        });
        return this;
    }

    entries() {
        return this.keys().map(key => [key, this.__data[key]]);
    }

    values() {
        return this.keys().map(key => this.__data[key]);
    }

    delete(name) {
        if (name in this.__data) {
            delete this.__data[name];
        }
        return this;
    }

    clear() {
        this.__data = {};
    }

    [Symbol.iterator]() {
        let n = 0;
        const values = this.values();
        const len = values.length;
        return {
            next() {
                const done = n >= len;
                return {done, value: !done && values[n++]};
            }
        };
    }
}

module.exports = FlashBag;