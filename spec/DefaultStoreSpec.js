const path = require('path');

const Kernel = require('@conga/framework/lib/kernel/TestKernel');

describe("Default Store", () => {

    let kernel;

    beforeAll((done) => {

        kernel = new Kernel(
            path.join(__dirname, '..', 'spec', 'data', 'projects', 'sample'),
            'app',
            'default_store',
            {}
        );

        kernel.addBundlePaths({
            'demo-bundle': path.join(__dirname, '..', 'spec', 'data', 'projects', 'sample', 'src', 'demo-bundle'),
            '@conga/framework-session': path.join(__dirname, '..')
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