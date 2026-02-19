import { Exchange } from '../types';

const CoinbaseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#0052FF"/>
        <path d="M17.5 12C17.5 15.0376 15.0376 17.5 12 17.5C8.96243 17.5 6.5 15.0376 6.5 12C6.5 8.96243 8.96243 6.5 12 6.5C15.0376 6.5 17.5 8.96243 17.5 12ZM9.5 12C9.5 13.3807 10.6193 14.5 12 14.5C13.3807 14.5 14.5 13.3807 14.5 12C14.5 10.6193 13.3807 9.5 12 9.5C10.6193 9.5 9.5 10.6193 9.5 12Z" fill="white"/>
    </svg>
);

const BinanceIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#F0B90B"/>
        <path d="M12 7.5L14.5 10L12 12.5L9.5 10L12 7.5Z" fill="white"/>
        <path d="M7 10L9.5 12.5L7 15L4.5 12.5L7 10Z" fill="white"/>
        <path d="M17 10L19.5 12.5L17 15L14.5 12.5L17 10Z" fill="white"/>
        <path d="M12 14L14.5 16.5L12 19L9.5 16.5L12 14Z" fill="white"/>
    </svg>
);

const FiriIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#1A1A1A"/>
        <path d="M8 8V16H9.5V12.5H14.5V16H16V8H14.5V11H9.5V8H8Z" fill="white"/>
    </svg>
);

export const ExchangeIcon = ({ exchange }: { exchange: Exchange }) => {
    switch (exchange) {
        case 'Coinbase':
            return <CoinbaseIcon />;
        case 'Binance':
            return <BinanceIcon />;
        case 'Firi':
            return <FiriIcon />;
        default:
            return null;
    }
};
