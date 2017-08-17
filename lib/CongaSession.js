/*
 * This file is part of the conga-session module.
 *
 * (c) Anthony Matarazzo <email@anthonymatarazzo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// core libs
const { EventEmitter } = require('events');

// third party libs
const _ = require('lodash');

/**
 * Mixin of functions for session object
 * @type {Object}
 */
let mixins = {};

/**
 *
 * @param {Class} [SessionClass]
 * @returns {EventEmitter}
 */
module.exports = SessionClass => class CongaSession extends (SessionClass || EventEmitter) {

    /**
     * Use this to register a new mixin for this store
     * @param {Object} object
     * @returns {Object|*}
     */
    static mixin(object) {
        // TODO: mixins need to be able to perform clean up of data before the session is saved
        return _.merge(mixins, object);
    }

    /**
     * Use this to mixin data on this store instance
     * @param {Object} original The original data you want to add mixins to
     * @returns {Object|*}
     */
    mixin(original) {
        return _.merge({}, mixins, original);
    }

    /** implement expression-session Store methods **/

    all(callback) {
        super.all((err, records) => {
            if (err) {
                callback(err);
                return;
            }
            callback(null, records.map(record => this.mixin(record)));
        });
    }

    get(sid, callback) {
        super.get(sid, (err, data) => {
            if (err) {
                callback(err);
                return;
            }
            callback(null, this.mixin(data));
        });
    }

    set(sid, session, callback) {
        super.set(sid, session, (err, data) => {
            if (err) {
                callback(err);
                return;
            }
            callback(null, this.mixin(data));
        });
    }

};