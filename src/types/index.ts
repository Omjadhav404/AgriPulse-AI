// LOGISTICS OS — Complete TypeScript Domain Models

export type AppRole = 'marketing' | 'business' | 'driver' | 'fleet' | 'control-tower';

export type VehicleCategory = 
  | 'bike' 
  | 'three_wheeler' 
  | 'mini_truck' 
  | 'lcv' 
  | 'truck_19ft' 
  | 'truck_32ft' 
  | 'container_truck' 
  | 'trailer' 
  | 'refrigerated' 
  | 'specialized';

export type ShipmentStatus = 
  | 'draft'
  | 'unassigned'
  | 'matching'
  | 'dispatched'
  | 'heading_to_pickup'
  | 'arrived_at_pickup'
  | 'loading'
  | 'in_transit'
  | 'arrived_at_destination'
  | 'delivered'
  | 'at_risk'
  | 'cancelled';

export type DocumentType = 
  | 'e_way_bill' 
  | 'lorry_receipt' 
  | 'proof_of_delivery' 
  | 'commercial_invoice' 
  | 'driving_license' 
  | 'vehicle_rc' 
  | 'insurance' 
  | 'fitness_cert' 
  | 'puc';

export type DocumentStatus = 'valid' | 'expiring_soon' | 'expired' | 'under_review';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  city: string;
  state: string;
  hubName?: string;
  address?: string;
}

export interface NetworkNode {
  id: string;
  name: string;
  city: string;
  state: string;
  type: 'hub' | 'warehouse' | 'port' | 'rail_terminal' | 'airport' | 'toll_plaza';
  coords: { lat: number; lng: number; x?: number; y?: number; z?: number };
  capacityTons: number;
  currentUtilizationPercent: number;
  activeShipments: number;
}

export interface DriverPerformance {
  score: number; // e.g. 94/100
  onTimeRate: number; // 96.4%
  completionRate: number; // 98.2%
  cancellationRate: number; // 1.1%
  acceptanceRate: number; // 82%
  feedbackRating: number; // 4.8
  totalJobs: number; // 842
  totalKm: number; // 84,240
  level: 'ACTIVE' | 'PRO' | 'ELITE';
  lastUpdated: string;
  factors: {
    onTimeWeight: number; // 40%
    completionWeight: number; // 25%
    cancellationWeight: number; // 15%
    complianceWeight: number; // 10%
    feedbackWeight: number; // 10%
  };
}

export interface ComplianceDocument {
  id: string;
  type: DocumentType;
  title: string;
  documentNumber: string;
  issuedDate: string;
  expiryDate: string;
  status: DocumentStatus;
  daysRemaining?: number;
  downloadUrl?: string;
  verifiedBy?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  photoUrl?: string;
  city: string;
  memberSince: number;
  status: 'online' | 'offline' | 'on_job' | 'busy';
  assignedVehicleId?: string;
  experienceYears: number;
  performance: DriverPerformance;
  documents: ComplianceDocument[];
  currentLocation: LocationCoordinates;
  preferredCorridors: string[];
  maxDistanceKm: number;
  nightDriving: boolean;
  returnLoadPreference: boolean;
}

export interface Vehicle {
  id: string;
  registrationNumber: string; // e.g. MH-15-AX-2841
  model: string;
  category: VehicleCategory;
  capacityKg: number;
  capacityVolumeCbm: number;
  status: 'active' | 'available' | 'maintenance' | 'idle';
  fuelLevelPercent: number;
  fastagBalance: number;
  currentLocation: LocationCoordinates;
  assignedDriverId?: string;
  assignedDriverName?: string;
  currentShipmentId?: string;
  nextMaintenanceKm: number;
  odometerKm: number;
  lastUpdated: string;
}

export interface Fleet {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  email: string;
  city: string;
  totalVehicles: number;
  totalDrivers: number;
  activeVehicles: number;
  availableVehicles: number;
  maintenanceVehicles: number;
  utilizationPercent: number;
  totalRevenueThisMonth: number;
  costPerKm: number;
}

export interface ShipmentCargo {
  type: string; // e.g. 'Automotive Parts', 'Industrial Machinery', 'FMCG Goods'
  category: 'FTL' | 'PTL' | 'Last Mile' | 'Express' | 'Cold Chain' | 'Special Handling';
  weightKg: number;
  volumeCbm: number;
  packageCount: number;
  temperatureRequired?: number; // for cold chain
  hazardous: boolean;
  specialInstructions?: string;
}

export interface Shipment {
  id: string; // e.g. 'LOS-48291'
  businessId: string;
  businessName: string;
  pickup: LocationCoordinates;
  drop: LocationCoordinates;
  cargo: ShipmentCargo;
  vehicleTypeRequired: VehicleCategory;
  pickupWindow: { start: string; end: string };
  deliveryDeadline: string;
  estimatedHours: number;
  status: ShipmentStatus;
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedVehicleId?: string;
  assignedVehicleReg?: string;
  estimatedCost: number;
  tollEstimate: number;
  actualCost?: number;
  progressPercent: number; // 0 to 100
  currentKm: number;
  totalKm: number;
  eWayBillNumber?: string;
  ewayBillStatus?: 'active' | 'generated' | 'expired';
  lorryReceiptNumber?: string;
  proofOfDelivery?: {
    signatureUrl?: string;
    photoUrl?: string;
    otpCode?: string;
    receivedBy?: string;
    timestamp?: string;
    gpsVerified?: boolean;
  };
  liveSpeedKmh?: number;
  temperatureCurrent?: number;
  alerts: string[];
  createdAt: string;
}

export interface JobOffer {
  id: string;
  shipmentId: string;
  originCity: string;
  destinationCity: string;
  pickupHub: string;
  dropHub: string;
  distanceKm: number;
  cargoDescription: string;
  weightKg: number;
  vehicleRequired: VehicleCategory;
  payoutAmount: number;
  pickupTime: string;
  deliveryTime: string;
  urgency: 'high' | 'normal' | 'express';
  whyThisJobReasons: string[];
}

export interface NetworkAlert {
  id: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'traffic' | 'telemetry' | 'warehouse' | 'compliance' | 'demand';
  title: string;
  description: string;
  shipmentId?: string;
  vehicleId?: string;
  hubId?: string;
  resolved: boolean;
}

export interface DriverEarningsSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;
  availableBalance: number;
  deliveriesToday: number;
  kmToday: number;
  onTimeToday: number;
  breakdown: {
    grossFreight: number;
    fuelAllowance: number;
    nightBonus: number;
    tollReimbursement: number;
    platformFee: number;
    netPayout: number;
  };
  dailyHistory: { date: string; earnings: number; trips: number; km: number }[];
}

export interface AIRecommendation {
  jobId: string;
  shipmentId: string;
  recommendedVehicleId: string;
  recommendedDriverName: string;
  vehicleReg: string;
  reliabilityScore: number;
  etaPickupMins: number;
  estimatedCost: number;
  reasons: string[];
}
