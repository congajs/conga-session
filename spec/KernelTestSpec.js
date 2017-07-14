const fs = require('fs');
const path = require('path');
const request = require('request');
const Kernel = require('@conga/framework/lib/kernel/TestKernel');

describe("Kernel", () => {

    let kernel;

    beforeAll((done) => {

        kernel = new Kernel(
            path.join(__dirname, '..', 'spec', 'data', 'projects', 'sample'),
            'app',
            'test',
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

    it("should have a cookie", (done) => {

        request({
            uri: 'http://localhost:5555/',
            method: 'GET',
            jar: true

        }, (error, response, body) => {
            expect(response.headers['set-cookie'][0]).toMatch('super.awesome.cookie');
            done();
        });

    });

    it("should set and get a session value", (done) => {

        request({
            uri: 'http://localhost:5555/set-session-value',
            method: 'GET',
            jar: true
        }, (error, response, body) => {

            request({
                uri: 'http://localhost:5555/get-session-value',
                method: 'GET',
                jar: true
            }, (error, response, body) => {
                expect(JSON.parse(body).value).toEqual(12345);
                done();
            });

        });

    });



});
