'use strict';
var mongoose = require('mongoose');
const Cotacao = mongoose.model('cotacao');
const Ativo = mongoose.model('ativo');
const StatusColeta = mongoose.model('status-coleta');

var Model = require('../models/model');

const yahooFinance = require('yahoo-finance2').default;
const { exec } = require('child_process');
const { format, differenceInDays, formatDate } = require('date-fns');

const { Queue } = require('../utils/queue.js')

function cotacaoYahooGET(simbolo) {
    return new Promise((resolve, reject) => {
        yahooFinance.quoteSummary(simbolo, {}).then((quote)=>{
            resolve(quote);
        })
        .catch((err) =>{
            reject(err);
        });
        // execYahooCli(simbolo, reject, resolve);
    });
}
module.exports.cotacaoYahooGET = cotacaoYahooGET;

module.exports.cotacaoSummaryGET = function (simbolo) {
    return new Promise((resolve, reject) => {
        yahooFinance.quoteSummary(simbolo, {}).then((quote)=>{
            resolve(quote);
        })
        .catch((err) =>{
            reject(err);
        });
    });
}

function cotacaoYahooSummaryGET(simbolo) {
    return new Promise((resolve, reject) => {
        cotacaoYahooGET(simbolo)
            .then((response) => {
                if (!!response && response.indexOf && response.indexOf('undefined') == 0) {
                    reject(`Não foi possível obter a cotação ${simbolo}`);
                    return;
                }
                const quote = (response.indexOf && JSON.parse(response)) || (response.price);
                const result = {
                    simbolo: quote.symbol,
                    moeda: quote.currency,
                    variacao: quote.regularMarketChangePercent,
                    preco: quote.regularMarketPrice,
                    nome: quote.longName,
                    curto: quote.shortName,
                    minima: quote.regularMarketDayRange ? quote.regularMarketDayRange.low : undefined,
                    maxima: quote.regularMarketDayRange ? quote.regularMarketDayRange.high : undefined,
                    dividendo: quote.dividendYield,
                    dividendoTaxa: quote.dividendRate,
                    horaMercado: quote.regularMarketTime
                }
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports.cotacaoYahooSummaryGET = cotacaoYahooSummaryGET;

const mapCotacoesBatch = new Map();

module.exports.atualizarCotacoesBatchGET = function () {
    return new Promise((resolve, reject) => {
        resolve(Object.fromEntries(mapCotacoesBatch.entries()));
    })
}

module.exports.atualizarCotacoesBatchPUT = function () {
    Array.from(mapCotacoesBatch.entries)
        .filter((key, value) => differenceInDays(new Date(), value.data) > 0)
        .map((key, value) => key)
        .forEach(key=> mapCotacoesBatch.delete(key))

    return new Promise(async (resolve, reject) => {
        try {
            const uuid = crypto.randomUUID();
            var ativos = await Ativo.find({metodo: "yahoo"});
            await atualizarCotacoesYahoo(ativos, uuid).then((result) => resolve(result)).catch((err) => reject(err));
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.atualizarCotacaoBatchPUT = function (sigla) {
    return new Promise(async (resolve, reject) => {
        try {
            const hoje = format(new Date(), 'yyyy-MM-dd');
            const now = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");

            this.cotacaoYahooSummaryGET(sigla).then(async (response) => {
                await atualizarCotacao(response, hoje, now);
                const status = new StatusColeta({
                    simbolo: sigla,
                    data: hoje,
                    dataColeta: now,
                    status: 'CONCLUIDA',
                    mensagem: 'Manual'
                });
                status.save();
            })
                .catch((error) => {
                    console.error(error);
                    const status = new StatusColeta({
                        simbolo: sigla,
                        data: hoje,
                        dataColeta: now,
                        status: 'ERRO',
                        mensagem: error.message
                    });
                    status.save();
                });
            resolve(sigla);
        } catch (error) {
            reject(error);
        }
    });
}

async function atualizarCotacoesYahoo(ativos, uuid) {
    return new Promise(async (resolve, reject) => {
        try {
            var siglas = ativos.map((ativo) => ativo.siglaYahoo);
        
            const hoje = format(new Date(), 'yyyy-MM-dd');
        
            var siglasComCotacoesHoje = (await Cotacao.find({ data: hoje, simbolo: { "$in": siglas } })).map(item => item.simbolo);
        
            if (siglasComCotacoesHoje.length != siglas.length) {
                siglas = siglas.filter(sigla => !siglasComCotacoesHoje.includes(sigla));
            }
        
            const totalizador = {
                data: new Date(),
                total: siglas.length,
                processados: 0,
                erros: 0,
                status: 'processando'
            };
        
            mapCotacoesBatch.set(uuid, totalizador);
        
            siglas.forEach((sigla) => {
                const now = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
                const statusColeta = new StatusColeta({
                    simbolo: sigla,
                    data: hoje,
                    dataColeta: now,
                    status: 'INICIADA'
                });
        
                const queueResolve = (async (response, data) => {
                    await atualizarCotacao(response, data.hoje, format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"));
                    data.statusColeta.status = 'CONCLUIDA';
                    data.statusColeta.save();
        
                    totalizador.processados++;
                    totalizador.status = totalizador.processados + totalizador.erros < totalizador.total ? 'processando' : 'concluido';
                    mapCotacoesBatch.set(uuid, totalizador);
                });
        
                const queueReject = (error, data) => {
                    console.error(error);
                    data.statusColeta.status = 'ERRO';
                    data.statusColeta.mensagem = error.message ? error.message : error;
                    data.statusColeta.save();
        
                    totalizador.erros++;
                    totalizador.status = 'processando';
                    mapCotacoesBatch.set(uuid, totalizador);
                };
        
                Queue.enqueue(
                    () => cotacaoYahooSummaryGET(sigla),
                    queueResolve,
                    queueReject,
                    { simbolo: sigla, hoje, now, statusColeta }
                ).then(() => {
                    totalizador.status = 'sucesso';
                }).catch((err) => {
                    totalizador.status = 'erro';
                    totalizador.error = err;
                });
            });
            resolve({ siglas, uuid, data: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss") });
        } catch (error) {
            reject(error);
        }
    });
}

function execYahooCli(simbolo, reject, resolve) {
    exec(`npx yahoo-finance2 quote ${simbolo}`, (err, stdout, stderr) => {
        if (err) {
            reject(err);
        } else {
            stdout = stdout.split('\n').filter((_, idx) => idx >= 3).join('\n');
            resolve(stdout);
        }
    });
}

async function atualizarCotacao(response, hoje, now) {
    const filter = {
        simbolo: response.simbolo,
        data: hoje
    };
    const dbCotacao = await Cotacao.find(filter);
    const dadosCotacao = responseToCotacao(response, hoje, now);

    if (dbCotacao && dbCotacao.length) {
        const update = {
            $set: dadosCotacao
        };
        await Cotacao.updateOne(filter, update);
    }
    else {
        const newCotacao = new Cotacao(dadosCotacao);
        await newCotacao.save();
    }
}

const MOEDAS = {
    "BRL": "BRL",
    "USD": "USD",
    "USDT": "USDT"
}

const TIPOS = {
    "CRYPTOCURRENCY": "CRIPTO",
    "CURRENCY": "REFERENCIA",
    "ETF": "FUNDO",
    "EQUITY": "ACAO",
    "FUTURE": "RF",
    "INDEX": "FUNDO",
    "MUTUALFUND": "FUNDO",
    "OPTION": "ACAO",
    undefined: "REFERENCIA"
}

function responseToCotacao(response, hoje, now) {
    return {
        simbolo: response.simbolo,
        moeda: MOEDAS[response.moeda],
        data: hoje,
        dataColeta: now,
        variacao: response.variacao,
        preco: response.preco,
        nome: response.nome,
        curto: response.curto,
        minima: response.minima,
        maxima: response.maxima,
        dividendo: response.dividendo,
        dividendoTaxa: response.dividendoTaxa,
        horaMercado: response.horaMercado,
        atualizacao: now
    };
}

module.exports.cotacaoGET = function (data, simbolos) {
    if (typeof simbolos === 'string') {
        simbolos = simbolos.split(',');
    }

    return new Promise(async (resolve, reject) => {
        try {
            // const ultimasCotacoes = await Cotacao.aggregate([{"$match": {"simbolo": {"$in": simbolos}}},{"$group":{"_id": "$simbolo", "maxdata": {$max: "$data"}}}]);
            const aggFilter = {
                "$match": {
                    simbolo: {
                        "$in": simbolos
                    }
                }
            }
    
            if (!!data) {
                aggFilter["$match"].data = {
                    $lte: data
                }
            }
    
            const agg = [
                aggFilter,
                {"$group":{"_id": "$simbolo", "maxdata": {$max: "$data"}}}
            ];
            const ultimasCotacoes = await Cotacao.aggregate(agg);
            if (!ultimasCotacoes.length) {
                resolve([]);
                return;
            }
            const fields = ultimasCotacoes.map(cotacao => {
                return {
                    simbolo: cotacao._id,
                    data: cotacao.maxdata
                }
            });
            const filter = fields.length > 1 ? {"$or": fields} : fields[0];
            const cotacoes = await Cotacao.find(filter);
            resolve(cotacoes);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.cotacaoPOST = function (dados) {
    return new Promise(async (resolve, reject) => {
        try {
            const filter = {
                data: dados.data || format(new Date(), 'yyyy-MM-dd'),
                simbolo: dados.simbolo
            }
            let cotacao = await Cotacao.findOneAndUpdate(filter, dados);
            if (!cotacao) {
                cotacao = await new Cotacao(dados).save();
            }
            resolve(cotacao.toObject());
        } catch (error) {
            reject(error);
        }
    });
}