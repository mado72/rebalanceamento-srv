'use strict';
var Model = require('../models/model');
var mongoose = require('mongoose');
const { respondWithCode } = require('../utils/writer');
const { format } = require('date-fns');
const Consolidado = mongoose.model('consolidado');
const Conta = mongoose.model('conta');

/**
 * Obtém lista de consolidados do portifólio
 * Recebe um array de Consolidado
 *
 * inicio yyyy-MM  (optional)
 * fim yyyy-MM  (optional)
 * returns List
 **/
exports.consolidadoGET = function(inicio, fim) {
  return new Promise(async (resolve, reject) => {
    try {
      var erros = [];
      var filter = montarFiltroIntervaloMeses(erros, inicio, fim);
      if (erros.length > 0) {
        reject(respondWithCode(422, erros));
        return;
      }
      var result = await Consolidado.find(filter);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Obtém lista de consolidados do portifólio para um determinado tipo
 * Recebe um array de Consolidado
 *
 * tipo Um dos valores CONTA, ACAO, FII, RF, INTL, TRADE, RESERVA, CRIPTO, SWING, PROVENTO, RETIRADA (optional)
 * inicio yyyy-MM  (optional)
 * fim yyyy-MM  (optional)
 * returns List
 **/
exports.consolidadoTipoGET = function(tipo, inicio, fim) {
  return new Promise(async (resolve, reject) => {
    try {
      var erros = [];
      var filter = montarFiltroIntervaloMeses(erros, inicio, fim);
      if (!!tipo) {
        if (!['CONTA', 'ACAO', 'FII', 'RF', 'INTL', 'TRADE', 'RESERVA', 'CRIPTO', 'SWING', 'PROVENTO', 'RETIRADA'].includes(tipo)) {
          erros.push(`Tipo ${tipo} inválido`);
        }
        else {
          filter.tipo = tipo;
        }
      }
      if (erros.length > 0) {
        reject(respondWithCode(422, erros));
        return;
      }
      var result = await Consolidado.find(filter);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Adiciona uma consolidado
 * Adiciona uma consolidado ao portifólio
 *
 * body Array de consolidados
 * returns Consolidados
**/
exports.consolidadoPOST = function(body) {
  return new Promise(async (resolve, reject) => {
    try {
      var errors = [];

      var consolidados = body.map(item=>{
        var consolidado = new Consolidado(item);

        if (!consolidado.ehValido()) {
          errors.push(item);
          return undefined;
        }

        console.log(consolidado.toJSON());

        if (!! item._id) {
          return {
            updateOne: {
              filter: { _id: consolidado._id },
              update: consolidado
            }
          }
        }
        return {
          insertOne: {
            document: consolidado
          }
        }
      });

      if (consolidados.length === 0) {
        errors.push(`Nenhum registro para salvar`);
      }

      if (errors.length > 0) {
        reject(respondWithCode(422, errors));
        return;
      }

      var result = await Consolidado.bulkWrite(consolidados);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

exports.consolidadoGerarPOST = function(anoMes) {
  return new Promise(async (resolve, reject) => {
    try {
      var contas = await Conta.find();
      anoMes = anoMes || parseInt(format(new Date(), 'yyyyMM'));

      if (!anoMesValido(anoMes)) {
        throw new Error(`anoMes gerado é inválido: ${anoMes}`)
      }

      var bulk = contas.map(conta=>conta.toObject()).map(conta=>{
        var consolidado = new Consolidado({
          idRef: conta._id.toString(),
          tipo: conta.tipo === "CARTAO" ? "CARTAO" : "CONTA",
          valor: conta.saldo,
          anoMes: anoMes
        });
        return {
          insertOne: {
            document: consolidado.toObject()
          }
        };
      });

      bulk.splice(0, 0, {
        deleteMany: {
          filter: { anoMes: anoMes }
        }
      });

      var result = await Consolidado.bulkWrite(bulk);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function montarFiltroIntervaloMeses(erros, inicio, fim) {
  var filter = {};
  if (!!inicio) {
    if (!anoMesValido(inicio)) {
      erros.push(`Inicio inválido: ${inicio}`);
    }
    else {
      filter.anoMes = {$gte: inicio};
    }
  }
  if (!!fim) {
    if (!anoMesValido(fim)) {
      erros.push(`Fim inválido: ${fim}`);
    }
    else {
      var filterFim = {$lte: fim};
      filter.anoMes = Object.assign((filter.anoMes || {}), filterFim);
    }
  }
  return filter;
}

function anoMesValido(anoMes) {
  var ano = anoMes / 100;
  var mes = anoMes % 100;
  return ! (ano < 1900 || ano > 2100 || mes < 1 || mes > 12);
}
