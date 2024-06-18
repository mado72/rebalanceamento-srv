'use strict';

var utils = require('../utils/writer.js');
var Conta = require('../service/ContaService');

module.exports.contaGET = function contaGET (req, res, next, moeda, conta) {
  Conta.contaGET(moeda, conta)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.contaIdDELETE = function contaIdDELETE (req, res, next, contaId) {
  Conta.contaIdDELETE(contaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.contaIdGET = function contaIdGET (req, res, next, contaId) {
  Conta.contaIdGET(contaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.contaPOST = function contaPOST (req, res, next, body) {
  Conta.contaPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.contaPUT = function contaPUT (req, res, next, body) {
  Conta.contaPUT(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.contasSaldoTotalGET = function contasSaldoTotalGET(req, res, next) {
  Conta.contasSaldoTotalGET()
   .then(function (response) {
      utils.writeJson(res, response);
    })
   .catch(function (response) {
      utils.handleError(res, response);
    });
}
