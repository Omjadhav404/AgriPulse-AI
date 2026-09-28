import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { IndiaLogistics3D } from '../3d/IndiaLogistics3D';
import {
  Truck,
  ArrowRight,
  ShieldCheck,
  Cpu,
  BarChart3,
  MapPin,
  CheckCircle2,
  Navigation,
  Clock,
  Compass,
  Zap,
  TrendingUp,
  FileText,
  Smartphone,
  ChevronRight,
  Layers,
  Search,
  SlidersHorizontal,
  Anchor,
  Plane
} from 'lucide-react';

interface LandingPageProps {
  onOpenOnboarding: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenOnboarding }) => {
  const {
    setRole,
    activeShipmentsCount,
    activeVehiclesCount,
    networkNodesCount,
    citiesCount,
    monthlySpendLakhs,
    runAIMatching
  } = useSimulation();

  // Interactive Quote Calculator state
  const [calcOrigin, setCalcOrigin] = useState('Mumbai');
  const [calcDest, setCalcDest] = useState('Delhi NCR');
  const [calcWeight, setCalcWeight] = useState(1200);
  const [calcVehicle, setCalcVehicle] = useState<'truck_32ft' | 'lcv' | 'refrigerated'>('truck_32ft');
  const [matchedQuote, setMatchedQuote] = useState<any>(null);

  const handleSimulateMatch = () => {
    const result = runAIMatching({
      origin: calcOrigin,
      destination: calcDest,
      weightKg: calcWeight,
      vehicleType: calcVehicle
    });
    setMatchedQuote(result.bestMatch);
  };

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'hidden' }}>
      {/* ============================================================ */}
      {/* 1. HERO SECTION WITH 3D INDIA DIGITAL TWIN BACKGROUND */}
      {/* ============================================================ */}
      <section style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 30%, #0d121c 0%, #07090e 100%)',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Persistent 3D Canvas Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.85,
          zIndex: 1
        }}>
          <IndiaLogistics3D height="100%" showOverlayControls={true} />
        </div>

        {/* Foreground Content with Glass Gradient Mask */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '40px 24px',
          width: '100%',
          pointerEvents: 'none' // Allow canvas interaction unless over buttons
        }}>
          <div style={{ maxWidth: '780px', pointerEvents: 'auto' }}>
            {/* Technical Sub-Tag */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 102, 0, 0.12)',
              border: '1px solid rgba(255, 102, 0, 0.35)',
              borderRadius: '30px',
              padding: '6px 16px',
              marginBottom: '24px',
              backdropFilter: 'blur(10px)'
            }}>
              <span className="pulse-dot pulse-dot-orange" />
              <span style={{
                color: 'var(--accent-orange)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)'
              }}>
                NATIONAL B2B LOGISTICS OPERATING SYSTEM
              </span>
            </div>

            {/* Massive Hero Headline */}
            <h1 style={{
              fontSize: 'clamp(40px, 7vw, 76px)',
              fontWeight: 900,
              lineHeight: 1.04,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '20px',
              textShadow: '0 8px 30px rgba(0,0,0,0.8)'
            }}>
              INDIA’S LOGISTICS<br />
              <span style={{
                background: 'linear-gradient(to right, #ff6600, #ffaa00, #ff5500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                OPERATING SYSTEM.
              </span>
            </h1>

            {/* Subheading */}
            <p style={{
              fontSize: 'clamp(17px, 2.2vw, 22px)',
              color: '#cbd5e1',
              lineHeight: 1.45,
              fontWeight: 400,
              maxWidth: '620px',
              marginBottom: '36px',
              textShadow: '0 2px 10px rgba(0,0,0,0.9)'
            }}>
              Businesses create demand. India’s transport network fulfills it. An open operating system connecting shippers with trucks, drivers, and infrastructure.
            </p>

            {/* CTAs */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '14px',
              alignItems: 'center'
            }}>
              <button
                onClick={() => setRole('business')}
                className="btn btn-primary"
                style={{ padding: '14px 28px', fontSize: '15px' }}
              >
                <span>BUILD YOUR LOGISTICS</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={onOpenOnboarding}
                className="btn btn-secondary"
                style={{ padding: '14px 24px', fontSize: '15px' }}
              >
                <span>JOIN THE DRIVER NETWORK</span>
              </button>

              <button
                onClick={() => setRole('control-tower')}
                className="btn"
                style={{
                  background: 'rgba(0, 240, 255, 0.12)',
                  color: '#5ceeff',
                  border: '1px solid rgba(0, 240, 255, 0.35)',
                  padding: '14px 22px',
                  fontSize: '15px',
                  fontWeight: 600
                }}
              >
                <Compass size={16} />
                <span>ENTER LOGISTICS OS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Network Counters Bar */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          background: 'rgba(10, 14, 22, 0.94)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          padding: '20px 24px'
        }}>
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                ACTIVE SHIPMENTS (SIMULATED)
              </div>
              <div style={{ fontSize: '30px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                {activeShipmentsCount.toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: '#00e676', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={12} /> Live transit across Golden Quadrilateral
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                ACTIVE VEHICLES ONLINE
              </div>
              <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>
                {activeVehiclesCount.toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                32FT, LCVs, Reefers, Multi-axle
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                VERIFIED NETWORK NODES
              </div>
              <div style={{ fontSize: '30px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                {networkNodesCount}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Cross-dock hubs, JNPT/Mundra ports
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                INDUSTRIAL CORRIDORS
              </div>
              <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {citiesCount} CITIES
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Tier-1 & Manufacturing MIDC clusters
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. EXPLAIN THE NETWORK: "ONE NETWORK. EVERY MOVEMENT." */}
      {/* ============================================================ */}
      <section style={{
        padding: '100px 24px',
        maxWidth: '1280px',
        margin: '0 auto',
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px auto' }}>
          <span className="badge badge-orange" style={{ marginBottom: '12px' }}>
            END-TO-END SUPPLY CHAIN PIPELINE
          </span>
          <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 50px)', marginBottom: '16px' }}>
            ONE NETWORK.<br />EVERY MOVEMENT.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '17px' }}>
            From factory dispatch to digital proof of delivery. Logistics OS removes manual broker friction with continuous automated telemetry.
          </p>
        </div>

        {/* 7-Stage Flow Visualization */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
          position: 'relative'
        }}>
          {[
            { step: '01', title: 'Business Demand', desc: 'Manufacturer or D2C brand creates shipment specification', icon: '🏭' },
            { step: '02', title: 'AI Matching', desc: 'Algorithm ranks 18 factors: distance, capacity, reliability score', icon: '⚡' },
            { step: '03', title: 'Driver Accepted', desc: 'Single tap acceptance with instant navigation to pickup terminal', icon: '📱' },
            { step: '04', title: 'Dock Loading', desc: 'E-way bill auto-validation & gross axle load confirmation', icon: '📦' },
            { step: '05', title: 'High-Speed Transit', desc: 'Live GPS, FASTag automated tolling, delay mitigation', icon: '🛣️' },
            { step: '06', title: 'Consignee Delivery', desc: 'Digital POD: Photo, signature canvas & consignee OTP', icon: '📍' },
            { step: '07', title: 'Instant Settlement', desc: 'Driver receives immediate UPI clearance; shipper receives invoice', icon: '💳' }
          ].map((item, idx) => (
            <div
              key={item.step}
              className="glass-panel"
              style={{
                padding: '20px 16px',
                textAlign: 'center',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{
                  fontSize: '28px',
                  marginBottom: '10px'
                }}>
                  {item.icon}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--accent-orange)',
                  fontWeight: 700,
                  marginBottom: '6px'
                }}>
                  PHASE {item.step}
                </div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff', marginBottom: '8px' }}>
                  {item.title}
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. BUSINESS OS SHOWCASE & INTERACTIVE QUOTE ENGINE */}
      {/* ============================================================ */}
      <section style={{
        padding: '90px 24px',
        background: 'rgba(13, 17, 26, 0.6)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
            gap: '50px',
            alignItems: 'center'
          }}>
            {/* Left: Product Messaging */}
            <div>
              <span className="badge badge-orange" style={{ marginBottom: '14px' }}>
                FOR ENTERPRISES & SHIPPERS
              </span>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: '18px' }}>
                YOUR BUSINESS.<br />OUR NETWORK.
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6, marginBottom: '24px' }}>
                Replace fragmented transporter phone calls, delayed WhatsApp updates, and paper LR slips with an integrated operating system.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
                {[
                  'Instant Truck Booking & Spot Bidding',
                  'Sub-meter GPS & Temperature Telemetry',
                  'Automated GST E-way Bill Validation',
                  'Predictive Delay & Congestion Rerouting',
                  'Digital Proof of Delivery (POD) Vault',
                  'Enterprise Consolidated Monthly Billing'
                ].map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#e2e8f0' }}>
                    <CheckCircle2 size={16} color="#00e676" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setRole('business')}
                className="btn btn-primary"
                style={{ padding: '12px 24px' }}
              >
                <span>OPEN BUSINESS OS</span>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Right: Live Interactive Capacity & AI Matcher Preview */}
            <div className="glass-panel" style={{ padding: '28px', border: '1px solid rgba(255, 102, 0, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px', color: '#ffffff' }}>Instant Capacity Finder</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Simulate real-time transport dispatch</div>
                </div>
                <span className="badge badge-orange">LIVE ENGINE</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="input-label">Origin City</label>
                  <select
                    className="input-field"
                    value={calcOrigin}
                    onChange={e => setCalcOrigin(e.target.value)}
                  >
                    <option>Mumbai</option>
                    <option>Pune</option>
                    <option>Bengaluru</option>
                    <option>Ahmedabad</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Destination City</label>
                  <select
                    className="input-field"
                    value={calcDest}
                    onChange={e => setCalcDest(e.target.value)}
                  >
                    <option>Delhi NCR</option>
                    <option>Pune</option>
                    <option>Chennai</option>
                    <option>Jaipur</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                <div>
                  <label className="input-label">Cargo Weight (KG)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={calcWeight}
                    onChange={e => setCalcWeight(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="input-label">Vehicle Type</label>
                  <select
                    className="input-field"
                    value={calcVehicle}
                    onChange={e => setCalcVehicle(e.target.value as any)}
                  >
                    <option value="truck_32ft">32 FT Multi-Axle</option>
                    <option value="lcv">LCV (14-17 FT)</option>
                    <option value="refrigerated">Refrigerated (-20°C)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSimulateMatch}
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '16px' }}
              >
                <Cpu size={16} />
                <span>FIND TRANSPORT (AI MATCH)</span>
              </button>

              {/* Match Result Display */}
              {matchedQuote && (
                <div style={{
                  background: 'rgba(255, 102, 0, 0.08)',
                  border: '1px solid rgba(255, 102, 0, 0.4)',
                  borderRadius: '12px',
                  padding: '16px',
                  animation: 'fadeIn 0.2s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="badge badge-green">BEST MATCH</span>
                      <strong style={{ color: '#ffffff', fontSize: '13px' }}>{matchedQuote.recommendedDriverName}</strong>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>
                      ₹{matchedQuote.estimatedCost.toLocaleString()}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    <div>Vehicle: <strong style={{ color: '#ffffff' }}>{matchedQuote.vehicleReg}</strong></div>
                    <div>ETA to Dock: <strong style={{ color: '#00e676' }}>{matchedQuote.etaPickupMins} min</strong></div>
                    <div>Reliability: <strong style={{ color: '#00f0ff' }}>{matchedQuote.reliabilityScore}/100</strong></div>
                  </div>

                  <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: 1.4, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                    ✓ {matchedQuote.reasons[0]}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. AI MATCHING ENGINE: 18 TRANSPARENT PARAMETERS */}
      {/* ============================================================ */}
      <section style={{
        padding: '90px 24px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 50px auto' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>
            ALGORITHMIC TRANSPARENCY
          </span>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 44px)', marginBottom: '14px' }}>
            THE AI MATCHING ENGINE
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Logistics OS eliminates hidden bias. Drivers and vehicles are matched based on documented, auditable operational metrics.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '14px'
        }}>
          {[
            { title: 'Distance & Deadhead', desc: 'Geographic proximity to pickup dock minimizing unladen miles' },
            { title: 'Vehicle Suitability', desc: 'Exact payload capacity, axle rating, volume and loading ramp match' },
            { title: 'Historical On-Time Rate', desc: 'Verified SLA arrival percentage across national trips (e.g. 96.4%)' },
            { title: 'Completion Rate', desc: 'Zero abandonment threshold on confirmed dispatches (e.g. 98.2%)' },
            { title: 'Cancellation Score', desc: 'Penalty-weighted score ensuring high trust for emergency freight' },
            { title: 'Corridor Familiarity', desc: 'Prior verified trips clocked along specific highway corridors (NH-48)' },
            { title: 'Compliance Validity', desc: 'Real-time check of Driving License, RC, Fitness, Insurance, and PUC' },
            { title: 'FASTag & Toll Clearance', desc: 'Pre-linked FASTag balance for uninterrupted toll express transit' },
            { title: 'Return-Load Synergy', desc: 'Matches backhaul demand to eliminate empty return trips for drivers' }
          ].map((param, i) => (
            <div key={i} className="glass-panel" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="pulse-dot pulse-dot-orange" />
                <h4 style={{ fontSize: '14px', color: '#ffffff' }}>{param.title}</h4>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {param.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. DRIVER & FLEET OPERATOR SECTION */}
      {/* ============================================================ */}
      <section style={{
        padding: '90px 24px',
        background: 'linear-gradient(180deg, rgba(13,17,26,0.8) 0%, rgba(7,9,14,1) 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
            gap: '50px',
            alignItems: 'center'
          }}>
            {/* Visual Phone mockup preview */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="mobile-device-frame" style={{ width: '360px', height: '600px', padding: '16px' }}>
                <div className="mobile-notch" />
                <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Driver OS</span>
                  <span className="badge badge-green" style={{ fontSize: '9px' }}>● ONLINE</span>
                </div>

                {/* Simulated Job Card */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 102, 0, 0.4)',
                  borderRadius: '14px',
                  padding: '14px',
                  marginTop: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--accent-orange)', fontWeight: 700 }}>NEW JOB AVAILABLE</span>
                    <strong style={{ fontSize: '16px', color: '#ffffff' }}>₹4,800</strong>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>Mumbai (Vashi) → Pune (Bhosari)</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    154 KM • 850 KG Gearboxes • LCV Required
                  </div>
                  <div style={{
                    marginTop: '10px',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    background: 'rgba(0, 230, 118, 0.1)',
                    fontSize: '10px',
                    color: '#00e676'
                  }}>
                    Why this job? Matches your vehicle & preferred corridor.
                  </div>
                </div>

                {/* Earnings card */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '14px',
                  marginTop: '12px'
                }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>TODAY'S EARNINGS</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>₹2,840</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    186 KM Clocked • 4 Trips Completed
                  </div>
                </div>
              </div>
            </div>

            {/* Content for drivers */}
            <div>
              <span className="badge badge-green" style={{ marginBottom: '14px' }}>
                FOR DRIVERS & FLEET OWNERS
              </span>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: '16px' }}>
                YOUR VEHICLE.<br />YOUR ROUTE.<br />YOUR BUSINESS.
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6, marginBottom: '24px' }}>
                Turn available driving capacity into steady, transparent income. No commission games. Direct consignee payments via instant UPI settlement.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(0, 230, 118, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Zap size={18} color="#00e676" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', color: '#ffffff' }}>Blinkit-Style Instant Job Acceptance</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Clear, upfront rates and direct highway corridors right on your phone.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255, 102, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TrendingUp size={18} color="#ff6600" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', color: '#ffffff' }}>Return-Load Auto Matching</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Never drive empty. System pre-matches return consignments before you even arrive at your destination.</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  onClick={onOpenOnboarding}
                  className="btn btn-primary"
                  style={{ padding: '12px 24px' }}
                >
                  <Truck size={16} />
                  <span>BECOME A DRIVER</span>
                </button>

                <button
                  onClick={() => setRole('fleet')}
                  className="btn btn-secondary"
                  style={{ padding: '12px 22px' }}
                >
                  <span>I OWN A FLEET (FLEET OS)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. FINAL CALL TO ACTION */}
      {/* ============================================================ */}
      <section style={{
        padding: '100px 24px',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 50%, rgba(255, 102, 0, 0.12) 0%, rgba(7, 9, 14, 1) 70%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 900, marginBottom: '18px' }}>
            THE NETWORK<br />THAT MOVES INDIA.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '36px', maxWidth: '600px', margin: '0 auto 36px auto' }}>
            One operating system connecting businesses, vehicles, drivers and logistics infrastructure.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setRole('business')}
              className="btn btn-primary"
              style={{ padding: '14px 30px', fontSize: '15px' }}
            >
              <span>BUILD YOUR SHIPMENT</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={onOpenOnboarding}
              className="btn btn-secondary"
              style={{ padding: '14px 26px', fontSize: '15px' }}
            >
              <span>BECOME A DRIVER</span>
            </button>

            <button
              onClick={() => setRole('fleet')}
              className="btn"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid var(--border-medium)',
                padding: '14px 24px',
                fontSize: '15px',
                fontWeight: 600
              }}
            >
              <span>MANAGE YOUR FLEET</span>
            </button>
          </div>

          <div style={{ marginTop: '50px', fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            LOGISTICS OS • B2B INDUSTRIAL FREIGHT SYSTEM • MOVE INDIA. BETTER.
          </div>
        </div>
      </section>
    </div>
  );
};
