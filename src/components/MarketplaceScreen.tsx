import React, { useState, useMemo } from 'react';
import { MarketplaceLot, Language, UserProfile, UserRole } from '../types';

interface MarketplaceScreenProps {
  lots: MarketplaceLot[];
  lang: Language;
  onSelectLotToOffer: (lot: MarketplaceLot) => void;
  onOpenVoiceHelp: () => void;
  currentUser?: UserProfile | null;
  onOpenLogin?: (role?: UserRole) => void;
}

export const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({
  lots,
  lang,
  onSelectLotToOffer,
  currentUser,
  onOpenLogin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minVolume, setMinVolume] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<'relevance' | 'price-asc' | 'price-desc' | 'volume'>('relevance');

  // Filter Categories counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'Cereals & Millets': 0,
      'Pulses / Dal': 0,
      'Oilseeds': 0,
      'Cash Crops & Spices': 0,
      'Horticulture & Fruits': 0,
    };
    lots.forEach((l) => {
      if (counts[l.category] !== undefined) {
        counts[l.category]++;
      }
    });
    return counts;
  }, [lots]);

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const toggleCert = (cert: string) => {
    if (selectedCerts.includes(cert)) {
      setSelectedCerts(selectedCerts.filter((c) => c !== cert));
    } else {
      setSelectedCerts([...selectedCerts, cert]);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedState('all');
    setSelectedCategories([]);
    setMinVolume(0);
    setMaxPrice(15000);
    setSelectedCerts([]);
  };

  const filteredLots = useMemo(() => {
    return lots
      .filter((lot) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = lot.title.toLowerCase().includes(q);
          const matchFarmer = lot.farmerName.toLowerCase().includes(q);
          const matchLoc = lot.location.toLowerCase().includes(q);
          const matchLotNo = lot.lotNumber.toLowerCase().includes(q);
          if (!matchTitle && !matchFarmer && !matchLoc && !matchLotNo) return false;
        }

        if (selectedState !== 'all' && lot.stateCode !== selectedState) {
          return false;
        }

        if (selectedCategories.length > 0 && !selectedCategories.includes(lot.category)) {
          return false;
        }

        if (lot.availableQuintals < minVolume) {
          return false;
        }

        if (lot.offeredRate > maxPrice) {
          return false;
        }

        if (selectedCerts.length > 0) {
          const hasAnyCert = selectedCerts.some((c) => lot.certifications.includes(c));
          if (!hasAnyCert) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'price-asc') return a.offeredRate - b.offeredRate;
        if (sortOption === 'price-desc') return b.offeredRate - a.offeredRate;
        if (sortOption === 'volume') return b.availableQuintals - a.availableQuintals;
        return 0;
      });
  }, [lots, searchQuery, selectedState, selectedCategories, minVolume, maxPrice, selectedCerts, sortOption]);

  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      {/* Live Mandi Index Ticker Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-xs border border-black/5 overflow-x-auto flex items-center justify-between gap-6 text-xs whitespace-nowrap">
        <div className="flex items-center gap-2 text-[#3a692f] font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3a692f] animate-pulse" />
          <span>NATIONAL MANDI INDEX:</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[#73787b]">Wheat (Grade-A):</span>
            <span className="font-bold text-[#1c1c18]">₹2,850/Qtl</span>
            <span className="text-[#3a692f] font-semibold flex items-center text-[11px]">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>+1.8%
            </span>
          </div>
          <div className="h-4 w-[1px] bg-black/10" />
          <div className="flex items-center gap-2">
            <span className="text-[#73787b]">Chana (Gram):</span>
            <span className="font-bold text-[#1c1c18]">₹5,650/Qtl</span>
            <span className="text-[#3a692f] font-semibold flex items-center text-[11px]">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>+0.4%
            </span>
          </div>
          <div className="h-4 w-[1px] bg-black/10" />
          <div className="flex items-center gap-2">
            <span className="text-[#73787b]">Mustard:</span>
            <span className="font-bold text-[#1c1c18]">₹5,800/Qtl</span>
            <span className="text-[#ba1a1a] font-semibold flex items-center text-[11px]">
              <span className="material-symbols-outlined text-[14px]">arrow_downward</span>-0.2%
            </span>
          </div>
          <div className="h-4 w-[1px] bg-black/10" />
          <div className="flex items-center gap-2">
            <span className="text-[#73787b]">Basmati 1121:</span>
            <span className="font-bold text-[#1c1c18]">₹3,950/Qtl</span>
            <span className="text-[#3a692f] font-semibold flex items-center text-[11px]">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>+2.1%
            </span>
          </div>
        </div>

        <span className="text-[11px] text-[#73787b] font-mono">Synced: 2 mins ago</span>
      </div>

      {/* Procurement / Auth Banner */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              currentUser?.role === 'consumer'
                ? 'bg-[#b6c9d5]/30 text-[#34454f]'
                : 'bg-[#b8eea5]/30 text-[#235119]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              {currentUser?.role === 'consumer' ? 'shopping_cart_checkout' : 'agriculture'}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1c1c18]">
                {currentUser?.role === 'consumer'
                  ? lang === 'hi'
                    ? `सत्यापित क्रेता पोर्टल: ${currentUser.fullName}`
                    : `Verified Buyer Mode: ${currentUser.fullName}`
                  : currentUser?.role === 'farmer'
                  ? lang === 'hi'
                    ? `किसान दृश्य: ${currentUser.fullName}`
                    : `Farmer Producer Mode: ${currentUser.fullName}`
                  : lang === 'hi'
                  ? 'अतिथि दृश्य (सार्वजनिक मंडी बाज़ार)'
                  : 'Public Marketplace (Guest View)'}
              </span>
              {currentUser?.role === 'consumer' && (
                <span className="px-2 py-0.5 rounded-md bg-[#3a692f]/10 text-[#3a692f] text-[10px] font-bold">
                  Escrow: ₹{(currentUser.escrowBalance || 450000).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-[11.5px] text-[#73787b] mt-0.5">
              {currentUser?.role === 'consumer'
                ? lang === 'hi'
                  ? 'आप प्रमाणित किसानों से सीधे थोक/खुदरा लॉट खरीदने और एस्क्रो ऑफर भेजने के लिए अधिकृत हैं।'
                  : 'You are authorized to place direct escrow buy orders and binding offers with 0% middleman cut.'
                : currentUser?.role === 'farmer'
                ? lang === 'hi'
                  ? 'उपभोक्ता या मिलर के रूप में फसल लॉट खरीदने के लिए क्रेता खाते में बदलें।'
                  : 'Viewing producer listings. Want to procure crops as a miller or bulk consumer?'
                : lang === 'hi'
                ? 'लॉट खरीदने या बिड लगाने के लिए किसान अथवा उपभोक्ता के रूप में लॉगिन करें।'
                : 'Sign in with your phone or email to submit direct escrow offers and track dispatches.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser ? (
            currentUser.role === 'farmer' ? (
              <button
                type="button"
                onClick={() => onOpenLogin && onOpenLogin('consumer')}
                className="px-3.5 py-2 rounded-xl bg-[#34454f] hover:bg-[#202c33] text-white text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[16px]">switch_account</span>
                <span>{lang === 'hi' ? 'क्रेता लॉगिन पर स्विच करें' : 'Switch to Consumer Login'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenLogin && onOpenLogin('farmer')}
                className="px-3.5 py-2 rounded-xl bg-[#3a692f] hover:bg-[#1d4d15] text-white text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[16px]">switch_account</span>
                <span>{lang === 'hi' ? 'किसान लॉगिन पर स्विच करें' : 'Switch to Farmer Login'}</span>
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={() => onOpenLogin && onOpenLogin('consumer')}
              className="px-4 py-2 rounded-xl bg-[#3a692f] hover:bg-[#1d4d15] text-white text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>{lang === 'hi' ? 'लॉगिन / साइन इन' : 'Login / Sign In'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-5 shadow-xs border border-black/5 space-y-5 text-xs">
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <div className="flex items-center gap-1.5 font-bold text-[#1c1c18] text-sm">
              <span className="material-symbols-outlined text-[20px] text-[#3a692f]">tune</span>
              <span>Procurement Filters</span>
            </div>
            <button
              onClick={handleReset}
              className="text-[#3a692f] font-semibold text-[11px] hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Search Box */}
          <div>
            <label className="font-semibold text-[#1c1c18] block mb-1">Search Lots</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Crop variety, farmer name, lot #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-8 pr-3 bg-[#f6f3ed] rounded-lg text-xs font-medium text-[#1c1c18] border border-black/10 focus:bg-white focus:outline-none"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#73787b] text-[18px]">
                search
              </span>
            </div>
          </div>

          {/* State of Origin */}
          <div>
            <label className="font-semibold text-[#1c1c18] block mb-1">Origin State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full h-9 px-3 bg-[#f6f3ed] rounded-lg text-xs font-medium text-[#1c1c18] border border-black/10"
            >
              <option value="all">All India (National Mandis)</option>
              <option value="gj">Gujarat (Rajkot / Junagadh)</option>
              <option value="mp">Madhya Pradesh (Sehore)</option>
              <option value="hr">Haryana (Karnal)</option>
              <option value="rj">Rajasthan (Alwar)</option>
              <option value="ts">Telangana (Nizamabad)</option>
            </select>
          </div>

          {/* Crop Categories */}
          <div>
            <label className="font-semibold text-[#1c1c18] block mb-2">Crop Classification</label>
            <div className="space-y-1.5">
              {Object.entries(categoryCounts).map(([cat, count]) => (
                <label
                  key={cat}
                  className="flex items-center justify-between cursor-pointer hover:bg-[#fcf9f3] p-1 rounded transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="rounded text-[#3a692f] focus:ring-0 accent-[#3a692f]"
                    />
                    <span className="text-[#43474b]">{cat}</span>
                  </div>
                  <span className="text-[10px] text-[#73787b] font-semibold">{count}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Minimum Batch Volume Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-[#1c1c18]">Min Batch Volume:</span>
              <span className="text-[#3a692f] font-bold">{minVolume} Qtl</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={minVolume}
              onChange={(e) => setMinVolume(Number(e.target.value))}
              className="w-full accent-[#3a692f]"
            />
            <div className="flex justify-between text-[10px] text-[#73787b] mt-0.5">
              <span>Any</span>
              <span>25 Qtl</span>
              <span>50+ Qtl</span>
            </div>
          </div>

          {/* Max Target Price */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-[#1c1c18]">Max Asking Price:</span>
              <span className="text-[#3a692f] font-bold">₹{maxPrice.toLocaleString('en-IN')}/Qtl</span>
            </div>
            <input
              type="range"
              min="2000"
              max="15000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#3a692f]"
            />
          </div>

          {/* Certifications */}
          <div>
            <label className="font-semibold text-[#1c1c18] block mb-2">Quality & Certifications</label>
            <div className="space-y-1.5">
              {[
                'AGMARK Grade A',
                'Organic India Certified',
                'Soil Health Card Tested',
                'Zero Chemical (SPNF)',
              ].map((cert) => (
                <label key={cert} className="flex items-center gap-2 cursor-pointer p-1">
                  <input
                    type="checkbox"
                    checked={selectedCerts.includes(cert)}
                    onChange={() => toggleCert(cert)}
                    className="rounded text-[#3a692f] accent-[#3a692f]"
                  />
                  <span className="text-[#43474b] text-[11px]">{cert}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Producer Lots Listing */}
        <div className="lg:col-span-3 space-y-4">
          {/* Top Bar for Results & Sorting */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-sm text-[#1c1c18]">
                {filteredLots.length} Active Verified Producer Lots
              </span>
              <p className="text-[11px] text-[#73787b]">
                Inspected lots with verified moisture assays and direct farmer bank mandate
              </p>
            </div>

            {/* Sort options */}
            <div className="flex items-center gap-2">
              <span className="text-[#73787b] font-medium">Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="h-8 px-2.5 bg-[#f6f3ed] rounded-lg text-xs font-semibold text-[#1c1c18] border border-black/10"
              >
                <option value="relevance">Relevance / Certified First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="volume">Volume: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid of Lots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredLots.map((lot) => (
              <div
                key={lot.id}
                className="bg-white rounded-2xl border border-black/10 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Image Header */}
                  <div className="relative h-48 w-full bg-[#f1ede7] overflow-hidden">
                    <img
                      src={lot.image}
                      alt={lot.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-bold text-[#1c1c18] shadow-xs">
                      {lot.lotNumber}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#3a692f] text-white text-[11px] font-bold shadow-xs">
                      {lot.badge}
                    </span>

                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs rounded-lg px-2.5 py-1 text-white flex justify-between text-[11px]">
                      <span>{lot.subBadge}</span>
                      <span>{lot.dispatchType}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#73787b] tracking-wider">
                          {lot.category}
                        </span>
                        <h3 className="font-bold text-base text-[#1c1c18] leading-tight">
                          {lot.title}
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-lg bg-[#b8eea5]/30 text-[#235119] text-xs font-bold">
                        {lot.availableQuintals} Qtl Avail
                      </span>
                    </div>

                    {/* Farmer Identity */}
                    <div className="flex items-center gap-2 text-xs text-[#43474b]">
                      <span className="material-symbols-outlined text-[16px] text-[#3a692f]">person</span>
                      <span>Farmer: <strong>{lot.farmerName}</strong></span>
                      <span>•</span>
                      <span>{lot.location}</span>
                    </div>

                    {/* Pricing Box */}
                    <div className="p-3 bg-[#fcf9f3] rounded-xl border border-black/5 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[#73787b]">Farmer Asking Rate:</span>
                        <span className="text-base font-bold text-[#3a692f]">
                          ₹{lot.offeredRate.toLocaleString('en-IN')}/Qtl
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-[#73787b]">
                        <span>Statutory MSP Benchmark:</span>
                        <span>₹{lot.govtMsp.toLocaleString('en-IN')}/Qtl</span>
                      </div>
                      <div className="text-[10.5px] text-[#235119] font-semibold flex items-center gap-1 bg-[#b8eea5]/30 px-2 py-0.5 rounded">
                        <span className="material-symbols-outlined text-[14px]">shield</span>
                        <span>{lot.marginSavedText}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => onSelectLotToOffer(lot)}
                    className="w-full py-2.5 rounded-xl bg-[#3a692f] hover:bg-[#1d4d15] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">shopping_cart_checkout</span>
                    <span>Make Offer / Buy Batch</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredLots.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-black/5 space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#73787b]">search_off</span>
              <h3 className="font-bold text-base text-[#1c1c18]">No producer lots match your criteria</h3>
              <p className="text-xs text-[#73787b] max-w-sm mx-auto">
                Try widening your price range, volume requirement, or resetting the state filters.
              </p>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg bg-[#3a692f] text-white text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
