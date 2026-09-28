import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { IndiaLogistics3D } from '../3d/IndiaLogistics3D';
import {
  Compass,
  Radio,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Cpu,
  Layers,
  MapPin,
  TrendingUp,
  Truck,
  Activity,
  ShieldAlert,
  ArrowRight,
  Maximize2
} from 'lucide-react';

export const ControlTower: React.FC = () => {
  const {
    activeShipmentsCount,
    activeVehiclesCount,
    networkNodes,
    alerts,
    dismissAlert,
    aiRecommendation,
    assignVehicleToShipment,
    shipments,
    vehicles
  } = useSimulation();

  const [selectedHub, setSelectedHub] = useState<any>(networkNodes[0]);
  const [assignedSuccess, setAssignedSuccess] = useState(false);

  const handleDispatchAI = () => {
    assignVehicleToShipment('LOS-48302', 'veh-01');
    setAssignedSuccess(true);
    setTimeout(() => setAssignedSuccess(false), 3000);
  };

  return (
    <div style={{
      height: 'calc(100vh - 64px)',
      background: '#07090e',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* 3D Map takes whole canvas behind */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <IndiaLogistics3D
          height="100%"
          showOverlayControls={true}
          onCitySelect={(cityName) => {
            const found = networkNodes.find(n => n.city.toLowerCase().includes(cityName.toLowerCase()));
            if (found) setSelectedHub(found);
          }}
        />
      </div>

      {/* Floating Control Tower Top Bar */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        margin: '16px 20px',
        background: 'rgba(10, 14, 22, 0.88)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '14px',
        padding: '12px 20px',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'rgba(255, 102, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-orange)'
          }}>
            <Radio size={20} className="pulse-dot-orange" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
                National Logistics Control Tower
              </span>
              <span className="badge badge-green">LIVE TELEMETRY STREAM</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Monitoring 42 industrial corridors • NH-48 & NH-44 Expressways
            </div>
          </div>
        </div>

        {/* Global Live Ticker counters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '12px' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Active Shipments: </span>
            <strong style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{activeShipmentsCount.toLocaleString()}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Active Vehicles: </span>
            <strong style={{ color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>{activeVehiclesCount.toLocaleString()}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Active Alerts: </span>
            <strong style={{ color: '#ff3366', fontFamily: 'var(--font-mono)' }}>{alerts.length} Incidents</strong>
          </div>
        </div>
      </div>

      {/* Floating HUD Panels on Left and Right */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        pointerEvents: 'none',
        padding: '0 20px 20px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '20px'
      }}>
        {/* Left Side: AI Dispatch Queue & Node Telemetry */}
        <div style={{
          width: '380px',
          maxHeight: 'calc(100vh - 180px)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          pointerEvents: 'auto'
        }}>
          {/* AI Dispatch Center Card */}
          <div className="glass-panel" style={{ padding: '18px', border: '1px solid rgba(255, 102, 0, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu size={16} color="#ff6600" />
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>AI Dispatch Recommendations</span>
              </div>
              <span className="badge badge-orange">Unassigned: 42</span>
            </div>

            <div style={{
              background: 'rgba(255, 102, 0, 0.08)',
              border: '1px solid rgba(255, 102, 0, 0.25)',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '12px'
            }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                URGENT SHIPMENT: LOS-48302
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                Mumbai (JNPT) → Delhi NCR (Manesar)
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 10px 0' }}>
                1,200 KG • 32 FT Required • Delivery in 28 hrs
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Recommended:</span>
                  <strong style={{ color: '#00e676' }}>{aiRecommendation.recommendedDriverName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '2px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Vehicle & ETA:</span>
                  <strong style={{ color: '#ffffff' }}>{aiRecommendation.vehicleReg} ({aiRecommendation.etaPickupMins}m ETA)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '2px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Reliability Score:</span>
                  <strong style={{ color: '#00f0ff' }}>{aiRecommendation.reliabilityScore}/100</strong>
                </div>
              </div>

              {assignedSuccess ? (
                <div style={{ background: 'rgba(0, 230, 118, 0.2)', border: '1px solid #00e676', borderRadius: '6px', padding: '8px', textAlign: 'center', color: '#00e676', fontSize: '12px', fontWeight: 700 }}>
                  ✓ DISPATCH CONFIRMED TO RAJ PATIL
                </div>
              ) : (
                <button
                  onClick={handleDispatchAI}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '8px', fontSize: '12px' }}
                >
                  Confirm AI Dispatch (₹{aiRecommendation.estimatedCost.toLocaleString()})
                </button>
              )}
            </div>
          </div>

          {/* Selected Node Telemetry */}
          {selectedHub && (
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                FOCUSED LOGISTICS NODE
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: '4px 0' }}>
                {selectedHub.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                {selectedHub.city}, {selectedHub.state} ({selectedHub.type.toUpperCase()})
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '6px' }}>
                  <div style={{ color: 'var(--text-muted)' }}>CAPACITY</div>
                  <strong style={{ color: '#ffffff' }}>{selectedHub.capacityTons.toLocaleString()} Tons</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '6px' }}>
                  <div style={{ color: 'var(--text-muted)' }}>UTILIZATION</div>
                  <strong style={{ color: selectedHub.currentUtilizationPercent > 85 ? '#ff3366' : '#00e676' }}>
                    {selectedHub.currentUtilizationPercent}%
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Real-time Incident Feed & Supply Surges */}
        <div style={{
          width: '380px',
          maxHeight: 'calc(100vh - 180px)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          pointerEvents: 'auto'
        }}>
          {/* Incident stream */}
          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={16} color="#ff3366" />
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>Active Telemetry Incidents</span>
              </div>
              <span className="badge badge-red">{alerts.length} ALERTS</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {alerts.map(alt => (
                <div
                  key={alt.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderLeft: `3px solid ${alt.severity === 'critical' ? '#ff3366' : alt.severity === 'warning' ? '#ffb300' : '#00e676'}`,
                    borderRadius: '8px',
                    padding: '10px 12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>{alt.title}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{alt.timestamp}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '2px 0 6px 0' }}>
                    {alt.description}
                  </p>
                  <button
                    onClick={() => dismissAlert(alt.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-orange)', fontSize: '10px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  >
                    Resolve Incident
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Supply Surge Heatmap Card */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <TrendingUp size={16} color="#00e676" />
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>Demand Hotspots & Surges</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '10px' }}>
              AI Model Prediction: High demand on Mumbai → Pune corridor. +34 additional vehicles will be required between 18:00 and 22:00.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--accent-green)', fontWeight: 600 }}>
              <span>Surge multiplier: +12%</span>
              <span>Available in radius: 18 trucks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
