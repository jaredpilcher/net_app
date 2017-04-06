/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/tests              ->  index
 * POST    /api/tests              ->  create
 * GET     /api/tests/:id          ->  show
 * PUT     /api/tests/:id          ->  upsert
 * PATCH   /api/tests/:id          ->  patch
 * DELETE  /api/tests/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Test from './test.model';
import perfTest from './test.service';
import validator from 'validator';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Tests
export function index(req, res) {
  return Test.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Test in the DB
export function create(req, res) {
    //validate ip addresses
    let server = req.params.server;
    let client = req.params.client;
    if(!client || !validator.isIP(client) || !server || !validator.isIP(server)) {
        console.log('invalid ip addresses. client:' + client + ' server:' + server);
        handleError(res, 400);
    }

    //run performance test
    perfTest(client, server);

  return respondWithResult(res, 201)
    .catch(handleError(res));
}
