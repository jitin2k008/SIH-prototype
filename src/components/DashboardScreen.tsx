import React, { useState } from 'react';
import { ProduceItem, OrderItem, Language, UserProfile } from '../types';
import { FARMER_PROFILE } from '../data/mockData';

interface DashboardScreenProps {
  produceList: ProduceItem[];
  orders: OrderItem[];
  lang: Language;
  onNavigateAddProduce: () => void;
  onNavigateMarketplace: () => void;
  onNavigateTrackOrders: (orderId?: string) => void;
  onOpenVoiceHelp: () => void;
  onOpenGatePass: (item: ProduceItem) => void;
  onOpenDeliveryChallan: (order: OrderItem) => void;
  currentUser?: UserProfile | null;
  onOpenLogin?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  produceList,
  orders,
  lang,
  onNavigateAddProduce,
  onNavigateMarketplace,
  onNavigateTrackOrders,
  onOpenVoiceHelp,
  onOpenGatePass,
  onOpenDeliveryChallan,
  currentUser,
  onOpenLogin,
}) => {
  const activeUser = currentUser || FARMER_PROFILE;
  // Direct Rate Calculator state
  const [calcCrop, setCalcCrop] = useState('wheat');
  const [calcQuintals, setCalcQuintals] = useState<number>(20);
  const [activeTab, setActiveTab] = useState<'all' | 'grains' | 'pulses' | 'fruits'>('all');
  const [hoveredMonth, setHoveredMonth] = useState<string | null>('Mar');

  // Pricing configuration for calculator
  const cropPriceConfig: Record<string, { mandi: number; direct: number; name: string }> = {
    wheat: { mandi: 2275, direct: 2850, name: 'Sharbati Wheat' },
    chana: { mandi: 5440, direct: 5650, name: 'Desi Chana' },
    mango: { mandi: 7800, direct: 9200, name: 'Gir Kesar Mango' },
    mustard: { mandi: 5650, direct: 5800, name: 'Mustard Seeds' },
  };

  const selectedCrop = cropPriceConfig[calcCrop] || cropPriceConfig.wheat;
  const mandiPayout = selectedCrop.mandi * calcQuintals;
  const directPayout = selectedCrop.direct * calcQuintals;
  const directExtraIncome = directPayout - mandiPayout;

  const filteredProduce = produceList.filter((item) => {
    if (activeTab === 'grains') return item.category.includes('Cereals');
    if (activeTab === 'pulses') return item.category.includes('Pulses');
    if (activeTab === 'fruits') return item.category.includes('Horticulture');
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Top Welcome / Profile Hero Card */}
      <div className="bg-gradient-to-r from-[#4b5d67] to-[#34454f] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              alt="User Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-white/20 shadow-md"
              src={activeUser.avatar}
            />
            <span
              className="absolute bottom-0 right-0 w-4 h-4 bg-[#3a692f] border-2 border-white rounded-full"
              title="Verified Account"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                {lang === 'hi' ? 'नमस्ते' : 'Welcome back'}, {activeUser.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#3a692f] text-[11px] font-semibold tracking-wide uppercase">
                {activeUser.id}
              </span>
              {activeUser.role === 'consumer' && (
                <span className="px-2 py-0.5 rounded-full bg-[#b6c9d5]/30 text-white text-[10px] font-bold">
                  Buyer Account
                </span>
              )}
            </div>
            <p className="text-xs text-white/80 flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                {activeUser.mandiCluster || activeUser.location}
              </span>
              <span>•</span>
              <span className="text-[#9fd48e] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                {activeUser.role === 'farmer' ? 'PFMS Direct Mandate Active' : 'Escrow Deposit Verified'}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {onOpenLogin && (
            <button
              onClick={onOpenLogin}
              className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold backdrop-blur-xs transition-colors flex items-center gap-1.5 border border-white/10"
              title="Switch to Farmer or Consumer Login"
            >
              <span className="material-symbols-outlined text-[16px] text-white">switch_account</span>
              <span>{lang === 'hi' ? 'खाता बदलें / लॉगिन' : 'Switch / Login'}</span>
            </button>
          )}
          <button
            onClick={onOpenVoiceHelp}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold backdrop-blur-xs transition-colors flex items-center gap-2 border border-white/10"
          >
            <span className="material-symbols-outlined text-[18px] text-[#9fd48e]">mic</span>
            <span>{lang === 'hi' ? 'बोलकर मदद लें (Voice Help)' : 'Voice Help / बोलकर मदद'}</span>
          </button>
          <button
            onClick={onNavigateAddProduce}
            className="px-4 py-2.5 rounded-xl bg-[#3a692f] hover:bg-[#235119] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>{lang === 'hi' ? 'फसल जोड़ें' : 'Add New Crop Batch'}</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-black/5 hover:border-black/10 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#73787b]">
            <span className="text-xs font-bold uppercase tracking-wider">
              {lang === 'hi' ? 'कुल प्राप्त भुगतान' : 'Total Realized Payouts'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#b8eea5]/30 flex items-center justify-center text-[#3a692f]">
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1c1c18]">
              ₹1,42,800
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#3a692f] font-semibold mt-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+14.2% vs Mandi APMC</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-black/5 hover:border-black/10 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#73787b]">
            <span className="text-xs font-bold uppercase tracking-wider">
              {lang === 'hi' ? 'सक्रिय फसल लिस्टिंग' : 'Active Produce Listings'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#d2e5f1]/40 flex items-center justify-center text-[#34454f]">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1c1c18]">
              4 Crops
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#43474b] mt-1">
              <span className="font-semibold text-[#1c1c18]">38 Qtl</span>
              <span>Live on National Mandi</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-black/5 hover:border-black/10 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#73787b]">
            <span className="text-xs font-bold uppercase tracking-wider">
              {lang === 'hi' ? 'परिवहन में ऑर्डर' : 'Direct Orders in Transit'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#b8eea5]/30 flex items-center justify-center text-[#3a692f]">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1c1c18]">
              3 Shipments
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#3a692f] font-semibold mt-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span>Dispatch Scheduled Today</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-black/5 hover:border-black/10 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#73787b]">
            <span className="text-xs font-bold uppercase tracking-wider">
              {lang === 'hi' ? 'बचाई गई आढ़तिया दलाली' : 'Direct Commission Saved'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#ffdcd8]/50 flex items-center justify-center text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[20px]">percent</span>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1c1c18]">
              ₹21,400
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#3a692f] font-semibold mt-1">
              <span>0% Arhatiya middleman cut</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Chart & Live Rate Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Comparative Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xs border border-black/5 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-4">
            <div>
              <h2 className="text-base font-bold text-[#1c1c18]">
                {lang === 'hi'
                  ? 'प्रत्यक्ष किसान कमाई बनाम एपीएमसी मंडी दर'
                  : 'Direct Farmer Realization vs. APMC Mandi Benchmark'}
              </h2>
              <p className="text-xs text-[#73787b]">
                Realized per Quintal Payout Comparison (Oct 2023 - Mar 2024)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#3a692f]" />
                <span className="text-[#1c1c18]">FarmDirect Escrow</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#73787b]" />
                <span className="text-[#73787b]">Mandi Spot Rate</span>
              </div>
            </div>
          </div>

          {/* Chart SVG Graphic */}
          <div className="py-4">
            <div className="relative w-full h-56">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                {/* Horizontal Guide Lines */}
                <line x1="40" y1="20" x2="490" y2="20" stroke="#f1ede7" strokeWidth="1" />
                <line x1="40" y1="70" x2="490" y2="70" stroke="#f1ede7" strokeWidth="1" />
                <line x1="40" y1="120" x2="490" y2="120" stroke="#f1ede7" strokeWidth="1" />
                <line x1="40" y1="170" x2="490" y2="170" stroke="#f1ede7" strokeWidth="1" />

                {/* Y-Axis Labels */}
                <text x="5" y="24" fontSize="10" fill="#73787b">₹3,000</text>
                <text x="5" y="74" fontSize="10" fill="#73787b">₹2,500</text>
                <text x="5" y="124" fontSize="10" fill="#73787b">₹2,000</text>
                <text x="5" y="174" fontSize="10" fill="#73787b">₹1,500</text>

                {/* Area Fill for Direct Rates */}
                <polygon
                  points="60,110 180,85 320,60 460,35 460,180 60,180"
                  fill="#b8eea5"
                  opacity="0.25"
                />

                {/* Mandi Benchmark Line (Dotted Gray) */}
                <polyline
                  points="60,135 180,120 320,115 460,105"
                  fill="none"
                  stroke="#73787b"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />

                {/* FarmDirect Green Line */}
                <polyline
                  points="60,110 180,85 320,60 460,35"
                  fill="none"
                  stroke="#3a692f"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Data Points - Mandi */}
                <circle cx="60" cy="135" r="4" fill="#73787b" />
                <circle cx="180" cy="120" r="4" fill="#73787b" />
                <circle cx="320" cy="115" r="4" fill="#73787b" />
                <circle cx="460" cy="105" r="4" fill="#73787b" />

                {/* Data Points - FarmDirect */}
                <circle cx="60" cy="110" r="5" fill="#3a692f" />
                <circle cx="180" cy="85" r="5" fill="#3a692f" />
                <circle cx="320" cy="60" r="5" fill="#3a692f" />
                <circle cx="460" cy="35" r="6" fill="#1d4d15" stroke="#ffffff" strokeWidth="2" />
              </svg>

              {/* X-Axis Month Indicators */}
              <div className="flex justify-between px-10 text-xs font-semibold text-[#73787b] mt-1">
                {['Oct', 'Dec', 'Feb', 'Mar'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setHoveredMonth(m)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      hoveredMonth === m ? 'bg-[#3a692f] text-white font-bold' : 'hover:text-[#1c1c18]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom insight highlight */}
          <div className="p-3 bg-[#fcf9f3] rounded-xl border border-black/5 flex items-center justify-between text-xs">
            <span className="text-[#43474b]">
              Current Sharbati Wheat Advantage: <strong>₹2,850/Qtl (Direct)</strong> vs ₹2,275/Qtl (APMC Mandi).
            </span>
            <span className="font-bold text-[#3a692f] bg-[#b8eea5]/40 px-2 py-0.5 rounded">
              +₹575 / Qtl Direct Net Profit
            </span>
          </div>
        </div>

        {/* Direct Rate Calculator */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-black/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-black/5 pb-3">
              <span className="material-symbols-outlined text-[20px] text-[#3a692f]">calculate</span>
              <h2 className="text-base font-bold text-[#1c1c18]">
                {lang === 'hi' ? 'सीधा आय कैलकुलेटर' : 'Direct Rate Calculator'}
              </h2>
            </div>
            <p className="text-[11px] text-[#73787b] mt-1">
              Estimate your exact net payout without middlemen deductions.
            </p>

            <div className="mt-4 space-y-3">
              {/* Select Commodity */}
              <div>
                <label className="text-xs font-semibold text-[#1c1c18] block mb-1">
                  Crop Commodity
                </label>
                <select
                  value={calcCrop}
                  onChange={(e) => setCalcCrop(e.target.value)}
                  className="w-full h-10 px-3 bg-[#f6f3ed] rounded-lg text-xs font-semibold text-[#1c1c18] border border-black/10 focus:bg-white"
                >
                  <option value="wheat">Sharbati Wheat (Grade-A)</option>
                  <option value="chana">Organic Desi Chana</option>
                  <option value="mango">Gir Kesar Mangoes</option>
                  <option value="mustard">Mustard Seeds (Sarson)</option>
                </select>
              </div>

              {/* Volume Slider & Stepper */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[#1c1c18]">Batch Volume:</span>
                  <span className="text-[#3a692f] font-bold">{calcQuintals} Quintals</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={calcQuintals}
                  onChange={(e) => setCalcQuintals(Number(e.target.value))}
                  className="w-full accent-[#3a692f]"
                />
                <div className="flex justify-between text-[10px] text-[#73787b] mt-0.5">
                  <span>5 Qtl</span>
                  <span>50 Qtl</span>
                  <span>100 Qtl</span>
                </div>
              </div>

              {/* Comparison Output */}
              <div className="p-3.5 bg-[#fcf9f3] rounded-xl border border-black/5 space-y-2 text-xs">
                <div className="flex justify-between text-[#73787b]">
                  <span>Local Mandi Net:</span>
                  <span className="font-semibold line-through">₹{mandiPayout.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#1c1c18] font-bold">
                  <span>FarmDirect Net Escrow:</span>
                  <span className="text-base text-[#3a692f]">₹{directPayout.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-[1px] bg-black/10" />
                <div className="flex justify-between items-center text-[#235119] font-bold bg-[#b8eea5]/30 p-2 rounded-lg">
                  <span>Your Extra Profit:</span>
                  <span className="text-sm">+₹{directExtraIncome.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateAddProduce}
            className="mt-4 w-full py-2.5 rounded-xl bg-[#3a692f] hover:bg-[#1d4d15] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>List This Volume For Instant Bids</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Active Produce Inventory & Live Auctions */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-black/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5 pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#1c1c18]">
              {lang === 'hi' ? 'सक्रिय फसल इन्वेंट्री और लाइव बोलियां' : 'Active Produce Inventory & Live Auctions'}
            </h2>
            <p className="text-xs text-[#73787b]">
              Your listed batches visible to certified institutional millers and retail FPOs
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#f6f3ed] p-1 rounded-xl">
            {(['all', 'grains', 'pulses', 'fruits'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-white text-[#1c1c18] shadow-xs'
                    : 'text-[#73787b] hover:text-[#1c1c18]'
                }`}
              >
                {tab === 'all' ? 'All Batches' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Produce Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {filteredProduce.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-black/10 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between bg-white group"
            >
              <div>
                {/* Image Header */}
                <div className="relative h-44 w-full bg-[#f1ede7] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-bold text-[#1c1c18] shadow-xs">
                    {item.lotNumber}
                  </span>
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs ${
                      item.status === 'Live Bidding'
                        ? 'bg-[#3a692f] text-white'
                        : item.status === 'GI Tagged • Live'
                        ? 'bg-[#1d4d15] text-white'
                        : 'bg-[#4b5d67] text-white'
                    }`}
                  >
                    {item.status}
                  </span>

                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs rounded-lg px-2.5 py-1 text-white flex justify-between text-[11px]">
                    <span>Moisture: {item.moisture}</span>
                    <span>Purity: {item.purity}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#73787b] font-bold">
                        {item.category}
                      </span>
                      <h3 className="font-bold text-sm text-[#1c1c18] leading-tight">
                        {item.name}
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-[#3a692f] bg-[#b8eea5]/30 px-2 py-0.5 rounded">
                      {item.stockVolume} {item.unit}
                    </span>
                  </div>

                  {/* Pricing Comparison */}
                  <div className="bg-[#fcf9f3] p-2.5 rounded-xl border border-black/5 space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[#73787b]">Active Highest Bid:</span>
                      <span className="font-bold text-sm text-[#3a692f]">
                        ₹{item.currentBid.toLocaleString('en-IN')}/Qtl
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-[#73787b]">
                      <span>Statutory MSP Benchmark:</span>
                      <span>₹{item.govtMsp.toLocaleString('en-IN')}/Qtl</span>
                    </div>
                    <div className="text-[11px] text-[#235119] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      <span>+₹{item.mspMargin} / Qtl above minimum MSP</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 pt-0 flex gap-2 border-t border-black/5 mt-2">
                <button
                  onClick={() => onOpenGatePass(item)}
                  className="flex-1 py-2 rounded-xl bg-[#f1ede7] hover:bg-[#ebe8e2] text-xs font-bold text-[#1c1c18] transition-colors flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">qr_code</span>
                  <span>Gate Pass</span>
                </button>
                <button
                  onClick={onNavigateMarketplace}
                  className="flex-1 py-2 rounded-xl bg-[#3a692f] hover:bg-[#1d4d15] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <span>Review Offers ({item.verifiedMillers})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Direct Orders & Dispatches */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-black/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#1c1c18]">
              {lang === 'hi' ? 'सीधे ऑर्डर और परिवहन स्थिति' : 'Live Direct Orders & Dispatches'}
            </h2>
            <p className="text-xs text-[#73787b]">
              Active purchase mandates funded in bank escrow awaiting weighbridge clearance
            </p>
          </div>
          <button
            onClick={() => onNavigateTrackOrders()}
            className="text-xs font-bold text-[#3a692f] hover:underline flex items-center gap-1"
          >
            <span>View All Shipments</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="divide-y divide-black/5 mt-2">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f1ede7] flex items-center justify-center text-[#3a692f] shrink-0 mt-1">
                  <span className="material-symbols-outlined text-[24px]">local_shipping</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-[#1c1c18]">{ord.orderNumber}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#b8eea5]/40 text-[#235119] text-[10.5px] font-bold">
                      {ord.statusBadge}
                    </span>
                  </div>
                  <p className="text-xs text-[#43474b]">
                    <strong>{ord.crop}</strong> • Buyer: {ord.buyer}
                  </p>
                  <p className="text-[11px] text-[#73787b] flex items-center gap-2">
                    <span>Truck: {ord.truckNumber}</span>
                    <span>•</span>
                    <span>{ord.highwayNotice}</span>
                  </p>
                </div>
              </div>

              {/* Order Actions */}
              <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
                <button
                  onClick={() => onOpenDeliveryChallan(ord)}
                  className="px-3 py-1.5 rounded-lg bg-[#f1ede7] hover:bg-[#ebe8e2] text-xs font-bold text-[#1c1c18] transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">description</span>
                  <span>Challan PIN: 8942</span>
                </button>
                <button
                  onClick={() => onNavigateTrackOrders(ord.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#3a692f] hover:bg-[#1d4d15] text-white text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">pin_drop</span>
                  <span>Track Transit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statutory Trust Banner */}
      <div className="rounded-2xl p-5 bg-[#f6f3ed] border border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1d4d15]/10 flex items-center justify-center text-[#1d4d15]">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <div>
            <h3 className="font-bold text-[#1c1c18]">
              Zero Intermediary & Guaranteed 24-Hour Settlement Guarantee
            </h3>
            <p className="text-[#73787b] text-[11px]">
              Direct mandating under Ministry of Agriculture guidelines. 100% funds held in RBI Escrow until weighbridge clearance.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[11px] text-[#73787b]">PFMS Gateway: STABLE</span>
        </div>
      </div>
    </div>
  );
};
