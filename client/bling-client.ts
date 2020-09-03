import qs from 'querystring'
import converter from 'xml-js'

import Axios from 'axios'

if (!process.env['BLING_API_KEY']) {
    throw new Error('Informe a chave de API da plataforma Bling');
}

const apikey = process.env['BLING_API_KEY'];
const axios = Axios.create({
    baseURL: 'https://bling.com.br/Api/v2',
    params: { apikey }
});

export default class BlingClient {

    public async getPedidos(): Promise<Pedido[]> {
        const response = await axios.get('/pedidos/json');
        const retorno = response.data['retorno'];

        if (retorno['erros']) {
            const erro = retorno['erros'].erro || retorno['erros'][0].erro;
            throw new Error(erro.msg);
        }

        return (retorno['pedidos'] as any[])
            .map(e => e['pedido']);
    }

    public async adicionarPedido(cliente: string, item: Item): Promise<Pedido> {
        const options = { compact: true, ignoreComment: true, indentText: false };
        const xml = converter.js2xml({
            pedido: {
                cliente: {
                    nome: cliente
                },
                pedido: {
                    itens: { item }
                }
            }
        }, options);

        const response = await axios.post('/pedido/json', qs.stringify({ xml }));
        const retorno = response.data['retorno'];

        if (retorno['erros']) {
            const erro = retorno['erros'].erro || retorno['erros'][0].erro;
            throw new Error(erro.msg);
        }

        return retorno['pedidos'][0].pedido;
    }

}

export declare interface Pedido {

    readonly numero: string;

    readonly idPedido?: number;

}

export declare interface Item {

    codigo: number;

    descricao: string;

    un: 'Un' | string;

    qtde: number;

    vlr_unit: number;

}