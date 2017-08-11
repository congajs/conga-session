const fs = require('fs');
const path = require('path');
const request = require('request');
const Kernel = require('@conga/framework/lib/kernel/TestKernel');

describe('Mixins Disabled List', () => {

    let kernel;

    beforeAll((done) => {

        kernel = new Kernel(
            path.join(__dirname, '..', 'spec', 'data', 'projects', 'sample'),
            'app',
            'mixins',
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

    it("should disable configured mixins", done => {

        request({
            uri: 'http://localhost:5555/mixins/check-flash-bag',
            method: 'GET',
            jar: true
        }, (error, response, body) => {

            try {
                body = JSON.parse(body);
            } catch (err) {
                expect(err).toBeUndefined();
            }

            expect(body.hasFlashBag).toBeFalsy();
            expect(body.flashBag).toBeFalsy();

            done();

        });

    });

    it("should enable tagged mixins", done => {

        request({
            uri: 'http://localhost:5555/mixins/check-iterable',
            method: 'GET',
            jar: true
        }, (error, response, body) => {

            try {
                body = JSON.parse(body);
            } catch (err) {
                expect(err).toBeUndefined();
            }

            expect(body.hasIterable).toBeTruthy();

            done();

        });

    });


});