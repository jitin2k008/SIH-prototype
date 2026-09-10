import React, { useState } from 'react';
import { Language } from '../types';

interface MarketInsightsScreenProps {
  lang: Language;
  onNavigateMarketplace: () => void;
}

export const MarketInsightsScreen: React.FC<MarketInsightsScreenProps> = ({
  lang,
  onNavigateMarketplace,
}) => {
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [timeframe, setTimeframe] = useState<'30d' | '90d' | '1y'>('30d');

  const stateData = [
    { state: 'Gujarat (Rajkot / Gondal)', mandiPrice: 2275, directPrice: 2850, volume: '4,200 Qtl', trend: '+14.2%' },
    { state: 'Madhya Pradesh (Sehore / Ujjain)', mandiPrice: 2210, directPrice: 2790, volume: '8,900 Qtl', trend: '+12.8%' },
    { state: 'Rajasthan (Alwar / Kota)', mandiPrice: 2250, directPrice: 2810, volume: '5,100 Qtl', trend: '+13.5%' },
    { state: 'Punjab (Karnal / Khanna)', mandiPrice: 2275, directPrice: 2870, volume: '12,400 Qtl', trend: '+15.1%' },
    { state: 'Maharashtra (Latur / Nashik)', mandiPrice: 2240, directPrice: 2800, volume: '3,800 Qtl', trend: '+11.9%' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#3a692f] uppercase tracking-wider block">
            National Agricultural Market Intelligence
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1c1c18] tracking-tight">
            {lang === 'hi' ? 'मंडी भाव व मूल्य विश्लेषण' : 'APMC Mandi vs Direct Price Intelligence'}
          </h1>
          <p className="text-xs text-[#73787b]">
            Empowering producers with real-time statutory MSP benchmarks and direct miller procurement margins.
          </p>
        </div>

        {/* Commodity & Timeframe selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="h-9 px-3 bg-[#f6f3ed] rounded-xl text-xs font-bold text-[#1c1c18] border border-black/10"
          >
            <option value="wheat">Sharbati Wheat</option>
            <option value="chana">Desi Chana</option>
            <option value="mustard">Mustard Seeds</option>
            <option value="paddy">Basmati Paddy</option>
          </select>
          <div className="flex bg-[#f1ede7] rounded-xl p-1 text-xs font-semibold">
            {(['30d', '90d', '1y'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-2.5 py-1 rounded-lg uppercase ${
                  timeframe === t ? 'bg-white text-[#1c1c18] shadow-xs' : 'text-[#73787b]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Macro Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-black/5 space-y-2">
          <span className="text-xs font-bold text-[#73787b] uppercase">Statutory MSP Floor</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1c1c18]">₹2,275</span>
            <span className="text-xs text-[#73787b]">/ Quintal</span>
          </div>
          <p className="text-[11px] text-[#3a692f] font-semibold">
            Fixed by Commission for Agricultural Costs & Prices
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-xs border border-black/5 space-y-2">
          <span className="text-xs font-bold text-[#73787b] uppercase">FarmDirect Realized Avg</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#3a692f]">₹2,840</span>
            <span className="text-xs text-[#73787b]">/ Quintal</span>
          </div>
          <p className="text-[11px] text-[#235119] font-semibold">
            +₹565 / Qtl (+24.8%) higher net realization
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-xs border border-black/5 space-y-2">
          <span className="text-xs font-bold text-[#73787b] uppercase">Direct Miller Demand</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#34454f]">High (142 Bids)</span>
          </div>
          <p className="text-[11px] text-[#43474b]">
            Rajkot, Ahmedabad, Surat FPO clusters actively buying
          </p>
        </div>
      </div>

      {/* State-wise Comparative Table */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-black/5 space-y-4">
        <div className="flex items-center justify-between border-b border-black/5 pb-3">
          <div>
            <h2 className="text-base font-bold text-[#1c1c18]">
              Inter-State Mandi vs. Direct Trade Comparison
            </h2>
            <p className="text-xs text-[#73787b]">
              Audited data across regional Agricultural Produce Market Committees
            </p>
          </div>
          <button
            onClick={onNavigateMarketplace}
            className="px-3.5 py-1.5 rounded-xl bg-[#3a692f] text-white text-xs font-bold hover:bg-[#1d4d15]"
          >
            Explore Active Lots
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/10 text-[10px] uppercase font-bold text-[#73787b]">
                <th className="py-2.5">Mandi Region / Cluster</th>
                <th className="py-2.5 text-right">Local Mandi Spot</th>
                <th className="py-2.5 text-right">FarmDirect Escrow</th>
                <th className="py-2.5 text-right">Direct Added Gain</th>
                <th className="py-2.5 text-right">Volume Traded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {stateData.map((row) => (
                <tr key={row.state} className="hover:bg-[#fcf9f3] transition-colors">
                  <td className="py-3 font-semibold text-[#1c1c18]">{row.state}</td>
                  <td className="py-3 text-right text-[#73787b]">₹{row.mandiPrice}/Qtl</td>
                  <td className="py-3 text-right font-bold text-[#3a692f]">
                    ₹{row.directPrice}/Qtl
                  </td>
                  <td className="py-3 text-right font-semibold text-[#235119]">
                    <span className="bg-[#b8eea5]/40 px-2 py-0.5 rounded">
                      +₹{row.directPrice - row.mandiPrice} ({row.trend})
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono text-[#43474b]">{row.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
