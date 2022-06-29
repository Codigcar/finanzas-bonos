import axios from 'axios';

export const finanzaApi = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API}/api/v1`,
});

