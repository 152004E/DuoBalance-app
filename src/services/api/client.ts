import axios from 'axios';

import { setupInterceptors } from './interceptor';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

setupInterceptors(api);
