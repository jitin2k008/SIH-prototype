import React, { useState } from 'react';
import { MarketplaceLot } from '../../types';

interface MakeOfferModalProps {
  lot: MarketplaceLot | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const MakeOfferModal: React.FC<MakeOfferModalProps> = ({
  lot,
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen || !lot) return null;

  const [bidPrice, setBidPrice] = useState<number>(lot.offeredRate);
  const [quantity, setQuantity] = useState<number>(Math.min(10, lot.availableQuintals));
  const [fulfillmentType, setFulfillmentType] = useState<'hub' | 'doorstep'>('hub');
  const [paymentMode, setPaymentMode] = useState<'escrow' | 'nach'>('escrow');
  const [submitting, setSubmitting] = useState(false);

  const totalValue = bidPrice * quantity;
  const mandiEquivalent = lot.govtMsp * quantity;
  const platformFee = Math.round(totalValue * 0.015);
  const statutoryCess = Math.round(totalValue * 0.01);
  const totalEscrowDeposit = totalValue + platformFee + statutoryCess;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSuccess(
        `Direct Mandate Contract created for ${quantity} Qtl of ${lot.title} at ₹${bidPrice}/Qtl. Locked in RBI-compliant Escrow.`
      );
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-black/10 relative my-8">
        <div className="flex items-center justify-between border-b border-black/5 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#3a692f]/10 flex items-center justify-center text-[#3a692f]">
              <span className="material-symbols-outlined text-[24px]">shopping_basket</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1c1c18]">Institutional Procurement Contract</h3>
              <p className="text-[11px] text-[#73787b]">
                Direct Farmer Trade • Statutory Escrow Protected
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#73787b] hover:text-[#1c1c18] rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Lot Details Summary */}
        <div className="p-3 bg-[#fcf9f3] rounded-xl flex items-center gap-3 border border-black/5 mb-4">
          <img
            src={lot.image}
            alt={lot.imageAlt}
            className="w-14 h-14 rounded-lg object-cover ring-1 ring-black/10"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1c1c18] truncate">{lot.title}</span>
              <span className="px-1.5 py-0.5 rounded bg-[#b8eea5]/50 text-[#235119] text-[10px] font-bold">
                {lot.badge}
              </span>
            </div>
            <p className="text-[11px] text-[#43474b]">
              Farmer: <strong>{lot.farmerName}</strong> • {lot.location}
            </p>
            <div className="flex gap-3 text-[11px] text-[#73787b] mt-0.5">
              <span>Lot: {lot.availableQuintals} Qtl Avail</span>
              <span>Statutory MSP: ₹{lot.govtMsp.toLocaleString('en-IN')}/Qtl</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Quantity & Price Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#1c1c18]">
                Quantity to Procure (Quintals)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={lot.availableQuintals}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full h-11 px-3 bg-[#f6f3ed] rounded-lg text-sm font-bold text-[#1c1c18] focus:bg-white focus:outline-none ring-1 ring-black/10"
                />
                <span className="absolute right-3 top-3 text-xs text-[#73787b]">Quintals</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#1c1c18]">
                Your Offer Rate / Qtl (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-xs font-bold text-[#3a692f]">₹</span>
                <input
                  type="number"
                  min={lot.govtMsp}
                  step="10"
                  value={bidPrice}
                  onChange={(e) => setBidPrice(Number(e.target.value))}
                  className="w-full h-11 pl-7 pr-3 bg-[#f6f3ed] rounded-lg text-sm font-bold text-[#3a692f] focus:bg-white focus:outline-none ring-1 ring-black/10"
                />
                <span className="absolute right-3 top-3 text-[11px] text-[#73787b]">per Qtl</span>
              </div>
            </div>
          </div>

          {/* Fulfillment Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#1c1c18]">Fulfillment & Dispatch</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setFulfillmentType('hub')}
                className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                  fulfillmentType === 'hub'
                    ? 'border-[#3a692f] bg-[#b8eea5]/20 font-semibold text-[#235119]'
                    : 'border-black/10 bg-[#fcf9f3] text-[#43474b]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">warehouse</span>
                <div>
                  <div className="font-bold">FPO Hub Aggregation</div>
                  <div className="text-[10px] text-[#73787b]">Quality certified at Mandi gate</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('doorstep')}
                className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                  fulfillmentType === 'doorstep'
                    ? 'border-[#3a692f] bg-[#b8eea5]/20 font-semibold text-[#235119]'
                    : 'border-black/10 bg-[#fcf9f3] text-[#43474b]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                <div>
                  <div className="font-bold">Farm Gate Direct Truck</div>
                  <div className="text-[10px] text-[#73787b]">Aggregator truck dispatched to farm</div>
                </div>
              </button>
            </div>
          </div>

          {/* Escrow Financial Ledger Breakdown */}
          <div className="p-3.5 rounded-xl bg-[#f1ede7] flex flex-col gap-1.5 text-xs">
            <div className="flex justify-between text-[#43474b]">
              <span>Producer 100% Direct Payout ({quantity} Qtl × ₹{bidPrice}):</span>
              <span className="font-bold text-[#1c1c18]">₹{totalValue.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#73787b] text-[11px]">
              <span>Statutory APMC Mandi Benchmark Payout:</span>
              <span className="line-through">₹{mandiEquivalent.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#43474b] text-[11px]">
              <span>Platform Service Fee (Civic rate 1.5%):</span>
              <span>₹{platformFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#43474b] text-[11px]">
              <span>Mandi Statutory Cess (1.0%):</span>
              <span>₹{statutoryCess.toLocaleString('en-IN')}</span>
            </div>
            <div className="h-[1px] bg-black/10 my-1" />
            <div className="flex justify-between items-center text-sm font-bold text-[#1c1c18]">
              <span>Total Escrow Depository Amount:</span>
              <span className="text-base text-[#3a692f]">
                ₹{totalEscrowDeposit.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[10px] text-[#73787b] mt-0.5">
              100% held in Reserve Bank of India compliant Public Escrow. Released to farmer only upon weighbridge barcode scan.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#f1ede7] hover:bg-[#ebe8e2] text-xs font-semibold text-[#43474b] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-[#3a692f] hover:bg-[#1d4d15] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>
                {submitting ? 'Depositing Escrow...' : 'Confirm Escrow Lock & Place Mandate'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
