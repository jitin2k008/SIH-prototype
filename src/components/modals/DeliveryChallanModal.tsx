import React from 'react';

interface DeliveryChallanModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  pin?: string;
}

export const DeliveryChallanModal: React.FC<DeliveryChallanModalProps> = ({
  isOpen,
  onClose,
  orderId = '#FD-8942',
  pin = '8942',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-black/10 relative">
        <div className="flex items-center justify-between border-b border-black/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-[#3a692f]">description</span>
            <div>
              <h3 className="font-bold text-sm text-[#1c1c18]">Statutory Delivery Challan & Dispatch PIN</h3>
              <p className="text-[10px] text-[#73787b]">Official Mandate Handover Documentation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#73787b] hover:text-[#1c1c18] rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Challan Card */}
        <div className="mt-4 p-4 rounded-xl bg-[#fcf9f3] border border-black/10 space-y-3">
          {/* Dispatch OTP / PIN Display */}
          <div className="bg-[#b8eea5]/30 p-3 rounded-xl border border-[#3a692f]/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#235119] tracking-wider block">
                Driver Handover Verification PIN
              </span>
              <span className="text-xl font-mono font-bold text-[#1c1c18] tracking-widest">{pin}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#3a692f] font-semibold block">Only share when loaded</span>
              <span className="text-[11px] text-[#43474b]">Unlocks Driver Transit Waybill</span>
            </div>
          </div>

          <div className="text-xs space-y-1.5">
            <div className="flex justify-between py-1 border-b border-black/5">
              <span className="text-[#73787b]">Order Number:</span>
              <span className="font-mono font-bold text-[#1c1c18]">{orderId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-black/5">
              <span className="text-[#73787b]">E-Way Bill Number:</span>
              <span className="font-mono text-[#1c1c18]">2918 3920 4410</span>
            </div>
            <div className="flex justify-between py-1 border-b border-black/5">
              <span className="text-[#73787b]">Consignor (Farmer):</span>
              <span className="font-medium text-[#1c1c18]">Ramesh Madhavjibhai Patel (Gondal)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-black/5">
              <span className="text-[#73787b]">Consignee (Buyer):</span>
              <span className="font-medium text-[#1c1c18]">GreenBazaar Retail FPO Ltd.</span>
            </div>
            <div className="flex justify-between py-1 border-b border-black/5">
              <span className="text-[#73787b]">Declared Weight:</span>
              <span className="font-bold text-[#3a692f]">10.00 Quintals (20 Jute Bags)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#73787b]">Escrow Authorization:</span>
              <span className="font-bold text-[#1d4d15]">RBI Regulated - 100% Locked</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2 justify-end">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-lg bg-[#f1ede7] text-xs font-semibold text-[#1c1c18] hover:bg-[#ebe8e2] flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Download Challan PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#3a692f] text-white text-xs font-bold hover:bg-[#1d4d15]"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
