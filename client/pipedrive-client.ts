import Axios from 'axios'

if (!process.env['PIPEDRIVE_API_KEY']) {
    throw new Error('Informe a chave de API da plataforma Pipedrive');
}

const api_token = process.env['PIPEDRIVE_API_KEY'];
const axios = Axios.create({
    baseURL: 'https://apizola.pipedrive.com/api/v1',
    params: { api_token }
});

export default class PipedriveClient {

    public async getDeals(status: Deal['status'] = 'all_not_deleted'): Promise<Deal[]> {
        const response = await axios.get('/deals', {
            params: { status }
        });

        if (!response.data['success']) {
            throw new Error(response.data['error']);
        }

        return response.data['data'];
    }

}

export declare interface Deal {

    readonly id: number;

    readonly title: string;

    readonly status: 'open' | 'won' | 'lost' | 'deleted' | 'all_not_deleted';

    readonly person_name: string;

}