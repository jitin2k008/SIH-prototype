import React, { useState } from 'react';
import { OrderItem, Language } from '../types';

interface TrackOrdersScreenProps {
  orders: OrderItem[];
  selectedOrderId?: string;
  lang: Language;
  onOpenGpsRoute: (truckNo: string, driver: string, speed: string, location: string) => void;
  onOpenVideoPlayer: (title: string, time: string, coords: string) => void;
  onOpenInvoice: (order: OrderItem) => void;
  onOpenDispute: (orderNumber: string) => void;
}

export const TrackOrdersScreen: React.FC<TrackOrdersScreenProps> = ({
  orders,
  selectedOrderId,
  lang,
  onOpenGpsRoute,
  onOpenVideoPlayer,
  onOpenInvoice,
  onOpenDispute,
}) => {
  const [activeOrderId, setActiveOrderId] = useState<string>(
    selectedOrderId || orders[0]?.id || 'order-1'
  );

  const currentOrder =
    orders.find((o) => o.id === activeOrderId) || orders[0] || null;

  if (!currentOrder) return null;

  return (
    <div className="space-y-6 animate-in fade-in pb-16 max-w-6xl mx-auto">
      {/* Order Selector Tabs */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-black/5 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#1c1c18] whitespace-nowrap">
            Select Active Mandate:
          </span>
          <div className="flex items-center gap-2">
            {orders.map((ord) => (
              <button
                key={ord.id}
                onClick={() => setActiveOrderId(ord.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  ord.id === activeOrderId
                    ? 'bg-[#3a692f] text-white shadow-xs'
                    : 'bg-[#f1ede7] text-[#43474b] hover:bg-[#ebe8e2]'
                }`}
              >
                {ord.orderNumber}
              </button>
            ))}
          </div>
        </div>

        <span className="text-[11px] text-[#73787b] font-mono hidden md:inline">
          Statutory E-Way Bill Mandate System
        </span>
      </div>

      {/* Main Order Header Box */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-black/5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1c1c18] tracking-tight">
              {currentOrder.orderNumber}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#b8eea5]/40 text-[#235119] text-xs font-bold">
              {currentOrder.statusBadge}
            </span>
          </div>
          <p className="text-xs text-[#73787b] flex items-center gap-2 flex-wrap">
            <span>Mandate Reference: <strong>{currentOrder.mandateRef}</strong></span>
            <span>•</span>
            <span>Created: {currentOrder.createdDate}</span>
            <span>•</span>
            <span>Buyer: <strong>{currentOrder.buyer}</strong></span>
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onOpenInvoice(currentOrder)}
            className="px-3.5 py-2 rounded-xl bg-[#f1ede7] hover:bg-[#ebe8e2] text-xs font-bold text-[#1c1c18] transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            <span>Official Invoice</span>
          </button>
          <button
            onClick={() => onOpenDispute(currentOrder.orderNumber)}
            className="px-3.5 py-2 rounded-xl bg-[#ffdcd8]/50 hover:bg-[#ffdcd8] text-xs font-bold text-[#ba1a1a] transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">report_problem</span>
            <span>Raise Dispute</span>
          </button>
        </div>
      </div>

      {/* 5-Step Transit & Escrow Lifecycle Monitor */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-black/5 space-y-4">
        <div className="flex items-center justify-between border-b border-black/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#3a692f]">conversion_path</span>
            <h2 className="text-sm font-bold text-[#1c1c18]">Dispatch Lifecycle & Escrow Milestones</h2>
          </div>
          <span className="text-xs font-bold text-[#3a692f] bg-[#b8eea5]/30 px-2.5 py-0.5 rounded-full">
            Stage {currentOrder.stage} of 5 Active
          </span>
        </div>

        {/* Visual Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {[
            {
              step: 1,
              title: '1. Order Placed',
              desc: 'Buyer deposited 100% escrow',
              time: '24 Oct, 09:15 AM',
              icon: 'shopping_bag',
            },
            {
              step: 2,
              title: '2. Farm Packaged',
              desc: 'Gunny sacks weighed & stitched',
              time: '24 Oct, 11:30 AM',
              icon: 'inventory_2',
            },
            {
              step: 3,
              title: '3. Ag-Logistics',
              desc: 'In transit on Highway NH-27',
              time: 'Active Now',
              icon: 'local_shipping',
            },
            {
              step: 4,
              title: '4. Quality Hub',
              desc: 'Weighbridge & moisture scan',
              time: 'ETA Tomorrow 11 AM',
              icon: 'science',
            },
            {
              step: 5,
              title: '5. Payout Release',
              desc: 'Direct PFMS Jan Dhan credit',
              time: 'Automatic T+1',
              icon: 'account_balance',
            },
          ].map((st) => {
            const isCompleted = st.step < currentOrder.stage;
            const isCurrent = st.step === currentOrder.stage;

            return (
              <div
                key={st.step}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-1 transition-all ${
                  isCurrent
                    ? 'border-[#3a692f] bg-[#b8eea5]/20 ring-2 ring-[#3a692f]/20 shadow-xs'
                    : isCompleted
                    ? 'border-black/5 bg-[#fcf9f3]'
                    : 'border-black/5 bg-[#f6f3ed]/50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCompleted
                        ? 'bg-[#3a692f] text-white'
                        : isCurrent
                        ? 'bg-[#1c1c18] text-white'
                        : 'bg-[#e5e2dc] text-[#73787b]'
                    }`}
                  >
                    {isCompleted ? (
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    ) : (
                      st.step
                    )}
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-[#73787b]">
                    {st.icon}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="font-bold text-xs text-[#1c1c18] block">{st.title}</span>
                  <span className="text-[10.5px] text-[#43474b] block leading-tight">
                    {st.desc}
                  </span>
                  <span className="text-[10px] text-[#3a692f] font-semibold block mt-1">
                    {st.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Truck Telematics Banner */}
      <div className="bg-gradient-to-r from-[#34454f] to-[#4b5d67] rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#9fd48e]">
            <span className="material-symbols-outlined text-[28px]">local_shipping</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">{currentOrder.truckNumber}</span>
              <span className="px-2 py-0.5 rounded bg-[#3a692f] text-[10px] font-bold uppercase">
                GPS Live Monitored
              </span>
            </div>
            <p className="text-xs text-white/80 mt-0.5">
              Driver: <strong>{currentOrder.driverName}</strong> ({currentOrder.driverPhone}) • Speed:{' '}
              {currentOrder.speed} • ETA: {currentOrder.eta}
            </p>
            <p className="text-[11px] text-[#9fd48e] font-medium mt-0.5">
              {currentOrder.currentLocation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${currentOrder.driverPhone}`}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold backdrop-blur-xs transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            <span>Call Driver</span>
          </a>
          <button
            onClick={() =>
              onOpenGpsRoute(
                currentOrder.truckNumber,
                currentOrder.driverName,
                currentOrder.speed,
                currentOrder.currentLocation
              )
            }
            className="px-4 py-2 rounded-xl bg-[#3a692f] hover:bg-[#1d4d15] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">map</span>
            <span>View Live GPS Route</span>
          </button>
        </div>
      </div>

      {/* Grid: Commodity Assay + Authenticity Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commodity & NABL Assay Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-black/5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#3a692f]">biotech</span>
                <h3 className="font-bold text-sm text-[#1c1c18]">Commodity & NABL Quality Assay</h3>
              </div>
              <span className="text-[11px] text-[#73787b] font-mono">{currentOrder.nablRef}</span>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <img
                src={currentOrder.cropImage}
                alt={currentOrder.cropImageAlt}
                className="w-20 h-20 rounded-xl object-cover ring-1 ring-black/10"
              />
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#73787b]">Batch Inspection</span>
                <h4 className="font-bold text-base text-[#1c1c18]">{currentOrder.crop}</h4>
                <p className="text-xs text-[#43474b]">
                  Contract Weight: <strong>{currentOrder.quantityQuintals} Quintals (40 Bags)</strong>
                </p>
              </div>
            </div>

            {/* Test Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-[#fcf9f3] border border-black/5">
                <span className="text-[#73787b] text-[10.5px] block">Moisture Reading</span>
                <span className="font-bold text-sm text-[#3a692f]">
                  {currentOrder.moistureIndex}
                </span>
                <span className="text-[10px] text-[#73787b] block">Statutory limit &lt; 12.0%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#fcf9f3] border border-black/5">
                <span className="text-[#73787b] text-[10.5px] block">Physical Purity</span>
                <span className="font-bold text-sm text-[#1c1c18]">
                  {currentOrder.physicalPurity}
                </span>
                <span className="text-[10px] text-[#73787b] block">Inert matter &lt; 0.8%</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#b8eea5]/20 border border-[#3a692f]/20 text-[11px] text-[#235119] flex items-center justify-between">
            <span>✓ Certified AGMARK Laboratory Seal Intact</span>
            <button
              onClick={() => onOpenInvoice(currentOrder)}
              className="font-bold underline text-xs"
            >
              Assay Certificate
            </button>
          </div>
        </div>

        {/* Producer & Landholding Authenticity Dossier */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-black/5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#3a692f]">verified_user</span>
                <h3 className="font-bold text-sm text-[#1c1c18]">Producer & Landholding Authenticity</h3>
              </div>
              <span className="text-[11px] text-[#3a692f] font-bold">KCC VALIDATED</span>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <img
                src={currentOrder.farmerPhoto}
                alt={currentOrder.farmerPhotoAlt}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-[#3a692f]/30"
              />
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm text-[#1c1c18]">{currentOrder.farmerName}</h4>
                <p className="text-xs text-[#73787b]">{currentOrder.farmerVillage}</p>
                <div className="flex gap-2 text-[11px] text-[#43474b]">
                  <span>Land: {currentOrder.farmerLand}</span>
                  <span>•</span>
                  <span>KCC: {currentOrder.farmerKcc}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-[#fcf9f3] rounded-xl border border-black/5 text-xs space-y-1">
              <div className="flex justify-between text-[#43474b]">
                <span>Biometric Identity:</span>
                <span className="font-semibold text-[#3a692f]">Aadhaar Biometric Linked</span>
              </div>
              <div className="flex justify-between text-[#43474b]">
                <span>Platform Credibility:</span>
                <span className="font-semibold text-[#1c1c18]">{currentOrder.farmerTrades}</span>
              </div>
              <div className="flex justify-between text-[#73787b] text-[11px]">
                <span>Farm GPS Coordinates:</span>
                <span className="font-mono">{currentOrder.geoCoords}</span>
              </div>
            </div>
          </div>

          {/* Bagging Video Record button */}
          <button
            onClick={() =>
              onOpenVideoPlayer(
                'Farm Bagging Verification - ' + currentOrder.orderNumber,
                currentOrder.videoRecordTime,
                currentOrder.geoCoords
              )
            }
            className="w-full py-2.5 rounded-xl bg-[#f1ede7] hover:bg-[#ebe8e2] text-xs font-bold text-[#1c1c18] transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px] text-[#3a692f]">play_circle</span>
            <span>Play Tamper-Proof Bagging Video Record</span>
          </button>
        </div>
      </div>

      {/* Institutional Financial Ledger & Escrow Breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-black/5 space-y-4">
        <div className="flex items-center justify-between border-b border-black/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#3a692f]">account_balance</span>
            <h3 className="font-bold text-sm text-[#1c1c18]">
              Statutory Escrow Ledger (Zero Hidden Margins)
            </h3>
          </div>
          <span className="text-xs font-bold text-[#3a692f]">Reserve Bank Regulated Escrow</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-[#fcf9f3] rounded-xl border border-black/5">
            <span className="text-[#73787b] block">Direct Farmer Base Payout</span>
            <span className="text-lg font-bold text-[#1c1c18]">
              ₹{currentOrder.breakdown.directFarmerPayout.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-[#3a692f] block mt-0.5">100% credited to Jan Dhan A/c</span>
          </div>

          <div className="p-3 bg-[#fcf9f3] rounded-xl border border-black/5">
            <span className="text-[#73787b] block">Ancillary Service Charges</span>
            <div className="text-xs font-medium text-[#43474b] mt-1 space-y-0.5">
              <div className="flex justify-between">
                <span>NABL Inspection:</span>
                <span>₹{currentOrder.breakdown.inspectionFee}</span>
              </div>
              <div className="flex justify-between">
                <span>APMC Mandi Cess:</span>
                <span>₹{currentOrder.breakdown.mandiCess}</span>
              </div>
              <div className="flex justify-between">
                <span>Dedicated Transit:</span>
                <span>₹{currentOrder.breakdown.logisticsFee}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#b8eea5]/30 rounded-xl border border-[#3a692f]/20 flex flex-col justify-between">
            <div>
              <span className="text-[#235119] font-bold block">Total Mandate Escrow Fund</span>
              <span className="text-xl font-bold text-[#1d4d15]">
                ₹{currentOrder.breakdown.totalEscrow.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-[10.5px] text-[#235119] font-medium">
              Brokerage cut saved: ₹{currentOrder.middlemanSavings.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
