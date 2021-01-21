const moment = require('moment')
const conexao = require('../infraestrutura/conexao')

class Atendimento {
    adiciona(atendimento, res) {
        const dataCriacao = moment().format('YYYY-MM-DD hh:mm:ss') // fornece data atual já no formato solicitado
        const data = moment(atendimento.data, 'DD/MM/YYYY hh:mm').format('YYYY-MM-DD hh:mm:ss') // formata a data vinda do usuário (agendada)
        
        // validação de data e cliente
        const dataEhValida = moment(data).isSameOrAfter(dataCriacao) // data maior igual ou atual, senão retorna "false"
        const clienteEhValido = atendimento.cliente.length >= 5 // cliente deve ter mais que 5 caracteres, senão retorna "false"
        const validacoes = [
            {nome: 'data', valido: dataEhValida, mensagem: 'Data deve ser maior ou igual à data atual.'},
            {nome: 'cliente', valido: clienteEhValido, mensagem: 'Cliente deve ter pelo menos 5 caracteres.'}
        ]
        const erros = validacoes.filter(campo => !campo.valido) //se um deles não for válido (!false), retorna o erro
        const existemErros = erros.length // se for 0, é falso

        if(existemErros) {
            res.status(400).json(erros)
        } else {
            const atendimentoDatado = {...atendimento, dataCriacao, data}
            const sql = 'INSERT INTO Atendimentos SET ?'
    
            conexao.query(sql, atendimentoDatado, (erro, resultados) => {
                if(erro) {
                    res.status(400).json(erro)
                } else {
                    res.status(201).json(atendimento)
                }
            })
        }
        }

    lista(res) {
        const sql = 'SELECT * FROM Atendimentos'

        conexao.query(sql, (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(201).json(resultados)
            }
        })
    }

    buscaPorId(id, res) {
        const sql = `SELECT * FROM Atendimentos WHERE id=${id}`

        conexao.query(sql, (erro, resultados) => {
            const atendimento = resultados[0]
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(201).json(atendimento)
            }
        })
    }

    altera(id, valores, res) {
        if(valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY hh:mm').format('YYYY-MM-DD hh:mm:ss')
        }

        const sql = `UPDATE Atendimentos SET ? WHERE id=?`

        conexao.query(sql, [valores, id], (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(201).json({...valores, id})
            }
        })
    }

    deleta(id, res) {
        const sql = `DELETE FROM Atendimentos WHERE id=?`

        conexao.query(sql, id, (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(201).json({id})
            }
        })
    }
}

module.exports = new Atendimento