/*
 * This file is part of the conga-session module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// third party libs
const session = require('express-session');

// local libs
const CongaSession = require('./CongaSession');

/**
 * The CongaSessionManager configures and sets up express session middleware
 */
module.exports = class CongaSessionManager {

	/**
     * Find all of the tagged view engines and register them
     *
     * @param  {Container}   container
     * @param  {Application} app
     * @param  {Function}    next
     * @return {void}
     */
    onAddMiddleware(container, app, next) {

        const config = container.get('config').get('session');
        const Store = CongaSession(require(config.store.module)(session));

        if (config.mixins === undefined ||
            config.mixins === true ||
            (config.mixins instanceof Object && (config.mixins.enabled === undefined || config.mixins.enabled))
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
                            'Your session.mixin tag must provide the mixin attribute as the name of the mixin.');
                    }
                    if (disabled && disabled.indexOf(name) !== -1) {
                        return;
                    }
                    const service = container.get(mixin.getServiceId());
                    if (typeof service === 'function') {
                        const value = service();
                        if (value instanceof Object) {
                            Store.mixin(value);
                        }
                        return;
                    }
                    const method = tag.getParameter('method') || 'getSessionMixin';
                    Store.mixin(service[method].call(service));
                });
            }
        }

        app.use(session({
            name: config.name,
            secret: config.secret,
            resave: config.resave,
            saveUninitialized: config.saveUninitialized,
            cookie: config.cookie,
            store: new Store(config.store.options)
        }));

        next();
    }

};
