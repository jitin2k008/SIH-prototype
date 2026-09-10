import React, { useState } from 'react';
import { ScreenId, Language, ProduceItem, MarketplaceLot, OrderItem, UserProfile, UserRole } from './types';
import {
  INITIAL_PRODUCE_INVENTORY,
  INITIAL_MARKETPLACE_LOTS,
  ORDERS_DATA,
  FARMER_PROFILE,
  CONSUMER_PROFILE,
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardScreen } from './components/DashboardScreen';
import { MarketplaceScreen } from './components/MarketplaceScreen';
import { AddProduceScreen } from './components/AddProduceScreen';
import { TrackOrdersScreen } from './components/TrackOrdersScreen';
import { MarketInsightsScreen } from './components/MarketInsightsScreen';
import { LoginScreen } from './components/LoginScreen';

// Modals
import { VoiceHelpModal } from './components/modals/VoiceHelpModal';
import { MakeOfferModal } from './components/modals/MakeOfferModal';
import { GatePassModal } from './components/modals/GatePassModal';
import { DeliveryChallanModal } from './components/modals/DeliveryChallanModal';
import { GpsRouteModal } from './components/modals/GpsRouteModal';
import { VideoPlayerModal } from './components/modals/VideoPlayerModal';
import { InvoiceModal } from './components/modals/InvoiceModal';
import { DisputeModal } from './components/modals/DisputeModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('farmer-dashboard');
  const [lang, setLang] = useState<Language>('en');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(FARMER_PROFILE);
  const [loginPreferredRole, setLoginPreferredRole] = useState<UserRole>('farmer');

  // App Data
  const [produceList, setProduceList] = useState<ProduceItem[]>(INITIAL_PRODUCE_INVENTORY);
  const [marketplaceLots, setMarketplaceLots] = useState<MarketplaceLot[]>(INITIAL_MARKETPLACE_LOTS);
  const [orders] = useState<OrderItem[]>(ORDERS_DATA);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string>('order-1');

  // Modals state
  const [isVoiceHelpOpen, setIsVoiceHelpOpen] = useState(false);
  const [selectedOfferLot, setSelectedOfferLot] = useState<MarketplaceLot | null>(null);
  const [selectedGatePassProduce, setSelectedGatePassProduce] = useState<ProduceItem | null>(null);
  const [selectedChallanOrder, setSelectedChallanOrder] = useState<OrderItem | null>(null);
  const [gpsRouteInfo, setGpsRouteInfo] = useState<{
    truckNo: string;
    driver: string;
    speed: string;
    location: string;
  } | null>(null);
  const [videoPlayerInfo, setVideoPlayerInfo] = useState<{
    title: string;
    time: string;
    coords: string;
  } | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<OrderItem | null>(null);
  const [disputeOrderNumber, setDisputeOrderNumber] = useState<string | null>(null);

  // Global notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Auth Handlers
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    const targetScreen: ScreenId = user.role === 'farmer' ? 'farmer-dashboard' : 'marketplace';
    setCurrentScreen(targetScreen);
    triggerToast(
      lang === 'hi'
        ? `सफलतापूर्वक लॉगिन: ${user.fullName} (${user.role === 'farmer' ? 'किसान' : 'उपभोक्ता'})`
        : `Signed in successfully: ${user.fullName} (${user.role === 'farmer' ? 'Farmer' : 'Consumer / Buyer'})`
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
    triggerToast(lang === 'hi' ? 'आप लॉग आउट हो चुके हैं।' : 'You have been signed out.');
  };

  const handleSwitchRole = () => {
    if (currentUser?.role === 'farmer') {
      setCurrentUser(CONSUMER_PROFILE);
      setCurrentScreen('marketplace');
      triggerToast(
        lang === 'hi'
          ? 'क्रेता / मिलर खाते पर स्विच किया गया: प्रिया शर्मा'
          : 'Switched to Consumer / Buyer profile: Priya Sharma'
      );
    } else {
      setCurrentUser(FARMER_PROFILE);
      setCurrentScreen('farmer-dashboard');
      triggerToast(
        lang === 'hi'
          ? 'किसान खाते पर स्विच किया गया: रमेश पटेल'
          : 'Switched to Farmer profile: Ramesh Patel'
      );
    }
  };

  const handleOpenLogin = (role?: UserRole) => {
    if (role) {
      setLoginPreferredRole(role);
    }
    setCurrentScreen('login');
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProduceAdded = (newProduce: ProduceItem) => {
    setProduceList([newProduce, ...produceList]);
    // Also add to marketplace
    const newLot: MarketplaceLot = {
      id: `lot-${Date.now()}`,
      lotNumber: newProduce.lotNumber,
      category: newProduce.category as any,
      title: newProduce.variety,
      harvestTag: 'Fresh Batch',
      farmerName: currentUser ? currentUser.fullName : 'Ramesh Patel',
      location: currentUser?.location || 'Rajkot, Gujarat',
      stateCode: 'gj',
      availableQuintals: newProduce.stockVolume,
      offeredRate: newProduce.targetPrice,
      govtMsp: newProduce.govtMsp,
      marginSavedText: 'Direct Farmer Mandate',
      badge: `AGMARK ${newProduce.name.includes('Grade-A') ? 'Grade A' : 'Certified'}`,
      subBadge: `Moisture: ${newProduce.moisture}`,
      image: newProduce.image,
      imageAlt: newProduce.imageAlt,
      certifications: ['Soil Health Card Tested'],
      dispatchType: 'FPO Hub Ready',
    };
    setMarketplaceLots([newLot, ...marketplaceLots]);
    setCurrentScreen('farmer-dashboard');
    triggerToast(
      `Crop Batch ${newProduce.lotNumber} listed successfully! Digital Gate Pass generated.`
    );
  };

  return (
    <div className="min-h-screen bg-[#fcf9f3] text-[#1c1c18] flex">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1c1c18] text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2.5 border border-white/10 animate-in slide-in-from-top-3 max-w-md">
          <span className="material-symbols-outlined text-[#9fd48e] text-[20px]">
            check_circle
          </span>
          <span className="flex-1">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white p-0.5"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Persistent Left Sidebar */}
      <Sidebar
        currentScreen={currentScreen}
        onSelectScreen={(screen) => {
          setCurrentScreen(screen);
          setMobileNavOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isOpenMobile={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
        lang={lang}
        currentUser={currentUser}
        onOpenLogin={() => handleOpenLogin()}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Fixed Header */}
        <Header
          onOpenMobileNav={() => setMobileNavOpen(true)}
          lang={lang}
          onToggleLanguage={(l) => setLang(l)}
          onOpenVoiceModal={() => setIsVoiceHelpOpen(true)}
          currentUser={currentUser}
          onOpenLogin={(role) => handleOpenLogin(role)}
          onLogout={handleLogout}
          onSwitchRole={handleSwitchRole}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 pt-20 px-4 sm:px-8 max-w-7xl w-full mx-auto">
          {currentScreen === 'login' && (
            <LoginScreen
              lang={lang}
              initialRole={loginPreferredRole}
              onLoginSuccess={handleLoginSuccess}
              onCancel={() => {
                if (currentUser) {
                  setCurrentScreen(currentUser.role === 'farmer' ? 'farmer-dashboard' : 'marketplace');
                } else {
                  setCurrentScreen('marketplace');
                }
              }}
            />
          )}

          {currentScreen === 'farmer-dashboard' && (
            <DashboardScreen
              produceList={produceList}
              orders={orders}
              lang={lang}
              currentUser={currentUser}
              onOpenLogin={() => handleOpenLogin()}
              onNavigateAddProduce={() => setCurrentScreen('add-produce')}
              onNavigateMarketplace={() => setCurrentScreen('marketplace')}
              onNavigateTrackOrders={(orderId) => {
                if (orderId) setActiveTrackingOrderId(orderId);
                setCurrentScreen('track-orders');
              }}
              onOpenVoiceHelp={() => setIsVoiceHelpOpen(true)}
              onOpenGatePass={(item) => setSelectedGatePassProduce(item)}
              onOpenDeliveryChallan={(order) => setSelectedChallanOrder(order)}
            />
          )}

          {currentScreen === 'marketplace' && (
            <MarketplaceScreen
              lots={marketplaceLots}
              lang={lang}
              currentUser={currentUser}
              onOpenLogin={(role) => handleOpenLogin(role)}
              onSelectLotToOffer={(lot) => setSelectedOfferLot(lot)}
              onOpenVoiceHelp={() => setIsVoiceHelpOpen(true)}
            />
          )}

          {currentScreen === 'add-produce' && (
            <AddProduceScreen
              lang={lang}
              onProduceAdded={handleProduceAdded}
              onCancel={() => setCurrentScreen('farmer-dashboard')}
            />
          )}

          {currentScreen === 'track-orders' && (
            <TrackOrdersScreen
              orders={orders}
              selectedOrderId={activeTrackingOrderId}
              lang={lang}
              onOpenGpsRoute={(truckNo, driver, speed, location) =>
                setGpsRouteInfo({ truckNo, driver, speed, location })
              }
              onOpenVideoPlayer={(title, time, coords) =>
                setVideoPlayerInfo({ title, time, coords })
              }
              onOpenInvoice={(order) => setInvoiceOrder(order)}
              onOpenDispute={(orderNumber) => setDisputeOrderNumber(orderNumber)}
            />
          )}

          {currentScreen === 'market-insights-admin' && (
            <MarketInsightsScreen
              lang={lang}
              onNavigateMarketplace={() => setCurrentScreen('marketplace')}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <VoiceHelpModal
        isOpen={isVoiceHelpOpen}
        onClose={() => setIsVoiceHelpOpen(false)}
        lang={lang}
      />

      <MakeOfferModal
        lot={selectedOfferLot}
        isOpen={!!selectedOfferLot}
        onClose={() => setSelectedOfferLot(null)}
        onSuccess={(msg) => triggerToast(msg)}
      />

      <GatePassModal
        isOpen={!!selectedGatePassProduce}
        onClose={() => setSelectedGatePassProduce(null)}
        lotId={selectedGatePassProduce?.lotNumber}
        cropName={selectedGatePassProduce?.name}
        quantity={selectedGatePassProduce?.stockVolume}
      />

      <DeliveryChallanModal
        isOpen={!!selectedChallanOrder}
        onClose={() => setSelectedChallanOrder(null)}
        orderId={selectedChallanOrder?.orderNumber}
        pin="8942"
      />

      <GpsRouteModal
        isOpen={!!gpsRouteInfo}
        onClose={() => setGpsRouteInfo(null)}
        truckNo={gpsRouteInfo?.truckNo}
        driverName={gpsRouteInfo?.driver}
        speed={gpsRouteInfo?.speed}
        location={gpsRouteInfo?.location}
      />

      <VideoPlayerModal
        isOpen={!!videoPlayerInfo}
        onClose={() => setVideoPlayerInfo(null)}
        title={videoPlayerInfo?.title}
        timestamp={videoPlayerInfo?.time}
        geoCoords={videoPlayerInfo?.coords}
      />

      {invoiceOrder && (
        <InvoiceModal
          isOpen={!!invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
          order={invoiceOrder}
        />
      )}

      {disputeOrderNumber && (
        <DisputeModal
          isOpen={!!disputeOrderNumber}
          onClose={() => setDisputeOrderNumber(null)}
          orderNumber={disputeOrderNumber}
          onSubmitted={(ticket) =>
            triggerToast(
              `Dispute logged under reference ${ticket}. Mandi Arbitrator will review within 24h.`
            )
          }
        />
      )}
    </div>
  );
}
