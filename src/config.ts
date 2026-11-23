// Backend'inizin adresi ve sık kullandığınız istekler. Projede değiştirmeniz gereken tek dosya bu.

import type { HttpMethod } from './api';

/** Backend'inizin adresi. Sonda "/" OLMADAN yazın. */
export const API_URL = 'http://localhost:8080';

export interface QuickRequest {
  method: HttpMethod;
  /** API_URL'den sonraki kısım, ör. /api/products */
  path: string;
  /** POST / PUT / PATCH için JSON gövde */
  body?: string;
}

/** Arayüzdeki "Hızlı" düğmeleri. Şimdilik örnek; kendi endpoint'lerinizle değiştirin. */
export const QUICK_REQUESTS: QuickRequest[] = [
  { method: 'GET', path: '/hello' },
  { method: 'POST', path: '/hello', body: '{\n  "name": "Ayşe"\n}' }
];
