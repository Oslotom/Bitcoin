import { FAQS } from '../data/faqs';

export default function FAQSection() {
  return (
    <section aria-labelledby="faq-title" className="mt-10 border-t border-slate-100 pt-10 space-y-5">
      <h2 id="faq-title" className="text-2xl font-display font-bold text-slate-900">Ofte stilte spørsmål om å kjøpe Bitcoin</h2>
      <div className="divide-y divide-slate-100">
        {FAQS.map((faq) => (
          <details key={faq.question} className="group py-4">
            <summary className="cursor-pointer text-slate-900 marker:text-brand">
              <h3 className="inline text-base font-semibold">{faq.question}</h3>
            </summary>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed whitespace-pre-line">{faq.answer}</p>
          </details>
        ))}
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">
        Kilder: <a href="https://www.finanstilsynet.no/nyhetsarkiv/nyheter/2025/investeringer-i-kryptoeiendeler-kan-vare-risikable/" className="text-brand hover:underline">Finanstilsynet</a>{' '}
        og <a href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/aksjer-og-verdipapirer/om/virtuell-valuta/skatteregler---virtuell-valuta/" className="text-brand hover:underline">Skatteetaten</a>.
        Tjenestene er beskrevet på <a href="/norske-borser" className="text-brand hover:underline">siden om norske kryptobørser</a> med lenker til tilbyderne.
      </p>
    </section>
  );
}
