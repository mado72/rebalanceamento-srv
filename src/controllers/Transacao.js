'use strict';

var utils = require('../utils/writer.js');
var Transacao = require('../service/TransacaoService.js');

module.exports.transacaoGET = function despesaGET (req, res, next, mes, pago, carteira) {
  Transacao.transacaoGET(mes, pago, carteira)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.transacaoIdDELETE = function despesaIdDELETE (req, res, next, despesaId) {
  Transacao.transacaoIdDELETE(despesaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.transacaoIdGET = function despesaIdGET (req, res, next, despesaId) {
  Transacao.transacaoIdGET(despesaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.transacaoPOST = function despesaPOST (req, res, next, body) {
  Transacao.transacaoPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.transacaoPUT = function despesaPUT (req, res, next, body) {
  Transacao.transacaoPUT(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};
