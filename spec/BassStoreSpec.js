const path = require('path');

const Kernel = require('@conga/framework/lib/kernel/TestKernel');

const rootPath = path.join(__dirname, '..');
const modulePath = path.join(rootPath, 'node_modules');
const appPath = path.join(rootPath, 'spec', 'data', 'projects', 'sample');

const Module = require('module');
const originalLoad = Module._load;

Module._load = function (request, parent) {

    let idx = request.indexOf('bass-nedb');
    if (idx !== -1) {
        request = path.join(modulePath, request.substr(idx));
    }

    return originalLoad.call(this, request, parent);
};

describe("Bass Store", () => {

    let kernel;

    beforeAll((done) => {

        kernel = new Kernel(
            appPath,
            'app',
            'bass_store',
            {}
        );

        kernel.addBundlePaths({
            'demo-bundle': path.join(appPath, 'src', 'demo-bundle'),
            '@conga/framework-session': rootPath,
            '@conga/framework-bass': path.join(modulePath, '@conga', 'framework-bass')
        });

        kernel.boot(() => {
            done();
        });

    });

    afterAll(done => {
        kernel.shutdown(() => done());
    });

    describe('default tests;', require('./DefaultTests'));

});