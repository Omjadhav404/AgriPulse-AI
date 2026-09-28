import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { AppRole } from '../../types';
import {
  Truck,
  Activity,
  Shield,
  Layers,
  Compass,
  Bell,
  UserCheck,
  ChevronDown,
  ExternalLink,
  Smartphone,
  Server
} from 'lucide-react';

interface GlobalHeaderProps {
  onOpenOnboarding: () => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ onOpenOnboarding }) => {
  const {
    role,
    setRole,
    activeShipmentsCount,
    activeVehiclesCount,
    alerts,
    dismissAlert
  } = useSimulation();

  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const rolesConfig: { id: AppRole; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'marketing', label: 'Network Showcase', icon: <Layers size={14} /> },
    { id: 'business', label: 'Business OS', icon: <Server size={14} />, badge: 'B2B' },
    { id: 'driver', label: 'Driver OS', icon: <Smartphone size={14} />, badge: 'Mobile' },
    { id: 'fleet', label: 'Fleet OS', icon: <Truck size={14} />, badge: '24 Trucks' },
    { id: 'control-tower', label: 'Control Tower', icon: <Compass size={14} />, badge: 'Live 3D' }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 500,
      background: 'rgba(7, 9, 14, 0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0 20px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Brand Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div
          onClick={() => setRole('marketing')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          {/* Logo Mark */}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #ff6600 0%, #ff8800 50%, #ffaa00 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(255, 102, 0, 0.4)'
          }}>
            <Truck size={20} color="#000000" strokeWidth={2.5} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '17px',
                letterSpacing: '-0.02em',
                color: '#ffffff'
              }}>
                LOGISTICS<span style={{ color: 'var(--accent-orange)' }}>OS</span>
              </span>
              <span className="badge badge-orange" style={{ padding: '2px 6px', fontSize: '10px' }}>
                INDIA
              </span>
            </div>
            <div style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase'
            }}>
              MOVE INDIA. BETTER.
            </div>
          </div>
        </div>

        {/* Live Network Telemetry Ticker */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '16px',
          background: 'rgba(18, 24, 38, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '20px',
          padding: '4px 14px',
          fontSize: '11px'
        }} className="telemetry-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="pulse-dot pulse-dot-green" />
            <span style={{ color: '#00e676', fontWeight: 600 }}>LIVE SIMULATION</span>
          </div>
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
          <div style={{ color: 'var(--text-secondary)' }}>
            Active Shipments: <strong style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{activeShipmentsCount.toLocaleString()}</strong>
          </div>
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
          <div style={{ color: 'var(--text-secondary)' }}>
            Vehicles: <strong style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{activeVehiclesCount.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* Main Operating System Role Tabs */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(13, 17, 26, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '3px',
        gap: '4px'
      }}>
        {rolesConfig.map(r => {
          const isActive = role === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 13px',
                borderRadius: '8px',
                background: isActive ? 'rgba(255, 102, 0, 0.18)' : 'transparent',
                color: isActive ? '#ff6600' : 'var(--text-secondary)',
                border: isActive ? '1px solid rgba(255, 102, 0, 0.4)' : '1px solid transparent',
                fontSize: '12px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {r.icon}
              <span>{r.label}</span>
              {r.badge && (
                <span style={{
                  fontSize: '9px',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  background: isActive ? '#ff6600' : 'rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#000000' : 'var(--text-muted)',
                  fontWeight: 700
                }}>
                  {r.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Actions: Persona Selector, Alert Bell & Onboarding CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Alerts Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
            style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: alerts.length > 0 ? '#ffb300' : 'var(--text-secondary)',
              cursor: 'pointer'
            }}
            title="Network Incidents & Telemetry Alerts"
          >
            <Bell size={16} />
            {alerts.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                background: '#ff3366',
                color: '#ffffff',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '9px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {alerts.length}
              </span>
            )}
          </button>

          {/* Alerts Dropdown Modal */}
          {showAlertsDropdown && (
            <div style={{
              position: 'absolute',
              top: '44px',
              right: 0,
              width: '360px',
              background: 'rgba(15, 20, 30, 0.97)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(20px)',
              padding: '16px',
              zIndex: 1000
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '10px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '10px'
              }}>
                <span style={{ fontWeight: 700, fontSize: '13px' }}>System Network Alerts</span>
                <span className="badge badge-amber">{alerts.length} Active</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
                {alerts.map(a => (
                  <div
                    key={a.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderLeft: `3px solid ${a.severity === 'critical' ? '#ff3366' : a.severity === 'warning' ? '#ffb300' : '#00e676'}`,
                      borderRadius: '6px',
                      padding: '8px 10px',
                      fontSize: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, color: '#ffffff' }}>{a.title}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{a.timestamp}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '11px', lineHeight: 1.4, margin: '2px 0 6px 0' }}>
                      {a.description}
                    </p>
                    <button
                      onClick={() => dismissAlert(a.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent-orange)',
                        fontSize: '10px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      Dismiss Alert
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Demo Persona Switcher */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <UserCheck size={14} color="#ff6600" />
            <span style={{ display: 'inline-block' }}>Demo Persona</span>
            <ChevronDown size={12} />
          </button>

          {showPersonaMenu && (
            <div style={{
              position: 'absolute',
              top: '44px',
              right: 0,
              width: '260px',
              background: 'rgba(15, 20, 30, 0.97)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(20px)',
              padding: '10px',
              zIndex: 1000
            }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '6px 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Select Active Workspace
              </div>
              <button
                onClick={() => { setRole('business'); setShowPersonaMenu(false); }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: role === 'business' ? 'rgba(255, 102, 0, 0.12)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  color: '#ffffff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff6600' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>Tata Motors Precision (Enterprise)</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Business OS • Shippers</div>
                </div>
              </button>

              <button
                onClick={() => { setRole('driver'); setShowPersonaMenu(false); }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: role === 'driver' ? 'rgba(255, 102, 0, 0.12)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  color: '#ffffff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e676' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>Raj Patil (Driver Pro)</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>MH-15-AX-2841 • Nashik-Mumbai</div>
                </div>
              </button>

              <button
                onClick={() => { setRole('fleet'); setShowPersonaMenu(false); }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: role === 'fleet' ? 'rgba(255, 102, 0, 0.12)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  color: '#ffffff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f0ff' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>Apex Logistics (Fleet Owner)</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>24 Vehicles • 18 Drivers</div>
                </div>
              </button>

              <button
                onClick={() => { setRole('control-tower'); setShowPersonaMenu(false); }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: role === 'control-tower' ? 'rgba(255, 102, 0, 0.12)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  color: '#ffffff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffaa00' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>National Control Tower</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Operations & Dispatch</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Onboarding CTA */}
        <button
          onClick={onOpenOnboarding}
          className="btn btn-primary"
          style={{ padding: '8px 14px', fontSize: '12px' }}
        >
          <Truck size={14} />
          <span>Join Supply Network</span>
        </button>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .telemetry-bar {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};
