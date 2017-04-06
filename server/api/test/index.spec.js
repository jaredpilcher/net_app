'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var testCtrlStub = {
  index: 'testCtrl.index',
  show: 'testCtrl.show',
  create: 'testCtrl.create',
  upsert: 'testCtrl.upsert',
  patch: 'testCtrl.patch',
  destroy: 'testCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var testIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './test.controller': testCtrlStub
});

describe('Test API Router:', function() {
  it('should return an express router instance', function() {
    testIndex.should.equal(routerStub);
  });

  describe('GET /api/tests', function() {
    it('should route to test.controller.index', function() {
      routerStub.get
        .withArgs('/', 'testCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/tests', function() {
    it('should route to test.controller.create', function() {
      routerStub.post
        .withArgs('/', 'testCtrl.create')
        .should.have.been.calledOnce;
    });
  });
});
