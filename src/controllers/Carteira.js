'use strict';

var utils = require('../utils/writer.js');
var Carteira = require('../service/CarteiraService');

module.exports.ativoGET = function ativoGET (req, res, next, tipoAtivo, nome) {
  Carteira.ativoGET(tipoAtivo, nome)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.ativoIdDELETE = function ativoIdDELETE (req, res, next, ativoId) {
  Carteira.ativoIdDELETE(ativoId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.ativoIdGET = function ativoIdGET (req, res, next, ativoId) {
  Carteira.ativoIdGET(ativoId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.ativoPOST = function ativoPOST (req, res, next, body) {
  Carteira.ativoPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.ativoPUT = function ativoPUT (req, res, next, body) {
  Carteira.ativoPUT(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.carteiraGET = function carteiraGET (req, res, next, moeda, classe) {
  Carteira.carteiraGET(moeda, classe)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.carteiraIdAlocacaoGET = function carteiraIdAlocacaoGET (req, res, next, carteiraId) {
  Carteira.carteiraIdAlocacaoGET(carteiraId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.carteiraIdAlocacaoPOST = function carteiraIdAlocacaoPOST (req, res, next, body, carteiraId) {
  if (!carteiraId && typeof body === 'string') {
    carteiraId = body;
    body = req.body;
  }
  Carteira.carteiraIdAlocacaoPOST(body, carteiraId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.carteiraIdDELETE = function carteiraIdDELETE (req, res, next, carteiraId) {
  Carteira.carteiraIdDELETE(carteiraId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.carteiraIdGET = function carteiraIdGET (req, res, next, carteiraId) {
  Carteira.carteiraIdGET(carteiraId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.carteiraPOST = function carteiraPOST (req, res, next, body) {
  Carteira.carteiraPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.carteiraPUT = function carteiraPUT (req, res, next, body) {
  Carteira.carteiraPUT(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};
