import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Vehicle, VehicleCategory } from '../../types';
import {
  Truck,
  Users,
  Activity,
  Fuel,
  CreditCard,
  Wrench,
  PlusCircle,
  TrendingUp,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Filter,
  Search,
  X
} from 'lucide-react';

export const FleetOS: React.FC = () => {
  const {
    fleet,
    vehicles,
    addFleetVehicle,
    setRole,
    setBusinessTab
  } = useSimulation();

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(vehicles[0]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'available' | 'maintenance'>('all');
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

  // New vehicle form state
  const [newReg, setNewReg] = useState('MH-12-PQ-9912');
  const [newModel, setNewModel] = useState('BharatBenz 2823R (Heavy Duty)');
  const [newCategory, setNewCategory] = useState<VehicleCategory>('truck_32ft');
  const [newCapacity, setNewCapacity] = useState('20000');
  const [newDriver, setNewDriver] = useState('Anand Shinde');

  const filteredVehicles = vehicles.filter(v => {
    if (filterStatus === 'all') return true;
    return v.status === filterStatus;
  });

  const handleCreateVehicle = () => {
    addFleetVehicle({
      registrationNumber: newReg,
      model: newModel,
      category: newCategory,
      capacityKg: Number(newCapacity),
      assignedDriverName: newDriver
    });
    setShowAddVehicleModal(false);
  };

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1440px', margin: '0 auto', color: '#ffffff' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-cyan">FLEET COMMAND</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{fleet.name}</span>
          </div>
          <h1 style={{ fontSize: '26px', marginTop: '4px' }}>Fleet Operations Center</h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowAddVehicleModal(true)}
            className="btn btn-primary"
            style={{ padding: '10px 18px', fontSize: '13px' }}
          >
            <PlusCircle size={15} />
            <span>Add Vehicle to Fleet</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px',
        marginBottom: '24px'
      }}>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>TOTAL FLEET ASSETS</div>
          <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
            {fleet.totalVehicles} TRUCKS
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            18 Drivers on roster
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ACTIVE IN TRANSIT</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>
            {fleet.activeVehicles}
          </div>
          <div style={{ fontSize: '11px', color: '#00e676' }}>
            {fleet.utilizationPercent}% Fleet Utilization
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AVAILABLE FOR DISPATCH</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#00e676', fontFamily: 'var(--font-mono)' }}>
            {fleet.availableVehicles}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Ready in Mumbai & Manesar
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>IN RTO / SERVICE BAY</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffb300', fontFamily: 'var(--font-mono)' }}>
            {fleet.maintenanceVehicles}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Preventive service scheduled
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MONTHLY REVENUE</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
            ₹12.4L
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Avg ₹68,420 per vehicle
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>OPERATING COST / KM</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
            ₹{fleet.costPerKm}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Includes fuel, FASTag & drivers
          </div>
        </div>
      </div>

      {/* Empty Capacity & Return Load AI Synergy Box */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 102, 0, 0.12) 0%, rgba(13, 17, 26, 0.95) 100%)',
        border: '1px solid var(--accent-orange)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 102, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RotateCcw size={24} color="#ff6600" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '16px', color: '#ffffff' }}>Empty Capacity & Backhaul Matcher</h3>
              <span className="badge badge-green">AI OPTIMIZER</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              6 trucks returning empty from Pune & Gujarat corridor. 12 matching spot shipments found, generating up to ₹1,82,400 in backhaul revenue.
            </p>
          </div>
        </div>

        <button
          onClick={() => { setRole('business'); setBusinessTab('marketplace'); }}
          className="btn btn-primary"
          style={{ padding: '10px 20px', fontSize: '13px' }}
        >
          <Sparkles size={15} />
          <span>Match Return Loads (12 Loads)</span>
        </button>
      </div>

      {/* Vehicle Grid Header & Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', color: '#ffffff' }}>Fleet Telemetry & Status</h2>

        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'active', 'available', 'maintenance'] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                background: filterStatus === st ? 'rgba(255, 102, 0, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: filterStatus === st ? '1px solid var(--accent-orange)' : '1px solid var(--border-subtle)',
                color: filterStatus === st ? 'var(--accent-orange)' : 'var(--text-secondary)',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicles Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '16px'
      }}>
        {filteredVehicles.map(veh => (
          <div
            key={veh.id}
            onClick={() => setSelectedVehicle(veh)}
            className="glass-panel"
            style={{
              padding: '18px',
              border: `1px solid ${selectedVehicle?.id === veh.id ? 'var(--accent-orange)' : 'var(--border-subtle)'}`,
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
                  {veh.registrationNumber}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {veh.model}
                </div>
              </div>

              <span className={`badge ${veh.status === 'active' ? 'badge-orange' : veh.status === 'available' ? 'badge-green' : 'badge-amber'}`}>
                {veh.status.toUpperCase()}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '11px', margin: '14px 0', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>DRIVER</div>
                <strong style={{ color: '#ffffff' }}>{veh.assignedDriverName || 'Unassigned'}</strong>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>DIESEL FUEL</div>
                <strong style={{ color: veh.fuelLevelPercent < 40 ? '#ffb300' : '#00e676' }}>
                  {veh.fuelLevelPercent}%
                </strong>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>FASTAG BAL</div>
                <strong style={{ color: '#00f0ff', fontFamily: 'var(--font-mono)' }}>
                  ₹{veh.fastagBalance}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} color="#ff6600" />
                <span>{veh.currentLocation.city}</span>
              </div>
              <div>
                Next service: in {veh.nextMaintenanceKm} km
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Vehicle Modal */}
      {showAddVehicleModal && (
        <div className="modal-overlay">
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-medium)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '520px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', color: '#ffffff' }}>Add Commercial Vehicle</h3>
              <button
                onClick={() => setShowAddVehicleModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label className="input-label">Vehicle Registration Number</label>
                <input
                  type="text"
                  className="input-field"
                  value={newReg}
                  onChange={e => setNewReg(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Vehicle Model & Make</label>
                <input
                  type="text"
                  className="input-field"
                  value={newModel}
                  onChange={e => setNewModel(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="input-label">Category</label>
                  <select
                    className="input-field"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                  >
                    <option value="truck_32ft">32 FT Multi-Axle</option>
                    <option value="truck_19ft">19 FT Container</option>
                    <option value="lcv">LCV 14-17 FT</option>
                    <option value="mini_truck">Mini Truck</option>
                    <option value="refrigerated">Reefer (-20°C)</option>
                    <option value="trailer">40 FT Trailer</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Payload Capacity (KG)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={newCapacity}
                    onChange={e => setNewCapacity(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Assigned Commercial Driver</label>
                <input
                  type="text"
                  className="input-field"
                  value={newDriver}
                  onChange={e => setNewDriver(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowAddVehicleModal(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateVehicle}
                className="btn btn-primary"
                style={{ flex: 1.5 }}
              >
                Add Vehicle & Issue Telemetry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
