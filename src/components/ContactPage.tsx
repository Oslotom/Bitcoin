import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, ChevronDown } from 'lucide-react';

const CONTACT_EMAIL = 'tomhaugeplass@gmail.com';
// Skjemaendepunkt (f.eks. Formspree) kan settes med VITE_CONTACT_ENDPOINT ved bygg.
// Standard er /api/contact, som bare finnes når Express-serveren (server.ts) kjører.
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || '/api/contact';

// Statisk hosting (GitHub Pages) har ikke /api/contact – da åpnes en ferdig utfylt e-post i stedet
const openMailDraft = (data: Record<string, string>) => {
  const subject = `[KjøpeBitcoin.no] ${data.subject || 'Henvendelse'}`;
  const body = `${data.message}\n\n--\n${data.name} <${data.email}>`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'mail'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Kunne ikke sende melding (HTTP ${response.status})`);
      }

      setStatus('success');
    } catch (error) {
      console.error('Error sending message:', error);
      openMailDraft(data);
      setStatus('mail');
    }
  };

  if (status === 'mail') {
    return (
      <div className="card-premium p-8 md:p-12 text-center space-y-4 animate-fade-in">
        <h3 className="text-2xl font-display font-bold text-slate-900">Fullfør i e-postprogrammet ditt</h3>
        <p className="text-slate-600 font-medium">
          Vi har åpnet en ferdig utfylt e-post med meldingen din. Trykk send der. Åpnet den seg ikke? Skriv direkte til{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-brand hover:underline">{CONTACT_EMAIL}</a>.
        </p>
        <button onClick={() => setStatus('idle')} className="text-brand font-bold text-sm hover:underline">
          Tilbake til skjemaet
        </button>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-8 animate-fade-in">
        <div className="flex justify-center">
          <div className="bg-emerald-50 p-6 rounded-full border border-emerald-100 shadow-sm">
            <CheckCircle2 className="text-emerald-500 w-16 h-16" />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-3xl font-display font-bold text-slate-900">Takk for din melding!</h3>
          <p className="text-slate-600 text-lg font-medium">
            Vi har mottatt din henvendelse og svarer til e-postadressen du oppga så snart som mulig.
          </p>
        </div>
        <button 
          onClick={() => setStatus('idle')}
          className="text-brand font-bold text-sm hover:underline"
        >
          Send en ny melding
        </button>
      </div>
    );
  }

  return (
    <div id="contact-page" className="space-y-16">
      <div className="card-premium p-8 md:p-16">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label htmlFor="name" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Fullt navn
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Ditt navn"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all shadow-sm"
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                E-postadresse
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="din@epost.no"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="subject" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
              Hva gjelder det?
            </label>
            <div className="relative">
              <select
                id="subject"
                name="subject"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all appearance-none shadow-sm"
              >
                <option>Generell henvendelse</option>
                <option>Feil i prisdata</option>
                <option>Annonsering / Partner</option>
                <option>Tips om ny børs</option>
                <option>Annet</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="message" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
              Melding
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              placeholder="Hva kan vi hjelpe deg med?"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all resize-none shadow-sm"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary w-full py-5 text-lg"
            >
              {status === 'loading' ? (
                <>Sender...</>
              ) : (
                <>
                  Send melding <Send size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-12 pt-8">
        <div className="flex items-center gap-5">
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 shadow-sm">
            <MessageSquare className="text-brand" size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Rask respons</p>
            <p className="text-lg font-bold text-slate-900">Svar innen 24 timer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
