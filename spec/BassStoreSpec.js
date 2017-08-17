const path = require('path');

const Kernel = require('@conga/framework/lib/kernel/TestKernel');

describe("Bass Store", () => {

    let kernel;

    beforeAll((done) => {

        kernel = new Kernel(
            path.join(__dirname, '..', 'spec', 'data', 'projects', 'sample'),
            'app',
            'bass_store',
            {}
        );

        kernel.addBundlePaths({
            'demo-bundle': path.join(__dirname, '..', 'spec', 'data', 'projects', 'sample', 'src', 'demo-bundle'),
            '@conga/framework-session': path.join(__dirname, '..'),
            '@conga/framework-bass': path.join(__dirname, '..', 'node_modules', '@conga', 'framework-bass')
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