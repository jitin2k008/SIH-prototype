import React, { useState } from 'react';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber?: string;
  onSubmitted: (ticketNo: string) => void;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  isOpen,
  onClose,
  orderNumber = '#FD-2024-8839',
  onSubmitted,
}) => {
  const [category, setCategory] = useState('Weighment Mismatch');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const ticketNo = `ESC-DISP-${Math.floor(10000 + Math.random() * 90000)}`;
      onSubmitted(ticketNo);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-black/10 relative">
        <div className="flex items-center justify-between border-b border-black/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-[#ba1a1a]">gavel</span>
            <div>
              <h3 className="font-bold text-sm text-[#1c1c18]">Raise Escrow Grievance / Dispute</h3>
              <p className="text-[10px] text-[#73787b]">Mandi Arbitrator Fast-Track Resolution</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#73787b] hover:text-[#1c1c18] rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
          <div>
            <label className="font-semibold text-[#1c1c18] block mb-1">Affected Order</label>
            <input
              disabled
              value={orderNumber}
              className="w-full h-9 px-3 bg-[#f1ede7] text-[#43474b] rounded-lg font-mono font-bold"
            />
          </div>

          <div>
            <label className="font-semibold text-[#1c1c18] block mb-1">Dispute Reason</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-9 px-3 bg-[#f6f3ed] rounded-lg text-[#1c1c18] font-medium border border-black/10"
            >
              <option>Weighment Bridge Mismatch (&gt; 0.5%)</option>
              <option>Moisture Reading Dispute</option>
              <option>Logistics Delay exceeding 24 hours</option>
              <option>Payment Escrow Release Hold</option>
              <option>Quality Grade Downgrade Claim</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-[#1c1c18] block mb-1">Statement of Facts</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue with batch details, weighbridge slip number, etc..."
              className="w-full p-2.5 bg-[#f6f3ed] rounded-lg text-[#1c1c18] border border-black/10 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="p-2.5 rounded-lg bg-[#ffdad6]/40 border border-[#ba1a1a]/20 text-[10.5px] text-[#93000a]">
            <strong>Note:</strong> Raising a dispute temporarily locks escrow release for 48 hours until an independent NABL Mandi Surveyor re-verifies the physical seals.
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-black/5">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-[#f1ede7] text-[#43474b] font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 rounded-lg bg-[#ba1a1a] text-white font-bold hover:bg-[#93000a] disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'File Grievance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
