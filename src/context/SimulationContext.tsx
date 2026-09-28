import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppRole,
  Shipment,
  ShipmentStatus,
  Vehicle,
  Driver,
  Fleet,
  JobOffer,
  NetworkAlert,
  DriverEarningsSummary,
  AIRecommendation,
  NetworkNode,
  VehicleCategory
} from '../types';
import {
  INITIAL_SHIPMENTS,
  INITIAL_VEHICLES,
  INITIAL_DRIVER,
  INITIAL_FLEET,
  INITIAL_JOB_OFFERS,
  INITIAL_ALERTS,
  INITIAL_DRIVER_EARNINGS,
  INITIAL_NETWORK_NODES,
  INITIAL_AI_RECOMMENDATION
} from '../data/mockData';

export type DriverDeliveryStage = 
  | 'heading_to_pickup' 
  | 'arrived_at_pickup' 
  | 'loading' 
  | 'in_transit' 
  | 'arrived_at_destination' 
  | 'delivered';

interface SimulationContextType {
  role: AppRole;
  setRole: (role: AppRole) => void;
  businessTab: string;
  setBusinessTab: (tab: string) => void;
  driverTab: string;
  setDriverTab: (tab: string) => void;
  fleetTab: string;
  setFleetTab: (tab: string) => void;
  controlTowerTab: string;
  setControlTowerTab: (tab: string) => void;
  
  // Real-time telemetry counters
  activeShipmentsCount: number;
  activeVehiclesCount: number;
  networkNodesCount: number;
  citiesCount: number;
  monthlySpendLakhs: number;

  // Domain states
  shipments: Shipment[];
  vehicles: Vehicle[];
  driver: Driver;
  fleet: Fleet;
  jobOffers: JobOffer[];
  alerts: NetworkAlert[];
  earnings: DriverEarningsSummary;
  networkNodes: NetworkNode[];
  aiRecommendation: AIRecommendation;

  // Active delivery workflow state for driver
  activeDeliveryStage: DriverDeliveryStage;
  activeDeliveryShipment: Shipment | null;
  activeDeliverySpeed: number;
  activeDeliveryKmCovered: number;
  earnedAmountCelebration: number | null;
  setEarnedAmountCelebration: (amount: number | null) => void;

  // Actions
  toggleDriverOnline: () => void;
  acceptJob: (jobId: string) => void;
  advanceDriverDeliveryStage: () => void;
  completeDeliveryWithProof: (proofData: {
    photo?: string;
    signature?: string;
    otp?: string;
    receivedBy: string;
  }) => void;
  createShipment: (newShipment: Partial<Shipment>) => Shipment;
  assignVehicleToShipment: (shipmentId: string, vehicleId: string) => void;
  dismissAlert: (alertId: string) => void;
  withdrawDriverBalance: () => void;
  addFleetVehicle: (vehicleData: Partial<Vehicle>) => void;
  runAIMatching: (query: { origin: string; destination: string; weightKg: number; vehicleType: VehicleCategory }) => {
    bestMatch: AIRecommendation;
    alternatives: AIRecommendation[];
  };
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & roles
  const [role, setRole] = useState<AppRole>('marketing');
  const [businessTab, setBusinessTab] = useState<string>('overview');
  const [driverTab, setDriverTab] = useState<string>('home');
  const [fleetTab, setFleetTab] = useState<string>('overview');
  const [controlTowerTab, setControlTowerTab] = useState<string>('network');

  // Simulated metrics
  const [activeShipmentsCount, setActiveShipmentsCount] = useState<number>(2481);
  const [activeVehiclesCount, setActiveVehiclesCount] = useState<number>(847);
  const [networkNodesCount] = useState<number>(186);
  const [citiesCount] = useState<number>(42);
  const [monthlySpendLakhs, setMonthlySpendLakhs] = useState<number>(48.2);

  // Core entities
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [driver, setDriver] = useState<Driver>(INITIAL_DRIVER);
  const [fleet, setFleet] = useState<Fleet>(INITIAL_FLEET);
  const [jobOffers, setJobOffers] = useState<JobOffer[]>(INITIAL_JOB_OFFERS);
  const [alerts, setAlerts] = useState<NetworkAlert[]>(INITIAL_ALERTS);
  const [earnings, setEarnings] = useState<DriverEarningsSummary>(INITIAL_DRIVER_EARNINGS);
  const [networkNodes] = useState<NetworkNode[]>(INITIAL_NETWORK_NODES);
  const [aiRecommendation] = useState<AIRecommendation>(INITIAL_AI_RECOMMENDATION);

  // Active delivery workflow
  const [activeDeliveryStage, setActiveDeliveryStage] = useState<DriverDeliveryStage>('in_transit');
  const [activeDeliveryShipment, setActiveDeliveryShipment] = useState<Shipment | null>(INITIAL_SHIPMENTS[0]); // LOS-48291
  const [activeDeliverySpeed, setActiveDeliverySpeed] = useState<number>(64);
  const [activeDeliveryKmCovered, setActiveDeliveryKmCovered] = useState<number>(96);
  const [earnedAmountCelebration, setEarnedAmountCelebration] = useState<number | null>(null);

  // Background simulation tick: Every 3.5s updates coordinates, telemetry, counters
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate shipments & vehicles slightly to feel like a living network
      setActiveShipmentsCount(prev => prev + (Math.random() > 0.48 ? 1 : -1));
      if (Math.random() > 0.7) {
        setActiveVehiclesCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      }

      // Progress active delivery if in transit
      if (activeDeliveryStage === 'in_transit' && activeDeliveryShipment) {
        setActiveDeliverySpeed(58 + Math.floor(Math.random() * 14));
        setActiveDeliveryKmCovered(prev => {
          const next = Math.min(activeDeliveryShipment.totalKm, prev + 1);
          return next;
        });

        // Update shipment progress
        setShipments(prevList =>
          prevList.map(s => {
            if (s.id === activeDeliveryShipment.id) {
              const newKm = Math.min(s.totalKm, s.currentKm + 1);
              const progress = Math.round((newKm / s.totalKm) * 100);
              return {
                ...s,
                currentKm: newKm,
                progressPercent: progress,
                liveSpeedKmh: 58 + Math.floor(Math.random() * 14)
              };
            }
            return s;
          })
        );
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [activeDeliveryStage, activeDeliveryShipment]);

  // Actions
  const toggleDriverOnline = () => {
    setDriver(prev => ({
      ...prev,
      status: prev.status === 'online' ? 'offline' : 'online'
    }));
  };

  const acceptJob = (jobId: string) => {
    const job = jobOffers.find(j => j.id === jobId);
    if (!job) return;

    // Remove job from available feed
    setJobOffers(prev => prev.filter(j => j.id !== jobId));

    // Find or create matching shipment
    let targetShipment = shipments.find(s => s.id === job.shipmentId);
    if (!targetShipment) {
      targetShipment = {
        id: job.shipmentId,
        businessId: 'biz-01',
        businessName: 'Tata Motors Precision Components Ltd.',
        pickup: {
          lat: 19.0760,
          lng: 72.8777,
          city: job.originCity,
          state: 'Maharashtra',
          address: job.pickupHub
        },
        drop: {
          lat: 18.6279,
          lng: 73.8131,
          city: job.destinationCity,
          state: 'Maharashtra',
          address: job.dropHub
        },
        cargo: {
          type: job.cargoDescription,
          category: 'FTL',
          weightKg: job.weightKg,
          volumeCbm: 6.2,
          packageCount: 12,
          hazardous: false
        },
        vehicleTypeRequired: job.vehicleRequired,
        pickupWindow: { start: job.pickupTime, end: 'Within 1 hour' },
        deliveryDeadline: job.deliveryTime,
        estimatedHours: 4.5,
        status: 'heading_to_pickup',
        assignedDriverId: driver.id,
        assignedDriverName: driver.name,
        assignedVehicleId: 'veh-01',
        assignedVehicleReg: 'MH-15-AX-2841',
        estimatedCost: job.payoutAmount,
        tollEstimate: 620,
        progressPercent: 5,
        currentKm: 8,
        totalKm: job.distanceKm,
        eWayBillNumber: '291048829104-EWB',
        ewayBillStatus: 'active',
        lorryReceiptNumber: `LR-2026-${job.id}`,
        alerts: ['Job accepted by Raj Patil. Heading to Vashi pickup terminal.'],
        createdAt: new Date().toISOString()
      };
      setShipments(prev => [targetShipment!, ...prev]);
    } else {
      setShipments(prev =>
        prev.map(s =>
          s.id === job.shipmentId
            ? { ...s, status: 'heading_to_pickup', assignedDriverName: driver.name }
            : s
        )
      );
    }

    setActiveDeliveryShipment(targetShipment);
    setActiveDeliveryStage('heading_to_pickup');
    setActiveDeliveryKmCovered(12);
    setDriverTab('active-delivery');
  };

  const advanceDriverDeliveryStage = () => {
    if (activeDeliveryStage === 'heading_to_pickup') {
      setActiveDeliveryStage('arrived_at_pickup');
    } else if (activeDeliveryStage === 'arrived_at_pickup') {
      setActiveDeliveryStage('loading');
    } else if (activeDeliveryStage === 'loading') {
      setActiveDeliveryStage('in_transit');
      if (activeDeliveryShipment) {
        setShipments(prev =>
          prev.map(s => (s.id === activeDeliveryShipment.id ? { ...s, status: 'in_transit' } : s))
        );
      }
    } else if (activeDeliveryStage === 'in_transit') {
      setActiveDeliveryStage('arrived_at_destination');
    }
  };

  const completeDeliveryWithProof = (proofData: {
    photo?: string;
    signature?: string;
    otp?: string;
    receivedBy: string;
  }) => {
    setActiveDeliveryStage('delivered');
    const payout = activeDeliveryShipment?.estimatedCost || 4800;

    // Trigger celebration counter (+₹4,800)
    setEarnedAmountCelebration(payout);

    // Update earnings
    setEarnings(prev => ({
      ...prev,
      today: prev.today + payout,
      thisWeek: prev.thisWeek + payout,
      thisMonth: prev.thisMonth + payout,
      availableBalance: prev.availableBalance + payout,
      deliveriesToday: prev.deliveriesToday + 1,
      kmToday: prev.kmToday + (activeDeliveryShipment?.totalKm || 154)
    }));

    // Update driver performance stats
    setDriver(prev => ({
      ...prev,
      performance: {
        ...prev.performance,
        totalJobs: prev.performance.totalJobs + 1,
        totalKm: prev.performance.totalKm + (activeDeliveryShipment?.totalKm || 154)
      }
    }));

    // Mark shipment delivered
    if (activeDeliveryShipment) {
      setShipments(prev =>
        prev.map(s =>
          s.id === activeDeliveryShipment.id
            ? {
                ...s,
                status: 'delivered',
                progressPercent: 100,
                currentKm: s.totalKm,
                proofOfDelivery: {
                  signatureUrl: proofData.signature,
                  photoUrl: proofData.photo,
                  otpCode: proofData.otp || '4821',
                  receivedBy: proofData.receivedBy || 'Consignee Receiver',
                  timestamp: new Date().toISOString(),
                  gpsVerified: true
                }
              }
            : s
        )
      );
    }
  };

  const createShipment = (newShipmentData: Partial<Shipment>): Shipment => {
    const newId = `LOS-${Math.floor(10000 + Math.random() * 90000)}`;
    const created: Shipment = {
      id: newId,
      businessId: 'biz-01',
      businessName: 'Tata Motors Precision Components Ltd.',
      pickup: newShipmentData.pickup || {
        lat: 19.0760,
        lng: 72.8777,
        city: 'Mumbai',
        state: 'Maharashtra',
        address: 'Bhiwandi Logistics Hub'
      },
      drop: newShipmentData.drop || {
        lat: 28.3588,
        lng: 76.9405,
        city: 'Delhi NCR',
        state: 'Haryana',
        address: 'IMT Manesar Hub'
      },
      cargo: newShipmentData.cargo || {
        type: 'Industrial Equipment',
        category: 'FTL',
        weightKg: 1200,
        volumeCbm: 18,
        packageCount: 10,
        hazardous: false
      },
      vehicleTypeRequired: newShipmentData.vehicleTypeRequired || 'truck_32ft',
      pickupWindow: newShipmentData.pickupWindow || { start: 'Tomorrow 08:00 AM', end: '10:00 AM' },
      deliveryDeadline: newShipmentData.deliveryDeadline || 'Within 24 Hours',
      estimatedHours: 24,
      status: 'unassigned',
      estimatedCost: newShipmentData.estimatedCost || 28500,
      tollEstimate: 3200,
      progressPercent: 0,
      currentKm: 0,
      totalKm: 1420,
      eWayBillNumber: `${Math.floor(100000000000 + Math.random() * 900000000000)}-EWB`,
      ewayBillStatus: 'generated',
      lorryReceiptNumber: `LR-2026-${newId}`,
      alerts: ['Shipment initialized. Broadcast to certified AI network capacity.'],
      createdAt: new Date().toISOString()
    };

    setShipments(prev => [created, ...prev]);
    setActiveShipmentsCount(prev => prev + 1);
    setMonthlySpendLakhs(prev => +(prev + created.estimatedCost / 100000).toFixed(1));

    return created;
  };

  const assignVehicleToShipment = (shipmentId: string, vehicleId: string) => {
    const targetVehicle = vehicles.find(v => v.id === vehicleId);
    setShipments(prev =>
      prev.map(s => {
        if (s.id === shipmentId) {
          return {
            ...s,
            status: 'dispatched',
            assignedVehicleId: vehicleId,
            assignedVehicleReg: targetVehicle?.registrationNumber || 'MH-15-AX-2841',
            assignedDriverName: targetVehicle?.assignedDriverName || 'Raj Patil'
          };
        }
        return s;
      })
    );

    setVehicles(prev =>
      prev.map(v => (v.id === vehicleId ? { ...v, status: 'active', currentShipmentId: shipmentId } : v))
    );
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const withdrawDriverBalance = () => {
    const balance = earnings.availableBalance;
    if (balance <= 0) return;
    setEarnings(prev => ({
      ...prev,
      availableBalance: 0
    }));
  };

  const addFleetVehicle = (vehicleData: Partial<Vehicle>) => {
    const newVeh: Vehicle = {
      id: `veh-${vehicles.length + 1}`,
      registrationNumber: vehicleData.registrationNumber || `MH-${Math.floor(10 + Math.random() * 89)}-ZZ-${Math.floor(1000 + Math.random() * 9000)}`,
      model: vehicleData.model || 'Tata Prima 4028.S (32 FT Trailer)',
      category: vehicleData.category || 'truck_32ft',
      capacityKg: vehicleData.capacityKg || 25000,
      capacityVolumeCbm: 75,
      status: 'available',
      fuelLevelPercent: 95,
      fastagBalance: 5000,
      currentLocation: {
        lat: 19.0760,
        lng: 72.8777,
        city: 'Mumbai',
        state: 'Maharashtra',
        address: 'JNPT CFS Compound'
      },
      assignedDriverName: vehicleData.assignedDriverName || 'Unassigned',
      nextMaintenanceKm: 8000,
      odometerKm: 42100,
      lastUpdated: 'Just now'
    };
    setVehicles(prev => [newVeh, ...prev]);
    setFleet(prev => ({
      ...prev,
      totalVehicles: prev.totalVehicles + 1,
      availableVehicles: prev.availableVehicles + 1
    }));
  };

  const runAIMatching = (query: { origin: string; destination: string; weightKg: number; vehicleType: VehicleCategory }) => {
    const bestMatch: AIRecommendation = {
      jobId: `match-${Date.now()}`,
      shipmentId: 'REQ-AI-MATCH',
      recommendedVehicleId: 'veh-01',
      recommendedDriverName: 'Raj Patil (Apex / Raj Logistics)',
      vehicleReg: 'MH-15-AX-2841',
      reliabilityScore: 94,
      etaPickupMins: 48,
      estimatedCost: query.weightKg > 5000 ? 28500 : 8400,
      reasons: [
        `Vehicle capacity accommodates ${query.weightKg.toLocaleString()} KG with 92% utilization efficiency`,
        `Driver positioned 7.4 km from ${query.origin} terminal`,
        `96.4% historical on-time delivery across verified ${query.origin} → ${query.destination} corridor`,
        'Active FASTag commercial toll clearance verified',
        'Transparent reliability profile: 98.2% completion rate, 1.1% cancellation'
      ]
    };

    const alternatives: AIRecommendation[] = [
      {
        jobId: `match-alt-1`,
        shipmentId: 'REQ-AI-ALT-1',
        recommendedVehicleId: 'veh-03',
        recommendedDriverName: 'Harpreet Singh (Manesar Transport)',
        vehicleReg: 'DL-01-AB-9923',
        reliabilityScore: 91,
        etaPickupMins: 75,
        estimatedCost: query.weightKg > 5000 ? 29200 : 8800,
        reasons: [
          'High load rating with heavy-duty BharatBenz chassis',
          '95.1% on-time record on National Golden Quadrilateral',
          'Certified dangerous goods / heavy machinery handling'
        ]
      },
      {
        jobId: `match-alt-2`,
        shipmentId: 'REQ-AI-ALT-2',
        recommendedVehicleId: 'veh-02',
        recommendedDriverName: 'Suresh More (Maharashtra Freightlines)',
        vehicleReg: 'MH-04-KF-8190',
        reliabilityScore: 89,
        etaPickupMins: 90,
        estimatedCost: query.weightKg > 5000 ? 27800 : 7900,
        reasons: [
          'Lower economic freight index',
          'Fast turnaround for express regional transit',
          'Verified compliance and digital LR documentation'
        ]
      }
    ];

    return { bestMatch, alternatives };
  };

  return (
    <SimulationContext.Provider
      value={{
        role,
        setRole,
        businessTab,
        setBusinessTab,
        driverTab,
        setDriverTab,
        fleetTab,
        setFleetTab,
        controlTowerTab,
        setControlTowerTab,
        activeShipmentsCount,
        activeVehiclesCount,
        networkNodesCount,
        citiesCount,
        monthlySpendLakhs,
        shipments,
        vehicles,
        driver,
        fleet,
        jobOffers,
        alerts,
        earnings,
        networkNodes,
        aiRecommendation,
        activeDeliveryStage,
        activeDeliveryShipment,
        activeDeliverySpeed,
        activeDeliveryKmCovered,
        earnedAmountCelebration,
        setEarnedAmountCelebration,
        toggleDriverOnline,
        acceptJob,
        advanceDriverDeliveryStage,
        completeDeliveryWithProof,
        createShipment,
        assignVehicleToShipment,
        dismissAlert,
        withdrawDriverBalance,
        addFleetVehicle,
        runAIMatching
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
