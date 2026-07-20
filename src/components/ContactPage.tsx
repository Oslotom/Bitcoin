import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Kunne ikke sende melding');
      }
      
      setStatus('success');
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-xl mx-auto py-32 text-center space-y-8 animate-fade-in">
        <div className="flex justify-center">
          <div className="bg-emerald-50 p-6 rounded-full border border-emerald-100 shadow-sm">
            <CheckCircle2 className="text-emerald-500 w-16 h-16" />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-display font-bold text-slate-900">Takk for din melding!</h2>
          <p className="text-slate-600 text-lg font-medium">
            Vi har mottatt din henvendelse og vil svare deg på <strong>tomhaugeplass@gmail.com</strong> så snart som mulig.
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
    <div id="contact-page" className="max-w-4xl mx-auto py-16 px-4 space-y-16 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-4">
          <Mail size={12} /> Kontakt oss
        </div>
        <h2 className="text-5xl font-display font-bold tracking-tight text-slate-900">
          Har du <span className="text-brand">spørsmål</span>?
        </h2>
        <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          Vi setter pris på alle tilbakemeldinger, spørsmål om annonsering eller tips til nye børser vi bør liste.
        </p>
      </div>

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
