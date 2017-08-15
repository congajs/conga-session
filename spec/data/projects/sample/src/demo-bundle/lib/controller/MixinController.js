const Controller = require('@conga/framework').Controller;

/**
 * @Route("/mixins")
 */
module.exports = class MixinController extends Controller {

    /**
     * @Route("/set-flash-bag-value", methods=["GET"])
     */
    setFlashBagValue(req, res) {
        req.session.getFlashBag().set('test-flash', 'got flash bag!');
        res.return(null);
    }

    /**
     * @Route("/get-flash-bag-value", methods=["GET"])
     */
    getFlashBagValue(req, res) {
        res.return({
            value: req.session.getFlashBag().get('test-flash')
        });
    }

    /**
     * @Route("/get-session-keys", methods=["GET"])
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
     * @Route("/check-iterable", methods=["GET"])
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
     * @Route("/check-flash-bag", methods=["GET"])
     */
    checkFlashBag(req, res) {
        res.return({
            hasFlashBag: typeof req.session.getFlashBag === 'function',
            flashBag: req.session.getFlashBag && req.session.getFlashBag()
        });
    }
};
