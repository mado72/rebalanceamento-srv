'use strict';
var Model = require('../models/model');
var mongoose = require('mongoose');
const { respondWithCode } = require('../utils/writer');
const Conta = mongoose.model('conta');

/**
 * Obtém lista de contas do portifólio
 * Recebe um array de Conta
 *
 * moeda Moeda  (optional)
 * returns List
 **/
exports.contaGET = function(moeda, conta) {
  return new Promise(async (resolve, reject) => {
    try {
      var filter = {};
      if (!!moeda) {
        filter.moeda = moeda;
      }
      if (!!conta) {
        filter.conta = {
          conta: new RegExp(conta, 'i')
        }
      }
      var result = await Conta.find(filter);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Remove uma conta
 * Remove uma conta identificada pelo seu id
 *
 * contaId Long Id da conta
 * no response value expected for this operation
 **/
exports.contaIdDELETE = function(contaId) {
  return new Promise(async (resolve, reject) => {
    try {
      var id = new mongoose.Types.ObjectId(contaId);
      var result = await Conta.findByIdAndDelete(id);
      if (!result) {
        resolve(respondWithCode(404, `Não encontrado ${contaId}`));
        return;
      }
      resolve(result);
    } catch (error) {
      reject(error);
    }
    resolve();
  });
}

/**
 * Obtém uma conta
 * Obtém uma conta identificada pelo seu id
 *
 * contaId Long Id da conta
 * returns Carteira
 **/
exports.contaIdGET = function(contaId) {
  return new Promise(async (resolve, reject) => {
    try {
      var id = new mongoose.Types.ObjectId(contaId);
      var result = await Conta.findById(id);
      if (!result) {
        resolve(respondWithCode(404, `Não encontrado ${contaId}`));
        return;
      }
      resolve(result);
    } catch (error) {
      reject(error);      
    }
  });
}

/**
 * Adiciona uma conta
 * Adiciona uma conta ao portifólio
 *
 * body Conta Dados da conta
 * returns Conta
**/
exports.contaPOST = function(body) {
  return new Promise(async (resolve, reject) => {
    try {
      var conta = new Conta(body);
      var result = await conta.save();
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Atualiza uma conta
 * Atualiza uma conta identificada pelo seu id
*
 * body Conta Dados da conta
 * returns Conta
 **/
exports.contaPUT = function(body) {
  return new Promise(async (resolve, reject) => {
    try {
      var id = new mongoose.Types.ObjectId(body._id);
      var result = await Conta.findByIdAndUpdate(id, body);
      if (!result) {
        resolve(respondWithCode(404, `Não encontrado ${result}`));
        return;
      }
      resolve(result);
    } catch (error) {
      error.code = 422;
      reject(error);
    }
  });
}

/*
 * Retorna o saldo total das contas
 **/
exports.contasSaldoTotalGET = function() {
  return new Promise(async (resolve, reject) => {
    try {
      var result = await Conta.aggregate([
        { $group: { _id: null, total: { $sum: "$saldo" } } }
      ]);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}