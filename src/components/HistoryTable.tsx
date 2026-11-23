import type { RequestResult } from '../api';
import { StatusBadge } from './StatusBadge';

export function HistoryTable({ history, onClear }: { history: RequestResult[]; onClear: () => void }) {
  return (
    <section className="card">
      <div className="card-header">
        <h2>İstek geçmişi</h2>
        <button type="button" onClick={onClear} disabled={history.length === 0}>
          Temizle
        </button>
      </div>
      {history.length === 0 ? (
        <p className="muted">Gönderilen istekler burada listelenir.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Saat</th>
                <th>İstek</th>
                <th>Durum</th>
                <th>Süre</th>
              </tr>
            </thead>
            <tbody>
              {history.map((r) => (
                <tr key={r.id}>
                  <td>{r.time.toLocaleTimeString('tr-TR')}</td>
                  <td>
                    <code>
                      {r.method} {r.url}
                    </code>
                  </td>
                  <td>
                    <StatusBadge result={r} />
                  </td>
                  <td>{r.durationMs} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
