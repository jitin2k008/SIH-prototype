import React from 'react';
import { ScreenId, Language, UserProfile } from '../types';

interface SidebarProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  lang: Language;
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
}

export const EMBLEM_LOGO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDb0-aXcsekaRtuL_33NsixOHJLYW30XWUII2K-lLX3XQYRTT3OxEjRgG4UNSileKqz7ChlgJrEtyvrm-8xzq1QMa5GW68J-C2YDFl0kilOWSivWOaXnOpjc4jaXB4k1pA-I2tS0AlbQQmS3IFSVH06n9k0oLA4JjT9Z8PfxSIuCe2IJEdosF6Mzy85vhIcYEk8O-bGSVNi-iadhsCN8Ca6lnD_F_14naYpyYlA2EQAzaOPFH-shdXL';

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onSelectScreen,
  isOpenMobile,
  onCloseMobile,
  lang,
  currentUser,
  onOpenLogin,
}) => {
  const isFarmer = currentUser?.role === 'farmer';

  const navItems: { id: ScreenId; label: string; hiLabel: string; icon: string; badge?: string }[] = [
    {
      id: 'farmer-dashboard',
      label: isFarmer ? 'Farmer Overview' : 'Producer Overview',
      hiLabel: 'डैशबोर्ड अवलोकन',
      icon: 'agriculture',
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      hiLabel: 'मंडी बाज़ार',
      icon: 'storefront',
      badge: currentUser?.role === 'consumer' ? 'Procure' : undefined,
    },
    {
      id: 'add-produce',
      label: isFarmer ? 'Add Produce' : 'Produce Listing',
      hiLabel: 'फसल जोड़ें',
      icon: 'add_circle',
    },
    {
      id: 'track-orders',
      label: 'Track Orders',
      hiLabel: 'ऑर्डर ट्रैकिंग',
      icon: 'local_shipping',
    },
    {
      id: 'market-insights-admin',
      label: 'Market Insights',
      hiLabel: 'मंडी अंतर्दृष्टि',
      icon: 'query_stats',
    },
    {
      id: 'login',
      label: 'Login & Accounts',
      hiLabel: 'लॉगिन व खाते',
      icon: 'manage_accounts',
      badge: 'Roles',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-[#f6f3ed] z-50 flex flex-col pt-4 pb-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-transform duration-200 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo & Subtitle */}
        <div className="px-4 pb-3 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                onSelectScreen('farmer-dashboard');
                onCloseMobile();
              }}
            >
              <img
                alt="FarmDirect Emblem Logo"
                className="h-8 w-auto object-contain"
                src={EMBLEM_LOGO}
              />
              <span className="font-semibold text-xl tracking-tight text-[#34454f]">FarmDirect</span>
            </div>
            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-[#73787b] hover:text-[#1c1c18]"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
          <span className="text-[11px] text-[#43474b] font-medium tracking-tight">
            {currentUser?.role === 'consumer'
              ? lang === 'hi'
                ? 'उपभोक्ता व मिलर खरीद पोर्टल'
                : 'Consumer & Miller Direct Procurement'
              : lang === 'hi'
              ? 'किसान उत्पादक कमान पोर्टल'
              : 'Kisan Producer Command'}
          </span>
        </div>

        {/* User Card */}
        <div className="px-3 mb-2">
          {currentUser ? (
            <div
              onClick={() => {
                onSelectScreen('login');
                onCloseMobile();
              }}
              className="p-2 rounded-xl bg-[#f1ede7] hover:bg-[#ebe6de] transition-colors flex items-center gap-2.5 border border-black/5 cursor-pointer group"
              title="Click to switch or view profile"
            >
              <img
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover ring-1 ring-[#3a692f]/30"
                src={currentUser.avatar}
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs text-[#1c1c18] truncate font-semibold">
                  {currentUser.name}
                </span>
                <span
                  className={`text-[10px] font-semibold truncate ${
                    currentUser.role === 'farmer' ? 'text-[#3a692f]' : 'text-[#34454f]'
                  }`}
                >
                  {currentUser.role === 'farmer' ? '🌾 Farmer' : '🛒 Buyer'} • {currentUser.id}
                </span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-[#73787b] group-hover:text-[#1c1c18]">
                swap_horiz
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                onOpenLogin();
                onCloseMobile();
              }}
              className="w-full p-2.5 rounded-xl bg-[#3a692f] hover:bg-[#1d4d15] text-white flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>{lang === 'hi' ? 'साइन इन करें' : 'Sign In to Account'}</span>
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectScreen(item.id);
                  onCloseMobile();
                }}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left ${
                  isActive
                    ? 'bg-[#4b5d67] text-[#ffffff] font-bold shadow-xs'
                    : 'text-[#43474b] hover:bg-[#f1ede7] hover:text-[#1c1c18]'
                }`}
              >
                <div className="flex items-center">
                  <span
                    className={`material-symbols-outlined mr-2.5 text-[20px] ${
                      isActive ? 'text-white' : 'text-[#43474b]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{lang === 'hi' ? item.hiLabel : item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#3a692f]/10 text-[#3a692f]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Escrow Badge at bottom */}
        <div className="px-3 pt-2">
          <div className="p-2.5 rounded-xl bg-[#f1ede7] text-[#43474b] text-[11px] flex flex-col gap-1 border border-black/5">
            <div className="flex items-center gap-1.5 text-[#3a692f] font-bold">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>{lang === 'hi' ? 'एस्क्रो सुरक्षित भुगतान' : 'Escrow Protected'}</span>
            </div>
            <span className="leading-tight text-[10.5px]">
              {lang === 'hi'
                ? 'PFMS / आधार ब्रिज द्वारा सीधा बैंक खाता भुगतान'
                : 'Direct Mandate Payouts via PFMS / Aadhaar Bridge'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
