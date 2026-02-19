import { motion } from 'framer-motion';
import ComparisonForm from './ComparisonForm';

interface HeaderProps {
  onCalculate: (amount: number) => void;
  isLoading: boolean;
}

export default function Header({ onCalculate, isLoading }: HeaderProps) {
  return (
    <header className="relative overflow-hidden bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-indigo-900/20 to-gray-900"></div>
      <div className="relative container mx-auto px-4 pt-16 pb-12 md:pt-24 md:pb-20 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold tracking-tight text-white"
        >
          Sammenlign Bitcoin Priser i Norge
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto"
        >
          Finn den beste prisen for å kjøpe bitcoin. Vi sammenligner de største børsene i Norge for deg.
        </motion.p>
        <div className="mt-8 max-w-xl mx-auto">
            <ComparisonForm onCalculate={onCalculate} isLoading={isLoading} />
        </div>
      </div>
    </header>
  );
}
