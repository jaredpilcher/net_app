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
    let server = req.body.server;
    let client = req.body.client;
    if(!client || !validator.isIP(client) || !server || !validator.isIP(server)) {
        console.log('invalid ip addresses. client:' + client + ' server:' + server);
        handleError(res, 400);
    }

    //validate protocol
    let protocol = req.body.protocol;
    if(!protocol || (protocol != "udp" && protocol != "tcp")) {
        console.log('invalid protocol given: ' + protocol);
        handleError(res, 400);
    }

    //run performance test
    perfTest(client, server, protocol);

    return res.status(201).send();
}
