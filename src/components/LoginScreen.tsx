import React, { useState } from 'react';
import { Language, UserProfile, UserRole } from '../types';
import {
  FARMER_PROFILE,
  CONSUMER_PROFILE,
  RETAIL_CONSUMER_PROFILE,
} from '../data/mockData';
import { EMBLEM_LOGO } from './Sidebar';

interface LoginScreenProps {
  lang: Language;
  onLoginSuccess: (user: UserProfile) => void;
  onCancel?: () => void;
  initialRole?: UserRole;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  lang,
  onLoginSuccess,
  onCancel,
  initialRole = 'farmer',
}) => {
  // Mode: 'login' or 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  // Selected user role: 'farmer' or 'consumer'
  const [role, setRole] = useState<UserRole>(initialRole);
  // Input identifier mode: 'email' or 'phone'
  const [inputMethod, setInputMethod] = useState<'email' | 'phone'>('phone');

  // Form states - Login
  const [identifier, setIdentifier] = useState(initialRole === 'farmer' ? '9876543210' : '9823456789');
  const [password, setPassword] = useState('kisan123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'verify' | 'success'>('request');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Form states - Registration
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regLocation, setRegLocation] = useState('');
  const [regBuyerType, setRegBuyerType] = useState<'Bulk Miller' | 'Retail Consumer' | 'Agri Processor'>('Retail Consumer');
  const [regLandParcel, setRegLandParcel] = useState('');
  const [regKcc, setRegKcc] = useState('');

  // Handle Role Switch
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setErrorMessage(null);
    if (newRole === 'farmer') {
      setIdentifier(inputMethod === 'phone' ? '9876543210' : 'ramesh.patel@kisan.gov.in');
      setPassword('kisan123');
    } else {
      setIdentifier(inputMethod === 'phone' ? '9823456789' : 'priya.sharma@suratgrain.com');
      setPassword('miller123');
    }
  };

  // Handle Input Method Switch
  const handleMethodChange = (newMethod: 'email' | 'phone') => {
    setInputMethod(newMethod);
    setErrorMessage(null);
    if (role === 'farmer') {
      setIdentifier(newMethod === 'phone' ? '9876543210' : 'ramesh.patel@kisan.gov.in');
    } else {
      setIdentifier(newMethod === 'phone' ? '9823456789' : 'priya.sharma@suratgrain.com');
    }
  };

  // Quick 1-Click Demo Login
  const handleQuickLogin = (demoUser: UserProfile) => {
    setLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(demoUser);
    }, 450);
  };

  // Submit Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanId = identifier.trim().toLowerCase();
    if (!cleanId) {
      setErrorMessage(
        lang === 'hi'
          ? 'कृपया अपना ईमेल या फ़ोन नंबर दर्ज करें।'
          : 'Please enter your email or phone number.'
      );
      return;
    }
    if (!password) {
      setErrorMessage(
        lang === 'hi' ? 'कृपया अपना पासवर्ड दर्ज करें।' : 'Please enter your password.'
      );
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Check farmer match
      if (role === 'farmer') {
        const farmerPhone = FARMER_PROFILE.phone;
        const farmerEmail = FARMER_PROFILE.email.toLowerCase();
        if (
          cleanId === farmerPhone ||
          cleanId === farmerEmail ||
          cleanId.includes('ramesh') ||
          cleanId.includes('kisan') ||
          cleanId === '9876543210'
        ) {
          onLoginSuccess(FARMER_PROFILE);
          return;
        }

        // Custom farmer profile if arbitrary entered
        const dynamicFarmer: UserProfile = {
          id: `FD-USR-${Math.floor(1000 + Math.random() * 9000)}`,
          name: cleanId.includes('@') ? cleanId.split('@')[0] : `Farmer (${cleanId.slice(-4)})`,
          fullName: cleanId.includes('@') ? cleanId.split('@')[0] : `Kisan Producer (${cleanId})`,
          role: 'farmer',
          email: cleanId.includes('@') ? cleanId : `${cleanId}@kisan.direct`,
          phone: cleanId.includes('@') ? '9876543210' : cleanId,
          status: 'Authenticated Farmer',
          location: 'Rajkot Mandi Cluster, Gujarat',
          avatar: FARMER_PROFILE.avatar,
          mandiCluster: 'Rajkot APMC Mandi, Gujarat',
          village: 'Village: Gondal, Dist: Rajkot, Gujarat',
          landParcel: '8.5 Acres',
          kcc: '#KCC-2024-PASS',
          aadhaarLinked: true,
          trades: '12 Successful Escrow Dispatches',
        };
        onLoginSuccess(dynamicFarmer);
        return;
      }

      // Check consumer / buyer match
      if (role === 'consumer') {
        const buyerPhone = CONSUMER_PROFILE.phone;
        const buyerEmail = CONSUMER_PROFILE.email.toLowerCase();
        const retailPhone = RETAIL_CONSUMER_PROFILE.phone;
        const retailEmail = RETAIL_CONSUMER_PROFILE.email.toLowerCase();

        if (cleanId === retailPhone || cleanId === retailEmail || cleanId.includes('ananya')) {
          onLoginSuccess(RETAIL_CONSUMER_PROFILE);
          return;
        }

        if (
          cleanId === buyerPhone ||
          cleanId === buyerEmail ||
          cleanId.includes('priya') ||
          cleanId.includes('surat') ||
          cleanId === '9823456789'
        ) {
          onLoginSuccess(CONSUMER_PROFILE);
          return;
        }

        // Custom consumer dynamic profile
        const dynamicConsumer: UserProfile = {
          id: `BUY-USR-${Math.floor(1000 + Math.random() * 9000)}`,
          name: cleanId.includes('@') ? cleanId.split('@')[0] : `Buyer (${cleanId.slice(-4)})`,
          fullName: cleanId.includes('@') ? cleanId.split('@')[0] : `Consumer Buyer (${cleanId})`,
          role: 'consumer',
          email: cleanId.includes('@') ? cleanId : `${cleanId}@buyer.direct`,
          phone: cleanId.includes('@') ? '9823456789' : cleanId,
          status: 'Verified Consumer',
          location: 'Ahmedabad / Mumbai Corridor',
          avatar: CONSUMER_PROFILE.avatar,
          companyName: 'Verified Direct Procuring Entity',
          buyerType: 'Retail Consumer',
          deliveryPincode: '380001',
          escrowBalance: 150000,
          trades: 'New Verified Buyer Account',
        };
        onLoginSuccess(dynamicConsumer);
      }
    }, 600);
  };

  // Submit Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName || !regPhone || !regPassword) {
      setErrorMessage(
        lang === 'hi'
          ? 'कृपया नाम, मोबाइल नंबर और पासवर्ड भरें।'
          : 'Please enter full name, mobile number, and password.'
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (role === 'farmer') {
        const newFarmer: UserProfile = {
          id: `FD-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
          name: regFullName.split(' ')[0],
          fullName: regFullName,
          role: 'farmer',
          email: regEmail || `${regPhone}@kisan.direct`,
          phone: regPhone,
          status: 'Newly Registered Farmer',
          location: regLocation || 'Gujarat APMC Cluster',
          avatar: FARMER_PROFILE.avatar,
          mandiCluster: regLocation || 'Rajkot Mandi Cluster, Gujarat',
          village: regLocation ? `Village: ${regLocation}` : 'Gondal, Rajkot',
          landParcel: regLandParcel || '5.0 Acres',
          kcc: regKcc || '#KCC-NEW-MANDATE',
          aadhaarLinked: true,
          trades: '0 Trades (New Farmer Gate Pass Active)',
        };
        onLoginSuccess(newFarmer);
      } else {
        const newBuyer: UserProfile = {
          id: `BUY-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
          name: regFullName.split(' ')[0],
          fullName: regFullName,
          role: 'consumer',
          email: regEmail || `${regPhone}@buyer.direct`,
          phone: regPhone,
          status: 'Direct Buyer Account',
          location: regLocation || 'Ahmedabad, Gujarat',
          avatar: CONSUMER_PROFILE.avatar,
          companyName: regFullName,
          buyerType: regBuyerType,
          deliveryPincode: regLocation ? regLocation.slice(-6) : '380015',
          escrowBalance: 50000,
          trades: 'New Buyer Escrow Account Ready',
        };
        onLoginSuccess(newBuyer);
      }
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4 sm:px-6 animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-black/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Informational Showcase / Hero Banner (5 cols on desktop) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#1d3319] via-[#24431f] to-[#34454f] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#3a692f]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#9fd48e]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Logo and National Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md p-1.5 flex items-center justify-center border border-white/20 shadow-inner">
                <img
                  src={EMBLEM_LOGO}
                  alt="FarmDirect"
                  className="w-full h-full object-contain brightness-110"
                />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-white block">
                  FarmDirect
                </span>
                <span className="text-[10.5px] uppercase tracking-wider text-[#9fd48e] font-semibold block">
                  {lang === 'hi' ? 'राष्ट्रीय प्रत्यक्ष कृषि बाज़ार' : 'National Direct Agri Market'}
                </span>
              </div>
            </div>

            {/* Role Context Pitch */}
            <div className="space-y-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[11px] font-semibold text-[#b8eea5] border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#9fd48e] animate-pulse" />
                {role === 'farmer'
                  ? lang === 'hi'
                    ? 'किसान / उत्पादक पोर्टल'
                    : 'Kisan / Producer Portal'
                  : lang === 'hi'
                  ? 'उपभोक्ता / मिलर पोर्टल'
                  : 'Consumer & Bulk Miller Portal'}
              </span>

              <h2 className="text-2xl font-bold leading-snug tracking-tight text-white">
                {role === 'farmer'
                  ? lang === 'hi'
                    ? 'सीधे मिलर और उपभोक्ताओं से जुड़ें, 0% आढ़तिया कमीशन।'
                    : 'Eliminate middlemen. Sell verified harvest lots directly to millers & buyers.'
                  : lang === 'hi'
                  ? 'खेत से सीधे सत्यापित उपज खरीदें, सुरक्षित एस्क्रो गारंटी।'
                  : 'Source 100% assay-tested grain & produce straight from verified Indian farmers.'}
              </h2>

              <p className="text-xs text-white/80 leading-relaxed">
                {role === 'farmer'
                  ? lang === 'hi'
                    ? 'सरकारी एमएसपी से अधिक मूल्य, पारदर्शी डिजिटल गेट पास और 24 घंटे में जन धन खाते में सीधा भुगतान।'
                    : 'Official MSP benchmarks, digital APMC gate passes, and RBI-regulated escrow payout within 24 hours of weighbridge scan.'
                  : lang === 'hi'
                  ? 'NABL प्रमाणित लैब नमी रिपोर्ट, जीपीएस लाइव ट्रक ट्रैकिंग और बिना किसी छिपी दलाली के पारदर्शी रसीद।'
                  : 'NABL laboratory moisture assays, live GPS highway telematics, and direct tamper-proof delivery records.'}
              </p>
            </div>

            {/* Key Assurance Badges */}
            <div className="space-y-2 pt-4 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2 text-white/90">
                <span className="material-symbols-outlined text-[18px] text-[#9fd48e]">verified_user</span>
                <span className="text-[11.5px]">AgriStack & PM-KISAN Verified Direct Link</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <span className="material-symbols-outlined text-[18px] text-[#9fd48e]">account_balance</span>
                <span className="text-[11.5px]">100% Safe RBI Escrow Settlement</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <span className="material-symbols-outlined text-[18px] text-[#9fd48e]">pin_drop</span>
                <span className="text-[11.5px]">Direct Farm-Gate Weighment & Logistics</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Selector Footer */}
          <div className="relative z-10 mt-8 pt-4 border-t border-white/10">
            <span className="text-[10.5px] uppercase tracking-wider text-white/70 font-semibold block mb-2">
              {lang === 'hi' ? 'त्वरित डेमो लॉगिन (1-क्लिक):' : 'Instant 1-Click Demo Accounts:'}
            </span>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin(FARMER_PROFILE)}
                className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-xs flex items-center justify-between border border-white/10 group"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#9fd48e]">agriculture</span>
                  <span className="font-semibold text-white">Farmer (Ramesh Patel)</span>
                </div>
                <span className="text-[10px] text-white/70 group-hover:text-white flex items-center gap-1 font-mono">
                  Login &rarr;
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(CONSUMER_PROFILE)}
                className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-xs flex items-center justify-between border border-white/10 group"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#b6c9d5]">storefront</span>
                  <span className="font-semibold text-white">Miller / Bulk Buyer (Priya Sharma)</span>
                </div>
                <span className="text-[10px] text-white/70 group-hover:text-white flex items-center gap-1 font-mono">
                  Login &rarr;
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(RETAIL_CONSUMER_PROFILE)}
                className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-xs flex items-center justify-between border border-white/10 group"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#f4ba74]">shopping_bag</span>
                  <span className="font-semibold text-white">Consumer Buyer (Ananya Verma)</span>
                </div>
                <span className="text-[10px] text-white/70 group-hover:text-white flex items-center gap-1 font-mono">
                  Login &rarr;
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Form Area (7 cols on desktop) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Top Navigation Row: Back / Guest link */}
            <div className="flex items-center justify-between pb-4 border-b border-black/5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#73787b] uppercase tracking-wider">
                  {authMode === 'login'
                    ? lang === 'hi'
                      ? 'सुरक्षित लॉगिन'
                      : 'Secure Sign In'
                    : lang === 'hi'
                    ? 'नया पंजीकरण'
                    : 'New Direct Registration'}
                </span>
              </div>
              {onCancel && (
                <button
                  onClick={onCancel}
                  type="button"
                  className="text-xs font-semibold text-[#43474b] hover:text-[#1c1c18] flex items-center gap-1 transition-colors"
                >
                  <span>{lang === 'hi' ? 'अतिथि के रूप में देखें' : 'Browse Marketplace'}</span>
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Primary Role Selector Tabs: Farmer vs Consumer */}
            <div className="mt-5 space-y-2">
              <label className="text-xs font-bold text-[#1c1c18] block">
                {lang === 'hi' ? 'अपनी भूमिका चुनें:' : 'Select Your Account Type:'}
              </label>
              <div className="grid grid-cols-2 gap-3 p-1 bg-[#f1ede7] rounded-2xl border border-black/5">
                <button
                  type="button"
                  onClick={() => handleRoleChange('farmer')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2.5 ${
                    role === 'farmer'
                      ? 'bg-white text-[#235119] shadow-sm ring-1 ring-black/5 font-bold'
                      : 'text-[#43474b] hover:text-[#1c1c18]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      role === 'farmer' ? 'text-[#3a692f]' : 'text-[#73787b]'
                    }`}
                  >
                    agriculture
                  </span>
                  <div className="text-left">
                    <span className="block leading-tight">
                      {lang === 'hi' ? 'किसान / उत्पादक' : 'Farmer / Producer'}
                    </span>
                    <span className="text-[10px] text-[#73787b] font-normal block leading-none mt-0.5">
                      {lang === 'hi' ? 'फसल बिक्री व गेट पास' : 'Sell Harvest & Get Paid'}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('consumer')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2.5 ${
                    role === 'consumer'
                      ? 'bg-white text-[#34454f] shadow-sm ring-1 ring-black/5 font-bold'
                      : 'text-[#43474b] hover:text-[#1c1c18]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      role === 'consumer' ? 'text-[#34454f]' : 'text-[#73787b]'
                    }`}
                  >
                    storefront
                  </span>
                  <div className="text-left">
                    <span className="block leading-tight">
                      {lang === 'hi' ? 'उपभोक्ता / मिलर' : 'Consumer / Buyer'}
                    </span>
                    <span className="text-[10px] text-[#73787b] font-normal block leading-none mt-0.5">
                      {lang === 'hi' ? 'थोक व खुदरा खरीद' : 'Procure Direct Crops'}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Mode Switcher: Sign In vs Register */}
            <div className="flex border-b border-black/10 mt-6 text-sm font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage(null);
                }}
                className={`pb-2.5 px-3 border-b-2 transition-all ${
                  authMode === 'login'
                    ? 'border-[#3a692f] text-[#3a692f] font-bold'
                    : 'border-transparent text-[#73787b] hover:text-[#1c1c18]'
                }`}
              >
                {lang === 'hi' ? 'साइन इन करें' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMessage(null);
                }}
                className={`pb-2.5 px-3 border-b-2 transition-all ${
                  authMode === 'register'
                    ? 'border-[#3a692f] text-[#3a692f] font-bold'
                    : 'border-transparent text-[#73787b] hover:text-[#1c1c18]'
                }`}
              >
                {lang === 'hi'
                  ? `नया ${role === 'farmer' ? 'किसान' : 'उपभोक्ता'} खाता बनाएं`
                  : `Create New ${role === 'farmer' ? 'Farmer' : 'Buyer'} Account`}
              </button>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mt-4 p-3 bg-[#ffdcd8]/70 border border-[#ba1a1a]/30 rounded-xl text-xs text-[#ba1a1a] font-medium flex items-center gap-2 animate-in fade-in">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
                {/* Method Pill Selector: Phone vs Email */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#1c1c18]">
                      {lang === 'hi' ? 'लॉगिन का प्रकार:' : 'Login using:'}
                    </label>
                    <div className="flex items-center bg-[#f1ede7] rounded-lg p-0.5 text-xs font-medium">
                      <button
                        type="button"
                        onClick={() => handleMethodChange('phone')}
                        className={`px-2.5 py-1 rounded-md text-[11px] transition-all flex items-center gap-1 ${
                          inputMethod === 'phone'
                            ? 'bg-white text-[#1c1c18] font-bold shadow-xs'
                            : 'text-[#73787b] hover:text-[#1c1c18]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">smartphone</span>
                        <span>{lang === 'hi' ? 'मोबाइल नंबर' : 'Phone Number'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMethodChange('email')}
                        className={`px-2.5 py-1 rounded-md text-[11px] transition-all flex items-center gap-1 ${
                          inputMethod === 'email'
                            ? 'bg-white text-[#1c1c18] font-bold shadow-xs'
                            : 'text-[#73787b] hover:text-[#1c1c18]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">mail</span>
                        <span>{lang === 'hi' ? 'ईमेल आईडी' : 'Email Address'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Input Field based on method */}
                  {inputMethod === 'phone' ? (
                    <div className="relative flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-black/10 bg-[#f1ede7] text-xs font-bold text-[#43474b]">
                        +91 🇮🇳
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder={role === 'farmer' ? '9876543210' : '9823456789'}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, ''))}
                        className="w-full h-11 px-3 bg-[#f6f3ed] rounded-r-xl text-xs font-semibold text-[#1c1c18] border border-black/10 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3a692f]/30"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="email"
                        placeholder={
                          role === 'farmer'
                            ? 'ramesh.patel@kisan.gov.in'
                            : 'priya.sharma@suratgrain.com'
                        }
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full h-11 pl-9 pr-3 bg-[#f6f3ed] rounded-xl text-xs font-semibold text-[#1c1c18] border border-black/10 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3a692f]/30"
                      />
                      <span className="material-symbols-outlined absolute left-2.5 top-3 text-[#73787b] text-[18px]">
                        mail
                      </span>
                    </div>
                  )}
                  <span className="text-[10.5px] text-[#73787b] block mt-1">
                    {inputMethod === 'phone'
                      ? role === 'farmer'
                        ? lang === 'hi'
                          ? 'डेमो किसान फ़ोन: 9876543210'
                          : 'Demo Farmer Mobile: 9876543210'
                        : lang === 'hi'
                        ? 'डेमो उपभोक्ता फ़ोन: 9823456789'
                        : 'Demo Consumer Mobile: 9823456789'
                      : role === 'farmer'
                      ? 'Demo Email: ramesh.patel@kisan.gov.in'
                      : 'Demo Email: priya.sharma@suratgrain.com'}
                  </span>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#1c1c18]">
                      {lang === 'hi' ? 'गुप्त पासवर्ड:' : 'Account Password:'}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotIdentifier(identifier);
                        setForgotStep('request');
                        setForgotModalOpen(true);
                      }}
                      className="text-[11px] text-[#3a692f] hover:underline font-semibold"
                    >
                      {lang === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 pl-9 pr-10 bg-[#f6f3ed] rounded-xl text-xs font-semibold text-[#1c1c18] border border-black/10 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3a692f]/30"
                    />
                    <span className="material-symbols-outlined absolute left-2.5 top-3 text-[#73787b] text-[18px]">
                      lock
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[#73787b] hover:text-[#1c1c18]"
                      aria-label="Toggle password visibility"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  <span className="text-[10px] text-[#73787b] block mt-1">
                    Demo password: <code className="bg-[#f1ede7] px-1.5 py-0.5 rounded font-mono text-[#3a692f] font-bold">{role === 'farmer' ? 'kisan123' : 'miller123'}</code>
                  </span>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-[#43474b]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-[#3a692f] accent-[#3a692f] w-4 h-4"
                    />
                    <span>{lang === 'hi' ? 'इस डिवाइस पर याद रखें' : 'Remember this device for 30 days'}</span>
                  </label>

                  <span className="text-[10.5px] text-[#3a692f] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">shield</span>
                    <span>256-bit SSL</span>
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                    role === 'farmer'
                      ? 'bg-[#3a692f] hover:bg-[#1d4d15]'
                      : 'bg-[#34454f] hover:bg-[#202c33]'
                  } ${loading ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>{lang === 'hi' ? 'सत्यापित किया जा रहा है...' : 'Authenticating Credentials...'}</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">login</span>
                      <span>
                        {role === 'farmer'
                          ? lang === 'hi'
                            ? 'किसान कमान पोर्टल में प्रवेश करें'
                            : 'Sign In as Verified Farmer'
                          : lang === 'hi'
                          ? 'उपभोक्ता / मिलर पोर्टल में प्रवेश करें'
                          : 'Sign In as Consumer / Buyer'}
                      </span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* REGISTRATION FORM */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="mt-5 space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#1c1c18] block mb-1">
                      {role === 'farmer'
                        ? lang === 'hi'
                          ? 'किसान का पूरा नाम *'
                          : 'Farmer Full Name *'
                        : lang === 'hi'
                        ? 'उपभोक्ता / कंपनी का नाम *'
                        : 'Consumer / Company Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={role === 'farmer' ? 'e.g. Ramesh Patel' : 'e.g. Surat Agro Millers'}
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      className="w-full h-10 px-3 bg-[#f6f3ed] rounded-xl text-xs font-semibold text-[#1c1c18] border border-black/10 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#1c1c18] block mb-1">
                      {lang === 'hi' ? 'मोबाइल नंबर (OTP सत्यापन) *' : 'Mobile Number (for SMS OTP) *'}
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit phone number"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full h-10 px-3 bg-[#f6f3ed] rounded-xl text-xs font-semibold text-[#1c1c18] border border-black/10 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#1c1c18] block mb-1">
                      {lang === 'hi' ? 'ईमेल पता (वैकल्पिक)' : 'Email Address (Optional)'}
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full h-10 px-3 bg-[#f6f3ed] rounded-xl text-xs font-semibold text-[#1c1c18] border border-black/10 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#1c1c18] block mb-1">
                      {lang === 'hi' ? 'पासवर्ड बनाएं *' : 'Create Password *'}
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full h-10 px-3 bg-[#f6f3ed] rounded-xl text-xs font-semibold text-[#1c1c18] border border-black/10 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {role === 'farmer' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#1c1c18] block mb-1">
                        {lang === 'hi' ? 'निकटतम एपीएमसी मंडी व राज्य' : 'Nearest APMC Mandi & State'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Gondal / Rajkot Mandi, Gujarat"
                        value={regLocation}
                        onChange={(e) => setRegLocation(e.target.value)}
                        className="w-full h-10 px-3 bg-[#f6f3ed] rounded-xl text-xs font-medium text-[#1c1c18] border border-black/10 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#1c1c18] block mb-1">
                        {lang === 'hi' ? 'भूमि क्षेत्र (एकड़ में)' : 'Landholding (Acres)'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 10.5 Acres"
                        value={regLandParcel}
                        onChange={(e) => setRegLandParcel(e.target.value)}
                        className="w-full h-10 px-3 bg-[#f6f3ed] rounded-xl text-xs font-medium text-[#1c1c18] border border-black/10 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#1c1c18] block mb-1">
                        {lang === 'hi' ? 'खरीदार का प्रकार' : 'Buyer Classification'}
                      </label>
                      <select
                        value={regBuyerType}
                        onChange={(e) => setRegBuyerType(e.target.value as any)}
                        className="w-full h-10 px-3 bg-[#f6f3ed] rounded-xl text-xs font-medium text-[#1c1c18] border border-black/10 focus:bg-white focus:outline-none"
                      >
                        <option value="Retail Consumer">Retail / Household Consumer</option>
                        <option value="Bulk Miller">Flour / Dal / Oil Miller</option>
                        <option value="Agri Processor">Food Processor / Exporter</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#1c1c18] block mb-1">
                        {lang === 'hi' ? 'डिलीवरी शहर व पिनकोड' : 'Delivery City & Pincode'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ahmedabad - 380015"
                        value={regLocation}
                        onChange={(e) => setRegLocation(e.target.value)}
                        className="w-full h-10 px-3 bg-[#f6f3ed] rounded-xl text-xs font-medium text-[#1c1c18] border border-black/10 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="p-3 bg-[#fcf9f3] rounded-xl border border-black/5 text-[11px] text-[#43474b]">
                  {role === 'farmer' ? (
                    <span>
                      ✓ {lang === 'hi'
                        ? 'पंजीकरण के बाद आपका डिजिटल गेट पास और आधार आधारित ई-केवाईसी तुरंत सक्रिय हो जाएगा।'
                        : 'Upon registration, your digital mandi gate pass and biometric AgriStack profile will be generated.'}
                    </span>
                  ) : (
                    <span>
                      ✓ {lang === 'hi'
                        ? '100% सुरक्षित आरबीआई संरक्षित एस्क्रो खाता आपके नाम पर आवंटित किया जाएगा।'
                        : 'An RBI-compliant dedicated escrow wallet will be provisioned for direct producer buyouts.'}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                    role === 'farmer'
                      ? 'bg-[#3a692f] hover:bg-[#1d4d15]'
                      : 'bg-[#34454f] hover:bg-[#202c33]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                  <span>
                    {role === 'farmer'
                      ? lang === 'hi'
                        ? 'किसान खाता पंजीकृत करें'
                        : 'Complete Farmer Registration'
                      : lang === 'hi'
                      ? 'उपभोक्ता खाता पंजीकृत करें'
                      : 'Complete Consumer Registration'}
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Bottom Trust & Compliance Footnote */}
          <div className="mt-8 pt-4 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#73787b] gap-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#3a692f]">verified</span>
              <span>Ministry of Agriculture & Farmers Welfare Integrated</span>
            </div>
            <span>Help: 1800-180-1551 (Toll-Free)</span>
          </div>
        </div>
      </div>

      {/* Forgot Password / OTP Recovery Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-black/10 space-y-4">
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3a692f] text-[22px]">lock_reset</span>
                <h3 className="font-bold text-sm text-[#1c1c18]">
                  {lang === 'hi' ? 'पासवर्ड रीसेट व ओटीपी' : 'Reset Password & OTP'}
                </h3>
              </div>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="text-[#73787b] hover:text-[#1c1c18]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {forgotStep === 'request' && (
              <div className="space-y-3">
                <p className="text-xs text-[#73787b]">
                  {lang === 'hi'
                    ? 'अपना पंजीकृत मोबाइल नंबर या ईमेल दर्ज करें। हम आपको 4-अंकीय सत्यापन कोड भेजेंगे।'
                    : 'Enter your registered phone or email address. We will send you an instant 4-digit verification code.'}
                </p>
                <div>
                  <label className="text-xs font-semibold text-[#1c1c18] block mb-1">
                    {lang === 'hi' ? 'पंजीकृत फ़ोन / ईमेल' : 'Registered Phone / Email'}
                  </label>
                  <input
                    type="text"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="9876543210 or email@domain.com"
                    className="w-full h-10 px-3 bg-[#f6f3ed] rounded-xl text-xs font-semibold text-[#1c1c18] border border-black/10"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setForgotStep('verify')}
                  className="w-full py-2.5 rounded-xl bg-[#3a692f] hover:bg-[#1d4d15] text-white text-xs font-bold transition-all"
                >
                  {lang === 'hi' ? 'ओटीपी कोड भेजें' : 'Send Verification Code (OTP)'}
                </button>
              </div>
            )}

            {forgotStep === 'verify' && (
              <div className="space-y-3">
                <div className="p-3 bg-[#b8eea5]/30 rounded-xl text-xs text-[#235119] font-medium">
                  ✓ Demo OTP sent to <strong>{forgotIdentifier || 'your number'}</strong>: Use code{' '}
                  <strong className="font-mono text-sm">4821</strong>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1c1c18] block mb-1">
                    Enter 4-Digit OTP
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="4821"
                    className="w-full h-10 text-center tracking-widest text-base font-bold bg-[#f6f3ed] rounded-xl border border-black/10"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1c1c18] block mb-1">
                    Set New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full h-10 px-3 bg-[#f6f3ed] rounded-xl text-xs border border-black/10"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setForgotStep('success')}
                  className="w-full py-2.5 rounded-xl bg-[#3a692f] hover:bg-[#1d4d15] text-white text-xs font-bold transition-all"
                >
                  Confirm & Update Password
                </button>
              </div>
            )}

            {forgotStep === 'success' && (
              <div className="space-y-3 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-[#b8eea5]/40 text-[#235119] flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[28px]">check_circle</span>
                </div>
                <h4 className="font-bold text-sm text-[#1c1c18]">Password Updated Successfully!</h4>
                <p className="text-xs text-[#73787b]">
                  You can now log in with your updated credentials.
                </p>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#3a692f] text-white text-xs font-bold"
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
