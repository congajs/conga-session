@conga/framework-session
========================

This bundle enabled sessions for the CongaJS framework.  The Sessions are built on top of 
`express-session` and allow you to provide your own mixins for the session object. 

See the [documentation](/docs) for more information.

## Configuration

```
# app/config/config.yml
 
session:
 
    # see https://github.com/expressjs/session for info
 
    secret: 'session-secret'
    resave: true
    saveUninitialized: true
 
    cookie:
        name: conga.sid
 
    # the session store configuration
    store:
        # any supported express-session store
        module: session-file-store
        
        # the store options here
        # NOTE: some stores have their own options
        options:
            path: "%kernel.var_path%/sessions"
            ttl: 7200
            retries: 4
            fileExtension: .session
 
    # if you leave out mixins alltogether they will be enabled
    mixins:
        # to turn off mixins, change this value to false
        enabled: true
        
        # to keep mixins enabled but disable only certain mixins
        # list each mixin that you want to disable here
        disabled:
            - flashBag
```

## Accessing The Session

> The session lives on the request object.  

> You have access to this on a controller action method.

```
const { Controller } = require('@conga/framework');
 
module.exports = class MyController extends Controller {
    /**
     * @Route("/", name="index", methods=["GET"])
     */
    index(req, res) {
        // add data to your session
        req.session.set('name', 'some value');
        
        // get data from the session
        res.return({data: req.session.get('some_key')});
    }
}
```  
