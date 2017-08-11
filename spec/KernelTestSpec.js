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

    afterAll(done => {
        kernel.shutdown(() => done());
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

    it("should set and get a flash-bag value", (done) => {

        request({
            uri: 'http://localhost:5555/mixins/set-flash-bag-value',
            method: 'GET',
            jar: true
        }, (error, response, body) => {

            request({
                uri: 'http://localhost:5555/mixins/get-flash-bag-value',
                method: 'GET',
                jar: true
            }, (error, response, body) => {

                expect(JSON.parse(body).value).toEqual('got flash bag!');

                request({
                    uri: 'http://localhost:5555/mixins/get-flash-bag-value',
                    method: 'GET',
                    jar: true
                }, (error, response, body) => {

                    expect(JSON.parse(body).value).toBeFalsy();

                    done();

                });

            });

        });

    });

    it("should support the iterable mixin", (done) => {

        request({
            uri: 'http://localhost:5555/mixins/get-session-keys',
            method: 'GET',
            jar: true
        }, (error, response, body) => {

            try {
                body = JSON.parse(body);
            } catch (err) {
                expect(err).toBeUndefined();
            }

            expect(body.keys).toBeTruthy();
            expect(body.keys.length).toBeGreaterThan(0);
            expect(body.keys.indexOf('NEW_SESSION_KEY')).toBeGreaterThan(-1);
            expect(body.keys.indexOf('MY_SESSION_VALUE')).toBeGreaterThan(-1);

            expect(body.data).toBeTruthy();
            expect(Object.keys(body.data).length).toEqual(body.keys.length);

            expect(body.NEW_SESSION_KEY).toEqual('testers');
            expect(body.MY_SESSION_VALUE).toEqual(12345);

            expect(body.hasRandom).toBeFalsy();
            expect(body.hasNewSessionKey).toBeTruthy();
            expect(body.hasMySessionValue).toBeTruthy();

            done();

        });

    });

});