export type ScreenId =
  | 'farmer-dashboard'
  | 'marketplace'
  | 'add-produce'
  | 'track-orders'
  | 'market-insights-admin'
  | 'login';

export type Language = 'en' | 'hi';

export type UserRole = 'farmer' | 'consumer';

export interface UserProfile {
  id: string;
  name: string;
  fullName: string;
  role: UserRole;
  email: string;
  phone: string;
  avatar: string;
  status: string;
  location: string;
  // Farmer specifics
  farmerId?: string;
  mandiCluster?: string;
  village?: string;
  landParcel?: string;
  kcc?: string;
  aadhaarLinked?: boolean;
  trades?: string;
  // Consumer / Buyer specifics
  buyerId?: string;
  companyName?: string;
  buyerType?: 'Bulk Miller' | 'Retail Consumer' | 'Agri Processor' | 'FPO Partner';
  gstNumber?: string;
  fssaiNumber?: string;
  deliveryPincode?: string;
  escrowBalance?: number;
}

export interface ProduceItem {
  id: string;
  lotNumber: string;
  category: string;
  name: string;
  variety: string;
  moisture: string;
  purity: string;
  stockVolume: number;
  unit: string;
  currentBid: number;
  targetPrice: number;
  govtMsp: number;
  mspMargin: number;
  verifiedMillers: number;
  status: 'Live Bidding' | 'In Negotiation' | 'GI Tagged • Live' | 'Active';
  image: string;
  imageAlt: string;
}

export interface MarketplaceLot {
  id: string;
  lotNumber: string;
  category: 'Cereals & Millets' | 'Pulses / Dal' | 'Oilseeds' | 'Cash Crops & Spices' | 'Horticulture & Fruits';
  title: string;
  harvestTag: string;
  farmerName: string;
  location: string;
  stateCode: string;
  availableQuintals: number;
  offeredRate: number;
  govtMsp: number;
  marginSavedText: string;
  badge: string;
  subBadge: string;
  image: string;
  imageAlt: string;
  certifications: string[];
  dispatchType: string;
  moistureText?: string;
  foreignMatter?: string;
  grainLength?: string;
  brixIndex?: string;
  purityText?: string;
  curcuminText?: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  createdDate: string;
  mandateRef: string;
  buyer: string;
  crop: string;
  quantityQuintals: number;
  contractValue: number;
  statusText: string;
  statusBadge: string;
  stage: number; // 1 to 5
  highwayNotice: string;
  truckNumber: string;
  driverName: string;
  driverPhone: string;
  currentLocation: string;
  speed: string;
  eta: string;
  cropImage: string;
  cropImageAlt: string;
  moistureIndex: string;
  physicalPurity: string;
  nablRef: string;
  farmerName: string;
  farmerVillage: string;
  farmerLand: string;
  farmerKcc: string;
  farmerAadhaar: string;
  farmerTrades: string;
  farmerPhoto: string;
  farmerPhotoAlt: string;
  videoRecordTime: string;
  geoCoords: string;
  breakdown: {
    directFarmerPayout: number;
    platformFee: number;
    inspectionFee: number;
    mandiCess: number;
    logisticsFee: number;
    totalEscrow: number;
  };
  middlemanSavings: number;
}
