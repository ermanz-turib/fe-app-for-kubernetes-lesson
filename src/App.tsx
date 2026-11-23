import { useState } from 'react';
import { sendRequest, type HttpMethod, type RequestResult } from './api';
import { FlowDiagram } from './components/FlowDiagram';
import { HistoryTable } from './components/HistoryTable';
import { RequestForm } from './components/RequestForm';
import { ResponsePanel } from './components/ResponsePanel';

/** Geçmişte tutulan en fazla istek sayısı. */
const MAX_HISTORY = 50;

export function App() {
  const [history, setHistory] = useState<RequestResult[]>([]);
  const [pending, setPending] = useState(false);

  const send = async (method: HttpMethod, url: string, body: string) => {
    setPending(true);
    const result = await sendRequest(method, url, body);
    setHistory((previous) => [result, ...previous].slice(0, MAX_HISTORY));
    setPending(false);
  };

  const last = history[0];

  return (
    <main className="page">
      <header className="page-header">
        <h1>Demo Frontend</h1>
        <p className="muted">Backend&apos;e istek atar ve isteğin gidip gitmediğini, ne cevap aldığını gösterir.</p>
      </header>

      <FlowDiagram pending={pending} last={last} />

      <div className="two-columns">
        <RequestForm pending={pending} onSend={send} />
        <ResponsePanel result={last} />
      </div>

      <HistoryTable history={history} onClear={() => setHistory([])} />
    </main>
  );
}
