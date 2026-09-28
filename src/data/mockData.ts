import {
  NetworkNode,
  Driver,
  Vehicle,
  Fleet,
  Shipment,
  JobOffer,
  NetworkAlert,
  DriverEarningsSummary,
  AIRecommendation
} from '../types';

export const INITIAL_NETWORK_NODES: NetworkNode[] = [
  {
    id: 'node-mum',
    name: 'Mumbai Western Gateway Hub (Bhiwandi)',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'hub',
    coords: { lat: 19.2968, lng: 73.0631, x: -1.2, y: -0.2, z: 1.1 },
    capacityTons: 12500,
    currentUtilizationPercent: 88,
    activeShipments: 412
  },
  {
    id: 'node-jnpt',
    name: 'JNPT Maritime Port Terminal',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    type: 'port',
    coords: { lat: 18.9499, lng: 72.9511, x: -1.25, y: -0.3, z: 1.15 },
    capacityTons: 35000,
    currentUtilizationPercent: 92,
    activeShipments: 284
  },
  {
    id: 'node-del',
    name: 'Delhi Northern Freight Corridor (Manesar)',
    city: 'Delhi NCR',
    state: 'Haryana',
    type: 'hub',
    coords: { lat: 28.3588, lng: 76.9405, x: -0.3, y: 1.4, z: 0.1 },
    capacityTons: 18000,
    currentUtilizationPercent: 79,
    activeShipments: 520
  },
  {
    id: 'node-blr',
    name: 'Bengaluru Tech & Industrial Logistics Park (Peenya)',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'warehouse',
    coords: { lat: 13.0285, lng: 77.5197, x: -0.2, y: -1.4, z: 1.4 },
    capacityTons: 9400,
    currentUtilizationPercent: 74,
    activeShipments: 340
  },
  {
    id: 'node-pun',
    name: 'Pune Auto Cluster Hub (Chakan MIDC)',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'hub',
    coords: { lat: 18.7606, lng: 73.8636, x: -1.0, y: -0.4, z: 1.2 },
    capacityTons: 8200,
    currentUtilizationPercent: 81,
    activeShipments: 215
  },
  {
    id: 'node-hyd',
    name: 'Hyderabad Central Aerospace & Pharma Hub',
    city: 'Hyderabad',
    state: 'Telangana',
    type: 'hub',
    coords: { lat: 17.3850, lng: 78.4867, x: 0.1, y: -0.6, z: 1.0 },
    capacityTons: 11000,
    currentUtilizationPercent: 68,
    activeShipments: 278
  },
  {
    id: 'node-chn',
    name: 'Chennai Port & Automotive Corridor (Sriperumbudur)',
    city: 'Chennai',
    state: 'Tamil Nadu',
    type: 'port',
    coords: { lat: 12.9699, lng: 79.9404, x: 0.4, y: -1.5, z: 1.5 },
    capacityTons: 16500,
    currentUtilizationPercent: 85,
    activeShipments: 310
  },
  {
    id: 'node-ahd',
    name: 'Ahmedabad Sanand Engineering Logistics Node',
    city: 'Ahmedabad',
    state: 'Gujarat',
    type: 'hub',
    coords: { lat: 23.0225, lng: 72.5714, x: -1.3, y: 0.5, z: 0.7 },
    capacityTons: 10500,
    currentUtilizationPercent: 72,
    activeShipments: 198
  },
  {
    id: 'node-jai',
    name: 'Jaipur Multimodal Freight Terminal (Sitapura)',
    city: 'Jaipur',
    state: 'Rajasthan',
    type: 'rail_terminal',
    coords: { lat: 26.9124, lng: 75.7873, x: -0.6, y: 1.1, z: 0.4 },
    capacityTons: 7800,
    currentUtilizationPercent: 64,
    activeShipments: 142
  },
  {
    id: 'node-kol',
    name: 'Kolkata Eastern Logistics Terminal (Dankuni)',
    city: 'Kolkata',
    state: 'West Bengal',
    type: 'hub',
    coords: { lat: 22.5726, lng: 88.3639, x: 1.8, y: 0.4, z: 0.6 },
    capacityTons: 14000,
    currentUtilizationPercent: 83,
    activeShipments: 230
  }
];

export const INITIAL_DRIVER: Driver = {
  id: 'drv-01',
  name: 'Raj Patil',
  phone: '+91 98230 48192',
  city: 'Nashik / Mumbai Corridor',
  memberSince: 2024,
  status: 'online',
  assignedVehicleId: 'veh-01',
  experienceYears: 8,
  performance: {
    score: 94,
    onTimeRate: 96.4,
    completionRate: 98.2,
    cancellationRate: 1.1,
    acceptanceRate: 82,
    feedbackRating: 4.8,
    totalJobs: 842,
    totalKm: 84240,
    level: 'PRO',
    lastUpdated: '12 minutes ago',
    factors: {
      onTimeWeight: 40,
      completionWeight: 25,
      cancellationWeight: 15,
      complianceWeight: 10,
      feedbackWeight: 10
    }
  },
  documents: [
    {
      id: 'doc-dl',
      type: 'driving_license',
      title: 'Commercial Heavy Transport Driving License',
      documentNumber: 'MH-15-2016-0048192',
      issuedDate: '2016-04-12',
      expiryDate: '2031-04-11',
      status: 'valid'
    },
    {
      id: 'doc-rc',
      type: 'vehicle_rc',
      title: 'Vehicle Registration Certificate (RC)',
      documentNumber: 'MH-15-AX-2841-RC',
      issuedDate: '2021-08-10',
      expiryDate: '2036-08-09',
      status: 'valid'
    },
    {
      id: 'doc-ins',
      type: 'insurance',
      title: 'Commercial Comprehensive Goods Carrier Policy',
      documentNumber: 'BAJAJ-ALL-8849201',
      issuedDate: '2025-10-01',
      expiryDate: '2026-09-30',
      status: 'valid'
    },
    {
      id: 'doc-fit',
      type: 'fitness_cert',
      title: 'State RTO Vehicle Fitness Certificate',
      documentNumber: 'RTO-NSK-FIT-9921',
      issuedDate: '2024-10-15',
      expiryDate: '2026-10-07',
      daysRemaining: 9,
      status: 'expiring_soon'
    },
    {
      id: 'doc-puc',
      type: 'puc',
      title: 'Pollution Under Control (PUC)',
      documentNumber: 'PUC-MH-2026-10928',
      issuedDate: '2026-04-01',
      expiryDate: '2026-10-01',
      status: 'valid'
    }
  ],
  currentLocation: {
    lat: 19.9975,
    lng: 73.7898,
    city: 'Nashik',
    state: 'Maharashtra',
    address: 'Near Dwarka Circle, NH-848, Nashik'
  },
  preferredCorridors: ['Mumbai — Pune', 'Nashik — Mumbai', 'Mumbai — Delhi Expressway'],
  maxDistanceKm: 1800,
  nightDriving: true,
  returnLoadPreference: true
};

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-01',
    registrationNumber: 'MH-15-AX-2841',
    model: 'Tata Signa 3523.T (32 FT Multi-Axle)',
    category: 'truck_32ft',
    capacityKg: 18500,
    capacityVolumeCbm: 64,
    status: 'active',
    fuelLevelPercent: 78,
    fastagBalance: 4650,
    currentLocation: {
      lat: 19.9975,
      lng: 73.7898,
      city: 'Nashik',
      state: 'Maharashtra',
      address: 'Dwarka Bypass, Nashik'
    },
    assignedDriverId: 'drv-01',
    assignedDriverName: 'Raj Patil',
    currentShipmentId: 'LOS-48291',
    nextMaintenanceKm: 1200,
    odometerKm: 142850,
    lastUpdated: 'Just now'
  },
  {
    id: 'veh-02',
    registrationNumber: 'MH-04-KF-8190',
    model: 'Ashok Leyland Ecomet 1215 (LCV 17 FT)',
    category: 'lcv',
    capacityKg: 7500,
    capacityVolumeCbm: 28,
    status: 'active',
    fuelLevelPercent: 62,
    fastagBalance: 2400,
    currentLocation: {
      lat: 19.0760,
      lng: 72.8777,
      city: 'Mumbai',
      state: 'Maharashtra',
      address: 'Vashi APMC Market Gate 3'
    },
    assignedDriverId: 'drv-02',
    assignedDriverName: 'Suresh More',
    currentShipmentId: 'LOS-48302',
    nextMaintenanceKm: 3400,
    odometerKm: 98120,
    lastUpdated: '2 min ago'
  },
  {
    id: 'veh-03',
    registrationNumber: 'DL-01-AB-9923',
    model: 'BharatBenz 2823R (Heavy Duty)',
    category: 'truck_32ft',
    capacityKg: 20000,
    capacityVolumeCbm: 70,
    status: 'available',
    fuelLevelPercent: 91,
    fastagBalance: 8200,
    currentLocation: {
      lat: 28.4595,
      lng: 77.0266,
      city: 'Gurugram',
      state: 'Haryana',
      address: 'IMT Manesar Logistics Park'
    },
    assignedDriverId: 'drv-03',
    assignedDriverName: 'Harpreet Singh',
    nextMaintenanceKm: 5600,
    odometerKm: 176400,
    lastUpdated: '5 min ago'
  },
  {
    id: 'veh-04',
    registrationNumber: 'KA-04-MK-3312',
    model: 'Mahindra Bolero Maxi Truck Plus',
    category: 'mini_truck',
    capacityKg: 1500,
    capacityVolumeCbm: 8,
    status: 'available',
    fuelLevelPercent: 84,
    fastagBalance: 1200,
    currentLocation: {
      lat: 13.0285,
      lng: 77.5197,
      city: 'Bengaluru',
      state: 'Karnataka',
      address: 'Peenya Industrial Area Phase 2'
    },
    assignedDriverId: 'drv-04',
    assignedDriverName: 'Manjunath K.',
    nextMaintenanceKm: 800,
    odometerKm: 64200,
    lastUpdated: '10 min ago'
  },
  {
    id: 'veh-05',
    registrationNumber: 'GJ-06-ZZ-4811',
    model: 'Tata Ultra T.16 Reefer (-20°C to +15°C)',
    category: 'refrigerated',
    capacityKg: 9500,
    capacityVolumeCbm: 34,
    status: 'active',
    fuelLevelPercent: 54,
    fastagBalance: 5100,
    currentLocation: {
      lat: 22.3072,
      lng: 73.1812,
      city: 'Vadodara',
      state: 'Gujarat',
      address: 'NH-48 Expressway Toll Plaza'
    },
    assignedDriverId: 'drv-05',
    assignedDriverName: 'Bhavin Patel',
    currentShipmentId: 'LOS-50114',
    nextMaintenanceKm: 2100,
    odometerKm: 112300,
    lastUpdated: '1 min ago'
  },
  {
    id: 'veh-06',
    registrationNumber: 'TS-07-EA-7712',
    model: 'Eicher Pro 3019 (19 FT Container)',
    category: 'truck_19ft',
    capacityKg: 11000,
    capacityVolumeCbm: 42,
    status: 'maintenance',
    fuelLevelPercent: 35,
    fastagBalance: 1800,
    currentLocation: {
      lat: 17.4399,
      lng: 78.4983,
      city: 'Secunderabad',
      state: 'Telangana',
      address: 'Authorized Eicher Workshop'
    },
    nextMaintenanceKm: 0,
    odometerKm: 188900,
    lastUpdated: '1 hour ago'
  }
];

export const INITIAL_FLEET: Fleet = {
  id: 'fleet-01',
  name: 'Apex National Transport & Logistics',
  ownerName: 'Vikramaditya Shinde',
  phone: '+91 94220 11928',
  email: 'dispatch@apexfreight.in',
  city: 'Mumbai / Pune Network',
  totalVehicles: 24,
  totalDrivers: 18,
  activeVehicles: 14,
  availableVehicles: 6,
  maintenanceVehicles: 2,
  utilizationPercent: 82,
  totalRevenueThisMonth: 1240000, // ₹12.4 Lakhs
  costPerKm: 28.4
};

export const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'LOS-48291',
    businessId: 'biz-01',
    businessName: 'Tata Motors Precision Components Ltd.',
    pickup: {
      lat: 19.0760,
      lng: 72.8777,
      city: 'Mumbai (Vashi APMC)',
      state: 'Maharashtra',
      hubName: 'Vashi Consolidation Terminal',
      address: 'Sector 19, Turbhe Vashi, Navi Mumbai'
    },
    drop: {
      lat: 18.6279,
      lng: 73.8131,
      city: 'Pune (Bhosari MIDC)',
      state: 'Maharashtra',
      hubName: 'Chakan Auto Assembly Hub',
      address: 'Plot G-44, Sector 7, Bhosari MIDC, Pune'
    },
    cargo: {
      type: 'Machined Gearboxes & Engine Blocks',
      category: 'FTL',
      weightKg: 850,
      volumeCbm: 5.4,
      packageCount: 14,
      hazardous: false,
      specialInstructions: 'Handle with pneumatic lift. Secure strapping on pallets.'
    },
    vehicleTypeRequired: 'lcv',
    pickupWindow: { start: '10:00 AM', end: '11:00 AM' },
    deliveryDeadline: 'Today 04:30 PM',
    estimatedHours: 4.5,
    status: 'in_transit',
    assignedDriverId: 'drv-01',
    assignedDriverName: 'Raj Patil',
    assignedVehicleId: 'veh-01',
    assignedVehicleReg: 'MH-15-AX-2841',
    estimatedCost: 4800,
    tollEstimate: 620,
    progressPercent: 62,
    currentKm: 96,
    totalKm: 154,
    eWayBillNumber: '291048829104-EWB',
    ewayBillStatus: 'active',
    lorryReceiptNumber: 'LR-2026-MUM-48291',
    liveSpeedKmh: 64,
    alerts: ['On schedule. Cleared Khalapur Toll Plaza on Mumbai-Pune Expressway.'],
    createdAt: '2026-09-27T08:15:00Z'
  },
  {
    id: 'LOS-48302',
    businessId: 'biz-02',
    businessName: 'Schneider Electric India Manufacturing',
    pickup: {
      lat: 18.9499,
      lng: 72.9511,
      city: 'Mumbai (JNPT)',
      state: 'Maharashtra',
      hubName: 'JNPT Maritime Inland Terminal',
      address: 'Container Freight Station 4, Uran, Navi Mumbai'
    },
    drop: {
      lat: 28.3588,
      lng: 76.9405,
      city: 'Delhi NCR (Manesar)',
      state: 'Haryana',
      hubName: 'Northern Industrial Distribution Hub',
      address: 'Plot 18, Sector 8, IMT Manesar, Gurugram'
    },
    cargo: {
      type: 'High-Voltage Switchgears & Transformers',
      category: 'FTL',
      weightKg: 1200,
      volumeCbm: 18.2,
      packageCount: 8,
      hazardous: false,
      specialInstructions: 'Shock sensors installed. Maintain under 75 km/h on expressway.'
    },
    vehicleTypeRequired: 'truck_32ft',
    pickupWindow: { start: 'Tomorrow 08:00 AM', end: 'Tomorrow 10:00 AM' },
    deliveryDeadline: 'Within 28 Hours',
    estimatedHours: 26,
    status: 'dispatched',
    assignedDriverId: 'drv-03',
    assignedDriverName: 'Harpreet Singh',
    assignedVehicleId: 'veh-03',
    assignedVehicleReg: 'DL-01-AB-9923',
    estimatedCost: 28500,
    tollEstimate: 3400,
    progressPercent: 18,
    currentKm: 255,
    totalKm: 1420,
    eWayBillNumber: '110948291884-EWB',
    ewayBillStatus: 'active',
    lorryReceiptNumber: 'LR-2026-JNPT-48302',
    liveSpeedKmh: 58,
    alerts: ['Western Dedicated Freight Highway clearance verified.'],
    createdAt: '2026-09-27T11:30:00Z'
  },
  {
    id: 'LOS-50114',
    businessId: 'biz-03',
    businessName: 'Sun Pharma Distribution Laboratories',
    pickup: {
      lat: 22.3072,
      lng: 73.1812,
      city: 'Vadodara (Sanand Corridor)',
      state: 'Gujarat',
      hubName: 'Pharma Cold Chain Vault 2',
      address: 'GIDC Industrial Estate, Vadodara'
    },
    drop: {
      lat: 13.0285,
      lng: 77.5197,
      city: 'Bengaluru (Peenya)',
      state: 'Karnataka',
      hubName: 'South Central Life Sciences Hub',
      address: 'Bio-Logistics Park, Peenya 3rd Phase'
    },
    cargo: {
      type: 'Temperature Controlled Biologics & Vaccines',
      category: 'Cold Chain',
      weightKg: 3200,
      volumeCbm: 14.0,
      packageCount: 32,
      temperatureRequired: 4.0, // 4°C
      hazardous: false,
      specialInstructions: 'Strict cold-chain SLA: Alarm if temperature breaches +2°C to +8°C.'
    },
    vehicleTypeRequired: 'refrigerated',
    pickupWindow: { start: 'Today 06:00 AM', end: 'Today 07:00 AM' },
    deliveryDeadline: 'Tomorrow 02:00 PM',
    estimatedHours: 22,
    status: 'in_transit',
    assignedDriverId: 'drv-05',
    assignedDriverName: 'Bhavin Patel',
    assignedVehicleId: 'veh-05',
    assignedVehicleReg: 'GJ-06-ZZ-4811',
    estimatedCost: 42000,
    tollEstimate: 2900,
    progressPercent: 54,
    currentKm: 680,
    totalKm: 1260,
    temperatureCurrent: 3.8, // 3.8°C
    eWayBillNumber: '448829100412-EWB',
    ewayBillStatus: 'active',
    lorryReceiptNumber: 'LR-2026-BRD-50114',
    liveSpeedKmh: 68,
    alerts: ['Reefer temperature nominal (3.8°C). Battery backup at 98%.'],
    createdAt: '2026-09-27T05:00:00Z'
  },
  {
    id: 'LOS-48128',
    businessId: 'biz-01',
    businessName: 'Tata Motors Precision Components Ltd.',
    pickup: {
      lat: 18.6279,
      lng: 73.8131,
      city: 'Pune',
      state: 'Maharashtra',
      address: 'Chakan Assembly Line 3'
    },
    drop: {
      lat: 19.9975,
      lng: 73.7898,
      city: 'Nashik',
      state: 'Maharashtra',
      address: 'Ambad MIDC Vendor Yard'
    },
    cargo: {
      type: 'Cast Iron Brake Rotors',
      category: 'FTL',
      weightKg: 1800,
      volumeCbm: 7.2,
      packageCount: 22,
      hazardous: false
    },
    vehicleTypeRequired: 'truck_19ft',
    pickupWindow: { start: 'Yesterday 09:00 AM', end: 'Yesterday 11:00 AM' },
    deliveryDeadline: 'Yesterday 05:00 PM',
    estimatedHours: 5,
    status: 'delivered',
    assignedDriverId: 'drv-01',
    assignedDriverName: 'Raj Patil',
    assignedVehicleId: 'veh-01',
    assignedVehicleReg: 'MH-15-AX-2841',
    estimatedCost: 3200,
    tollEstimate: 450,
    progressPercent: 100,
    currentKm: 210,
    totalKm: 210,
    eWayBillNumber: '992810481280-EWB',
    ewayBillStatus: 'active',
    lorryReceiptNumber: 'LR-2026-PUN-48128',
    proofOfDelivery: {
      receivedBy: 'Ramesh Kadam (Store In-charge)',
      timestamp: '2026-09-26T16:48:00Z',
      gpsVerified: true
    },
    alerts: ['Delivered 12 minutes ahead of SLA.'],
    createdAt: '2026-09-26T07:30:00Z'
  },
  {
    id: 'LOS-47920',
    businessId: 'biz-04',
    businessName: 'Godrej Agrovet Logistics Division',
    pickup: {
      lat: 19.9975,
      lng: 73.7898,
      city: 'Nashik',
      state: 'Maharashtra',
      address: 'Dindori Agri Warehousing Zone'
    },
    drop: {
      lat: 19.0760,
      lng: 72.8777,
      city: 'Mumbai',
      state: 'Maharashtra',
      address: 'Bhiwandi Central FMCG Hub'
    },
    cargo: {
      type: 'Packaged Organic Agri-Produce',
      category: 'PTL',
      weightKg: 2400,
      volumeCbm: 11.5,
      packageCount: 65,
      hazardous: false
    },
    vehicleTypeRequired: 'truck_19ft',
    pickupWindow: { start: '2 days ago', end: '2 days ago' },
    deliveryDeadline: '2 days ago',
    estimatedHours: 4.8,
    status: 'delivered',
    assignedDriverId: 'drv-01',
    assignedDriverName: 'Raj Patil',
    assignedVehicleId: 'veh-01',
    assignedVehicleReg: 'MH-15-AX-2841',
    estimatedCost: 4600,
    tollEstimate: 510,
    progressPercent: 100,
    currentKm: 168,
    totalKm: 168,
    lorryReceiptNumber: 'LR-2026-NSK-47920',
    proofOfDelivery: {
      receivedBy: 'A. K. Sharma',
      timestamp: '2026-09-25T14:10:00Z',
      gpsVerified: true
    },
    alerts: ['Zero damage certificate signed.'],
    createdAt: '2026-09-25T06:00:00Z'
  },
  {
    id: 'LOS-51092',
    businessId: 'biz-05',
    businessName: 'Havells India Electricals',
    pickup: {
      lat: 28.3588,
      lng: 76.9405,
      city: 'Delhi NCR (Alwar)',
      state: 'Rajasthan',
      address: 'Havells Plant 4, Neemrana'
    },
    drop: {
      lat: 26.9124,
      lng: 75.7873,
      city: 'Jaipur',
      state: 'Rajasthan',
      address: 'V.K.I. Industrial Area, Jaipur'
    },
    cargo: {
      type: 'Industrial Copper Wiring & LED Modules',
      category: 'FTL',
      weightKg: 4600,
      volumeCbm: 24,
      packageCount: 40,
      hazardous: false
    },
    vehicleTypeRequired: 'truck_32ft',
    pickupWindow: { start: 'Tomorrow 09:00 AM', end: 'Tomorrow 12:00 PM' },
    deliveryDeadline: 'Tomorrow 08:00 PM',
    estimatedHours: 6.5,
    status: 'unassigned',
    estimatedCost: 16400,
    tollEstimate: 1450,
    progressPercent: 0,
    currentKm: 0,
    totalKm: 240,
    alerts: ['AI Matching active: 4 trucks within 15 km corridor.'],
    createdAt: '2026-09-27T18:00:00Z'
  }
];

export const INITIAL_JOB_OFFERS: JobOffer[] = [
  {
    id: 'job-01',
    shipmentId: 'LOS-48291',
    originCity: 'Mumbai (Vashi)',
    destinationCity: 'Pune (Bhosari MIDC)',
    pickupHub: 'Turbhe Vashi Hub',
    dropHub: 'Chakan Auto Corridor',
    distanceKm: 154,
    cargoDescription: 'Machined Gearboxes & Engine Blocks (850 KG)',
    weightKg: 850,
    vehicleRequired: 'lcv',
    payoutAmount: 4800,
    pickupTime: '10:30 AM',
    deliveryTime: '04:30 PM (6 hrs)',
    urgency: 'high',
    whyThisJobReasons: [
      'Matches your registered LCV / 32 FT capacity',
      'Pickup is only 7.4 km away from current Nashik-Mumbai heading',
      'High-yield freight rate (₹31.1 / KM)',
      'Preferred corridor: Mumbai — Pune Golden Line',
      'Instant UPI clearance on digital POD submission'
    ]
  },
  {
    id: 'job-02',
    shipmentId: 'LOS-51204',
    originCity: 'Nashik (Ambad)',
    destinationCity: 'Mumbai (Bhiwandi)',
    pickupHub: 'Ambad MIDC Yard',
    dropHub: 'Bhiwandi Hub 04',
    distanceKm: 148,
    cargoDescription: 'Export-grade Table Grapes & Agri-crates (1,400 KG)',
    weightKg: 1400,
    vehicleRequired: 'truck_19ft',
    payoutAmount: 3900,
    pickupTime: 'Today 02:00 PM',
    deliveryTime: 'Today 08:00 PM',
    urgency: 'normal',
    whyThisJobReasons: [
      'Pickup is within 3.2 km of your current GPS point',
      'Direct highway corridor with zero unpaved roads',
      'Pre-cleared FASTag toll vouchers included'
    ]
  },
  {
    id: 'job-03',
    shipmentId: 'LOS-51340',
    originCity: 'Pune (Chakan)',
    destinationCity: 'Aurangabad (Waluj)',
    pickupHub: 'Chakan Gate 2',
    dropHub: 'Waluj Industrial Estate',
    distanceKm: 235,
    cargoDescription: 'Pressed Steel Components (2,100 KG)',
    weightKg: 2100,
    vehicleRequired: 'truck_32ft',
    payoutAmount: 5600,
    pickupTime: 'Tomorrow 07:30 AM',
    deliveryTime: 'Tomorrow 02:30 PM',
    urgency: 'normal',
    whyThisJobReasons: [
      'Compatible return load after completing Pune delivery',
      'Avoids deadhead return miles (+₹5,600 extra revenue)',
      'Verified tier-1 enterprise consignee'
    ]
  }
];

export const INITIAL_ALERTS: NetworkAlert[] = [
  {
    id: 'alt-01',
    timestamp: '3 mins ago',
    severity: 'warning',
    category: 'traffic',
    title: 'Thane Toll Plaza Congestion',
    description: 'Heavy traffic on NH-48 northbound. Potential +22 min delay for 14 active consignments including LOS-48291.',
    shipmentId: 'LOS-48291',
    resolved: false
  },
  {
    id: 'alt-02',
    timestamp: '18 mins ago',
    severity: 'critical',
    category: 'telemetry',
    title: 'Vehicle Stopped Unscheduled (24 min)',
    description: 'Vehicle MH-15-AX-2841 stationary near Padgha bypass. Driver telemetry confirmed safe rest stop.',
    vehicleId: 'veh-01',
    resolved: false
  },
  {
    id: 'alt-03',
    timestamp: '42 mins ago',
    severity: 'critical',
    category: 'warehouse',
    title: 'Bhiwandi Hub 04 Capacity Alert (91%)',
    description: 'Bay 6 and 7 experiencing queue. AI Dispatch recommends temporary cross-dock diversion to Navi Mumbai.',
    hubId: 'node-mum',
    resolved: false
  },
  {
    id: 'alt-04',
    timestamp: '2 hours ago',
    severity: 'warning',
    category: 'compliance',
    title: 'Driver Fitness Certificate Expiring in 9 Days',
    description: 'RTO fitness certificate for vehicle MH-15-AX-2841 due for renewal on 2026-10-07. Upload renewal to maintain active priority.',
    vehicleId: 'veh-01',
    resolved: false
  },
  {
    id: 'alt-05',
    timestamp: '3 hours ago',
    severity: 'info',
    category: 'demand',
    title: 'Supply Surge: Mumbai → Pune Corridor',
    description: 'AI model predicts 34 additional vehicles will be required between 18:00 and 22:00. Payout multipliers active (+12%).',
    resolved: true
  }
];

export const INITIAL_DRIVER_EARNINGS: DriverEarningsSummary = {
  today: 4840,
  thisWeek: 28420,
  thisMonth: 94280,
  availableBalance: 12480,
  deliveriesToday: 4,
  kmToday: 186,
  onTimeToday: 96,
  breakdown: {
    grossFreight: 5200,
    fuelAllowance: 650,
    nightBonus: 350,
    tollReimbursement: 620,
    platformFee: -1980,
    netPayout: 4840
  },
  dailyHistory: [
    { date: 'Mon', earnings: 4200, trips: 3, km: 165 },
    { date: 'Tue', earnings: 3800, trips: 2, km: 140 },
    { date: 'Wed', earnings: 5100, trips: 4, km: 210 },
    { date: 'Thu', earnings: 4600, trips: 3, km: 175 },
    { date: 'Fri', earnings: 5880, trips: 5, km: 240 },
    { date: 'Sat', earnings: 4840, trips: 4, km: 186 }
  ]
};

export const INITIAL_AI_RECOMMENDATION: AIRecommendation = {
  jobId: 'rec-01',
  shipmentId: 'LOS-48302',
  recommendedVehicleId: 'veh-01',
  recommendedDriverName: 'Raj Patil (Raj Logistics)',
  vehicleReg: 'MH-15-AX-2841',
  reliabilityScore: 94,
  etaPickupMins: 48,
  estimatedCost: 28500,
  reasons: [
    'Vehicle capacity (32 FT / 18.5T) perfectly accommodates 1,200 KG / 18.2 CBM cargo with 84% volume efficiency',
    'Driver currently in Nashik, 48 min transit to pickup terminal on NH-848',
    '96.4% on-time arrival across 842 verified national trips',
    'Full E-way bill and commercial heavy permit pre-validated',
    'Zero transit cancellations in last 45 operating days'
  ]
};
