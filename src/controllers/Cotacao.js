'use strict';

var utils = require('../utils/writer.js');
var Cotacao = require('../service/CotacaoService');

module.exports.cotacaoYahooGET = function cocotacaoYahooGETntaGET(req, res, next, simbolo) {
    Cotacao.cotacaoYahooGET(simbolo)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.handleError(res, response);
        });
}

module.exports.cotacaoYahooSummaryGET = function cotacaoYahooSummaryGET(req, res, next, simbolo) {
    Cotacao.cotacaoYahooSummaryGET(simbolo)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.handleError(res, response);
        });
}

module.exports.atualizarCotacoesBatchPUT = function atualizarCotacoesBatchPUT(req, res) {
    Cotacao.atualizarCotacoesBatchPUT()
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.handleError(res, response);
        });
}

module.exports.atualizarCotacaoBatchPUT = function atualizarCotacaoBatchPUT(req, res, next, simbolo) {
    Cotacao.atualizarCotacaoBatchPUT(simbolo)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.handleError(res, response);
        });
}

module.exports.cotacaoGET = function (req, res, next, data, simbolo) {
    simbolo = decodeURIComponent(simbolo);
    Cotacao.cotacaoGET(data, simbolo)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            console.error(`Erro ao consultar simbolo: '${simbolo}'`);
            utils.handleError(res, response);
        });
}
