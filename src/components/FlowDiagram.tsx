import { diagnose, parseHttpUrl, type Diagnosis, type RequestResult } from '../api';
import { API_URL } from '../config';

type StageState = Diagnosis['tone'] | 'idle' | 'pending';

interface FlowDiagramProps {
  pending: boolean;
  last: RequestResult | undefined;
}

/** Tarayıcı → Backend: son isteğin sonucunu renklerle gösterir. */
export function FlowDiagram({ pending, last }: FlowDiagramProps) {
  const target = last ? parseHttpUrl(last.url) : null;

  let tone: StageState = 'idle';
  let message = 'Henüz istek gönderilmedi. Aşağıdan bir istek gönderin.';
  if (pending) {
    tone = 'pending';
    message = 'İstek gönderiliyor…';
  } else if (last) {
    const diagnosis = diagnose(last);
    tone = diagnosis.tone;
    message = diagnosis.message;
  }
  const browserState: StageState = pending ? 'pending' : last ? 'ok' : 'idle';

  return (
    <section className="card">
      <h2>İsteğin yolu</h2>
      <div className="flow">
        <FlowNode state={browserState} title="Tarayıcı (bu sayfa)" line={window.location.host} />
        <div className={`flow-arrow tone--${tone}`}>
          <code>{last ? `${last.method} ${target ? target.pathname + target.search : ''}` : '—'}</code>
          <div className="flow-arrow__line">
            {/* key her yeni istekte değişir, böylece nokta her seferinde baştan kayar */}
            {last && !pending && <span key={last.id} className="flow-arrow__dot" />}
          </div>
        </div>
        <FlowNode state={tone} title="Backend" line={target?.origin ?? API_URL} />
      </div>
      <p className={`diagnosis tone--${tone}`}>{message}</p>
    </section>
  );
}

function FlowNode({ state, title, line }: { state: StageState; title: string; line: string }) {
  return (
    <div className={`flow-node tone--${state}`}>
      <strong>{title}</strong>
      <span>{line}</span>
    </div>
  );
}
