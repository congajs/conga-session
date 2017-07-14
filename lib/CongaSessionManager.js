/*
 * This file is part of the conga-session module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const session = require('express-session');

/**
 * The CongaSessionManager configures and sets up express session middleware
 *
 * @author Marc Roulias <marc@lampjunkie.com>
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
        const Store = require(config.store.module)(session);

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

}
