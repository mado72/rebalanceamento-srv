'use strict';
var mongoose = require('mongoose');
var utils = require('../utils/writer.js');
const Aporte = mongoose.model('aporte');
const Provento = mongoose.model('provento');
const Retirada = mongoose.model('retirada');


module.exports.aporteGET = function (idCarteira, data) {
    const filter = {};
    if (!!idCarteira) {
        filter.idCarteira = idCarteira;
    }
    if (!!data) {
        filter.data = data;
    }
    return new Promise(async (resolve, reject) => {
        try {
            const aportes = Aporte.find(filter, null, { sort: { data: -1 } })
            resolve(aportes);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.aportePOST = function (aporte) {
    return new Promise(async (resolve, reject) => {
        try {
            const aporteSaved = await new Aporte(aporte).save();
            resolve(aporteSaved);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.aportePUT = function (aporte) {
    return new Promise(async (resolve, reject) => {
        try {
            const aporteUpdated = await Aporte.findByIdAndUpdate(new mongoose.Types.ObjectId(aporte._id), aporte);
            resolve(aporteUpdated);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.aporteDELETE = function (aporteId) {
    return new Promise(async (resolve, reject) => {
        try {
            const deleted = await Aporte.findByIdAndDelete(aporteId);
            if (! deleted) {
                throw new utils.ResponseError(404, `Aporte ${aporteId} não encontrado`)
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.proventoGET = function (dataInicio, dataFim, agregado) {
    const filter = {};
    if (!!dataInicio &&!!dataFim) {
        filter.data = { $gte: dataInicio, $lte: dataFim };
    }
    return new Promise(async (resolve, reject) => {
        try {
            if (agregado) {
                const total = await Provento.aggregate([
                    { $match: filter },
                    { $group: { _id: {
                        idAtivo: "$idAtivo",
                        tipo: "$tipo"
                    }, total: { $sum: "$total" } } }
                ]);
                const result = total.map(item=>({...item._id, total: item.total}))
                resolve(result);
            } else {
                const proventos = await Provento.find(filter, null, { sort: { data: -1 } });
                resolve(proventos);
            }
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.proventoPOST = function (provento) {
    return new Promise(async (resolve, reject) => {
        try {
            const proventoSaved = await new Provento(provento).save();
            resolve(proventoSaved);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.proventoPUT = function (provento) {
    return new Promise(async (resolve, reject) => {
        try {
            const proventoUpdated = await Provento.findByIdAndUpdate(new mongoose.Types.ObjectId(provento._id), provento);
            resolve(proventoUpdated);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.proventoDELETE = function (proventoId) {
    return new Promise(async (resolve, reject) => {
        try {
            const deleted = await Provento.findByIdAndDelete(proventoId);
            if (! deleted) {
                throw new utils.ResponseError(404, `Provento ${proventoId} não encontrado`);
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.retiradaGET = function (dataInicio, dataFinal) {
    const filter = {};
    if (!!dataInicio &&!!dataFinal) {
        filter.data = { $gte: dataInicio, $lte: dataFinal };
    }
    return new Promise(async (resolve, reject) => {
        try {
            const retiradas = await Retirada.find(filter, null, { sort: { data: -1 } });
            resolve(retiradas);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.retiradaPOST = function (retirada) {
    return new Promise(async (resolve, reject) => {
        try {
            const retiradaSaved = await new Retirada(retirada).save();
            resolve(retiradaSaved);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.retiradaPUT = function (retirada) {
    return new Promise(async (resolve, reject) => {
        try {
            const retiradaUpdated = await Retirada.findByIdAndUpdate(new mongoose.Types.ObjectId(retirada._id), retirada);
            resolve(retiradaUpdated);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.retiradaDELETE = function (retiradaId) {
    return new Promise(async (resolve, reject) => {
        try {
            const deleted = await Retirada.findByIdAndDelete(retiradaId);
            if (! deleted) {
                throw new utils.ResponseError(404, `Retirada ${retiradaId} não encontrada`)
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}
