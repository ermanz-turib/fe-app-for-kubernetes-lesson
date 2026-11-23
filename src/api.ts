export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;
export type HttpMethod = (typeof HTTP_METHODS)[number];

export const methodHasBody = (method: HttpMethod) => method === 'POST' || method === 'PUT' || method === 'PATCH';

/** Bu sürede cevap gelmezse istek iptal edilir. */
const REQUEST_TIMEOUT_MS = 15_000;

export type Outcome =
  | 'response' // backend cevap verdi (durum kodu ne olursa olsun)
  | 'redirect' // backend 3xx ile başka adrese yönlendirdi
  | 'timeout' // süre içinde cevap gelmedi
  | 'network-error' // backend'e ulaşılamadı (adres yanlış, backend kapalı ya da CORS izni yok)
  | 'invalid-url'; // adres http(s):// ile başlamıyor, istek gönderilmedi

export interface RequestResult {
  id: string;
  time: Date;
  method: HttpMethod;
  /** İsteğin gittiği tam adres, ör. http://localhost:8080/hello */
  url: string;
  outcome: Outcome;
  /** Backend'in döndüğü durum kodu; cevap gelmediyse null */
  status: number | null;
  statusText: string;
  durationMs: number;
  /** Cevap gövdesi (JSON ise okunaklı hâle getirilmiş) ya da hata mesajı */
  body: string;
}

/** İsteği tarayıcıdan doğrudan verilen adrese (backend'e) gönderir. */
export async function sendRequest(method: HttpMethod, address: string, body: string): Promise<RequestResult> {
  const url = address.trim();
  const base = { id: crypto.randomUUID(), time: new Date(), method, url, status: null, statusText: '', body: '' };

  if (!parseHttpUrl(url)) return { ...base, outcome: 'invalid-url', durationMs: 0 };

  const withBody = methodHasBody(method) && body.trim() !== '';
  const startedAt = performance.now();
  const elapsed = () => Math.round(performance.now() - startedAt);

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: withBody ? { 'Content-Type': 'application/json' } : undefined,
      body: withBody ? body : undefined,
      cache: 'no-store',
      // Yönlendirmeyi tarayıcı kendisi takip etmesin; login sayfasına giden bir 302 ayrıca gösterilir
      redirect: 'manual',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === 'TimeoutError';
    return { ...base, outcome: timedOut ? 'timeout' : 'network-error', durationMs: elapsed(), body: String(error) };
  }

  if (response.type === 'opaqueredirect') return { ...base, outcome: 'redirect', durationMs: elapsed() };

  let text: string;
  try {
    text = prettyJson(await response.text());
  } catch (error) {
    // Durum kodu geldi ama gövde okunamadı (ör. gövde gelirken süre doldu): durumu kaybetme
    text = `(Cevap gövdesi okunamadı: ${String(error)})`;
  }
  return {
    ...base,
    outcome: 'response',
    status: response.status,
    statusText: response.statusText,
    durationMs: elapsed(),
    body: text
  };
}

/** Adres http:// ya da https:// ile başlayan geçerli bir adresse URL nesnesini, değilse null döner. */
export function parseHttpUrl(value: string): URL | null {
  const url = URL.parse(value);
  return url && (url.protocol === 'http:' || url.protocol === 'https:') ? url : null;
}

/** JSON ise girintili hâle getirir, değilse olduğu gibi bırakır. */
function prettyJson(text: string): string {
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}

// ─── Sonucun yorumu: renk, kısa etiket ve açıklama tek yerde ──────────────

export interface Diagnosis {
  tone: 'ok' | 'warn' | 'error';
  /** Durum rozetindeki kısa yazı */
  label: string;
  /** Akış diyagramının altındaki açıklama */
  message: string;
}

export function diagnose(result: RequestResult): Diagnosis {
  switch (result.outcome) {
    case 'invalid-url':
      return {
        tone: 'error',
        label: 'Geçersiz adres',
        message: 'Adres geçersiz; http:// ya da https:// ile başlayan tam adres yazın.'
      };
    case 'network-error':
      return {
        tone: 'error',
        label: 'Ağ hatası',
        message:
          "Backend'e ulaşılamadı. Adres doğru mu, backend ayakta mı? Backend ayaktaysa sebep büyük ihtimalle CORS: " +
          `tarayıcı konsolunda (F12) 'CORS' hatası varsa backend'in ${window.location.origin} adresine izin vermesi gerekir.`
      };
    case 'timeout':
      return {
        tone: 'error',
        label: 'Zaman aşımı',
        message: `Backend ${REQUEST_TIMEOUT_MS / 1000} sn içinde cevap vermedi.`
      };
    case 'redirect':
      return {
        tone: 'warn',
        label: 'Yönlendirme (3xx)',
        message:
          'Backend başka bir adrese yönlendirdi (3xx). Çoğunlukla login sayfasıdır, ör. Spring Security açıksa. ' +
          'Hedef adresi tarayıcının Network sekmesinde (F12) görebilirsiniz.'
      };
    case 'response': {
      const status = result.status ?? 0;
      const label = `${status} ${result.statusText}`.trim();
      if (status < 400) return { tone: 'ok', label, message: "İstek backend'e ulaştı, backend başarılı cevap döndü." };
      const hint = status === 404 ? " Bu path backend'de tanımlı mı?" : '';
      return { tone: 'warn', label, message: `İstek backend'e ulaştı ama backend ${status} döndü.${hint}` };
    }
  }
}
