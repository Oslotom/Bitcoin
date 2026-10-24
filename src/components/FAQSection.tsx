import { FAQS } from '../data/faqs';

export default function FAQSection() {
  return (
    <section aria-labelledby="faq-title" className="mt-12 border-t border-slate-100 pt-10 grid gap-x-12 gap-y-5 md:grid-cols-[1fr_1.6fr]">
      <div><p className="mb-2 text-xs font-medium text-brand">Før du kjøper</p><h2 id="faq-title" className="section-title">Kort om å<br className="hidden md:block" /> kjøpe Bitcoin.</h2></div>
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
      <p className="text-xs text-slate-500 leading-relaxed md:col-start-2">
        Kilder: <a href="https://www.finanstilsynet.no/nyhetsarkiv/nyheter/2025/investeringer-i-kryptoeiendeler-kan-vare-risikable/" className="text-brand hover:underline">Finanstilsynet</a>{' '}
        og <a href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/aksjer-og-verdipapirer/om/virtuell-valuta/skatteregler---virtuell-valuta/" className="text-brand hover:underline">Skatteetaten</a>.
        Tjenestene er beskrevet på <a href="/norske-borser" className="text-brand hover:underline">siden om norske kryptobørser</a> med lenker til tilbyderne.
      </p>
    </section>
  );
}
