/*
 * This file is part of the conga-session module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// third party libs
const _ = require('lodash');
const session = require('express-session');

/**
 * Mixin of functions for session object
 * @type {Object}
 */
let _mixins = {};

/**
 * Use this to register a new mixin for the session
 * @param {Object} object
 * @returns {Object|*}
 */
const mergeMixin = object => _.merge(_mixins, object);

/**
 * Use this to add mixin to a session
 * @param {Object} original The original data (session) you want to add mixins to
 * @returns {Object|*}
 */
const applyMixins = original => _.merge(original, _mixins);

/**
 * The CongaSessionManager configures and sets up express session middleware
 */
module.exports = class CongaSessionManager {

    /**
     * Initialize some variables on construct
     * @constructor
     */
    constructor() {
        this.config = null;
        this.Store = null;
    }

    /**
     * Initialize the Store with mixins during compile time
     * @param {Object} event
     * @param {Function} next
     * @returns {void}
     */
    onKernelCompile(event, next) {

        const { container } = event;

        const config = container.get('config').get('session');

        // attempt to load the configured store
        let Store;
        if (config.store && config.store.module) {
            try {
                Store = require(config.store.module)(session);
            } catch (err) {
                console.error(err.stack || err);
            }
        }

        // if we could not load a store, use the MemoryStore as default
        if (!Store) {
            Store = session.MemoryStore;
        }

        if (config.mixins === undefined ||
            config.mixins === true ||
            (config.mixins instanceof Object &&
                (config.mixins.enabled === undefined || config.mixins.enabled))
        ) {
            // find all the tagged session mixins
            const mixins = container.getTagsByName('session.mixin');

            if (mixins && mixins.length !== 0) {

                // if defined, array of disabled mixins
                const disabled = Array.isArray(config.mixins.disabled) && config.mixins.disabled;

                // sort the tags by priority
                container.get('conga.ioc.tag.sorter').sortByPriority(mixins);

                // add each mixin to the CongaSession store
                mixins.forEach(mixin => {
                    const name = mixin.getParameter('mixin');
                    if (!name) {
                        throw new Error(
                            'Your session.mixin tag must provide the "mixin" attribute as the name of the mixin.');
                    }
                    if (disabled && disabled.indexOf(name) !== -1) {
                        return;
                    }
                    const service = container.get(mixin.getServiceId());
                    if (service instanceof Function) {
                        const value = service();
                        if (value instanceof Object) {
                            mergeMixin(value);
                        }
                        return;
                    }
                    const method = tag.getParameter('method') || 'getSessionMixin';
                    mergeMixin(service[method].call(service));
                });
            }
        }

        this.config = config;
        this.options = config.store && config.store.options || {};
        this.Store = Store;

        next();
    }

    /**
     * Perform session mixins when the request scope is created
     * @param {Object} event
     * @param {Function} next
     */
    onRequestScope(event, next) {
        applyMixins(event.request.session);
        next();
    }

    /**
     * Find all of the tagged view engines and register them
     * @param {Container} container
     * @param {Application} app
     * @param {Function} next
     * @returns {void}
     */
    onAddMiddleware(container, app, next) {

        const { config, options, Store } = this;

        app.use(session({
            name: config.name,
            secret: config.secret,
            resave: config.resave,
            saveUninitialized: config.saveUninitialized,
            cookie: config.cookie,
            store: new Store(options)
        }));

        next();
    }

};
