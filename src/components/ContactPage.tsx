import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate form submission
    // In a real app, you would use an API route or a service like Formspree
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      // Using a standard form submission service or just simulating
      console.log('Sending message to tomhaugeplass@gmail.com:', data);
      
      // Artificial delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('success');
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-6 animate-fade-in">
        <div className="flex justify-center">
          <div className="bg-emerald-50 p-4 rounded-full">
            <CheckCircle2 className="text-emerald-500 w-12 h-12" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-slate-900 uppercase">Takk for din melding!</h2>
        <p className="text-slate-600 font-medium">
          Vi har mottatt din henvendelse og vil svare deg på <strong>tomhaugeplass@gmail.com</strong> så snart som mulig.
        </p>
        <button 
          onClick={() => setStatus('idle')}
          className="text-orange-600 font-bold text-xs uppercase tracking-widest hover:underline"
        >
          Send en ny melding
        </button>
      </div>
    );
  }

  return (
    <div id="contact-page" className="max-w-2xl mx-auto py-8 space-y-12 animate-fade-in">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
          <Mail size={12} /> Kontakt oss
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
          Har du <span className="text-orange-600">spørsmål</span>?
        </h2>
        <p className="text-slate-500 text-sm font-medium max-w-md mx-auto leading-relaxed">
          Vi setter pris på alle tilbakemeldinger, spørsmål om annonsering eller tips til nye børser vi bør liste.
        </p>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Navn
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Ditt navn"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                E-post
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="din@epost.no"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Emne
            </label>
            <select
              id="subject"
              name="subject"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:bg-white transition-all appearance-none"
            >
              <option>Generell henvendelse</option>
              <option>Feil i prisdata</option>
              <option>Annonsering / Partner</option>
              <option>Tips om ny børs</option>
              <option>Annet</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Melding
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Hva kan vi hjelpe deg med?"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:bg-white transition-all resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-4 bg-[#0052FF] hover:bg-[#0045db] text-white rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>Sender...</>
              ) : (
                <>
                  Send melding <Send size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
        <div className="flex items-center gap-4">
          <div className="bg-orange-50 p-3 rounded-2xl">
            <Mail className="text-orange-600" size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">E-post</p>
            <p className="text-sm font-bold text-slate-700">tomhaugeplass@gmail.com</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-2xl">
            <MessageSquare className="text-[#0052FF]" size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Svarstid</p>
            <p className="text-sm font-bold text-slate-700">Innen 24 timer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
