import React, { useState } from 'react';
import { Language, ProduceItem } from '../types';

interface AddProduceScreenProps {
  lang: Language;
  onProduceAdded: (newProduce: ProduceItem) => void;
  onCancel: () => void;
}

export const AddProduceScreen: React.FC<AddProduceScreenProps> = ({
  lang,
  onProduceAdded,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields
  const [category, setCategory] = useState('Cereals & Grains');
  const [cropVariety, setCropVariety] = useState('Sharbati Golden Wheat');
  const [harvestDate, setHarvestDate] = useState('2024-10-20');
  const [moisture, setMoisture] = useState<number>(10.4);
  const [volumeQuintals, setVolumeQuintals] = useState<number>(20);
  const [minOrderLimit, setMinOrderLimit] = useState<number>(5);
  const [selectedGrade, setSelectedGrade] = useState<'A' | 'B' | 'C'>('A');
  const [soilHealthCertified, setSoilHealthCertified] = useState(true);
  const [askingPrice, setAskingPrice] = useState<number>(2850);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // MSP benchmarks per category
  const mspBenchmarks: Record<string, number> = {
    'Cereals & Grains': 2275,
    'Pulses': 5440,
    'Oilseeds': 5650,
    'Fruits & Veg': 7800,
    'Spices': 9800,
  };

  const currentMsp = mspBenchmarks[category] || 2275;
  const juteSacks = volumeQuintals * 2; // 50kg jute bags
  const grossBatchValue = volumeQuintals * askingPrice;
  const platformFee = 0; // zero arhatiya cut
  const guaranteedEscrowNet = grossBatchValue;
  const extraGainPerQtl = askingPrice - currentMsp;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStepSubmit = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Final submission
      const newLotId = `Lot #GJ-${Math.floor(10 + Math.random() * 89)}-${selectedGrade}`;
      const newProduce: ProduceItem = {
        id: `p-${Date.now()}`,
        lotNumber: newLotId,
        category: category,
        name: `${cropVariety} (Grade-${selectedGrade})`,
        variety: cropVariety,
        moisture: `${moisture}%`,
        purity: selectedGrade === 'A' ? '99.2%' : selectedGrade === 'B' ? '97.8%' : '95.5%',
        stockVolume: volumeQuintals,
        unit: 'Quintal',
        currentBid: askingPrice,
        targetPrice: askingPrice,
        govtMsp: currentMsp,
        mspMargin: extraGainPerQtl,
        verifiedMillers: 1,
        status: 'Live Bidding',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCutGNRNuLlt65OrLKIdvY7hZQV3pfRYv8ppKx-7TI5UqIo8PsDnsDcAsLXTJF0f7ZYM0DHL63_tm8RZt0Ll5Ha2sp_yphbYcNM2RYfHodUqQ-seYdUZfbk0UNjvnam09j8ZxZsij8zhiAM2ZiSPTDj3uIF6tEdxPbZ9aQKoNnrutEGkYN2_4dMsz5JClBBYq1T_oBF7AlHlO2cVU1V2oHEVrsMJgOTdXvMCavlfVAjKjUTFAYV6PTF',
        imageAlt: 'Freshly registered crop batch in gunny sacks',
      };
      onProduceAdded(newProduce);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-20 max-w-6xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#1c1c18] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 border border-white/10 animate-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[#9fd48e] text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#3a692f] uppercase tracking-wider block">
            {lang === 'hi' ? 'सीधा किसान पंजीकरण' : 'Direct Producer Registration'}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1c1c18] tracking-tight">
            {lang === 'hi' ? 'नई फसल का लॉट दर्ज करें' : 'List New Crop Harvest Batch'}
          </h1>
          <p className="text-xs text-[#73787b]">
            Certified digital gate pass generated upon submission. Direct 100% escrow settlement.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Draft saved successfully to local storage')}
            className="px-3.5 py-2 rounded-xl bg-[#f1ede7] hover:bg-[#ebe8e2] text-xs font-bold text-[#1c1c18] transition-colors"
          >
            Save Draft
          </button>
        </div>
      </div>

      {/* 5-Step Visual Wizard Progress Tracker */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-black/5 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[500px]">
          {[
            { step: 1, title: 'Crop & Variety', icon: 'grass' },
            { step: 2, title: 'Quantity & Grade', icon: 'scale' },
            { step: 3, title: 'MSP & Pricing', icon: 'currency_rupee' },
            { step: 4, title: 'Photos & Assay', icon: 'photo_camera' },
            { step: 5, title: 'Mandi & Logistics', icon: 'local_shipping' },
          ].map((s, idx, arr) => {
            const isCompleted = s.step < currentStep;
            const isCurrent = s.step === currentStep;

            return (
              <React.Fragment key={s.step}>
                <div
                  onClick={() => setCurrentStep(s.step)}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-[#3a692f] text-white'
                        : isCurrent
                        ? 'bg-[#34454f] text-white ring-4 ring-[#b6c9d5]/30'
                        : 'bg-[#f1ede7] text-[#73787b]'
                    }`}
                  >
                    {isCompleted ? (
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    ) : (
                      s.step
                    )}
                  </div>
                  <span
                    className={`text-xs font-semibold whitespace-nowrap ${
                      isCurrent
                        ? 'text-[#1c1c18] font-bold'
                        : isCompleted
                        ? 'text-[#3a692f]'
                        : 'text-[#73787b]'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {idx < arr.length - 1 && (
                  <div
                    className={`flex-1 h-[2px] mx-3 transition-colors ${
                      isCompleted ? 'bg-[#3a692f]' : 'bg-[#e5e2dc]'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Main Form + Sticky Financial Intel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Form Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Crop Classification */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-black/5 space-y-4">
            <div className="flex items-center gap-2 border-b border-black/5 pb-3">
              <span className="material-symbols-outlined text-[20px] text-[#3a692f]">spa</span>
              <h2 className="text-sm font-bold text-[#1c1c18]">1. Crop Commodity & Classification</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {['Cereals & Grains', 'Pulses', 'Oilseeds', 'Fruits & Veg', 'Spices'].map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    category === cat
                      ? 'border-[#3a692f] bg-[#b8eea5]/20 text-[#235119] font-bold shadow-xs'
                      : 'border-black/10 bg-[#fcf9f3] text-[#43474b] hover:bg-[#f1ede7]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {cat === 'Cereals & Grains'
                      ? 'grain'
                      : cat === 'Pulses'
                      ? 'emoji_nature'
                      : cat === 'Oilseeds'
                      ? 'water_drop'
                      : cat === 'Fruits & Veg'
                      ? 'nutrition'
                      : 'psychiatry'}
                  </span>
                  <span className="text-[11px] leading-tight">{cat}</span>
                </button>
              ))}
            </div>

            {/* Crop Variety with suggestions */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1c1c18]">
                Crop Variety / Trade Spec
              </label>
              <input
                type="text"
                value={cropVariety}
                onChange={(e) => setCropVariety(e.target.value)}
                placeholder="e.g. Sharbati Golden Wheat, Desi Chana..."
                className="w-full h-11 px-3 bg-[#f6f3ed] rounded-xl text-xs font-semibold text-[#1c1c18] border border-black/10 focus:bg-white focus:outline-none"
              />
              <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
                <span className="text-[#73787b]">Popular varieties:</span>
                {['Sharbati 306', 'Lokwan', 'HD-2967', 'Desi Chana (NPOP)', 'Gir Kesar'].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setCropVariety(s)}
                    className="px-2 py-0.5 rounded-full bg-[#f1ede7] hover:bg-[#ebe8e2] text-[#43474b] font-medium transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Harvest Date & Moisture Analysis */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-black/5 space-y-4">
            <div className="flex items-center gap-2 border-b border-black/5 pb-3">
              <span className="material-symbols-outlined text-[20px] text-[#3a692f]">calendar_today</span>
              <h2 className="text-sm font-bold text-[#1c1c18]">2. Harvest Period & Moisture Index</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#1c1c18] block mb-1">
                  Harvest Completion Date
                </label>
                <input
                  type="date"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full h-10 px-3 bg-[#f6f3ed] rounded-xl text-xs font-medium text-[#1c1c18] border border-black/10"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[#1c1c18]">Tested Grain Moisture:</span>
                  <span className="font-bold text-[#3a692f]">{moisture}% (Optimal &lt; 12%)</span>
                </div>
                <input
                  type="range"
                  min="8.0"
                  max="16.0"
                  step="0.1"
                  value={moisture}
                  onChange={(e) => setMoisture(Number(e.target.value))}
                  className="w-full accent-[#3a692f]"
                />
                <div className="flex justify-between text-[10px] text-[#73787b] mt-0.5">
                  <span>8% (Very Dry)</span>
                  <span>11% (Grade A Ideal)</span>
                  <span>14%+ (High Moisture)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Available Lot Weight & Bagging */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-black/5 space-y-4">
            <div className="flex items-center gap-2 border-b border-black/5 pb-3">
              <span className="material-symbols-outlined text-[20px] text-[#3a692f]">inventory</span>
              <h2 className="text-sm font-bold text-[#1c1c18]">3. Batch Weight & Bagging Configuration</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#1c1c18] block mb-1">
                  Total Available Volume (Quintals)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVolumeQuintals(Math.max(1, volumeQuintals - 1))}
                    className="w-10 h-10 rounded-xl bg-[#f1ede7] hover:bg-[#ebe8e2] font-bold text-base flex items-center justify-center text-[#1c1c18]"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={volumeQuintals}
                    onChange={(e) => setVolumeQuintals(Math.max(1, Number(e.target.value)))}
                    className="w-full h-10 text-center font-bold text-sm bg-[#f6f3ed] rounded-xl border border-black/10"
                  />
                  <button
                    type="button"
                    onClick={() => setVolumeQuintals(volumeQuintals + 1)}
                    className="w-10 h-10 rounded-xl bg-[#f1ede7] hover:bg-[#ebe8e2] font-bold text-base flex items-center justify-center text-[#1c1c18]"
                  >
                    +
                  </button>
                </div>
                <span className="text-[11px] text-[#73787b] block mt-1">
                  Equivalent to <strong>{juteSacks} standard 50kg gunny jute bags</strong>.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1c1c18] block mb-1">
                  Minimum Lot Purchase Requirement
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={minOrderLimit}
                    onChange={(e) => setMinOrderLimit(Math.max(1, Number(e.target.value)))}
                    className="w-full h-10 px-3 bg-[#f6f3ed] rounded-xl text-xs font-bold text-[#1c1c18] border border-black/10"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-[#73787b]">Quintals</span>
                </div>
                <span className="text-[11px] text-[#73787b] block mt-1">
                  Buyers must purchase at least this quantity.
                </span>
              </div>
            </div>

            {/* Quality Grade Radio Cards */}
            <div>
              <label className="text-xs font-semibold text-[#1c1c18] block mb-2">
                Declared AGMARK Quality Tier
              </label>
              <div className="grid grid-cols-3 gap-3 text-xs">
                {[
                  { grade: 'A' as const, label: 'Grade A Premium', spec: 'Purity > 99%, Moisture < 11%' },
                  { grade: 'B' as const, label: 'Grade B Standard', spec: 'Purity > 97%, Moisture < 12.5%' },
                  { grade: 'C' as const, label: 'Grade C Fair Average', spec: 'Purity > 95%, Moisture < 14%' },
                ].map((g) => (
                  <button
                    key={g.grade}
                    type="button"
                    onClick={() => setSelectedGrade(g.grade)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-1 transition-all ${
                      selectedGrade === g.grade
                        ? 'border-[#3a692f] bg-[#b8eea5]/20 text-[#235119] font-bold shadow-xs'
                        : 'border-black/10 bg-[#fcf9f3] text-[#43474b]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{g.label}</span>
                      {selectedGrade === g.grade && (
                        <span className="material-symbols-outlined text-[16px] text-[#3a692f]">
                          check_circle
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#73787b]">{g.spec}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Soil Health Card Toggle */}
            <div className="p-3 bg-[#fcf9f3] rounded-xl border border-black/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#3a692f]">verified</span>
                <div>
                  <span className="font-bold text-[#1c1c18] block">Soil Health Card Verified</span>
                  <span className="text-[11px] text-[#73787b]">
                    Plot registered with District Agricultural Officer
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={soilHealthCertified}
                onChange={(e) => setSoilHealthCertified(e.target.checked)}
                className="w-4 h-4 accent-[#3a692f]"
              />
            </div>
          </div>

          {/* Section 4: Photographic Verification (3 Slots) */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-black/5 space-y-4">
            <div className="flex items-center gap-2 border-b border-black/5 pb-3">
              <span className="material-symbols-outlined text-[20px] text-[#3a692f]">add_a_photo</span>
              <h2 className="text-sm font-bold text-[#1c1c18]">4. Photographic Verification & Assay Proof</h2>
            </div>
            <p className="text-[11px] text-[#73787b]">
              Photographs are geotagged to Gondal, Rajkot coordinates and verified before gate pass generation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Photo 1 */}
              <div className="p-2 bg-[#fcf9f3] rounded-xl border border-black/10 flex flex-col gap-2">
                <div className="relative h-28 w-full rounded-lg overflow-hidden bg-black/5">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUy146Ox-lR4MThS3Dx9GVdPUavosRGvtuyUGd3WCNiTC2voVAu2pKlJi0LAqvQsHL4kfV59eJvrgjvvJvvJ3gH525g2v3j0JvcK24lsiDEJ3AO1dlBzQNWxJOjNNeYmGTkp0ijIm29euG9VrzHRdO-4gfTaQH3QuhyAyheEPvHawbWKbTJvwlxe_gHoybiModQV03KHR8NF0hZSEKQSSa7_EDsq0GsXULDBY1Y6r66cYEv_qDirIX"
                    alt="Grain in hand"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                    ✓ Verified
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#1c1c18]">1. Grain Quality In Hand</span>
                <span className="text-[10px] text-[#73787b]">Clean lustrous kernel shot</span>
              </div>

              {/* Photo 2 */}
              <div className="p-2 bg-[#fcf9f3] rounded-xl border border-black/10 flex flex-col gap-2">
                <div className="relative h-28 w-full rounded-lg overflow-hidden bg-black/5">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDcTJ6b-WRj-Y6s7ug4RN1SbGuyfeHY7z8jPdmhl6ZQC-ZxayTMPq7g_FFLFLsWw1N39Q9LzX8MBcMZ6NvUrGbahFXyk3Y9kOvLhcqCp4r7P5080rotdIDnUAPXJ1qaoPJ1zs8waUO6T6WWo6n9MuoAo3kuu3hVErrXTRkH8c850rb8hwUsX-yi1GhJseg2_NX7BTsCugyt5D2QSadAG1kIXf7rpaSkExDpMlPPJPnLeqs5eOXtz_E"
                    alt="Burlap sacks"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                    ✓ Verified
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#1c1c18]">2. Jute Sacks Stack</span>
                <span className="text-[10px] text-[#73787b]">Full batch storage lot</span>
              </div>

              {/* Photo 3 */}
              <div className="p-2 bg-[#fcf9f3] rounded-xl border border-black/10 flex flex-col gap-2">
                <div className="relative h-28 w-full rounded-lg overflow-hidden bg-black/5">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdFp1QaBVdQe7fo2Ys24aX4e9U3OkLVWBbUWh3ZVb_IvfphaOlQDYZ8ImrjM1lu07Xz2H0BAH663wz_mfWqFJWSG4RFSN2vwVBSGys2yCXFi9WzcxNlG40g0B86--91MBwAUifnhRgPRF9EMEMpoYqcMqH5_AYvqzf_ToIcJq8J6itNrkW2YerSf6szn3PMNKRA0KNUJdIten0y7Toixi69lUkLHKzipyMFhVqnchLJlmdW0qNUW-W"
                    alt="Assay meter"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                    ✓ Verified
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#1c1c18]">3. Moisture Meter Display</span>
                <span className="text-[10px] text-[#73787b]">Instrument reading: 10.4%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Financial & MSP Intel Box */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-xs border border-black/5 space-y-4 sticky top-20">
          <div className="border-b border-black/5 pb-3">
            <span className="text-[10px] uppercase font-bold text-[#3a692f] tracking-wider block">
              Government Price Intelligence
            </span>
            <h3 className="font-bold text-base text-[#1c1c18]">Live MSP & Escrow Yield</h3>
          </div>

          {/* Statutory Benchmark */}
          <div className="p-3 bg-[#fcf9f3] rounded-xl border border-black/5 text-xs space-y-1">
            <div className="flex justify-between text-[#73787b]">
              <span>Government Mandated MSP:</span>
              <span className="font-bold text-[#1c1c18]">₹{currentMsp.toLocaleString('en-IN')}/Qtl</span>
            </div>
            <p className="text-[10px] text-[#73787b]">
              Official floor price fixed by CACP for current agricultural season.
            </p>
          </div>

          {/* Asking Price Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1c1c18]">
              Your Direct Asking Rate (₹ / Qtl)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs font-bold text-[#3a692f]">₹</span>
              <input
                type="number"
                min={currentMsp}
                step="25"
                value={askingPrice}
                onChange={(e) => setAskingPrice(Math.max(currentMsp, Number(e.target.value)))}
                className="w-full h-10 pl-7 pr-3 bg-[#f6f3ed] rounded-xl text-sm font-bold text-[#3a692f] border border-black/10 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Real-time Ledger */}
          <div className="p-3.5 bg-[#f1ede7] rounded-xl space-y-2 text-xs">
            <div className="flex justify-between text-[#43474b]">
              <span>Gross Batch Value ({volumeQuintals} Qtl):</span>
              <span className="font-bold text-[#1c1c18]">₹{grossBatchValue.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#43474b] text-[11px]">
              <span>Brokerage / Arhatiya Cut:</span>
              <span className="font-bold text-[#3a692f]">₹0.00 (Zero Cut)</span>
            </div>
            <div className="h-[1px] bg-black/10" />
            <div className="flex justify-between items-center text-sm font-bold text-[#1c1c18]">
              <span>Guaranteed Net Escrow:</span>
              <span className="text-base text-[#3a692f]">
                ₹{guaranteedEscrowNet.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-2 bg-[#b8eea5]/30 rounded-lg text-[10.5px] text-[#235119] font-semibold">
              ✓ Direct PFMS transfer to your registered Jan Dhan account within 24h of weighbridge scan.
            </div>
          </div>

          {/* Step Navigation Actions */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handleStepSubmit}
              className="w-full py-3 rounded-xl bg-[#3a692f] hover:bg-[#1d4d15] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{currentStep === 5 ? 'Confirm & Publish Lot' : 'Continue / आगे बढ़ें'}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>

            <button
              onClick={onCancel}
              className="w-full py-2.5 rounded-xl bg-[#f1ede7] hover:bg-[#ebe8e2] text-xs font-semibold text-[#73787b] transition-colors"
            >
              Cancel & Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
