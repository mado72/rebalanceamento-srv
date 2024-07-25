'use strict';

var utils = require('../utils/writer.js');
var Cotacao = require('../service/CotacaoService');

module.exports.cotacaoYahooGET = function cocotacaoYahooGET(req, res, next, simbolo) {
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

module.exports.cotacaoSummaryGET = function cotacaoSummaryGET(req, res, next, simbolo) {
    Cotacao.cotacaoSummaryGET(simbolo)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.handleError(res, response);
        });
}

module.exports.atualizarCotacoesBatchGET = function atualizarCotacoesBatchGET(req, res) {
    Cotacao.atualizarCotacoesBatchGET()
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

module.exports.cotacaoPOST = function (req, res, next, dados) {
    if (! dados) {
        utils.handleError(res, `Dados inválidos`);
        return;
    }
    if (! dados.simbolo) {
        utils.handleError(res, `Simbolo inválido`);
        return;
    }
    dados.simbolo = dados.simbolo.trim();
    if (! dados.manual) {
        utils.handleError(res, `Apenas cotação manual é permitido atualizar`);
        return;
    }
    if (! dados.data ) {
        dados.data = new Date();
    }
    if (! dados.dataColeta ) {
        dados.dataColeta = dados.data;
    }
    Cotacao.cotacaoPOST(dados)
        .then(function (response) {
            utils.writeJson(res, utils.respondWithCode(201, response));
        })
        .catch(function (error) {
            console.error(`Erro ao salvar cotacao: '${dados.simbolo} ${error}'`);
            utils.handleError(res, error);
        });
}
