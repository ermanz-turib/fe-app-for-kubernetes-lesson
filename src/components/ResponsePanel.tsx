import type { RequestResult } from '../api';
import { StatusBadge } from './StatusBadge';

export function ResponsePanel({ result }: { result: RequestResult | undefined }) {
  return (
    <section className="card">
      <h2>Son cevap</h2>
      {result ? (
        <>
          <div className="response-meta">
            <StatusBadge result={result} />
            <code>
              {result.method} {result.url}
            </code>
            <span>{result.durationMs} ms</span>
          </div>
          <pre className="response-body">{result.body || '(boş)'}</pre>
        </>
      ) : (
        <p className="muted">Henüz istek gönderilmedi.</p>
      )}
    </section>
  );
}
