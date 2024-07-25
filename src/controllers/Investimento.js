'use strict';

var utils = require('../utils/writer.js');
var Investimento = require('../service/InvestimentoService');

module.exports.aporteGET = function (req, res, next, carteiraId, data) {
    Investimento.aporteGET(carteiraId, data)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (err) {
            utils.handleError(res, err);
        });
}

module.exports.aportePOST = function (req, res, next, aporte) {
    Investimento.aportePOST(aporte)
        .then(function (response) {
            utils.writeJson(res, utils.respondWithCode(201, response));
        })
        .catch(function (err) {
            utils.handleError(res, err);
        });
}

module.exports.aportePUT = function (req, res, next, aporte) {
    Investimento.aportePUT(aporte)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (err) {
            utils.handleError(res, err);
        });
}

module.exports.aporteDELETE = function (req, res, next, aporteId) {
    Investimento.aporteDELETE(aporteId)
        .then(function (response) {
            utils.writeJson(res, utils.respondWithCode(204, response));
        })
        .catch(function (err) {
            utils.handleError(res, err);
        });
}

module.exports.proventoGET = function (req, res, next, dataInicio, dataFinal, agregado) {
    Investimento.proventoGET(dataInicio, dataFinal, agregado)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (err) {
            utils.handleError(res, err);
        });
}

module.exports.proventoPOST = function (req, res, next, provento) {
    Investimento.proventoPOST(provento)
        .then(function (response) {
            utils.writeJson(res, utils.respondWithCode(201, response));
        })
        .catch(function (err) {
            utils.handleError(res, err);
        });
}

module.exports.proventoPUT = function (req, res, next, provento) {
    Investimento.proventoPUT(provento)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (err) {
            utils.handleError(res, err);
        });
}

module.exports.proventoDELETE = function (req, res, next, proventoId) {
    Investimento.proventoDELETE(proventoId)
        .then(function (response) {
            utils.writeJson(res, utils.respondWithCode(204, response));
        })
        .catch(function (err) {
            utils.handleError(res, err);
        });
}

module.exports.retiradaGET = function (req, res, next, dataInicio, dataFinal) {
    Investimento.retiradaGET(dataInicio, dataFinal)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (err) {
            utils.handleError(res, err);
        });
}

module.exports.retiradaPOST = function (req, res, next, retirada) {
    Investimento.retiradaPOST(retirada)
        .then(function (response) {
            utils.writeJson(res, utils.respondWithCode(201, response));
        })
        .catch(function (err) {
            utils.handleError(res, err);
        });
}

module.exports.retiradaPUT = function (req, res, next, retirada) {
    Investimento.retiradaPUT(retirada)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (err) {
            utils.handleError(res, err);
        });
}

module.exports.retiradaDELETE = function (req, res, next, retiradaId) {
    Investimento.retiradaDELETE(retiradaId)
        .then(function (response) {
            utils.writeJson(res, utils.respondWithCode(204, response));
        })
        .catch(function (err) {
            utils.handleError(res, err);
        });
}