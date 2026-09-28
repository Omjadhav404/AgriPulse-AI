import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import confetti from 'canvas-confetti';
import {
  Truck,
  MapPin,
  Clock,
  DollarSign,
  Award,
  Shield,
  ChevronRight,
  Phone,
  Navigation,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
  Layers,
  ArrowRight,
  Zap,
  Sliders,
  Smartphone,
  Maximize2,
  Minimize2,
  RefreshCw,
  Camera,
  PenTool,
  KeyRound
} from 'lucide-react';

export const DriverOS: React.FC = () => {
  const {
    driverTab,
    setDriverTab,
    driver,
    toggleDriverOnline,
    jobOffers,
    acceptJob,
    activeDeliveryStage,
    activeDeliveryShipment,
    activeDeliverySpeed,
    activeDeliveryKmCovered,
    advanceDriverDeliveryStage,
    completeDeliveryWithProof,
    earnings,
    withdrawDriverBalance,
    earnedAmountCelebration,
    setEarnedAmountCelebration
  } = useSimulation();

  // Mobile frame wrapper toggle (for desktop view testing)
  const [useDeviceFrame, setUseDeviceFrame] = useState(false);

  // Proof of delivery modal state
  const [showPODModal, setShowPODModal] = useState(false);
  const [podPhotoUploaded, setPodPhotoUploaded] = useState(true);
  const [podSignatureDone, setPodSignatureDone] = useState(true);
  const [podOtp, setPodOtp] = useState('4821');
  const [consigneeName, setConsigneeName] = useState('Ramesh Kadam (Store Manager)');

  // Return loads alert dismiss/view
  const [showReturnLoadAlert, setShowReturnLoadAlert] = useState(true);

  // Trigger confetti when earned celebration is set
  const handleTriggerPODSubmit = () => {
    setShowPODModal(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    completeDeliveryWithProof({
      receivedBy: consigneeName,
      otp: podOtp
    });
  };

  const content = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: useDeviceFrame ? '800px' : 'calc(100vh - 64px)',
      background: '#090b10',
      color: '#ffffff',
      position: 'relative'
    }}>
      {/* Top Header Bar */}
      <div style={{
        padding: '16px 20px',
        background: 'rgba(15, 20, 30, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 200
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff6600, #ffaa00)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '16px',
            color: '#000000'
          }}>
            RP
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800 }}>Good morning, {driver.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {driver.assignedVehicleId === 'veh-01' ? 'MH-15-AX-2841 (32 FT)' : 'LCV / 19 FT'}
            </div>
          </div>
        </div>

        {/* Online / Offline Status Button */}
        <button
          onClick={toggleDriverOnline}
          style={{
            background: driver.status === 'online' ? 'rgba(0, 230, 118, 0.15)' : 'rgba(255, 51, 102, 0.15)',
            border: `1px solid ${driver.status === 'online' ? '#00e676' : '#ff3366'}`,
            borderRadius: '24px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <span className={`pulse-dot ${driver.status === 'online' ? 'pulse-dot-green' : ''}`} style={{ background: driver.status === 'online' ? '#00e676' : '#ff3366' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: driver.status === 'online' ? '#00e676' : '#ff3366' }}>
            {driver.status.toUpperCase()}
          </span>
        </button>
      </div>

      {/* Frame Toggle Button for desktop convenience */}
      <div style={{ padding: '8px 20px', background: 'rgba(255, 255, 255, 0.02)', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <button
          onClick={() => setUseDeviceFrame(!useDeviceFrame)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
        >
          {useDeviceFrame ? <Maximize2 size={12} /> : <Smartphone size={12} />}
          <span>{useDeviceFrame ? 'Full Width View' : 'Preview in Phone Frame'}</span>
        </button>
      </div>

      {/* Main Body Content based on active tab */}
      <div style={{ flex: 1, padding: '18px', overflowY: 'auto', paddingBottom: '90px' }}>
        {/* ============================================================ */}
        {/* 1. HOME TAB */}
        {/* ============================================================ */}
        {driverTab === 'home' && (
          <div>
            {/* Celebration Card if just delivered */}
            {earnedAmountCelebration && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(0, 230, 118, 0.2) 0%, rgba(13, 17, 26, 0.95) 100%)',
                border: '1px solid #00e676',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '16px',
                textAlign: 'center',
                animation: 'fadeIn 0.3s ease'
              }}>
                <div style={{ fontSize: '12px', color: '#00e676', fontWeight: 700, textTransform: 'uppercase' }}>
                  DELIVERY COMPLETED SUCCESSFULLY
                </div>
                <div style={{ fontSize: '36px', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)', margin: '6px 0' }}>
                  +₹{earnedAmountCelebration.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                  Cleared to linked UPI account ({driver.name})
                </div>
                <button
                  onClick={() => setEarnedAmountCelebration(null)}
                  className="btn btn-secondary"
                  style={{ marginTop: '12px', padding: '6px 14px', fontSize: '11px' }}
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Return Load Opportunity Alert */}
            {showReturnLoadAlert && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 102, 0, 0.15) 0%, rgba(15, 20, 30, 0.95) 100%)',
                border: '1px solid var(--accent-orange)',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={16} color="#ff6600" />
                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-orange)' }}>
                      RETURN LOAD PRE-MATCHED
                    </span>
                  </div>
                  <button
                    onClick={() => setShowReturnLoadAlert(false)}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '11px' }}
                  >
                    ✕
                  </button>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
                  Pune (Bhosari) → Nashik (Ambad)
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 10px 0' }}>
                  Avoid driving back empty. Earn +₹3,200 on return leg.
                </div>
                <button
                  onClick={() => setDriverTab('jobs')}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '8px', fontSize: '12px' }}
                >
                  View Return Load →
                </button>
              </div>
            )}

            {/* Available Jobs Banner (Blinkit simplicity) */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '18px',
              marginBottom: '18px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>AVAILABLE JOBS</div>
                  <div style={{ fontSize: '12px', color: 'var(--accent-orange)' }}>
                    {jobOffers.length} nearby jobs ready for pickup
                  </div>
                </div>
                <button
                  onClick={() => setDriverTab('jobs')}
                  className="btn btn-primary"
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  VIEW JOBS
                </button>
              </div>
            </div>

            {/* Today's Operational Telemetry */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '18px'
            }}>
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>TODAY'S EARNINGS</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                  ₹{earnings.today.toLocaleString()}
                </div>
                <div style={{ fontSize: '10px', color: '#00e676', marginTop: '2px' }}>
                  +₹620 Toll voucher refunded
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>TODAY'S DISTANCE</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>
                  {earnings.kmToday} KM
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Highway NH-48 & Expressway
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DELIVERIES COMPLETED</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                  {earnings.deliveriesToday}
                </div>
                <div style={{ fontSize: '10px', color: '#00e676', marginTop: '2px' }}>
                  Zero consignee disputes
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ON-TIME SLA RATE</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#00e676', fontFamily: 'var(--font-mono)' }}>
                  96.4%
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Pro Driver Priority Level
                </div>
              </div>
            </div>

            {/* Quick jump to active delivery if in progress */}
            {activeDeliveryShipment && (
              <div
                onClick={() => setDriverTab('active-delivery')}
                style={{
                  background: 'rgba(255, 102, 0, 0.08)',
                  border: '1px solid rgba(255, 102, 0, 0.4)',
                  borderRadius: '14px',
                  padding: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="pulse-dot pulse-dot-orange" />
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-orange)' }}>
                      TRIP IN PROGRESS: {activeDeliveryShipment.id}
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff', marginTop: '4px' }}>
                    {activeDeliveryShipment.pickup.city} → {activeDeliveryShipment.drop.city}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Stage: {activeDeliveryStage.replace('_', ' ').toUpperCase()} ({activeDeliveryKmCovered}/{activeDeliveryShipment.totalKm} KM)
                  </div>
                </div>
                <ChevronRight size={18} color="#ff6600" />
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* 2. JOBS FEED (Blinkit-Style Instant Operations) */}
        {/* ============================================================ */}
        {driverTab === 'jobs' && (
          <div>
            <div style={{ marginBottom: '14px' }}>
              <h2 style={{ fontSize: '20px', color: '#ffffff' }}>Available Consignments</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Matched for your registered vehicle ({driver.assignedVehicleId === 'veh-01' ? '32 FT Multi-Axle' : 'LCV'}).
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {jobOffers.map(job => (
                <div
                  key={job.id}
                  className="glass-panel"
                  style={{
                    padding: '18px',
                    border: '1px solid rgba(255, 102, 0, 0.3)',
                    background: 'rgba(16, 21, 32, 0.95)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span className="badge badge-orange" style={{ marginBottom: '6px' }}>HIGH DEMAND SPOT</span>
                      <h3 style={{ fontSize: '17px', color: '#ffffff' }}>
                        {job.originCity} → {job.destinationCity}
                      </h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>
                        ₹{job.payoutAmount.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '10px', color: '#00e676' }}>Instant UPI Payout</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)', margin: '12px 0' }}>
                    <div>Distance: <strong style={{ color: '#ffffff' }}>{job.distanceKm} KM</strong></div>
                    <div>Payload: <strong style={{ color: '#ffffff' }}>{job.weightKg} KG</strong></div>
                    <div>Pickup: <strong style={{ color: '#00e676' }}>{job.pickupTime}</strong></div>
                  </div>

                  {/* Why this job? Transparency box */}
                  <div style={{
                    background: 'rgba(0, 230, 118, 0.08)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    border: '1px solid rgba(0, 230, 118, 0.25)',
                    marginBottom: '14px'
                  }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#00e676', textTransform: 'uppercase', marginBottom: '4px' }}>
                      WHY THIS JOB?
                    </div>
                    <ul style={{ fontSize: '11px', color: '#cbd5e1', paddingLeft: '16px', lineHeight: 1.4 }}>
                      {job.whyThisJobReasons.slice(0, 3).map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Big Touch-Friendly Action Button */}
                  <button
                    onClick={() => acceptJob(job.id)}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '12px', fontSize: '15px' }}
                  >
                    <span>ACCEPT JOB (₹{job.payoutAmount.toLocaleString()})</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. ACTIVE DELIVERY LIVE HUD */}
        {/* ============================================================ */}
        {driverTab === 'active-delivery' && activeDeliveryShipment && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span className="badge badge-orange">{activeDeliveryShipment.id}</span>
                <h2 style={{ fontSize: '18px', color: '#ffffff', marginTop: '4px' }}>
                  {activeDeliveryShipment.pickup.city} → {activeDeliveryShipment.drop.city}
                </h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-green">LIVE GPS TRACKING</span>
              </div>
            </div>

            {/* Speedometer & Progress Dial */}
            <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CURRENT HIGHWAY SPEED</div>
              <div style={{ fontSize: '48px', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                {activeDeliveryStage === 'in_transit' ? activeDeliverySpeed : 0}
                <span style={{ fontSize: '16px', color: 'var(--text-muted)', marginLeft: '4px' }}>KM/H</span>
              </div>

              {/* Progress */}
              <div style={{ margin: '14px 0 6px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span>Distance Covered: {activeDeliveryKmCovered} KM</span>
                  <span style={{ color: 'var(--text-muted)' }}>Total: {activeDeliveryShipment.totalKm} KM</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(100, Math.round((activeDeliveryKmCovered / activeDeliveryShipment.totalKm) * 100))}%`,
                    height: '100%',
                    background: 'linear-gradient(to right, #ff6600, #ffaa00)'
                  }} />
                </div>
              </div>
            </div>

            {/* Stages Stepper */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
                CURRENT DELIVERY STAGE
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-orange)' }}>
                {activeDeliveryStage.replace(/_/g, ' ').toUpperCase()}
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {activeDeliveryStage === 'heading_to_pickup' && 'Navigate to Turbhe Vashi terminal for cargo bay check-in.'}
                {activeDeliveryStage === 'arrived_at_pickup' && 'Vehicle checked in. Awaiting forklift dock clearance.'}
                {activeDeliveryStage === 'loading' && 'Cargo loading underway. Verify straps and pneumatic locks.'}
                {activeDeliveryStage === 'in_transit' && 'On highway transit. Mumbai-Pune Expressway toll auto-deducted.'}
                {activeDeliveryStage === 'arrived_at_destination' && 'Arrived at Bhosari MIDC. Request consignee verification.'}
                {activeDeliveryStage === 'delivered' && 'Consignment completed. Proof of delivery uploaded.'}
              </div>
            </div>

            {/* Big Action Button dynamically updates by state */}
            {activeDeliveryStage === 'heading_to_pickup' && (
              <button
                onClick={advanceDriverDeliveryStage}
                className="btn btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: 800 }}
              >
                ARRIVED AT PICKUP DOCK
              </button>
            )}

            {activeDeliveryStage === 'arrived_at_pickup' && (
              <button
                onClick={advanceDriverDeliveryStage}
                className="btn btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: 800 }}
              >
                START LOADING CARGO
              </button>
            )}

            {activeDeliveryStage === 'loading' && (
              <button
                onClick={advanceDriverDeliveryStage}
                className="btn btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: 800 }}
              >
                LOAD CONFIRMED (START TRIP)
              </button>
            )}

            {activeDeliveryStage === 'in_transit' && (
              <button
                onClick={advanceDriverDeliveryStage}
                className="btn btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: 800 }}
              >
                ARRIVED AT DESTINATION
              </button>
            )}

            {activeDeliveryStage === 'arrived_at_destination' && (
              <button
                onClick={() => setShowPODModal(true)}
                className="btn btn-success"
                style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: 800 }}
              >
                CONFIRM PROOF OF DELIVERY
              </button>
            )}

            {activeDeliveryStage === 'delivered' && (
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <span className="badge badge-green" style={{ fontSize: '13px', padding: '6px 14px' }}>
                  ✓ DELIVERY COMPLETED
                </span>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* 4. EARNINGS DASHBOARD */}
        {/* ============================================================ */}
        {driverTab === 'earnings' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', color: '#ffffff' }}>Earnings Dashboard</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Transparent payout ledger with zero hidden deductions.
              </p>
            </div>

            {/* Balances */}
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AVAILABLE FOR INSTANT WITHDRAWAL</div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#00e676', fontFamily: 'var(--font-mono)', margin: '4px 0 14px 0' }}>
                ₹{earnings.availableBalance.toLocaleString()}
              </div>

              <button
                onClick={withdrawDriverBalance}
                className="btn btn-success"
                style={{ width: '100%', padding: '10px', fontSize: '13px' }}
                disabled={earnings.availableBalance <= 0}
              >
                Instant UPI Withdrawal to HDFC Account
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
              <div className="glass-panel" style={{ padding: '12px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>TODAY</div>
                <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  ₹{earnings.today.toLocaleString()}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '12px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>THIS WEEK</div>
                <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  ₹{earnings.thisWeek.toLocaleString()}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '12px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>THIS MONTH</div>
                <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  ₹{earnings.thisMonth.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Itemized Calculation Transparency */}
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
                Trip Financial Breakdown
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Gross Freight Charges:</span>
                  <span style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>+₹{earnings.breakdown.grossFreight}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Diesel Fuel Allowance:</span>
                  <span style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>+₹{earnings.breakdown.fuelAllowance}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>FASTag Toll Reimbursement:</span>
                  <span style={{ color: '#00e676', fontFamily: 'var(--font-mono)' }}>+₹{earnings.breakdown.tollReimbursement}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                  <span style={{ fontWeight: 700 }}>Net Driver Payout:</span>
                  <span style={{ fontWeight: 800, color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>
                    ₹{earnings.breakdown.netPayout}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 5. PERFORMANCE & TRUST PROFILE */}
        {/* ============================================================ */}
        {driverTab === 'performance' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', color: '#ffffff' }}>Driver Trust & Reliability Profile</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Auditable metrics based on completed trips. Never arbitrary ratings.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '20px', marginBottom: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>RELIABILITY SCORE</div>
              <div style={{ fontSize: '56px', fontWeight: 900, color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>
                {driver.performance.score}
                <span style={{ fontSize: '20px', color: 'var(--text-muted)' }}>/100</span>
              </div>
              <span className="badge badge-green" style={{ fontSize: '12px' }}>
                LEVEL: {driver.performance.level} DRIVER
              </span>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '6px' }}>
                Last updated {driver.performance.lastUpdated}
              </div>
            </div>

            {/* Score Factor Breakdown */}
            <div className="glass-panel" style={{ padding: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>
                How Your Score is Calculated (100% Transparent):
              </div>

              {[
                { label: 'On-Time Completion (40% Weight)', val: `${driver.performance.onTimeRate}%` },
                { label: 'Completion Rate (25% Weight)', val: `${driver.performance.completionRate}%` },
                { label: 'Low Cancellation Rate (15% Weight)', val: `${driver.performance.cancellationRate}%` },
                { label: 'Document Compliance (10% Weight)', val: '100% Valid' },
                { label: 'Shipper / Business Feedback (10% Weight)', val: `${driver.performance.feedbackRating}/5.0` }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <strong style={{ color: '#ffffff' }}>{item.val}</strong>
                </div>
              ))}
            </div>

            {/* Document Expiry Warnings */}
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
                Compliance & Fitness Status
              </div>
              <div style={{
                background: 'rgba(255, 179, 0, 0.1)',
                border: '1px solid #ffb300',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '11px',
                color: '#ffc947',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={16} />
                <span>RTO Fitness Certificate expires in 9 days. Upload renewal before 2026-10-07.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Proof of Delivery (POD) Modal */}
      {showPODModal && (
        <div className="modal-overlay">
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-medium)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '460px',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '8px' }}>
              Digital Proof of Delivery (POD)
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Upload consignee signature and delivery photo to clear instant UPI payout.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label className="input-label">Consignee Receiver Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={consigneeName}
                  onChange={e => setConsigneeName(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Consignee OTP Verification</label>
                <input
                  type="text"
                  className="input-field"
                  value={podOtp}
                  onChange={e => setPodOtp(e.target.value)}
                />
              </div>

              {/* Photo & Signature Checks */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div
                  onClick={() => setPodPhotoUploaded(!podPhotoUploaded)}
                  style={{
                    background: podPhotoUploaded ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${podPhotoUploaded ? '#00e676' : 'var(--border-subtle)'}`,
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Camera size={20} color={podPhotoUploaded ? '#00e676' : '#94a3b8'} style={{ margin: '0 auto 4px auto' }} />
                  <div style={{ fontSize: '11px', fontWeight: 600 }}>{podPhotoUploaded ? 'Photo Captured' : 'Take Photo'}</div>
                </div>

                <div
                  onClick={() => setPodSignatureDone(!podSignatureDone)}
                  style={{
                    background: podSignatureDone ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${podSignatureDone ? '#00e676' : 'var(--border-subtle)'}`,
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <PenTool size={20} color={podSignatureDone ? '#00e676' : '#94a3b8'} style={{ margin: '0 auto 4px auto' }} />
                  <div style={{ fontSize: '11px', fontWeight: 600 }}>{podSignatureDone ? 'Signature Signed' : 'Sign on Screen'}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowPODModal(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={handleTriggerPODSubmit}
                className="btn btn-success"
                style={{ flex: 1.5 }}
              >
                Confirm POD & Collect ₹4,800
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Thumb Navigation Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: useDeviceFrame ? 'auto' : 0,
        right: useDeviceFrame ? 'auto' : 0,
        width: useDeviceFrame ? '100%' : '100%',
        maxWidth: useDeviceFrame ? '440px' : '100%',
        background: 'rgba(11, 14, 20, 0.98)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 0',
        zIndex: 300
      }}>
        {[
          { id: 'home', label: 'Home', icon: <Truck size={18} /> },
          { id: 'jobs', label: 'Jobs', icon: <Layers size={18} />, badge: `${jobOffers.length}` },
          { id: 'active-delivery', label: 'Active Trip', icon: <Navigation size={18} /> },
          { id: 'earnings', label: 'Earnings', icon: <DollarSign size={18} /> },
          { id: 'performance', label: 'Profile', icon: <Award size={18} /> }
        ].map(tab => {
          const isActive = driverTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setDriverTab(tab.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: isActive ? 'var(--accent-orange)' : '#64748b',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                position: 'relative',
                padding: '4px 8px'
              }}
            >
              {tab.icon}
              <span style={{ fontSize: '10px', fontWeight: isActive ? 700 : 500 }}>{tab.label}</span>
              {tab.badge && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '6px',
                  background: '#ff6600',
                  color: '#000000',
                  borderRadius: '10px',
                  fontSize: '9px',
                  fontWeight: 800,
                  padding: '1px 5px'
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return useDeviceFrame ? (
    <div style={{ padding: '30px 20px', background: '#05070a', display: 'flex', justifyContent: 'center' }}>
      <div className="mobile-device-frame">
        <div className="mobile-notch" />
        {content}
      </div>
    </div>
  ) : (
    content
  );
};
