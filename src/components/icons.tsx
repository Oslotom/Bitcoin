import { CryptoCurrency, Exchange } from '../types';

const BitcoinIcon = () => (
    <svg width="24" height="24" viewBox="0.004 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="#000000">
        <path d="M63.04 39.741c-4.274 17.143-21.638 27.575-38.783 23.301C7.12 58.768-3.313 41.404.962 24.262 5.234 7.117 22.597-3.317 39.737.957c17.144 4.274 27.576 21.64 23.302 38.784z" fill="#f7931a"></path>
        <path d="M46.11 27.441c.636-4.258-2.606-6.547-7.039-8.074l1.438-5.768-3.512-.875-1.4 5.616c-.922-.23-1.87-.447-2.812-.662l1.41-5.653-3.509-.875-1.439 5.766c-.764-.174-1.514-.346-2.242-.527l.004-.018-4.842-1.209-.934 3.75s2.605.597 2.55.634c1.422.355 1.68 1.296 1.636 2.042l-1.638 6.571c.098.025.225.061.365.117l-.37-.092-2.297 9.205c-.174.432-.615 1.08-1.609.834.035.051-2.552-.637-2.552-.637l-1.743 4.02 4.57 1.139c.85.213 1.683.436 2.502.646l-1.453 5.835 3.507.875 1.44-5.772c.957.26 1.887.5 2.797.726L27.504 50.8l3.511.875 1.453-5.823c5.987 1.133 10.49.676 12.383-4.738 1.527-4.36-.075-6.875-3.225-8.516 2.294-.531 4.022-2.04 4.483-5.157zM38.087 38.69c-1.086 4.36-8.426 2.004-10.807 1.412l1.928-7.729c2.38.594 10.011 1.77 8.88 6.317zm1.085-11.312c-.99 3.966-7.1 1.951-9.083 1.457l1.748-7.01c1.983.494 8.367 1.416 7.335 5.553z" fill="#ffffff"></path>
    </svg>
);

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

const KrakenIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#5E20CD"/>
        <path d="M12 6L15 9H9L12 6ZM12 18L9 15H15L12 18ZM6 12L9 9V15L6 12ZM18 12L15 15V9L18 12Z" fill="white"/>
    </svg>
);

const NbxIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#000000"/>
        <path d="M8 8H10V16H8V8ZM14 8H16V16H14V8ZM11 8H13V16H11V8Z" fill="#00BFFF"/>
    </svg>
);

const BareBitcoinIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#F7931A"/>
        <path d="M8 7.5H12.4C14.1 7.5 15.2 8.4 15.2 9.8C15.2 10.7 14.8 11.3 14.1 11.6C15 11.9 15.5 12.6 15.5 13.6C15.5 15.2 14.2 16.2 12.2 16.2H8V7.5ZM10.1 10.9H12.1C12.8 10.9 13.2 10.6 13.2 10C13.2 9.4 12.8 9.1 12.1 9.1H10.1V10.9ZM10.1 14.6H12.3C13.1 14.6 13.5 14.3 13.5 13.7C13.5 13.1 13.1 12.7 12.3 12.7H10.1V14.6Z" fill="white"/>
    </svg>
);

const RevolutIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#111111"/>
        <path d="M7.5 8H12.8C14.31 8 15.5 9.18 15.5 10.65C15.5 12.1 14.32 13.3 12.84 13.3H10V16H7.5V8ZM10 10.2V11.2H12.62C12.91 11.2 13.14 10.97 13.14 10.68C13.14 10.43 12.94 10.2 12.62 10.2H10Z" fill="white"/>
    </svg>
);

const CryptoComIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#121B27"/>
        <path d="M12 6L17 9L12 12L7 9L12 6ZM12 13L17 10L12 19L7 10L12 13Z" fill="#1199FA"/>
    </svg>
);

const BuyBitcoinIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#F7931A"/>
        <path d="M14.5 12C14.5 13.3807 13.3807 14.5 12 14.5C10.6193 14.5 9.5 13.3807 9.5 12C9.5 10.6193 10.6193 9.5 12 9.5C13.3807 9.5 14.5 10.6193 14.5 12ZM12 8.5C14.4853 8.5 16.5 10.5147 16.5 13C16.5 15.4853 14.4853 17.5 12 17.5C9.51472 17.5 7.5 15.4853 7.5 13C7.5 10.5147 9.51472 8.5 12 8.5Z" fill="white"/>
    </svg>
);

const EthereumIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0L11.603 0.603L12 2.76L12.397 0.603L12 0ZM12 0L12 24L12 0ZM12 2.76L23.603 15.397L12 2.76ZM23.603 15.397L12 24L23.603 15.397ZM12 24L0.397 15.397L12 24ZM0.397 15.397L12 2.76L0.397 15.397Z" fill="#627EEA"/>
        <path d="M12 0L12 24L12 0ZM12 2.76L23.603 15.397L12 2.76ZM23.603 15.397L12 24L23.603 15.397ZM12 24L0.397 15.397L12 24ZM0.397 15.397L12 2.76L0.397 15.397Z" fill="white" fillOpacity="0.2"/>
    </svg>
);

const DogecoinIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#C2A633"/>
        <path d="M12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6ZM12 13C9.23858 13 7 15.2386 7 18H17C17 15.2386 14.7614 13 12 13Z" fill="white"/>
    </svg>
);

export const CryptoIcon = ({ crypto }: { crypto: CryptoCurrency }) => {
    switch (crypto) {
        case CryptoCurrency.BTC:
            return <BitcoinIcon />;
        case CryptoCurrency.ETH:
            return <EthereumIcon />;
        case CryptoCurrency.DOGE:
            return <DogecoinIcon />;
        default:
            return null;
    }
};

const NorwayFlagIcon = () => (
    <svg width="24" height="24" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" preserveAspectRatio="xMidYMid meet">
        <path fill="#EF2B2D" d="M10 5H4a4 4 0 0 0-4 4v6h10V5zm22 0H16v10h20V9a4 4 0 0 0-4-4zM10 31H4a4 4 0 0 1-4-4v-6h10v10zm22 0H16V21h20v6a4 4 0 0 1-4 4z"></path>
        <path fill="#002868" d="M14.5 5h-2.944l-.025 11.5H0v3h11.525L11.5 31h3V19.5H36v-3H14.5z"></path>
        <path fill="#EEE" d="M14.5 31H16V21h20v-1.5H14.5zM16 5h-1.5v11.5H36V15H16zm-4.5 0H10v10H0v1.5h11.5zM0 19.5V21h10v10h1.5V19.5z"></path>
    </svg>
);

export const CountryIcon = ({ countryCode }: { countryCode: string }) => {
    switch (countryCode) {
        case 'NO':
            return <NorwayFlagIcon />;
        default:
            return null;
    }
};

export const ExchangeIcon = ({ exchange }: { exchange: Exchange }) => {
    switch (exchange) {
        case 'Coinbase':
            return <CoinbaseIcon />;
        case 'Binance':
            return <BinanceIcon />;
        case 'Firi':
            return <FiriIcon />;
        case 'Kraken':
            return <KrakenIcon />;
        case 'NBX':
            return <NbxIcon />;
        case 'Bare Bitcoin':
            return <BareBitcoinIcon />;
        case 'Revolut':
            return <RevolutIcon />;
        case 'Crypto.com':
            return <CryptoComIcon />;
        case 'BuyBitcoin.com':
            return <BuyBitcoinIcon />;
        default:
            return null;
    }
};
