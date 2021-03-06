/*
 * This file is part of the conga-session module.
 *
 * (c) Anthony Matarazzo <email@anthonymatarazzo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// local libs
const FlashBag = require('./FlashBag');

/**
 * FlashBag session mixin
 */
const MIXIN = {
    /**
     * Get the FlashBag
     * @returns {FlashBag}
     */
    getFlashBag() {
        if (!(this.__flashBag instanceof FlashBag)) {
            this.__flashBag = new FlashBag(
                this.__flashBag && this.__flashBag.__data || this.__flashBag || {});
        }
        return this.__flashBag;
    }
};

module.exports = () => MIXIN;