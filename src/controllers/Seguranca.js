'use strict';

var utils = require('../utils/writer.js');
var Seguranca = require('../service/SegurancaService');

module.exports.authPOST = function authPOST (req, res, next, xAPIKEY) {
  Seguranca.authPOST(xAPIKEY)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      console.error(response);
      utils.writeJson(res, response);
    });
};
