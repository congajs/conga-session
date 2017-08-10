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
};
