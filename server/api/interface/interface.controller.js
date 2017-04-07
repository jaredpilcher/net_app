/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/interfaces              ->  index
 * POST    /api/interfaces              ->  create
 * GET     /api/interfaces/:id          ->  show
 * PUT     /api/interfaces/:id          ->  upsert
 * PATCH   /api/interfaces/:id          ->  patch
 * DELETE  /api/interfaces/:id          ->  destroy
 */

'use strict';

import network from 'network';

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

/**
 * Retreive the IP addresses of the network interfaces on this device
 */
function getNetworkInterfaces() {
  return new Promise(
      function (resolve, reject){
          network.get_interfaces_list(function(err, list) {
              let ipAddresses = [];
              for (var i = 0, len = list.length; i < len; i++) {
                  ipAddresses.push(list[i].ip_address);
              }
              resolve(ipAddresses);
          });
      }
  );
}

// Gets a list of Interfaces
export function index(req, res) {
  return getNetworkInterfaces()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

