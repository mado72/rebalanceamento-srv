'use strict';

var utils = require('../utils/writer.js');
var Consolidado = require('../service/ConsolidadoService.js');

module.exports.consolidadoGET = function consolidadoGET (req, res, next, inicio, fim) {
  Consolidado.consolidadoGET(inicio, fim)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      if (response.payload) {
        utils.writeJson(res, response);
      }
      else {
        utils.handleError(res, response);
      }
    });
};

module.exports.consolidadoPOST = function consolidadoPOST (req, res, next, body) {
  Consolidado.consolidadoPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      if (response.payload) {
        utils.writeJson(res, response);
      }
      else {
        utils.handleError(res, response);
      }
    });
};

module.exports.consolidadoTipoGET = function consolidadoTipoGET (req, res, next, tipo, inicio, fim) {
  Consolidado.consolidadoTipoGET(tipo, inicio, fim)
  .then(function (response) {
    utils.writeJson(res, response);
  })
  .catch(function (response) {
    if (response.payload) {
      utils.writeJson(res, response);
    }
    else {
      utils.handleError(res, response);
    }
  });
};

module.exports.consolidadoGerarPOST = function consolidadoGerarPOST (req, res, next, anoMes) {
  Consolidado.consolidadoGerarPOST(anoMes)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      if (response.payload) {
        utils.writeJson(res, response);
      }
      else {
        utils.handleError(res, response);
      }
    });
};

