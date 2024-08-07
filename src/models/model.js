var mongoose = require('mongoose');
const { format } = require('date-fns');
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

const TipoTransacao = Object.freeze({
    DEBITO : "DEBITO",
    CREDITO : "CREDITO",
    DIVIDENDO: "DIVIDENDO",
    JCP : "JCP",
    TAXA: "TAXA",
    BONUS: "BONUS",
    EXTRA: "EXTRA"
})

const TipoPeriodicidade = Object.freeze({
    SEMANAL : "SEMANAL",
    QUINZENAL : "QUINZENAL",
    MENSAL : "MENSAL",
    TRIMESTRAL : "TRIMESTRAL",
    SEMESTRAL : "SEMESTRAL",
    ANUAL : "ANUAL",
    UNICO: "UNICO"
})

const TipoLiquidacao = Object.freeze({
    Conta: "Conta",
    CARTAO: "CARTAO",
    OUTROS: "OUTROS"
})

const TipoConta = Object.freeze({
    CORRENTE : "CORRENTE",
    POUPANCA : "POUPANCA",
    CARTAO : "CARTAO",
    INVESTIMENTO : "INVESTIMENTO"
})

const TipoMoeda = Object.freeze({
    BRL : "BRL",
    USD : "USD",
    USDT : "USDT"
})

const TipoMoedaSigla = Object.freeze({
    BRL : "BRL",
    USD : "USD",
    USDT : "USDT"
})

const TipoClasse = Object.freeze({
    Moeda : "Moeda",
    Acao : "Acao",
    FII : "FII",
    PosFixada: "PosFixada",
    CDB : "CDB",
    RF : "RF",
    ETF : "ETF",
    Referencia : "Referencia",
    Cripto : "Cripto",
})

const TipoConsolidado = Object.freeze({
    Conta : "Conta",
    Acao : "Acao",
    FII : "FII",
    ETF : "ETF",
    RF : "RF",
    CDB : "CDB",
    PosFixada : "PosFixada",
    Trade : "Trade",
    Reserva : "Reserva",
    Cripto : "Cripto",
    SwingTrade : "SwingTrade",
    Provento : "Provento",
    JCP: "JCP",
    Aluguel: "Aluguel",
    Retirada : "Retirada"
})

const TipoStatusColeta = Object.freeze({
    ERRO : "ERRO",
    CONCLUIDA : "CONCLUIDA"
})

const MetodoCotacao = Object.freeze({
    manual: "manual",
    yahoo: "yahoo",
    tesouro: "tesouro",
    referencia: "referencia"
})

const TipoProvento = Object.freeze({
    Dividendo: "Dividendo",
    JCP: "JCP",
    Aluguel: "Aluguel",
    Taxa: "Taxa",
    Bonus: "Bonus",
    Outros: "Outros"
})

var Transacao = new Schema({
    descricao: { type: String, required: true}, // Descrição da transação
    valor: {type: Number, required: true}, // Valor da transação
    periodicidade: {type: String, required: true, enum: Object.values(TipoPeriodicidade)}, // Periodicidade da transação (mensal, trimestral, anual, etc.)
    tipoTransacao: {type: String, required: true, enum: Object.values(TipoTransacao)}, // Tipo da transação
    dataInicial: {type: String, required: true}, // Data de vencimento da transação
    dataFinal: {type: String}, // Data final da recorrência (opcional)
    origem: {type: String}, // Identifica se a transação surgiu de uma transação anterior (opcional)
    categoria: {type: String}, // Identifica a categoria da transação (opcional)
    liquidacao: {type: String, required: true, enum: Object.values(TipoLiquidacao)}, // Tipo de liquidação
    dataLiquidacao: {type: String}, // Data em que a transação foi paga (opcional)
    contaLiquidacao: {type: String}, // Conta de Liquidação
}, {
    statics: {
        toObjectInstance: (dbInstance)=> {
            var obj = dbInstance.toObject();
            if (!! obj.periodicidade) obj.periodicidade = TipoPeriodicidade[obj.periodicidade];
            if (!! obj.liquidacao) obj.liquidacao = TipoLiquidacao[obj.liquidacao];
            return obj;
        },
        toDBInstance: (obj) => {
            if (typeof obj.dataInicial === "object" && obj.dataInicial.getMonth && typeof obj.dataFinal.getMonth === 'function') obj.dataInicial = format(obj.dataInicial, 'yyyy-MM-dd');
            if (typeof obj.dataFinal === "object" && !! obj.dataFinal && obj.dataFinal.getMonth && typeof obj.dataFinal.getMonth === 'function') obj.dataFinal = format(obj.dataFinal, 'yyyy-MM-dd');
            if (typeof obj.dataLiquidacao === "object" && !! obj.dataLiquidacao && obj.dataLiquidacao.getMonth && typeof obj.dataLiquidacao.getMonth === 'function') obj.dataLiquidacao = format(obj.dataLiquidacao, 'yyyy-MM-dd');
            if (typeof obj.periodicidade === "object") obj.periodicidade = TipoPeriodicidade[obj.periodicidade];
            if (! obj.contaLiquidacao) obj.contaLiquidacao = null;
            if (!! obj.liquidacao) obj.liquidacao = TipoLiquidacao[obj.liquidacao];
            return obj;
        }
    }
});

var CarteiraAtivo = new Schema({
    _id: false,
    ativoId: { type: mongoose.Schema.Types.ObjectId, ref: 'ativo', index: true, unique: true }, // Referência ao ativo
    quantidade: {type: Number, required: true}, // Quantidade do ativo na carteira
    objetivo: {type: Number, required: true}, // Objetivo do ativo na carteira
    vlInicial: {type: Number, required: true}, // Valor Inicial do ativo na carteira
    vlAtual: {type: Number, required: true}, // Valor Atual do ativo na carteira
});

var Carteira = new Schema({
    nome: {type: String, required: true, index: true, unique: true}, // Nome da carteira
    moeda: {type: String, required: true, enum: Object.values(TipoMoeda)}, // Moeda da carteira
    objetivo: {type: Number, required: true}, // Objetivo da carteira
    classe: {type: String, required: true, enum: Object.values(TipoClasse)}, // Classe da carteira
    ativos: [CarteiraAtivo], // Ativos
});

var ReferenciaCarteira = new Schema({
    _id: false,
    id: {type: mongoose.Schema.Types.ObjectId, ref: 'carteira', index: true, unique: true}, // ID de referência da carteira
    tipo: {type: String, required: true}, // Tipo de referência da carteira
})

var Ativo = new Schema({
    nome: {type: String, required: true, index: true, unique: true}, // Nome do ativo
    moeda: {type: String, required: true, enum: Object.values(TipoMoeda)}, // Moeda do ativo
    sigla: {type: String, required: true, index: true, unique: true}, // Simbolo do ativo
    siglaYahoo: {type: String, required: false, index: true, unique: true}, // Simbolo do ativo no Yahoo
    descricao: {type: String}, // Descrição do ativo
    setor: {type: String, required: true}, // Setor do ativo
    tipo: {type: String, required: true, enum: Object.values(TipoClasse)}, // Classe do ativo
    cotacao: {type: Number, format: 'double', required: false}, // Cotação do ativo
    referencia: {type: ReferenciaCarteira, required: false}, // Referência da carteira,
    metodo: {type: String, required: true, enum: Object.values(MetodoCotacao)}, // Método de atualização da cotação do ativo
})

var Conta = new Schema({
    conta: {type: String, required: true}, // Conta 
    saldo: {type: Number, required: true}, // Saldo da Conta
    moeda: {type: String, required: true, enum: Object.values(TipoMoeda)}, // Moeda da Conta
    tipo: {type: String, required: true, enum: Object.values(TipoConta)}, // Tipo da Conta}
},
/* {
    methods: {
        getSaldoTotal() {
            return new mongoose.model('Conta'),aggregate({
                $group: {
                    _id: null,
                    total: { $sum: "$saldo" }
                }
            })
        }
    },
    query: {
        byName(name) {
            return this.where({ conta: new RegExp(name, 'i')});
        }
    }
}*/)


var Consolidado = new Schema(
    {
        idRef: {type: String, required: true, index: true}, // Conta 
        tipo: {type: String, required: true, enum: Object.values(TipoConsolidado)}, // Tipo da Consolidado
        valor: {type: Number, required: true}, // Valor da Consolidado
        anoMes: {type: Number, required: true, index: true}, // Ano e Mês da Consolidado
    },
    {
        methods: {
            ehValido() {
                var ano = this.anoMes / 100;
                var mes = this.anoMes % 100;
                return ! (ano < 1900 || ano > 2100 || mes < 1 || mes > 12);
            }
        }
    }
)

var Cotacao = new Schema({
    simbolo: {type: String, required: true}, // Simbolo da cotação
    data: {type: String, required: true}, // Data da cotação
    dataColeta: {type: String, required: true}, // Data hora da coleta da cotação
    // abertura: {type: Number, format: 'double', required: true}, // Abertura da cotação
    // fechamento: {type: Number, format: 'double', required: true}, // Fechamento da cotação
    // volume: {type: Number, format: 'double', required: true}, // Volume da cotação
    moeda: {type: String, required: true, enum: Object.values(TipoMoeda)}, // Moeda da cotação
    preco: {type: Number, format: 'double', required: true}, // Valor da cotação
    manual: {type: Boolean, required: false, default: false}, //
    variacao: {type: Number, format: 'double', required: false}, // Variacao da cotação
    nome: {type: String, required: false}, // Nome da cotação
    curto: {type: String, required: false}, // Nome curto da cotação
    minima: {type: Number, format: 'double', required: false}, // Minima da cotação
    maxima: {type: Number, format: 'double', required: false}, // Maxima da cotação
    dividendo: {type: Number, format: 'double', required: false}, // Dividendo da cotação
    dividendoTaxa: {type: Number, format: 'double', required: false}, // Taxa do dividendo
    horaMercado: {type: String, required: false} // Hora do mercado 
})

Cotacao.index({simbolo: 1, data: 1}, {unique: true});

var StatusColeta = new Schema({
    simbolo: {type: String, required: true}, // Simbolo da coleta,
    data: {type: String, required: true}, // Data da coleta,
    dataColeta: {type: String, required: true}, // Data hora da coleta da cotação,
    status: {type: String, required: true, enum: Object.values(TipoStatusColeta)}, // Status da coleta
    mensagem: {type: String, required: false}, // Mensagem da coleta
})

var Aporte = new Schema({
    idCarteira: {type: mongoose.Schema.Types.ObjectId, ref: 'carteira', required: true}, // ID da Conta
    idAtivo: {type: mongoose.Schema.Types.ObjectId, ref: 'ativo', required: true}, // ID do Ativo
    data: {type: String, required: true}, // Data do Aporte
    quantidade: {type: Number, required: true}, // Quantidade do Aporte
    valorUnitario: {type: Number, required: true}, // Valor Unitário do Aporte
    total: {type: Number, required: true}, // Total do Aporte
})

Aporte.index({idCarteira: 1, idAtivo: 1}, {unique: true})

var Provento = new Schema({
    idAtivo: {type: mongoose.Schema.Types.ObjectId, ref: 'ativo', required: true}, // ID do Ativo
    idConta: {type: mongoose.Schema.Types.ObjectId, ref: 'conta', required: true}, // ID do Ativo
    data: {type: String, required: true}, // Data do Provento
    tipo: {type: String, required: true, enum: Object.values(TipoProvento)}, // Tipo do Provento
    total: {type: Number, required: true}, // Total do Provento
})

Provento.index({idAtivo: 1, idConta: 1, data: 1}, {unique: true})

var Retirada = new Schema({
    data: {type: String, required: true}, // Data da Retirada
    valor: {type: Number, required: true}, // Retirada
})

module.exports = {
    'tipo-moeda': TipoMoeda,
    'tipo-moeda-sigla': TipoMoedaSigla,
    'tipo-conta': TipoConta,
    'tipo-classe': TipoClasse,
    'tipo-periodicidade': TipoPeriodicidade,
    'tipo-liquidacao': TipoLiquidacao,
    'tipo-consolidado': TipoConsolidado,
    'tipo-status-coleta': TipoStatusColeta,
    'metodo-cotacao': MetodoCotacao,
    'tipo-provento': TipoProvento,
    'ativo': mongoose.model('ativo', Ativo, 'ativo'),
    'transacao': mongoose.model('transacao', Transacao, 'transacao'),
    'carteira': mongoose.model('carteira', Carteira, 'carteira'),
    'carteiraAtivo': mongoose.model('carteiraAtivo', CarteiraAtivo),
    'conta': mongoose.model('conta', Conta, 'conta'),
    'consolidado': mongoose.model('consolidado', Consolidado, 'consolidado'),
    'cotacao': mongoose.model('cotacao', Cotacao, 'cotacao'),
    'status-coleta': mongoose.model('status-coleta', StatusColeta, 'statusColeta'),
    'aporte': mongoose.model('aporte', Aporte, 'aporte'),
    'provento': mongoose.model('provento', Provento, 'provento'),
    'retirada': mongoose.model('retirada', Retirada, 'retirada'),
}