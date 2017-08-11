/*
 * This file is part of the conga-session module.
 *
 * (c) Anthony Matarazzo <email@anthonymatarazzo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Iterable session mixin
 */
const Iterable = {
    get(name) {
        return name[0] !== '_' && this[name];
    },

    set(name, value) {
        if (name[0] === '_') {
            return null;
        }
        this[name] = value;
        return value;
    },

    has(name) {
        return name[0] !== '_' && name in this && this[name] !== 'function';
    },

    keys() {
        return Object.keys(this).filter(key => {
            return key[0] !== '_' && typeof this[key] !== 'function';
        });
    },

    delete(name) {
        if (name[0] !== '_' &&
            name in this &&
            typeof this[name] !== 'function'
        ) {
            delete this[name];
            return true;
        }
        return false;
    },

    entries() {
        return this.keys().map(key => [key, this[key]]);
    },

    values() {
        return this.keys().map(key => this[key]);
    },

    [Symbol.iterator]() {
        return this.entries();
    }
};

module.exports = () => Iterable;