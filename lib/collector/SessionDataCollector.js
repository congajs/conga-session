/*
 * This file is part of the conga-session library.
 *
 * (c) Anthony Matarazzo <email@anthonymatarazzo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

let CongaProfiler;
try {
    // safely and quietly attempt to load the profiler module
    CongaProfiler = require('@conga/framework-profiler');
} catch(e) { }

/**
 * The SessionDataCollector collects query information from bass during a request
 */
const SessionDataCollector = CongaProfiler && class SessionDataCollector
    extends CongaProfiler.Collector.DataCollectorInterface
{
    /**
     *
     * @param {Container} container The service container
     */
    constructor(container) {
        super();
        this.container = container;
    }

    /**
     * Get the twig bundle configuration
     * @return {Object}
     */
    get config() {
        return this.container.get('config').get('session');
    }

    /**
     * {@inheritDoc}
     */
    getName() {
        return 'Session';
    }

    /**
     * {@inheritDoc}
     */
    hasDashboard() {
        return true;
    }

    /**
     * {@inheritDoc}
     * @see DataCollectorInterface.isEnabled
     */
    isEnabled() {
        const config = this.config;
        if (!config || !config.profiler) {
            return false;
        }
        if (config.profiler === true) {
            return true;
        }
        return config.profiler instanceof Object && config.profiler.enabled;
    }

    /**
     * {@inheritDoc}
     */
    collectData(request, response, document = null) {
        return Promise.resolve(JSON.parse(JSON.stringify(request.session)));
    }
};

module.exports = SessionDataCollector || class { };