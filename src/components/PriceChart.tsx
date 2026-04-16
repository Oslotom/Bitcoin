import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getHistoricalData } from '../services/api';
import { motion } from 'motion/react';

interface PricePoint {
  timestamp: number;
  price: number;
}

const PriceChart: React.FC = () => {
  const [data, setData] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const historicalData = await getHistoricalData(days);
        setData(historicalData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [days]);

  const formatXAxis = (tickItem: number) => {
    const date = new Date(tickItem);
    if (days === 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const formatYAxis = (tickItem: number) => {
    return new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK',
      maximumFractionDigits: 0,
    }).format(tickItem);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg font-mono text-xs">
          <p className="text-gray-500 mb-1">
            {new Date(payload[0].payload.timestamp).toLocaleString('no-NO')}
          </p>
          <p className="text-orange-600 font-bold text-sm">
            {formatYAxis(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bitcoin Prisutvikling</h2>
          <p className="text-sm text-gray-500">Historisk pris i NOK</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {[
            { label: '24t', value: 1 },
            { label: '7d', value: 7 },
            { label: '30d', value: 30 },
            { label: '90d', value: 90 },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setDays(option.value)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                days === option.value
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[400px] w-full">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatXAxis}
                tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'monospace' }}
                axisLine={false}
                tickLine={false}
                minTickGap={30}
              />
              <YAxis
                hide
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#f97316"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      
      <div className="mt-4 flex items-center justify-end gap-4 text-[10px] font-mono text-gray-400 uppercase tracking-wider">
        <span>Kilde: CoinGecko</span>
        <span>Oppdatert: {new Date().toLocaleTimeString('no-NO')}</span>
      </div>
    </div>
  );
};

export default PriceChart;
