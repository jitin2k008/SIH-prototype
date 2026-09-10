import React from 'react';
import { OrderItem } from '../../types';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderItem;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-black/10 relative my-6">
        <div className="flex items-center justify-between border-b border-black/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-[#3a692f]">receipt_long</span>
            <div>
              <h3 className="font-bold text-base text-[#1c1c18]">Official Mandate & GST Invoice</h3>
              <p className="text-[11px] text-[#73787b]">Tax Invoice cum Mandi Cess Settlement Receipt</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#73787b] hover:text-[#1c1c18] rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Printable Invoice Body */}
        <div className="mt-4 p-5 bg-[#fcf9f3] rounded-xl border border-black/10 text-xs space-y-4 font-sans">
          {/* Top Invoice Header */}
          <div className="flex justify-between items-start border-b border-black/10 pb-3">
            <div>
              <span className="font-bold text-base text-[#1c1c18]">FarmDirect National Escrow Portal</span>
              <p className="text-[11px] text-[#73787b]">Ministry of Agriculture & Farmers Welfare Integrated</p>
              <p className="text-[11px] text-[#73787b]">GSTIN: 24AAACF9182K1Z8</p>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-sm text-[#1c1c18]">INV-FD-2024-8839</span>
              <p className="text-[11px] text-[#73787b]">Date: 24 Oct 2024</p>
              <p className="text-[11px] text-[#3a692f] font-semibold">Status: Escrow Paid</p>
            </div>
          </div>

          {/* Parties Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-2.5 rounded-lg bg-white border border-black/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#73787b] block mb-1">
                Seller / Producer
              </span>
              <p className="font-bold text-[#1c1c18]">{order.farmerName}</p>
              <p className="text-[11px] text-[#43474b]">{order.farmerVillage}</p>
              <p className="text-[11px] text-[#43474b]">KCC: {order.farmerKcc}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-black/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#73787b] block mb-1">
                Buyer / Consignee
              </span>
              <p className="font-bold text-[#1c1c18]">{order.buyer}</p>
              <p className="text-[11px] text-[#43474b]">APMC Licensed Institutional Buyer</p>
              <p className="text-[11px] text-[#43474b]">Mandate: {order.mandateRef}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/10 text-[10px] uppercase font-bold text-[#73787b]">
                <th className="py-1.5">Description</th>
                <th className="py-1.5 text-center">HSN</th>
                <th className="py-1.5 text-right">Qty (Qtl)</th>
                <th className="py-1.5 text-right">Unit Rate (₹)</th>
                <th className="py-1.5 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr>
                <td className="py-2 font-medium text-[#1c1c18]">
                  {order.crop} (AGMARK Certified)
                </td>
                <td className="py-2 text-center text-[#73787b]">1001</td>
                <td className="py-2 text-right font-semibold">{order.quantityQuintals}</td>
                <td className="py-2 text-right font-mono">
                  ₹{(order.breakdown.directFarmerPayout / order.quantityQuintals).toFixed(0)}
                </td>
                <td className="py-2 text-right font-bold text-[#1c1c18]">
                  ₹{order.breakdown.directFarmerPayout.toLocaleString('en-IN')}
                </td>
              </tr>
              <tr>
                <td className="py-1 text-[#43474b]">Civic Platform Tech Fee (1.5%)</td>
                <td className="py-1 text-center text-[#73787b]">9983</td>
                <td className="py-1 text-right">-</td>
                <td className="py-1 text-right">-</td>
                <td className="py-1 text-right font-medium">₹{order.breakdown.platformFee.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="py-1 text-[#43474b]">NABL Accredited Quality Assay</td>
                <td className="py-1 text-center text-[#73787b]">9983</td>
                <td className="py-1 text-right">-</td>
                <td className="py-1 text-right">-</td>
                <td className="py-1 text-right font-medium">₹{order.breakdown.inspectionFee.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="py-1 text-[#43474b]">Statutory APMC Mandi Cess (1.0%)</td>
                <td className="py-1 text-center text-[#73787b]">MANDI</td>
                <td className="py-1 text-right">-</td>
                <td className="py-1 text-right">-</td>
                <td className="py-1 text-right font-medium">₹{order.breakdown.mandiCess.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="py-1 text-[#43474b]">Dedicated Ag-Logistics Transit (NH-27)</td>
                <td className="py-1 text-center text-[#73787b]">9965</td>
                <td className="py-1 text-right">-</td>
                <td className="py-1 text-right">-</td>
                <td className="py-1 text-right font-medium">₹{order.breakdown.logisticsFee.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-black/10 font-bold text-sm text-[#1c1c18]">
                <td colSpan={4} className="py-2 text-right">
                  Total Institutional Mandate Value:
                </td>
                <td className="py-2 text-right text-[#3a692f] text-base">
                  ₹{order.breakdown.totalEscrow.toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="p-2.5 rounded bg-[#b8eea5]/20 border border-[#3a692f]/20 text-[10.5px] text-[#235119]">
            ✓ Arhatiya / Middleman brokerage: <strong>₹0.00 (Zero Commission Model)</strong>. Total direct savings for this trade: <strong>₹{order.middlemanSavings.toLocaleString('en-IN')}</strong>.
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-[11px] text-[#73787b]">Digital Signature: SHA256: 8f92..b41e</span>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 rounded-lg bg-[#f1ede7] hover:bg-[#ebe8e2] text-xs font-semibold text-[#1c1c18] flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#3a692f] text-white text-xs font-bold hover:bg-[#1d4d15]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
