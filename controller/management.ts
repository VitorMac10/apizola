import express from 'express'
import { MongoClient, Db } from 'mongodb'

import BlingClient from '../client/bling-client'

export const route = express.Router();

const Bling = new BlingClient();

export default class Management {

    private readonly client: MongoClient;
    private readonly db: Db;

    public constructor(client: MongoClient) {
        this.client = client;
        this.db = this.client.db('apizola');

        route.post('/', (req, res) => {
            const { event, current, previous } = req.body;
            if (!event || !current || !previous) {
                return res.status(200).send();
            }

            if (event === 'updated.deal' && current['status'] === 'won' && previous['status'] !== 'won') {
                return Bling.adicionarPedido(current['person_name'], {
                    codigo: 1,
                    descricao: current['title'],
                    un: 'Un',
                    qtde: 1,
                    vlr_unit: current['value']
                }).then(async pedido => {
                    const { numero, data, totalprodutos, totalvenda } = await Bling.getPedido(pedido.numero);
                    await this.db.collection('opportunities').insertOne({
                        _id: pedido.idPedido, numero, data, totalprodutos, totalvenda
                    });

                    res.status(201).send();
                }).catch(() => res.status(202).send());
            }

            res.status(200).send();
        });
    }

}