import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Shipment, VehicleCategory, ShipmentStatus } from '../../types';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Map,
  ShoppingBag,
  FileText,
  CreditCard,
  Bot,
  BarChart3,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ChevronRight,
  X,
  Truck,
  Send,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Download
} from 'lucide-react';

export const BusinessOS: React.FC = () => {
  const {
    businessTab,
    setBusinessTab,
    setRole,
    activeShipmentsCount,
    monthlySpendLakhs,
    shipments,
    createShipment,
    runAIMatching
  } = useSimulation();

  // Search & Filter in Shipments
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(shipments[0]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Wizard state for Shipment Creation
  const [wizardStep, setWizardStep] = useState(1);
  const [newShipmentData, setNewShipmentData] = useState({
    originCity: 'Mumbai',
    originHub: 'Bhiwandi Central Warehousing Zone',
    originContact: '+91 98210 11920',
    destCity: 'Delhi NCR',
    destHub: 'Manesar Industrial Park',
    destConsignee: 'Havells India Distribution',
    goodsType: 'High-Precision Automotive Castings',
    category: 'FTL' as const,
    weightKg: 1200,
    volumeCbm: 18,
    vehicleType: 'truck_32ft' as VehicleCategory,
    pickupWindow: 'Tomorrow 08:00 AM',
    deliveryDeadline: 'Within 28 Hours',
    specialReqs: 'Pneumatic tie-downs, Digital tamper seal, GPS reporting'
  });
  const [matchedAIMatch, setMatchedAIMatch] = useState<any>(null);

  // AI Copilot state
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotMessages, setCopilotMessages] = useState<
    { sender: 'user' | 'ai'; text: string; dataCard?: any }[]
  >([
    {
      sender: 'ai',
      text: 'Hello. I am Logistics AI Copilot. I analyze your enterprise freight telemetry across all Indian trade corridors. How can I assist your dispatch team today?'
    }
  ]);

  const handleRunAICopilot = (queryText: string) => {
    const q = queryText || copilotQuery;
    if (!q) return;

    const userMsg = { sender: 'user' as const, text: q };
    let aiResponseMsg: { sender: 'ai'; text: string; dataCard?: any };

    if (q.toLowerCase().includes('delayed') || q.toLowerCase().includes('at risk')) {
      aiResponseMsg = {
        sender: 'ai',
        text: 'Analysis detected 1 consignment facing potential delay: LOS-48291 (Mumbai → Pune). Padgha toll corridor is backed up by 22 mins. Driver Raj Patil has rerouted via Eastern Expressway.',
        dataCard: {
          type: 'alert',
          title: 'Congestion Impact: LOS-48291',
          metric: '+22m Delay Predicted',
          recommendation: 'FASTag priority lane bypass cleared. SLA target maintained.'
        }
      };
    } else if (q.toLowerCase().includes('cost') || q.toLowerCase().includes('spend')) {
      aiResponseMsg = {
        sender: 'ai',
        text: 'Your highest cost lane this month is Mumbai → Delhi NCR (avg ₹28,500/trip across 32 FT multi-axle). Recommending return-load contract consolidation to reduce cost by 14.8%.',
        dataCard: {
          type: 'savings',
          title: 'Lane Cost Optimization: W-DFC',
          metric: '₹1.84L Potential Savings',
          recommendation: 'Consolidate 4 PTL shipments into 1 FTL via Bhiwandi Hub.'
        }
      };
    } else if (q.toLowerCase().includes('capacity') || q.toLowerCase().includes('empty')) {
      aiResponseMsg = {
        sender: 'ai',
        text: 'Found 6 empty returning vehicles on Delhi → Jaipur corridor. You can book backhaul capacity at 32% discount (₹14,200 vs standard ₹21,000).',
        dataCard: {
          type: 'capacity',
          title: 'Backhaul Discount Capacity',
          metric: '6 Available Trucks',
          recommendation: 'Book backhaul slot before 18:00 to lock preferential freight rate.'
        }
      };
    } else {
      aiResponseMsg = {
        sender: 'ai',
        text: `Analysis complete for: "${q}". Current network health score is 96.2% on-time delivery across 2,481 active shipments with zero transit exceptions.`,
        dataCard: {
          type: 'general',
          title: 'Network Telemetry Overview',
          metric: '96.2% On-Time SLA',
          recommendation: 'All compliance E-way bills active and verified.'
        }
      };
    }

    setCopilotMessages(prev => [...prev, userMsg, aiResponseMsg]);
    setCopilotQuery('');
  };

  const handleFinishWizard = () => {
    const created = createShipment({
      pickup: {
        lat: 19.0760,
        lng: 72.8777,
        city: newShipmentData.originCity,
        state: 'Maharashtra',
        address: newShipmentData.originHub
      },
      drop: {
        lat: 28.3588,
        lng: 76.9405,
        city: newShipmentData.destCity,
        state: 'Haryana',
        address: newShipmentData.destHub
      },
      cargo: {
        type: newShipmentData.goodsType,
        category: newShipmentData.category,
        weightKg: newShipmentData.weightKg,
        volumeCbm: newShipmentData.volumeCbm,
        packageCount: 16,
        hazardous: false,
        specialInstructions: newShipmentData.specialReqs
      },
      vehicleTypeRequired: newShipmentData.vehicleType,
      pickupWindow: { start: newShipmentData.pickupWindow, end: 'Within 2 hours' },
      deliveryDeadline: newShipmentData.deliveryDeadline,
      estimatedCost: matchedAIMatch?.estimatedCost || 28500
    });

    setSelectedShipment(created);
    setBusinessTab('shipments');
    setIsDrawerOpen(true);
    setWizardStep(1);
    setMatchedAIMatch(null);
  };

  const filteredShipments = shipments.filter(s => {
    const matchesSearch =
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.pickup.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.drop.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.cargo.type.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'in_transit') return matchesSearch && (s.status === 'in_transit' || s.status === 'dispatched');
    if (statusFilter === 'delivered') return matchesSearch && s.status === 'delivered';
    if (statusFilter === 'at_risk') return matchesSearch && s.status === 'at_risk';
    return matchesSearch;
  });

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', background: 'var(--bg-primary)' }}>
      {/* Sidebar Navigation */}
      <aside style={{
        width: '240px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
        padding: '20px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flexShrink: 0
      }}>
        <div style={{ padding: '0 8px 14px 8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Enterprise Shipper
          </div>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff' }}>
            Tata Motors Precision
          </div>
          <div style={{ fontSize: '11px', color: 'var(--accent-orange)' }}>
            GST: 27AABCT2841Q1ZP
          </div>
        </div>

        {[
          { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
          { id: 'shipments', label: 'Shipments', icon: <Package size={16} />, badge: `${shipments.length}` },
          { id: 'create', label: 'Create Shipment', icon: <PlusCircle size={16} />, highlight: true },
          { id: 'tracking', label: 'Live Telemetry', icon: <Map size={16} /> },
          { id: 'marketplace', label: 'Capacity Market', icon: <ShoppingBag size={16} /> },
          { id: 'documents', label: 'Document Center', icon: <FileText size={16} /> },
          { id: 'billing', label: 'Billing & Spend', icon: <CreditCard size={16} /> },
          { id: 'ai', label: 'Logistics AI Copilot', icon: <Bot size={16} />, badge: 'AI' }
        ].map(item => {
          const isActive = businessTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setBusinessTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: '8px',
                background: isActive ? 'rgba(255, 102, 0, 0.15)' : 'transparent',
                color: isActive ? '#ff6600' : item.highlight ? 'var(--accent-orange)' : 'var(--text-secondary)',
                border: isActive ? '1px solid rgba(255, 102, 0, 0.3)' : '1px solid transparent',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: '10px',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: isActive ? '#ff6600' : 'rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#000000' : 'var(--text-muted)',
                  fontWeight: 700
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div style={{ marginTop: 'auto', padding: '12px', background: 'rgba(255, 102, 0, 0.06)', borderRadius: '10px', border: '1px solid rgba(255, 102, 0, 0.2)' }}>
          <div style={{ fontSize: '11px', color: 'var(--accent-orange)', fontWeight: 700, marginBottom: '2px' }}>
            OPERATING TOWER
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '8px' }}>
            Access National 3D Dispatch & Network Telemetry.
          </p>
          <button
            onClick={() => setRole('control-tower')}
            style={{
              background: 'var(--accent-orange)',
              border: 'none',
              borderRadius: '6px',
              color: '#000000',
              fontWeight: 700,
              fontSize: '11px',
              padding: '6px 10px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Launch Control Tower →
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }}>
        {/* ============================================================ */}
        {/* 1. OVERVIEW TAB */}
        {/* ============================================================ */}
        {businessTab === 'overview' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
              <div>
                <span className="badge badge-orange" style={{ marginBottom: '6px' }}>COMMAND CENTER</span>
                <h1 style={{ fontSize: '28px', color: '#ffffff' }}>GOOD MORNING.</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  Here's what's happening across your nationwide logistics network today.
                </p>
              </div>

              <button
                onClick={() => setBusinessTab('create')}
                className="btn btn-primary"
                style={{ padding: '10px 18px' }}
              >
                <PlusCircle size={16} />
                <span>Create New Shipment</span>
              </button>
            </div>

            {/* KPI Cards Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '16px',
              marginBottom: '28px'
            }}>
              <div className="glass-panel" style={{ padding: '18px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  ACTIVE SHIPMENTS
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                  {activeShipmentsCount.toLocaleString()}
                </div>
                <div style={{ fontSize: '11px', color: '#00e676', marginTop: '4px' }}>
                  ● 100% telemetry linked
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '18px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  IN HIGHWAY TRANSIT
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>
                  1,842
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Avg speed: 62.4 KM/H
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '18px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  DELIVERED THIS MONTH
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#00e676', fontFamily: 'var(--font-mono)' }}>
                  638
                </div>
                <div style={{ fontSize: '11px', color: '#00e676', marginTop: '4px' }}>
                  96.4% on-time SLA
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '18px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  AT RISK / DELAYED
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#ff3366', fontFamily: 'var(--font-mono)' }}>
                  42
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
                  Weather & Padgha toll
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '18px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  MONTHLY LOGISTICS SPEND
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  ₹{monthlySpendLakhs}L
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  -8.4% vs market broker spot
                </div>
              </div>
            </div>

            {/* Live Network & Quick Actions Split */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
              {/* Left: Active Movements Table */}
              <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', color: '#ffffff' }}>Active Freight Movements</h3>
                  <button
                    onClick={() => setBusinessTab('shipments')}
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-orange)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    View All Shipments →
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {shipments.slice(0, 3).map(s => (
                    <div
                      key={s.id}
                      onClick={() => { setSelectedShipment(s); setIsDrawerOpen(true); }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#ffffff' }}>
                            {s.id}
                          </span>
                          <span className={`badge ${s.status === 'in_transit' ? 'badge-orange' : s.status === 'delivered' ? 'badge-green' : 'badge-amber'}`}>
                            {s.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {s.pickup.city} → {s.drop.city} ({s.cargo.type})
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                          {s.progressPercent}% Completed
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {s.currentKm} / {s.totalKm} KM
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: AI Insights Card */}
              <div className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(255, 102, 0, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Sparkles size={18} color="#ff6600" />
                  <h3 style={{ fontSize: '16px', color: '#ffffff' }}>Logistics AI Insight</h3>
                </div>

                <div style={{
                  background: 'rgba(255, 102, 0, 0.08)',
                  borderRadius: '10px',
                  padding: '14px',
                  marginBottom: '14px',
                  border: '1px solid rgba(255, 102, 0, 0.2)'
                }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff', marginBottom: '4px' }}>
                    Western Corridor Congestion Alert
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    Padgha toll plaza is operating at +25m delay. AI dispatcher has shifted 14 upcoming dispatches to NH-48 Express bypass.
                  </p>
                </div>

                <div style={{
                  background: 'rgba(0, 240, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '14px',
                  border: '1px solid rgba(0, 240, 255, 0.2)'
                }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff', marginBottom: '4px' }}>
                    Backhaul Freight Opportunity
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    6 trucks returning empty from Pune MIDC to Mumbai today. Match your return scrap cargo to save ₹28,400.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 2. SHIPMENTS TABLE TAB */}
        {/* ============================================================ */}
        {businessTab === 'shipments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '22px', color: '#ffffff' }}>National Consignments Directory</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Inspect real-time telemetry, E-way bill validation and proof of delivery.
                </p>
              </div>

              <button
                onClick={() => setBusinessTab('create')}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                <PlusCircle size={15} />
                <span>New Shipment</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '18px',
              background: 'var(--bg-secondary)',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="text"
                  placeholder="Search by Shipment ID (e.g. LOS-48291), Origin, Consignee..."
                  className="input-field"
                  style={{ paddingLeft: '36px' }}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="input-field"
                style={{ width: '180px' }}
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="at_risk">At Risk</option>
              </select>
            </div>

            {/* Table */}
            <div className="glass-panel" style={{ overflow: 'hidden' }}>
              <table className="tech-table">
                <thead>
                  <tr>
                    <th>Shipment ID</th>
                    <th>Route (Origin → Destination)</th>
                    <th>Cargo Details</th>
                    <th>Assigned Vehicle & Driver</th>
                    <th>Progress</th>
                    <th>E-Way Bill</th>
                    <th>Cost</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShipments.map(s => (
                    <tr
                      key={s.id}
                      onClick={() => { setSelectedShipment(s); setIsDrawerOpen(true); }}
                    >
                      <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-orange)' }}>
                        {s.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{s.pickup.city} → {s.drop.city}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.totalKm} KM corridor</div>
                      </td>
                      <td>
                        <div>{s.cargo.type}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.cargo.weightKg} KG • {s.vehicleTypeRequired.toUpperCase()}</div>
                      </td>
                      <td>
                        {s.assignedDriverName ? (
                          <div>
                            <div style={{ fontWeight: 600 }}>{s.assignedDriverName}</div>
                            <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                              {s.assignedVehicleReg}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-dim)', fontSize: '11px' }}>AI Matching...</span>
                        )}
                      </td>
                      <td>
                        <div style={{ width: '100px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '2px' }}>
                            <span>{s.progressPercent}%</span>
                            <span style={{ color: 'var(--text-muted)' }}>{s.currentKm}km</span>
                          </div>
                          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${s.progressPercent}%`, height: '100%', background: s.status === 'delivered' ? '#00e676' : '#ff6600' }} />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                          {s.eWayBillNumber || 'Pending'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        ₹{s.estimatedCost.toLocaleString()}
                      </td>
                      <td>
                        <span className={`badge ${s.status === 'in_transit' ? 'badge-orange' : s.status === 'delivered' ? 'badge-green' : 'badge-neutral'}`}>
                          {s.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. 8-STEP SHIPMENT CREATION WIZARD */}
        {/* ============================================================ */}
        {businessTab === 'create' && (
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-orange">8-STEP WIZARD</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Step {wizardStep} of 8</span>
              </div>
              <h2 style={{ fontSize: '24px', marginTop: '4px', color: '#ffffff' }}>
                Create Enterprise Shipment
              </h2>
            </div>

            <div className="glass-panel" style={{ padding: '28px' }}>
              {wizardStep === 1 && (
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '14px' }}>Step 1: Pickup Location & Consignor</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label className="input-label">Origin City</label>
                      <input
                        type="text"
                        className="input-field"
                        value={newShipmentData.originCity}
                        onChange={e => setNewShipmentData({ ...newShipmentData, originCity: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="input-label">Warehouse / MIDC Zone</label>
                      <input
                        type="text"
                        className="input-field"
                        value={newShipmentData.originHub}
                        onChange={e => setNewShipmentData({ ...newShipmentData, originHub: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <label className="input-label">Dispatch Supervisor Mobile</label>
                    <input
                      type="text"
                      className="input-field"
                      value={newShipmentData.originContact}
                      onChange={e => setNewShipmentData({ ...newShipmentData, originContact: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '14px' }}>Step 2: Destination & Consignee Facility</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label className="input-label">Destination City</label>
                      <input
                        type="text"
                        className="input-field"
                        value={newShipmentData.destCity}
                        onChange={e => setNewShipmentData({ ...newShipmentData, destCity: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="input-label">Consignee Receiving Hub</label>
                      <input
                        type="text"
                        className="input-field"
                        value={newShipmentData.destHub}
                        onChange={e => setNewShipmentData({ ...newShipmentData, destHub: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <label className="input-label">Consignee Legal Entity Name</label>
                    <input
                      type="text"
                      className="input-field"
                      value={newShipmentData.destConsignee}
                      onChange={e => setNewShipmentData({ ...newShipmentData, destConsignee: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '14px' }}>Step 3: Goods Classification</h3>
                  <div>
                    <label className="input-label">Cargo Description</label>
                    <input
                      type="text"
                      className="input-field"
                      value={newShipmentData.goodsType}
                      onChange={e => setNewShipmentData({ ...newShipmentData, goodsType: e.target.value })}
                    />
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <label className="input-label">Shipment Category</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                      {['FTL', 'PTL', 'Express', 'Cold Chain', 'Special Handling'].map(cat => (
                        <div
                          key={cat}
                          onClick={() => setNewShipmentData({ ...newShipmentData, category: cat as any })}
                          style={{
                            background: newShipmentData.category === cat ? 'rgba(255, 102, 0, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                            border: `1px solid ${newShipmentData.category === cat ? 'var(--accent-orange)' : 'var(--border-subtle)'}`,
                            borderRadius: '8px',
                            padding: '10px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#ffffff'
                          }}
                        >
                          {cat}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '14px' }}>Step 4: Weight & Volume Metrics</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label className="input-label">Total Cargo Weight (KG)</label>
                      <input
                        type="number"
                        className="input-field"
                        value={newShipmentData.weightKg}
                        onChange={e => setNewShipmentData({ ...newShipmentData, weightKg: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="input-label">Total Volume (CBM)</label>
                      <input
                        type="number"
                        className="input-field"
                        value={newShipmentData.volumeCbm}
                        onChange={e => setNewShipmentData({ ...newShipmentData, volumeCbm: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 5 && (
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '14px' }}>Step 5: Required Vehicle Type</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {[
                      { type: 'truck_32ft', label: '32 FT Multi-Axle (18.5T)' },
                      { type: 'truck_19ft', label: '19 FT Container (9T)' },
                      { type: 'lcv', label: 'LCV Ecomet (4.5T)' },
                      { type: 'mini_truck', label: 'Mini Truck Tata Ace (1.2T)' },
                      { type: 'refrigerated', label: 'Cold-Chain Reefer (-20°C)' },
                      { type: 'trailer', label: '40 FT Heavy Flatbed' }
                    ].map(v => (
                      <div
                        key={v.type}
                        onClick={() => setNewShipmentData({ ...newShipmentData, vehicleType: v.type as any })}
                        style={{
                          background: newShipmentData.vehicleType === v.type ? 'rgba(255, 102, 0, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                          border: `1px solid ${newShipmentData.vehicleType === v.type ? 'var(--accent-orange)' : 'var(--border-subtle)'}`,
                          borderRadius: '10px',
                          padding: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '13px' }}>{v.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 6 && (
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '14px' }}>Step 6: Pickup Window</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {['Immediate Spot (Within 2 hours)', 'Tomorrow 08:00 AM', 'Tomorrow 02:00 PM', 'Scheduled Corridor (Select Date)'].map(w => (
                      <div
                        key={w}
                        onClick={() => setNewShipmentData({ ...newShipmentData, pickupWindow: w })}
                        style={{
                          background: newShipmentData.pickupWindow === w ? 'rgba(255, 102, 0, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                          border: `1px solid ${newShipmentData.pickupWindow === w ? 'var(--accent-orange)' : 'var(--border-subtle)'}`,
                          borderRadius: '8px',
                          padding: '12px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '13px',
                          color: '#ffffff'
                        }}
                      >
                        {w}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 7 && (
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '14px' }}>Step 7: Delivery SLA Deadline</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {['Within 24 hours (Express)', 'Within 28 hours (Standard Highway)', 'Within 48 hours (Economy Multi-Drop)'].map(d => (
                      <div
                        key={d}
                        onClick={() => setNewShipmentData({ ...newShipmentData, deliveryDeadline: d })}
                        style={{
                          background: newShipmentData.deliveryDeadline === d ? 'rgba(255, 102, 0, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                          border: `1px solid ${newShipmentData.deliveryDeadline === d ? 'var(--accent-orange)' : 'var(--border-subtle)'}`,
                          borderRadius: '8px',
                          padding: '12px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '13px',
                          color: '#ffffff'
                        }}
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 8 && (
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '14px' }}>Step 8: AI Matching Engine Results</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Evaluating 18 parameters across active trucks in the {newShipmentData.originCity} corridor...
                  </p>

                  <div style={{
                    background: 'rgba(255, 102, 0, 0.08)',
                    border: '1px solid rgba(255, 102, 0, 0.4)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge badge-green">OPTIMAL DISPATCH MATCH</span>
                        <strong style={{ fontSize: '15px', color: '#ffffff' }}>Raj Patil (Raj Logistics)</strong>
                      </div>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>
                        ₹28,500
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                      <div>Vehicle: <strong style={{ color: '#ffffff' }}>MH-15-AX-2841</strong></div>
                      <div>Type: <strong style={{ color: '#ffffff' }}>32 FT Multi-Axle</strong></div>
                      <div>ETA Pickup: <strong style={{ color: '#00e676' }}>48 min</strong></div>
                      <div>Reliability: <strong style={{ color: '#00f0ff' }}>94/100</strong></div>
                    </div>

                    <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.5, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
                      <div>✓ 96.4% historical on-time arrival on {newShipmentData.originCity} → {newShipmentData.destCity} corridor</div>
                      <div>✓ Vehicle capacity matches 1,200 KG with zero overloading violation</div>
                      <div>✓ Active commercial Goods Insurance and E-way bill portal sync ready</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                {wizardStep > 1 ? (
                  <button onClick={() => setWizardStep(prev => prev - 1)} className="btn btn-secondary">
                    Back
                  </button>
                ) : <div />}

                {wizardStep < 8 ? (
                  <button onClick={() => setWizardStep(prev => prev + 1)} className="btn btn-primary">
                    Next Step <ChevronRight size={15} />
                  </button>
                ) : (
                  <button onClick={handleFinishWizard} className="btn btn-primary">
                    <CheckCircle2 size={16} />
                    <span>Confirm & Broadcast Dispatch (₹28,500)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 4. CAPACITY MARKETPLACE */}
        {/* ============================================================ */}
        {businessTab === 'marketplace' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', color: '#ffffff' }}>National Freight Capacity Marketplace</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Contracted spot capacity, return backhauls, and verified fleet operators across India.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {[
                { lane: 'Mumbai → Delhi NCR', vehicle: '32 FT Multi-Axle', available: 'Tomorrow 08:00 AM', rate: '₹28,500', onTime: '96.4%', trucksAvail: 42 },
                { lane: 'Delhi NCR → Jaipur', vehicle: '19 FT Container', available: 'Available Now', rate: '₹14,200', onTime: '98.1%', trucksAvail: 18, isBackhaul: true },
                { lane: 'Bengaluru → Chennai', vehicle: 'LCV 17 FT', available: 'Today 04:00 PM', rate: '₹7,800', onTime: '97.2%', trucksAvail: 29 },
                { lane: 'Vadodara → Bengaluru', vehicle: 'Reefer Cold Chain', available: 'Tomorrow 06:00 AM', rate: '₹42,000', onTime: '99.0%', trucksAvail: 8 },
                { lane: 'Pune → Hyderabad', vehicle: '32 FT Multi-Axle', available: 'Today 08:00 PM', rate: '₹22,400', onTime: '95.5%', trucksAvail: 14 }
              ].map((item, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '15px', color: '#ffffff' }}>{item.lane}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.vehicle}</div>
                    </div>
                    {item.isBackhaul ? (
                      <span className="badge badge-green">32% BACKHAUL SAVINGS</span>
                    ) : (
                      <span className="badge badge-orange">{item.trucksAvail} TRUCKS</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '14px 0', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Available: <strong style={{ color: '#ffffff' }}>{item.available}</strong>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>
                      {item.rate}
                    </div>
                  </div>

                  <button
                    onClick={() => setBusinessTab('create')}
                    className="btn btn-secondary"
                    style={{ width: '100%', fontSize: '12px' }}
                  >
                    Book Capacity on this Lane
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 5. DOCUMENT CENTER */}
        {/* ============================================================ */}
        {businessTab === 'documents' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', color: '#ffffff' }}>Compliance & Document Center</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                National GST E-way bills, Lorry Receipts (LR), and Proof of Delivery (POD) repository.
              </p>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
              <table className="tech-table">
                <thead>
                  <tr>
                    <th>Doc Type</th>
                    <th>Document Number</th>
                    <th>Associated Shipment</th>
                    <th>Issued Date</th>
                    <th>Validation Authority</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: 'E-Way Bill', num: '291048829104-EWB', ship: 'LOS-48291 (Mum → Pun)', date: '2026-09-27', auth: 'NIC GST Portal', status: 'VALID' },
                    { type: 'Lorry Receipt (LR)', num: 'LR-2026-MUM-48291', ship: 'LOS-48291 (Mum → Pun)', date: '2026-09-27', auth: 'Apex Freightways', status: 'VALID' },
                    { type: 'Proof of Delivery (POD)', num: 'POD-48128-SIGN', ship: 'LOS-48128 (Pun → Nsk)', date: '2026-09-26', auth: 'Consignee Receiver (Ramesh Kadam)', status: 'VALID' },
                    { type: 'E-Way Bill', num: '110948291884-EWB', ship: 'LOS-48302 (JNPT → Del)', date: '2026-09-27', auth: 'NIC GST Portal', status: 'VALID' },
                    { type: 'Commercial Invoice', num: 'INV-TM-2026-0881', ship: 'LOS-48291 (Mum → Pun)', date: '2026-09-27', auth: 'Tata Motors Precision Ltd.', status: 'VALID' }
                  ].map((doc, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600, color: '#ffffff' }}>{doc.type}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-orange)' }}>{doc.num}</td>
                      <td>{doc.ship}</td>
                      <td>{doc.date}</td>
                      <td>{doc.auth}</td>
                      <td>
                        <span className="badge badge-green">{doc.status}</span>
                      </td>
                      <td>
                        <button
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--accent-cyan)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                            fontSize: '11px'
                          }}
                        >
                          <Download size={13} /> PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 6. BILLING & SPEND TAB */}
        {/* ============================================================ */}
        {businessTab === 'billing' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', color: '#ffffff' }}>Enterprise Spend & Freight Ledger</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Consolidated billing, FASTag toll charges, TDS adjustments, and GST tax clearance.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CURRENT CYCLE SPEND</div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                  ₹48,20,400
                </div>
                <div style={{ fontSize: '11px', color: '#00e676' }}>Cycle closes in 14 days</div>
              </div>

              <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>FASTAG TOLL REIMBURSEMENTS</div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                  ₹3,84,200
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Automated cashless plaza passes</div>
              </div>

              <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>GST INPUT TAX CREDIT (18%)</div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                  ₹8,67,672
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>E-Invoices pre-reconciled on GSTR-2B</div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 7. LOGISTICS AI COPILOT TAB */}
        {/* ============================================================ */}
        {businessTab === 'ai' && (
          <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="#ff6600" />
                <h2 style={{ fontSize: '22px', color: '#ffffff' }}>Logistics AI Copilot</h2>
                <span className="badge badge-cyan">TELEMETRY REASONING</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Natural language insights into your supply chains, delayed lanes, empty capacity, and route optimization.
              </p>
            </div>

            {/* Quick Prompt Suggestions */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {[
                'Which shipments are delayed?',
                'Which lanes cost us the most?',
                'Find unused vehicle capacity',
                'Optimize tomorrow’s dispatch'
              ].map((pill, i) => (
                <button
                  key={i}
                  onClick={() => handleRunAICopilot(pill)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '11px',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Chat Messages Feed */}
            <div style={{
              flex: 1,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {copilotMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%'
                  }}
                >
                  <div style={{
                    background: msg.sender === 'user' ? 'var(--accent-orange)' : 'rgba(255, 255, 255, 0.05)',
                    color: msg.sender === 'user' ? '#000000' : 'var(--text-primary)',
                    fontWeight: msg.sender === 'user' ? 600 : 400,
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    border: msg.sender === 'ai' ? '1px solid var(--border-subtle)' : 'none'
                  }}>
                    {msg.text}
                  </div>

                  {msg.dataCard && (
                    <div style={{
                      marginTop: '8px',
                      background: 'rgba(10, 14, 22, 0.95)',
                      border: '1px solid rgba(255, 102, 0, 0.4)',
                      borderRadius: '10px',
                      padding: '12px 14px'
                    }}>
                      <div style={{ fontSize: '11px', color: 'var(--accent-orange)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {msg.dataCard.title}
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                        {msg.dataCard.metric}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {msg.dataCard.recommendation}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Form */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Ask Logistics AI (e.g. 'Show our worst-performing lanes', 'Find backhauls')..."
                value={copilotQuery}
                onChange={e => setCopilotQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRunAICopilot('')}
              />
              <button
                onClick={() => handleRunAICopilot('')}
                className="btn btn-primary"
                style={{ padding: '0 20px' }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* SHIPMENT INSPECTOR SLIDE-OVER DRAWER */}
      {/* ============================================================ */}
      {isDrawerOpen && selectedShipment && (
        <div className="drawer-backdrop" onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-orange)' }}>
                  {selectedShipment.id}
                </span>
                <span className={`badge ${selectedShipment.status === 'in_transit' ? 'badge-orange' : 'badge-green'}`}>
                  {selectedShipment.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Route Summary */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '16px', marginBottom: '20px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ORIGIN</div>
                  <div style={{ fontWeight: 700, color: '#ffffff' }}>{selectedShipment.pickup.city}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{selectedShipment.pickup.address}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DESTINATION</div>
                  <div style={{ fontWeight: 700, color: '#ffffff' }}>{selectedShipment.drop.city}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{selectedShipment.drop.address}</div>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span>Progress: {selectedShipment.progressPercent}%</span>
                  <span style={{ color: 'var(--text-muted)' }}>{selectedShipment.currentKm} / {selectedShipment.totalKm} KM</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${selectedShipment.progressPercent}%`, height: '100%', background: '#ff6600' }} />
                </div>
              </div>
            </div>

            {/* Live Telemetry Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>CURRENT SPEED</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                  {selectedShipment.liveSpeedKmh || 62} KM/H
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ESTIMATED FREIGHT</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>
                  ₹{selectedShipment.estimatedCost.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Assigned Driver Details */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Assigned Transporter & Vehicle
              </h4>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#ffffff' }}>{selectedShipment.assignedDriverName || 'Raj Patil'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                      Vehicle: {selectedShipment.assignedVehicleReg || 'MH-15-AX-2841'} ({selectedShipment.vehicleTypeRequired.toUpperCase()})
                    </div>
                  </div>
                  <span className="badge badge-green">VERIFIED PRO</span>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Associated Compliance Documents
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '12px' }}>
                  <span>E-Way Bill: {selectedShipment.eWayBillNumber || '291048829104-EWB'}</span>
                  <span style={{ color: '#00e676', fontWeight: 600 }}>Active</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '12px' }}>
                  <span>Lorry Receipt: {selectedShipment.lorryReceiptNumber || 'LR-2026-MUM-48291'}</span>
                  <span style={{ color: '#00e676', fontWeight: 600 }}>Signed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
