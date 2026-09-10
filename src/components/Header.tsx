import React, { useState } from 'react';
import { Language, UserProfile, UserRole } from '../types';

interface HeaderProps {
  onOpenMobileNav: () => void;
  lang: Language;
  onToggleLanguage: (lang: Language) => void;
  onOpenVoiceModal: () => void;
  currentUser: UserProfile | null;
  onOpenLogin: (role?: UserRole) => void;
  onLogout: () => void;
  onSwitchRole: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileNav,
  lang,
  onToggleLanguage,
  currentUser,
  onOpenLogin,
  onLogout,
  onSwitchRole,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 px-4 sm:px-8 flex items-center justify-between border-b border-black/5">
      {/* Left side items */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile menu hamburger */}
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 text-[#43474b] hover:bg-[#f1ede7] rounded-lg transition-colors"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Kisan Helpline */}
        <div className="flex items-center gap-1.5 text-[#43474b] text-xs sm:text-sm font-medium">
          <span className="material-symbols-outlined text-[18px] text-[#3a692f]">support_agent</span>
          <span className="hidden sm:inline">
            {lang === 'hi' ? 'किसान हेल्पलाइन:' : 'Kisan Helpline:'}
          </span>
          <span className="font-semibold text-[#1c1c18]">1800-180-1551</span>
        </div>

        <div className="hidden md:block h-4 w-[1px] bg-[#e5e2dc]" />

        {/* Govt Authenticated Producer or Consumer Badge */}
        <div className="hidden md:flex items-center gap-1.5 text-xs sm:text-sm text-[#43474b]">
          <span
            className={`material-symbols-outlined text-[18px] ${
              currentUser?.role === 'consumer' ? 'text-[#34454f]' : 'text-[#1d4d15]'
            }`}
          >
            {currentUser?.role === 'consumer' ? 'verified' : 'shield'}
          </span>
          <span>
            {currentUser?.role === 'consumer'
              ? lang === 'hi'
                ? 'सत्यापित प्रत्यक्ष उपभोक्ता / मिलर'
                : 'Verified Direct Buyer / Miller'
              : lang === 'hi'
              ? 'सरकार द्वारा प्रमाणित उत्पादक'
              : 'Govt Authenticated Producer'}
          </span>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language selector toggle */}
        <div className="flex items-center bg-[#f1ede7] rounded-full p-[2px] border border-black/5">
          <button
            onClick={() => onToggleLanguage('en')}
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
              lang === 'en'
                ? 'bg-white text-[#3a692f] shadow-xs'
                : 'text-[#43474b] hover:text-[#1c1c18]'
            }`}
            type="button"
          >
            English
          </button>
          <button
            onClick={() => onToggleLanguage('hi')}
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
              lang === 'hi'
                ? 'bg-white text-[#3a692f] shadow-xs'
                : 'text-[#43474b] hover:text-[#1c1c18]'
            }`}
            type="button"
          >
            हिंदी
          </button>
        </div>

        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button
            aria-label="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-[#43474b] hover:bg-[#f1ede7] hover:text-[#1c1c18] rounded-full transition-colors relative"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-black/10 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-black/5 flex items-center justify-between">
                <span className="font-bold text-xs text-[#1c1c18]">Notifications (3)</span>
                <span className="text-[10px] text-[#3a692f] font-semibold">Mark all read</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="px-4 py-2.5 hover:bg-[#fcf9f3] border-b border-black/5 cursor-pointer">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3a692f]">
                    <span className="material-symbols-outlined text-[15px]">payments</span>
                    <span>Escrow Release Approved</span>
                  </div>
                  <p className="text-[11px] text-[#43474b] mt-0.5">
                    ₹28,500 transferred to Jan Dhan A/c for Order #FD-8942.
                  </p>
                  <span className="text-[9px] text-[#73787b]">12 mins ago</span>
                </div>
                <div className="px-4 py-2.5 hover:bg-[#fcf9f3] border-b border-black/5 cursor-pointer">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#34454f]">
                    <span className="material-symbols-outlined text-[15px]">gavel</span>
                    <span>New Bid Received on Lot #GJ-94-A</span>
                  </div>
                  <p className="text-[11px] text-[#43474b] mt-0.5">
                    Surat AgriMill placed ₹2,850/Qtl for 20 Quintals Sharbati Wheat.
                  </p>
                  <span className="text-[9px] text-[#73787b]">1 hour ago</span>
                </div>
                <div className="px-4 py-2.5 hover:bg-[#fcf9f3] cursor-pointer">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1d4d15]">
                    <span className="material-symbols-outlined text-[15px]">local_shipping</span>
                    <span>Truck In Transit</span>
                  </div>
                  <p className="text-[11px] text-[#43474b] mt-0.5">
                    Order #FD-2024-8839 crossed Rajkot Bypass, ETA tomorrow 2 PM.
                  </p>
                  <span className="text-[9px] text-[#73787b]">2 hours ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown OR Sign-in Button */}
        {currentUser ? (
          <div className="relative">
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full bg-[#f1ede7] hover:bg-[#ebe8e2] transition-colors cursor-pointer border border-black/5"
            >
              <img
                alt="Profile"
                className="w-7 h-7 rounded-full object-cover ring-1 ring-[#3a692f]/40"
                src={currentUser.avatar}
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-[#1c1c18] leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#3a692f] leading-none">
                  {currentUser.role === 'farmer' ? 'Farmer' : 'Consumer'}
                </span>
              </div>
              <span className="material-symbols-outlined text-[#73787b] text-[18px]">expand_more</span>
            </div>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-black/10 p-3.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-black/5">
                  <img
                    alt="Profile"
                    className="w-11 h-11 rounded-full object-cover ring-1 ring-black/10"
                    src={currentUser.avatar}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#1c1c18] truncate">{currentUser.fullName}</p>
                    <span
                      className={`inline-block px-1.5 py-0.2 text-[9.5px] font-bold rounded ${
                        currentUser.role === 'farmer'
                          ? 'bg-[#b8eea5]/40 text-[#235119]'
                          : 'bg-[#b6c9d5]/40 text-[#34454f]'
                      }`}
                    >
                      {currentUser.id} • {currentUser.role === 'farmer' ? 'Kisan Producer' : 'Consumer Buyer'}
                    </span>
                    <p className="text-[10px] text-[#73787b] truncate mt-0.5">{currentUser.location}</p>
                  </div>
                </div>

                <div className="py-2.5 text-xs flex flex-col gap-1.5 border-b border-black/5">
                  {currentUser.role === 'farmer' ? (
                    <>
                      <div className="flex justify-between text-[11px] text-[#43474b]">
                        <span>Land Parcel:</span>
                        <span className="font-semibold text-[#1c1c18]">{currentUser.landParcel || '14.2 Acres'}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-[#43474b]">
                        <span>KCC Number:</span>
                        <span className="font-semibold text-[#1c1c18]">{currentUser.kcc || '#9482-XXXX-71'}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-[#43474b]">
                        <span>Aadhaar Link:</span>
                        <span className="font-semibold text-[#3a692f]">Biometric Verified</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between text-[11px] text-[#43474b]">
                        <span>Entity:</span>
                        <span className="font-semibold text-[#1c1c18]">{currentUser.companyName || 'Registered Buyer'}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-[#43474b]">
                        <span>Escrow Balance:</span>
                        <span className="font-bold text-[#3a692f]">
                          ₹{(currentUser.escrowBalance || 450000).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-[#43474b]">
                        <span>Delivery Pincode:</span>
                        <span className="font-semibold text-[#1c1c18]">{currentUser.deliveryPincode || '395007'}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-[11px] text-[#73787b]">
                    <span>Email:</span>
                    <span className="truncate max-w-[140px]">{currentUser.email}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#73787b]">
                    <span>Phone:</span>
                    <span>+91 {currentUser.phone}</span>
                  </div>
                </div>

                {/* Dropdown Actions */}
                <div className="pt-2 flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSwitchRole();
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold text-[#43474b] hover:bg-[#f1ede7] flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#3a692f]">swap_horiz</span>
                      <span>
                        {currentUser.role === 'farmer'
                          ? lang === 'hi' ? 'उपभोक्ता लॉगिन पर स्विच करें' : 'Switch to Consumer / Miller'
                          : lang === 'hi' ? 'किसान लॉगिन पर स्विच करें' : 'Switch to Farmer / Producer'}
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenLogin(currentUser.role);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold text-[#43474b] hover:bg-[#f1ede7] flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">lock</span>
                      <span>{lang === 'hi' ? 'लॉगिन स्क्रीन खोलें' : 'Switch Account / Login Page'}</span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdcd8]/50 flex items-center gap-1.5 transition-colors mt-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>{lang === 'hi' ? 'लॉग आउट करें' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onOpenLogin('farmer')}
            className="px-3.5 py-1.5 rounded-full bg-[#3a692f] hover:bg-[#1d4d15] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">login</span>
            <span>{lang === 'hi' ? 'लॉगिन करें' : 'Sign In'}</span>
          </button>
        )}
      </div>
    </header>
  );
};
