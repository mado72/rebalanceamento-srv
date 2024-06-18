'use strict';
var Model = require('../models/model');
var mongoose = require('mongoose');
const { respondWithCode } = require('../utils/writer');
const Ativo = mongoose.model('ativo');
const Carteira = mongoose.model('carteira');
const CarteiraAtivo = mongoose.model('carteiraAtivo');

/**
 * Lista os ativos disponíveis
 * Lista os ativos cadastrados
 *
 * tipoAtivo Tipo de Ativo  (optional)
 * returns List
 **/
exports.ativoGET = function (tipoAtivo, termo) {
  return new Promise(async function (resolve, reject) {
    var filter = {};
    !!tipoAtivo && (filter.tipoAtivo = tipoAtivo);
    !!termo && (filter.$or = [
      {nome : {$regex: new RegExp(termo, 'i')}}, 
      {sigla : {$regex: new RegExp(termo, 'i')}}, 
      {descricao : {$regex: new RegExp(termo, 'i')}}]);
    try {
      var result = await Ativo.find(filter);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}


/**
 * Remove um ativo
 * Remove um ativo identificado pelo seu id
 *
 * ativoId Long Id do ativo
 * no response value expected for this operation
 **/
exports.ativoIdDELETE = function (ativoId) {
  return new Promise(async function (resolve, reject) {
    try {
      var id = new mongoose.Types.ObjectId(ativoId);
      var result = await Model.ativo.findByIdAndDelete(id);
      if (!result) {
        resolve(respondWithCode(404, `Não encontrado ${ativoId}`));
      }
      else {
        resolve(result);
      }
    } catch (error) {
      error.code = 422;
      reject(error);
    }
  });
}


/**
 * Obtém um ativo
 * Obtém um ativo pelo seu id
 *
 * ativoId Long Id do ativo
 * returns Ativo
 **/
exports.ativoIdGET = function (ativoId) {
  console.log(ativoId);
  return new Promise(function (resolve, reject) {
    var id = new mongoose.Types.ObjectId(ativoId);
    Ativo.findById(id).then(result => {
      if (!result) {
        resolve(respondWithCode(404, `Não encontrado ${result}`));
      }
      else {
        resolve(result);
      }
    })
      .catch(err => {
        reject(err);
      });
  });
}


/**
 * Adiciona um ativo
 * Adiciona um ativo ao portifólio
 *
 * body Ativo Dados do Ativo
 * returns Ativo
 **/
exports.ativoPOST = function (body) {
  return new Promise(async function (resolve, reject) {
    try {
      var ativo = new Ativo(body);
      var result = await ativo.save();
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Atualiza um ativo
 * Atualiza um ativo identificado pelo seu id
 *
 * body Ativo Dados do ativo
 * no response value expected for this operation
 **/
exports.ativoPUT = function (body) {
  return new Promise(async function (resolve, reject) {
    var id = new mongoose.Types.ObjectId(body._id);
    try {
      var result = await Ativo.findByIdAndUpdate(id, body);
      if (!result) {
        resolve(respondWithCode(404, `Não encontrado ${id}`));
        return;
      }
      resolve(result);
    } catch (error) {
      error.code = 422;
      reject(error);
    }
  });
}


/**
 * Obtém lista de carteiras do portifólio
 * Recebe um array de Carteira
 *
 * moeda Moeda  (optional)
 * classe Classe  (optional)
 * returns List
 **/
exports.carteiraGET = function (moeda, classe) {
  return new Promise(async function (resolve, reject) {
    var filter = {};
    if (!!moeda) filter.moeda = moeda;
    if (!!classe) filter.classe = classe;

    try {
      var result = await Carteira.find(filter);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  })
};

/**
 * Obtém as alocações dos ativos de uma carteira
 * Obtém os ativos de uma carteira identificada pelo seu id
 *
 * carteiraId Long Id da carteira
 * returns List
 **/
exports.carteiraIdAlocacaoGET = function (carteiraId) {
  return new Promise(async (resolve, reject) => {
    var id = new mongoose.Types.ObjectId(carteiraId);

    try {
      var carteira = await Carteira.findById(id);
      if (!carteira) {
        resolve(respondWithCode(404, `Não encontrado ${carteiraId}`));
        return;
      }
      var mapIdAtivos = new Map(carteira.ativos.map(ativo=>[ativo.ativoId.toString(), ativo]));

      var ativosId = Array.from(mapIdAtivos.keys());
      var ativos = await Ativo.find({ _id: { $in: ativosId } });

      var result = ativos.map(ativo => {
        var ativoCarteira = mapIdAtivos.get(ativo._id.toString()).toObject();
        ativoCarteira.ativo = ativo.toObject();
        return ativoCarteira;
      });
      carteira = carteira.toObject();
      carteira.ativos = result;
      resolve(carteira);

    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Atualiza as alocações de um conjunto de ativos em uma carteira
 * Atualiza as alocações de um conjunto de ativos em uma carteira identificada pelo seu id
 *
 * body List Dados das alocações
 * carteiraId Long Id da carteira
 * returns List
 **/
exports.carteiraIdAlocacaoPOST = function (body, carteiraId) {
  return new Promise(async (resolve, reject) => {
    var id = new mongoose.Types.ObjectId(carteiraId);
    try {
      var carteira = await Carteira.findById(id);
      if (!carteira) {
        resolve(respondWithCode(404, `Não encontrado ${carteiraId}`));
        return;
      }

      var ativos = {};
      body.forEach(item=>{
        ativos[item.ativoId] = new CarteiraAtivo(item);
      });
      carteira.ativos = Object.values(ativos);
      await carteira.save();
      resolve(carteira);
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Remove uma carteira
 * Remove uma carteira identificada pelo seu id
 *
 * carteiraId Long Id da carteira
 * no response value expected for this operation
 **/
exports.carteiraIdDELETE = function (carteiraId) {
  return new Promise(async (resolve, reject) => {
    try {
      var id = new mongoose.Types.ObjectId(carteiraId);
      var result = await Carteira.findByIdAndDelete(id);
      if (!result) {
        resolve(respondWithCode(404, `Não encontrado ${carteiraId}`));
        return;
      }
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Obtém uma carteira
 * Obtém uma carteira identificada pelo seu id
 *
 * carteiraId Long Id da carteira
 * returns Carteira
 **/
exports.carteiraIdGET = function (carteiraId) {
  return new Promise(async (resolve, reject) => {
    try {
      var id = new mongoose.Types.ObjectId(carteiraId);
      var carteira = Carteira.findById(id);
      if (!carteira) {
        resolve(respondWithCode(404, `Não encontrado ${carteiraId}`));
        return;
      }
      resolve(carteira);

    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Adiciona uma carteira
 * Adiciona uma carteira ao portifólio
 *
 * body Carteira Dados da carteira
 * returns Carteira
 **/
exports.carteiraPOST = function (body) {
  return new Promise(async (resolve, reject) => {
    try {
      var carteira = new Carteira(body);
      var result = await carteira.save();
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Atualiza uma carteira
 * Atualiza uma carteira identificada pelo seu id
 *
 * body Carteira Dados da carteira
 * returns Carteira
 **/
exports.carteiraPUT = function (body) {
  return new Promise(async (resolve, reject) => {
    try {
      var carteira = Carteira.findByIdAndUpdate(body._id, body);
      if (!carteira) {
        resolve(respondWithCode(404, `Não encontrado ${body._id}`));
        return;
      }
      resolve(carteira);
    } catch (error) {
      reject(error);
    }
  });
}

