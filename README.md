@conga/framework-session
========================

This bundle enabled sessions for the CongaJS framework.  The Sessions are built on top of 
`express-session` and allow you to provide your own mixins for the session object. 

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

The session lives on the request object.  

Usually, you have access to this on a controller action method.

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

You can also set the `scope` of your service to "request" and it will be 
available inside your container as `container.get('request').session`. 
Again, this only works if you are in the request scope.


## Session Mixins

Mixins are a cool way to provide extended functionality for your session instance.

There are two mixins installed from this module. Other modules also install mixins, 
so look through their read-me for information.

### Iterable

Iterable provides the `get`, `set`, and other methods on your session, and implements the 
iterable interface.  

The mixin name is `iterable`, you can disable it in your configuration.

You are encouraged to use the `get` and `set` methods to access your data, as private 
keys are not allowed.  Private keys are anything that start with a '_'.  

You should also note that @conga/framework-security uses its mixin to support stateful security 
realms, which require you to use `get` and `set` to access secure data inside a security realm.

### FlashBag

The flash bag is a nice extension that allows you to set a session message to only be picked 
up once.  After it's picked up, the message is deleted.

You can access the flash bag like this, `request.session.getFlashBag()`.

The flash bag has a `get` and a `set` method and also fully implements the iterable 
interface.

The mixin name is `flashBag`, you can disable it in your configuration.

## Custom Mixins

You can make your own mixin!

Your mixin can be anything you want, you just have to register it.  You register it by tagging 
a service definition as `session.mixin`.

#### Register The Mixin

```
# my-bundle/lib/resources/config/services.yml
 
services:
    my.mixin:
        constructor: my-bundle:session/MyMixin
        tags:
            - { name: session.mixin, mixin: myMixin, priority: 10 }
```

The name tells the system what your mixin is named, so apps can disable them.

The priority tells the system in which order to process the mixin.

#### Code The Mixin

Here's a very simple example, demonstrating how to code the mixin and save custom data on it.

```
// my-bundle/lib/session/MyMixin.js
 
class MyMixin {
    constructor() {
        this.data = {};
    }
    
    set(name, value) {
        this.data[name] = value;
        return value;
    }
    
    get(name) {
        return this.data[name];
    }
}
 
module.exports = () => {
    getMyMixin() {
        if (!this.__myMixin) {
            this.__myMixin = new MyMixin();
        }
        return this.__myMixin;
    }
};
```

Use your new mixin `request.session.getMyMixin().set('foo', 'bar');`

Anything that can be JSON stringified will be persisted in the session and merged back on, on 
subsequent requests. In the case of MyMixin, the session will have data that looks like this 
`{__myMixin: {data: {foo: "bar"}}}` when it gets persisted.  

When it's refreshed on a new request, the data object will contain our foo variable, 
`request.session.getMyMixin().get('foo')`.

 
