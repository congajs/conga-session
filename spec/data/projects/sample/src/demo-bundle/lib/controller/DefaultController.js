const Controller = require('@conga/framework').Controller;

/**
 * @Route("/")
 */
module.exports = class DefaultController extends Controller {

    /**
     * @Route("/", name="default.index", methods=["GET"])
     */
    index(req, res) {
        res.return({ hello: 'world' });
    }

    /**
     * @Route("/set-session-value", methods=["GET"])
     */
    setSessionValue(req, res) {
        req.session.MY_SESSION_VALUE = 12345;
        req.session.save();
        res.return(null);
    }

    /**
     * @Route("/get-session-value", methods=["GET"])
     */
    getSessionValue(req, res) {
        res.return({
            value: req.session.MY_SESSION_VALUE,
            session: req.session
        });
    }

    /**
     * @Route("/mixins/set-flash-bag-value", methods=["GET"])
     */
    setFlashBagValue(req, res) {
        req.session.getFlashBag().set('test-flash', 'got flash bag!');
        res.return(null);
    }

    /**
     * @Route("/mixins/get-flash-bag-value", methods=["GET"])
     */
    getFlashBagValue(req, res) {
        res.return({
            value: req.session.getFlashBag().get('test-flash')
        });
    }

    /**
     * @Route("/mixins/get-session-keys", methods=["GET"])
     */
    getSessionKeys(req, res) {
        req.session.set('NEW_SESSION_KEY', 'testers');
        res.return({
            keys: req.session.keys(),
            data: req.session.values(),
            entries: req.session.entries(),
            hasRandom: req.session.has(Math.floor(Math.random() * 25) + '_KEY'),
            hasNewSessionKey: req.session.has('NEW_SESSION_KEY'),
            hasMySessionValue: req.session.has('MY_SESSION_VALUE'),
            MY_SESSION_VALUE: req.session.get('MY_SESSION_VALUE'),
            NEW_SESSION_KEY: req.session.get('NEW_SESSION_KEY')
        });
    }

    /**
     * @Route("/mixins/check-iterable", methods=["GET"])
     */
    checkIterable(req, res) {
        res.return({
            hasIterable: (
                typeof req.session.get === 'function' &&
                typeof req.session.set === 'function' &&
                typeof req.session.has === 'function' &&
                typeof req.session.keys === 'function' &&
                typeof req.session.delete === 'function' &&
                typeof req.session.entries === 'function' &&
                typeof req.session.values === 'function'
            )
        });
    }

    /**
     * @Route("/mixins/check-flash-bag", methods=["GET"])
     */
    checkFlashBag(req, res) {
        res.return({
            hasFlashBag: typeof req.session.getFlashBag === 'function',
            flashBag: req.session.getFlashBag && req.session.getFlashBag()
        });
    }
};
