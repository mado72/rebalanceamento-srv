'use strict';
var mongoose = require('mongoose');

const { respondWithCode } = require('../utils/writer');
const { format, startOfMonth, endOfMonth } = require('date-fns');
const Transacao = mongoose.model('transacao');

/**
 * Lista as transações
 * Lista as transações programadas do ano
 *
 * mes Integer  (optional)
 * pago boolean (optional)
 * categoria string (optional)
 * returns List
 **/
exports.transacaoGET = function (mes, pago, categoria) {
  var filter = {};
  if (!!mes) {
    var now = new Date();
    var inicio = format(startOfMonth(now), 'yyyy-MM-dd');
    var fim = format(endOfMonth(now), 'yyyy-MM-dd');
    filter.dataInicial = {
      $gte: inicio,
      $lte: fim
    };
  };
  if (pago !== undefined) {
    filter.dataLiquidacao = { $exists: pago };
  };
  if (!!categoria) filter.categoria = categoria;

  return new Promise(async (resolve, reject) => {
    try {
      var result = await Transacao.find(filter).sort({dataInicial:1, descricao: 1});
      result = result.map(item=>Transacao.toObjectInstance(item));
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Remove uma nova transacao
 * Remove uma nova transacao
 *
 * transacaoId Long ID da transacao
 * no response value expected for this operation
 **/
exports.transacaoIdDELETE = function (transacaoId) {
  return new Promise(async (resolve, reject) => {
    try {
      var id = new mongoose.Types.ObjectId(transacaoId);
      var transacao = await Transacao.findByIdAndDelete(id)
      if (!transacao) {
        resolve(respondWithCode(404, `Transação não encontrada`));
        return;
      }
      resolve(Transacao.toObjectInstance(transacao))
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Busca os dados de uma transacao pelo Id
 * Returna uma única transacao
 *
 * transacaoId Long ID da transacao
 * returns Transacao
 **/
exports.transacaoIdGET = function (transacaoId) {
  return new Promise(async (resolve, reject) => {
    try {
      var id = new mongoose.Types.ObjectId(transacaoId);

      var transacao = await Transacao.findById(id);
      if (!transacao) {
        resolve(respondWithCode(404, `Transação não encontrada`));
        return;
      }
      resolve(Transacao.toObjectInstance(transacao));

    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Adiciona uma nova transacao
 * Adiciona uma nova transacao
 *
 * body Transacao Cria uma nova transacao
 * returns Transacao
 **/
exports.transacaoPOST = function (body) {
  return new Promise(async (resolve, reject) => {
    try {
      const dbInstance = Transacao.toDBInstance(body);
      var transacao = new Transacao(dbInstance);
      transacao = await transacao.save();
      resolve(Transacao.toObjectInstance(transacao));
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Atualiza uma transacao
 * Atualiza uma transacao identificada pelo seu id
 *
 * body Transacao Dados da transacao
 * returns Transacao
 **/
exports.transacaoPUT = function (body) {
  return new Promise(async (resolve, reject) => {
    try {
      var id = new mongoose.Types.ObjectId(body._id);
      const dbInstance = Transacao.toDBInstance(body);
      var transacao = await Transacao.findByIdAndUpdate(id, dbInstance);

      if (!transacao) {
        resolve(respondWithCode(404, `Transação não encontrada`));
        return;
      }
      resolve();
    } catch (error) {
      error.code = 422;
      reject(error);
    }
  });
}
