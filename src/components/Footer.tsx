export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-8 text-center text-gray-500 border-t border-white/10 mt-16">
      <div className="container mx-auto px-4">
        <p>&copy; {currentYear} Crypto Price Compare (Norge). Alle rettigheter forbeholdt.</p>
        <p className="text-xs mt-2">Prisene er estimater og kan variere. Gjør alltid din egen research.</p>
      </div>
    </footer>
  );
}
