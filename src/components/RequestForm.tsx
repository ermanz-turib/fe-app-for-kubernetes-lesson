import { useState } from 'react';
import { HTTP_METHODS, methodHasBody, type HttpMethod } from '../api';
import { API_URL, QUICK_REQUESTS, type QuickRequest } from '../config';

const EXAMPLE_URL = `${API_URL}/hello`;

interface RequestFormProps {
  pending: boolean;
  onSend: (method: HttpMethod, url: string, body: string) => void;
}

export function RequestForm({ pending, onSend }: RequestFormProps) {
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [url, setUrl] = useState(EXAMPLE_URL);
  const [body, setBody] = useState('');

  const sendQuick = (quick: QuickRequest) => {
    const quickUrl = API_URL + quick.path;
    const quickBody = quick.body ?? body;
    setMethod(quick.method);
    setUrl(quickUrl);
    setBody(quickBody);
    onSend(quick.method, quickUrl, quickBody);
  };

  return (
    <section className="card">
      <h2>İstek gönder</h2>
      <form
        className="request-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSend(method, url, body);
        }}
      >
        <div className="request-line">
          <select aria-label="HTTP metodu" value={method} onChange={(e) => setMethod(e.target.value as HttpMethod)}>
            {HTTP_METHODS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <input
            className="url-input"
            aria-label="İstek adresi"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={EXAMPLE_URL}
            spellCheck={false}
          />
          <button type="submit" className="button-primary" disabled={pending}>
            Gönder
          </button>
        </div>

        {methodHasBody(method) && (
          <textarea
            aria-label="İstek gövdesi (JSON)"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={'{ "name": "Ayşe" }'}
            rows={4}
            spellCheck={false}
          />
        )}

        {QUICK_REQUESTS.length > 0 && (
          <div className="quick-requests">
            <span className="muted">Hızlı:</span>
            {QUICK_REQUESTS.map((quick) => (
              <button
                key={`${quick.method} ${quick.path}`}
                type="button"
                className="chip"
                disabled={pending}
                onClick={() => sendQuick(quick)}
              >
                {quick.method} {quick.path}
              </button>
            ))}
          </div>
        )}
      </form>
    </section>
  );
}
