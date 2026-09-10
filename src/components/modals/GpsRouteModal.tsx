import React from 'react';

interface GpsRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  truckNo?: string;
  driverName?: string;
  speed?: string;
  location?: string;
}

export const GpsRouteModal: React.FC<GpsRouteModalProps> = ({
  isOpen,
  onClose,
  truckNo = '#GJ-03-BW-9012',
  driverName = 'Mukesh S.',
  speed = '42 km/h',
  location = 'Currently crossing Rajkot Bypass on NH-27',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-black/10 relative">
        <div className="flex items-center justify-between border-b border-black/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#3a692f]/10 flex items-center justify-center text-[#3a692f]">
              <span className="material-symbols-outlined text-[24px]">satellite_alt</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1c1c18]">Live Ag-Logistics GPS Telematics</h3>
              <p className="text-[11px] text-[#73787b]">
                Real-time transit surveillance on National Highway 27
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

        {/* Live Vector Map Simulation */}
        <div className="mt-4 rounded-xl overflow-hidden border border-black/10 relative bg-[#f1ede7] h-64 flex flex-col">
          {/* Map canvas graphic with Highway NH-27 line */}
          <div className="relative w-full h-full bg-[#ebe8e2] overflow-hidden p-4">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 600 240"
              preserveAspectRatio="none"
            >
              {/* Grid Lines */}
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#dedbd5" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Highway NH-27 Line */}
              <path
                d="M 50 190 Q 200 160 300 110 T 550 50"
                fill="none"
                stroke="#c3c7cb"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M 50 190 Q 200 160 300 110 T 550 50"
                fill="none"
                stroke="#3a692f"
                strokeWidth="4"
                strokeDasharray="8 4"
                strokeLinecap="round"
              />

              {/* Point 1: Gondal Origin */}
              <circle cx="50" cy="190" r="7" fill="#1c1c18" />
              <text x="45" y="215" fontSize="11" fontWeight="bold" fill="#1c1c18">
                Gondal Origin (Done)
              </text>

              {/* Point 2: Rajkot Bypass (Current Active Truck) */}
              <circle cx="210" cy="150" r="14" fill="#b8eea5" opacity="0.6">
                <animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="210" cy="150" r="8" fill="#3a692f" />
              <circle cx="210" cy="150" r="3" fill="#ffffff" />
              <text x="180" y="130" fontSize="12" fontWeight="bold" fill="#235119">
                🚚 Current Position ({speed})
              </text>

              {/* Point 3: Chotila Hub */}
              <circle cx="370" cy="90" r="6" fill="#73787b" />
              <text x="350" y="75" fontSize="11" fill="#43474b">
                Chotila Quality Hub
              </text>

              {/* Point 4: Ahmedabad Terminal */}
              <circle cx="550" cy="50" r="8" fill="#ba1a1a" />
              <text x="470" y="40" fontSize="11" fontWeight="bold" fill="#ba1a1a">
                Ahmedabad Destination
              </text>
            </svg>

            {/* Float HUD */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs p-2.5 rounded-lg shadow-xs border border-black/10 text-xs">
              <span className="font-bold text-[#1c1c18] block">{truckNo}</span>
              <span className="text-[#3a692f] font-semibold">{location}</span>
            </div>

            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg shadow-xs border border-black/10 text-xs font-mono font-bold text-[#1c1c18]">
              Speed: {speed} • Heading: North-East 48°
            </div>
          </div>
        </div>

        {/* Telematics stats bar */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-[#fcf9f3] border border-black/5">
            <span className="text-[10px] text-[#73787b] block">Driver In Charge</span>
            <span className="font-bold text-[#1c1c18]">{driverName}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#fcf9f3] border border-black/5">
            <span className="text-[10px] text-[#73787b] block">Remaining Distance</span>
            <span className="font-bold text-[#1c1c18]">168 km</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#fcf9f3] border border-black/5">
            <span className="text-[10px] text-[#73787b] block">Estimated Arrival</span>
            <span className="font-bold text-[#3a692f]">Tomorrow, 2:00 PM</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#fcf9f3] border border-black/5">
            <span className="text-[10px] text-[#73787b] block">Cargo Temperature</span>
            <span className="font-bold text-[#1c1c18]">27.4°C (Optimum)</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center pt-3 border-t border-black/5">
          <a
            href="tel:+919825044102"
            className="text-xs font-bold text-[#3a692f] flex items-center gap-1 hover:underline"
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            <span>Call Driver Mukesh S. (+91 98250 44102)</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#3a692f] text-white text-xs font-bold hover:bg-[#1d4d15]"
          >
            Close Telematics
          </button>
        </div>
      </div>
    </div>
  );
};
