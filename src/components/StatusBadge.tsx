import { diagnose, type RequestResult } from '../api';

export function StatusBadge({ result }: { result: RequestResult }) {
  const { tone, label } = diagnose(result);
  return <span className={`badge tone--${tone}`}>{label}</span>;
}
