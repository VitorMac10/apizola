import * as dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import { MongoClient } from 'mongodb'

import Management, { route } from './controller/management';

const api = express();
api.use(express.json());

(async () => {
    if (!process.env['MONGODB_URL']) {
        throw new Error('Informe a URL da instância MongoDB no arquivo ".env" ou nas váriaveis de ambiente de seu sistema');
    }

    const MONGO_URL = process.env['MONGODB_URL'] as string;
    const client = await MongoClient.connect(MONGO_URL, { useUnifiedTopology: true });

    new Management(client);
    api.use('/management', route);
})().then(() => {
    api.listen(process.env['PORT'] || 3000,
        () => console.log('API iniciada com sucesso'))
}).catch((e: Error) => console.error(`[ERRO] ${e.message}`));