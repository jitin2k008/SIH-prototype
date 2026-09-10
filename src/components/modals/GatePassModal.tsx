import React from 'react';

interface GatePassModalProps {
  isOpen: boolean;
  onClose: () => void;
  lotId?: string;
  cropName?: string;
  quantity?: number;
  vehicleNo?: string;
}

export const GatePassModal: React.FC<GatePassModalProps> = ({
  isOpen,
  onClose,
  lotId = 'Lot #GJ-94-A',
  cropName = 'Sharbati Wheat (Grade-A)',
  quantity = 20,
  vehicleNo = 'GJ-03-BW-9012',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-black/10 relative">
        <div className="flex items-center justify-between border-b border-black/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-[#3a692f]">badge</span>
            <div>
              <h3 className="font-bold text-sm text-[#1c1c18]">Digital APMC Transit Gate Pass</h3>
              <p className="text-[10px] text-[#73787b]">Government of Gujarat Mandi Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#73787b] hover:text-[#1c1c18] rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Gate Pass Card */}
        <div className="mt-4 p-4 rounded-xl border-2 border-dashed border-[#73787b]/30 bg-[#fcf9f3] flex flex-col items-center text-center">
          <div className="w-full flex justify-between items-center text-[10px] text-[#73787b] pb-2 border-b border-black/5">
            <span>Pass Ref: GP-2024-9981</span>
            <span className="text-[#3a692f] font-bold">VALID & VERIFIED</span>
          </div>

          {/* SVG QR Code Simulation */}
          <div className="my-3 p-3 bg-white rounded-xl shadow-xs border border-black/10 flex flex-col items-center">
            <svg
              className="w-36 h-36"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100" height="100" fill="white" />
              {/* Corner 1 */}
              <rect x="5" y="5" width="28" height="28" fill="#1c1c18" />
              <rect x="9" y="9" width="20" height="20" fill="white" />
              <rect x="13" y="13" width="12" height="12" fill="#1c1c18" />
              {/* Corner 2 */}
              <rect x="67" y="5" width="28" height="28" fill="#1c1c18" />
              <rect x="71" y="9" width="20" height="20" fill="white" />
              <rect x="75" y="13" width="12" height="12" fill="#1c1c18" />
              {/* Corner 3 */}
              <rect x="5" y="67" width="28" height="28" fill="#1c1c18" />
              <rect x="9" y="71" width="20" height="20" fill="white" />
              <rect x="13" y="75" width="12" height="12" fill="#1c1c18" />
              {/* Data Blocks */}
              <rect x="38" y="10" width="8" height="8" fill="#1c1c18" />
              <rect x="50" y="10" width="8" height="8" fill="#1c1c18" />
              <rect x="38" y="24" width="16" height="8" fill="#1c1c18" />
              <rect x="10" y="42" width="10" height="8" fill="#1c1c18" />
              <rect x="25" y="42" width="12" height="12" fill="#3a692f" />
              <rect x="42" y="42" width="16" height="16" fill="#1c1c18" />
              <rect x="65" y="40" width="10" height="10" fill="#1c1c18" />
              <rect x="80" y="40" width="12" height="6" fill="#1c1c18" />
              <rect x="40" y="66" width="12" height="12" fill="#1c1c18" />
              <rect x="60" y="66" width="14" height="8" fill="#1c1c18" />
              <rect x="80" y="60" width="14" height="14" fill="#3a692f" />
              <rect x="40" y="82" width="24" height="10" fill="#1c1c18" />
              <rect x="70" y="80" width="12" height="12" fill="#1c1c18" />
            </svg>
            <span className="text-[10px] font-mono font-bold text-[#1c1c18] mt-1">
              APMC-AUTH-GJ-9482
            </span>
          </div>

          <div className="w-full text-left space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#73787b]">Batch Identifier:</span>
              <span className="font-bold text-[#1c1c18]">{lotId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#73787b]">Commodity:</span>
              <span className="font-semibold text-[#1c1c18]">{cropName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#73787b]">Gross Quantity:</span>
              <span className="font-bold text-[#3a692f]">{quantity} Quintals (40 Bags)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#73787b]">Assigned Truck:</span>
              <span className="font-mono font-semibold text-[#1c1c18]">{vehicleNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#73787b]">Farmer Producer:</span>
              <span className="font-semibold text-[#1c1c18]">Ramesh Madhavjibhai Patel</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2 justify-end">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-lg bg-[#f1ede7] text-xs font-semibold text-[#1c1c18] hover:bg-[#ebe8e2] flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print Pass</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#3a692f] text-white text-xs font-bold hover:bg-[#1d4d15]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
