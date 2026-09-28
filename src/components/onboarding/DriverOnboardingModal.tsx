import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  UploadCloud,
  FileCheck,
  Truck,
  CreditCard,
  Clock,
  ShieldCheck,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { VehicleCategory } from '../../types';

interface DriverOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRoleSwitch?: () => void;
}

export const DriverOnboardingModal: React.FC<DriverOnboardingModalProps> = ({
  isOpen,
  onClose,
  onSuccessRoleSwitch
}) => {
  const [step, setStep] = useState<number>(1);
  const [onboardingType, setOnboardingType] = useState<'individual' | 'fleet'>('individual');

  // Form State
  const [formData, setFormData] = useState({
    name: 'Santosh Kumar',
    phone: '+91 98210 44921',
    city: 'Mumbai',
    licenseType: 'Commercial Heavy Goods Vehicle (HMV)',
    experienceYears: '6',
    preferredRoutes: 'Mumbai-Pune, Mumbai-Gujarat Corridor',
    vehicleNumber: 'MH-04-ER-9821',
    vehicleCategory: 'truck_32ft' as VehicleCategory,
    capacityKg: '16000',
    fuelType: 'Diesel / BS-VI',
    bankAccount: '918200192840192',
    ifsc: 'HDFC0001042',
    upiId: 'santosh.freight@okhdfcbank',
    availability: 'available_now'
  });

  const [uploadedDocs, setUploadedDocs] = useState({
    dl: true,
    rc: true,
    insurance: true,
    fitness: true,
    puc: true,
    permit: false
  });

  const [verificationStatus, setVerificationStatus] = useState<
    'UNVERIFIED' | 'DOCUMENTS_SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED'
  >('DOCUMENTS_SUBMITTED');

  if (!isOpen) return null;

  const vehicleOptions: { type: VehicleCategory; label: string; icon: string; payload: string }[] = [
    { type: 'bike', label: 'Bike / Scooter', icon: '🛵', payload: 'Up to 30 KG' },
    { type: 'three_wheeler', label: 'Three-Wheeler', icon: '🛺', payload: '500 KG' },
    { type: 'mini_truck', label: 'Mini Truck (Tata Ace)', icon: '🚐', payload: '1,200 KG' },
    { type: 'lcv', label: 'LCV (14-17 FT)', icon: '🚚', payload: '4,500 KG' },
    { type: 'truck_19ft', label: '19 FT Truck', icon: '🚛', payload: '9,000 KG' },
    { type: 'truck_32ft', label: '32 FT Multi-Axle', icon: '🚛', payload: '18,500 KG' },
    { type: 'container_truck', label: 'Container Carrier', icon: '📦', payload: '24,000 KG' },
    { type: 'refrigerated', label: 'Reefer (Cold Chain)', icon: '❄️', payload: '12,000 KG' },
    { type: 'trailer', label: 'Heavy Trailer (40 FT)', icon: '🏗️', payload: '35,000 KG' }
  ];

  const handleNext = () => {
    if (step < 7) {
      setStep(prev => prev + 1);
    } else {
      setVerificationStatus('VERIFIED');
      setTimeout(() => {
        onClose();
        if (onSuccessRoleSwitch) onSuccessRoleSwitch();
      }, 1400);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  return (
    <div className="modal-overlay">
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-medium)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '720px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 20, 30, 0.6)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-orange">Onboarding Protocol</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Step {step} of 7</span>
            </div>
            <h2 style={{ fontSize: '20px', marginTop: '4px' }}>
              Join the Logistics OS Network
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.08)' }}>
          <div style={{
            width: `${(step / 7) * 100}%`,
            height: '100%',
            background: 'linear-gradient(to right, #ff6600, #ffaa00)',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Form Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {step === 1 && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <span className="input-label">I am joining as:</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                  <div
                    onClick={() => setOnboardingType('individual')}
                    style={{
                      background: onboardingType === 'individual' ? 'rgba(255, 102, 0, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${onboardingType === 'individual' ? 'var(--accent-orange)' : 'var(--border-subtle)'}`,
                      borderRadius: '12px',
                      padding: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff' }}>Independent Driver / Rider</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      I own or drive 1 vehicle (Truck, LCV, Mini-truck, Bike).
                    </div>
                  </div>

                  <div
                    onClick={() => setOnboardingType('fleet')}
                    style={{
                      background: onboardingType === 'fleet' ? 'rgba(255, 102, 0, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${onboardingType === 'fleet' ? 'var(--accent-orange)' : 'var(--border-subtle)'}`,
                      borderRadius: '12px',
                      padding: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff' }}>Fleet / Transport Owner</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      I own or manage 2 or more commercial transport vehicles.
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="input-label">Full Legal Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="input-label">Active Mobile (WhatsApp Enabled)</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label className="input-label">Base Operating City / Regional Hub</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Mumbai, Pune, Delhi NCR, Nashik, Surat"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ fontSize: '16px', marginBottom: '14px' }}>Driving Experience & Licensing</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="input-label">Commercial License Type</label>
                  <select
                    className="input-field"
                    value={formData.licenseType}
                    onChange={e => setFormData({ ...formData, licenseType: e.target.value })}
                  >
                    <option>Commercial Heavy Goods Vehicle (HMV)</option>
                    <option>Medium Goods Vehicle (MGV)</option>
                    <option>Light Motor Vehicle — Commercial (LMV-TR)</option>
                    <option>Hazardous / Chemical Transport Endorsement</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Driving Experience (Years)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.experienceYears}
                    onChange={e => setFormData({ ...formData, experienceYears: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label className="input-label">Preferred Operating Corridors</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.preferredRoutes}
                  onChange={e => setFormData({ ...formData, preferredRoutes: e.target.value })}
                  placeholder="e.g. Mumbai-Pune, Mumbai-Delhi NH-48, Bengaluru-Chennai"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Vehicle Category & Specifications</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                marginBottom: '16px',
                maxHeight: '260px',
                overflowY: 'auto'
              }}>
                {vehicleOptions.map(veh => {
                  const isSelected = formData.vehicleCategory === veh.type;
                  return (
                    <div
                      key={veh.type}
                      onClick={() => setFormData({ ...formData, vehicleCategory: veh.type })}
                      style={{
                        background: isSelected ? 'rgba(255, 102, 0, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isSelected ? 'var(--accent-orange)' : 'var(--border-subtle)'}`,
                        borderRadius: '10px',
                        padding: '12px',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '4px' }}>{veh.icon}</div>
                      <div style={{ fontWeight: 600, fontSize: '12px', color: '#ffffff' }}>{veh.label}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{veh.payload}</div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="input-label">Registration Number (Number Plate)</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.vehicleNumber}
                    onChange={e => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="input-label">Fuel / Powertrain</label>
                  <select
                    className="input-field"
                    value={formData.fuelType}
                    onChange={e => setFormData({ ...formData, fuelType: e.target.value })}
                  >
                    <option>Diesel (BS-VI)</option>
                    <option>CNG Commercial</option>
                    <option>Electric Heavy EV</option>
                    <option>LNG / Dual Fuel</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Mandatory Compliance Documents</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Logistics OS requires objective validation for vehicle fitness and commercial transport safety.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { key: 'dl', label: 'Commercial Driving License', code: 'DL' },
                  { key: 'rc', label: 'Registration Certificate (RC)', code: 'RC' },
                  { key: 'insurance', label: 'Commercial Goods Insurance', code: 'INS' },
                  { key: 'fitness', label: 'RTO Fitness Certificate', code: 'FIT' },
                  { key: 'puc', label: 'Pollution Under Control (PUC)', code: 'PUC' },
                  { key: 'permit', label: 'National Goods Carriage Permit', code: 'NP' }
                ].map(doc => {
                  const isUploaded = uploadedDocs[doc.key as keyof typeof uploadedDocs];
                  return (
                    <div
                      key={doc.key}
                      onClick={() => setUploadedDocs({ ...uploadedDocs, [doc.key]: !isUploaded })}
                      style={{
                        background: isUploaded ? 'rgba(0, 230, 118, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                        border: `1px solid ${isUploaded ? 'rgba(0, 230, 118, 0.4)' : 'var(--border-subtle)'}`,
                        borderRadius: '10px',
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          background: isUploaded ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          color: isUploaded ? '#00e676' : 'var(--text-muted)'
                        }}>
                          {doc.code}
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>{doc.label}</div>
                          <div style={{ fontSize: '10px', color: isUploaded ? '#00e676' : 'var(--text-dim)' }}>
                            {isUploaded ? '✓ Document Uploaded & Parsed' : 'Click to simulate upload'}
                          </div>
                        </div>
                      </div>
                      {isUploaded ? <CheckCircle2 size={18} color="#00e676" /> : <UploadCloud size={18} color="#64748b" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 style={{ fontSize: '16px', marginBottom: '14px' }}>Bank & Instant UPI Settlement</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Trip freight and POD clearance are settled immediately to your linked bank account or UPI ID.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="input-label">Bank Account Number</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.bankAccount}
                    onChange={e => setFormData({ ...formData, bankAccount: e.target.value })}
                  />
                </div>
                <div>
                  <label className="input-label">IFSC Code</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.ifsc}
                    onChange={e => setFormData({ ...formData, ifsc: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label className="input-label">Direct UPI ID (Instant POD payout)</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.upiId}
                  onChange={e => setFormData({ ...formData, upiId: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h3 style={{ fontSize: '16px', marginBottom: '14px' }}>Operating Availability Schedule</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { id: 'available_now', label: 'Available Now', desc: 'Ready to receive immediate spot freight notifications in current zone' },
                  { id: 'today', label: 'Available Today', desc: 'Will complete loading and be ready within 3-4 hours' },
                  { id: 'scheduled', label: 'Scheduled Long-Haul Corridors', desc: 'Accept advance inter-state consignments for next 48-72 hours' }
                ].map(opt => (
                  <div
                    key={opt.id}
                    onClick={() => setFormData({ ...formData, availability: opt.id })}
                    style={{
                      background: formData.availability === opt.id ? 'rgba(255, 102, 0, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${formData.availability === opt.id ? 'var(--accent-orange)' : 'var(--border-subtle)'}`,
                      borderRadius: '10px',
                      padding: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 600, color: '#ffffff' }}>{opt.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{opt.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 7 && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(0, 230, 118, 0.15)',
                border: '2px solid #00e676',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <ShieldCheck size={32} color="#00e676" />
              </div>

              <h3 style={{ fontSize: '20px', marginBottom: '6px' }}>Verification In Progress</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 20px auto' }}>
                Automated document OCR has confirmed your Commercial License, RC, and FASTag link.
              </p>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0, 230, 118, 0.1)',
                border: '1px solid rgba(0, 230, 118, 0.3)',
                borderRadius: '8px',
                padding: '6px 14px',
                marginBottom: '20px'
              }}>
                <span className="pulse-dot pulse-dot-green" />
                <span style={{ color: '#00e676', fontWeight: 700, fontSize: '12px' }}>STATUS: NETWORK ACTIVE</span>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'left',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Assigned Vehicle:</span>
                  <strong style={{ color: '#ffffff' }}>{formData.vehicleNumber} ({formData.vehicleCategory.toUpperCase()})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Base Hub:</span>
                  <strong style={{ color: '#ffffff' }}>{formData.city} Terminal</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Initial Level:</span>
                  <span className="badge badge-green">PRO VERIFIED</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(10, 14, 22, 0.8)'
        }}>
          {step > 1 ? (
            <button onClick={handlePrev} className="btn btn-secondary">
              <ChevronLeft size={16} /> Back
            </button>
          ) : <div />}

          <button onClick={handleNext} className="btn btn-primary">
            {step === 7 ? 'Complete Activation & Enter OS' : 'Continue'}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
