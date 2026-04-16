export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-8 text-center text-slate-500 border-t border-slate-200 mt-16">
      <div className="container mx-auto px-4">
        <p>&copy; {currentYear} Kjøpebitcoin.no. Alle rettigheter forbeholdt.</p>
        <p className="text-xs mt-2">Prisene er estimater og kan variere. Gjør alltid din egen research.</p>
      </div>
    </footer>
  );
}
