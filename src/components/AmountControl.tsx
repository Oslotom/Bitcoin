import { useEffect, useId, useState } from 'react';
import { validAmount } from '../services/market';
import { trackEvent } from '../services/analytics';

export default function AmountControl({ amount, onChange }: { amount: number; onChange: (value: number) => void }) {
  const id = useId();
  const [draft, setDraft] = useState(String(amount));
  useEffect(() => setDraft(String(amount)), [amount]);
  const error = !validAmount(Number(draft));
  const update = (text: string) => { setDraft(text); if (validAmount(Number(text))) onChange(Number(text)); };
  return (
    <div className="amount-control">
      <div className="amount-input-group"><label htmlFor={id}>Hvor mye vil du kjøpe for?</label><div><input id={id} type="number" inputMode="decimal" min="100" max="10000000" step="any" value={draft} onChange={(e) => update(e.target.value)} onBlur={() => { if (!error) trackEvent('calculator_amount', { bracket: amount < 10000 ? 'under_10000' : amount < 50000 ? '10000_49999' : '50000_plus' }); }} aria-invalid={error} aria-describedby={error ? `${id}-error` : undefined} /><span>NOK</span></div></div>
      <div className="amount-presets" aria-label="Velg eksempelbeløp">{[1000, 10000, 50000].map((value) => <button type="button" key={value} aria-pressed={amount === value && !error} onClick={() => { update(String(value)); trackEvent('calculator_preset', { amount: String(value) }); }}>{value.toLocaleString('nb-NO')} kr</button>)}</div>
      {error && <p id={`${id}-error`} role="status" className="basis-full text-xs text-rose-700">Velg et beløp mellom 100 og 10 000 000 kr. Beregningen viser fortsatt {amount.toLocaleString('nb-NO')} kr.</p>}
    </div>
  );
}
