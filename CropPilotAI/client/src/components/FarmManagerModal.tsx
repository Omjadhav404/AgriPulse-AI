import React, { useState } from 'react';
import { X, Plus, MapPin, Sprout, Check, Loader2 } from 'lucide-react';
import { Farm, Field } from '../types';
import { createFarmApi, addFieldApi } from '../services/api';

interface FarmManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  farms: Farm[];
  onFarmAdded: (farm: Farm) => void;
  onFieldAdded: (farmId: string, field: Field) => void;
}

export const FarmManagerModal: React.FC<FarmManagerModalProps> = ({
  isOpen,
  onClose,
  farms,
  onFarmAdded,
  onFieldAdded
}) => {
  const [mode, setMode] = useState<'addFarm' | 'addField'>('addFarm');
  const [loading, setLoading] = useState(false);

  // New Farm Form State
  const [farmName, setFarmName] = useState('');
  const [location, setLocation] = useState('');
  const [totalAcreage, setTotalAcreage] = useState('15.0');
  const [soilType, setSoilType] = useState('Loam');
  const [irrigation, setIrrigation] = useState('Drip Micro-Irrigation');

  // New Field Form State
  const [targetFarmId, setTargetFarmId] = useState(farms[0]?.id || '');
  const [fieldName, setFieldName] = useState('');
  const [fieldSize, setFieldSize] = useState('5.0');
  const [crop, setCrop] = useState('Tomato');
  const [variety, setVariety] = useState('Hybrid');
  const [growthStage, setGrowthStage] = useState<'Germination' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Maturation' | 'Harvested'>('Vegetative');

  if (!isOpen) return null;

  const handleCreateFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newFarm = await createFarmApi({
        name: farmName,
        location,
        total_acreage: Number(totalAcreage),
        primary_soil_type: soilType,
        irrigation_system: irrigation
      });
      onFarmAdded(newFarm);
      setFarmName('');
      setLocation('');
      onClose();
    } catch (err: any) {
      alert(err.message || 'Error creating farm');
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetFarmId) return;
    setLoading(true);
    try {
      const newField = await addFieldApi(targetFarmId, {
        name: fieldName,
        size_acres: Number(fieldSize),
        current_crop: crop,
        variety,
        growth_stage: growthStage
      });
      onFieldAdded(targetFarmId, newField);
      setFieldName('');
      onClose();
    } catch (err: any) {
      alert(err.message || 'Error adding field parcel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Sprout className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              {mode === 'addFarm' ? 'Register New Agricultural Holding' : 'Add Cultivated Field Parcel'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('addFarm')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'addFarm' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register Farm
          </button>
          <button
            type="button"
            onClick={() => setMode('addField')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'addField' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Add Field Parcel
          </button>
        </div>

        {/* Mode A: Register Farm */}
        {mode === 'addFarm' ? (
          <form onSubmit={handleCreateFarm} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Farm Name *
              </label>
              <input
                type="text"
                required
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                placeholder="e.g. Riverbend Agro Estate"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Location & Region *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Northern Basin, Sector 4"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Total Acreage
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={totalAcreage}
                  onChange={(e) => setTotalAcreage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Primary Soil Type
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="Loam">Rich Loam</option>
                  <option value="Clay Loam">Clay Loam</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                  <option value="Black Cotton">Black Cotton</option>
                  <option value="Alluvial">Alluvial</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Irrigation Infrastructure
              </label>
              <input
                type="text"
                value={irrigation}
                onChange={(e) => setIrrigation(e.target.value)}
                placeholder="e.g. Precision Drip Micro-Irrigation"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Confirm Farm Registration</span>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAddField} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Assign To Farm *
              </label>
              <select
                value={targetFarmId}
                onChange={(e) => setTargetFarmId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.location})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Field Parcel Name *
              </label>
              <input
                type="text"
                required
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder="e.g. North Plot - Tomato Section"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Crop Species *
                </label>
                <input
                  type="text"
                  required
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  placeholder="e.g. Tomato, Wheat"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Size (Acres)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={fieldSize}
                  onChange={(e) => setFieldSize(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Cultivar / Variety
                </label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="e.g. Hybrid F1"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Current Growth Stage
                </label>
                <select
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="Germination">Germination</option>
                  <option value="Vegetative">Vegetative</option>
                  <option value="Flowering">Flowering</option>
                  <option value="Fruiting">Fruiting</option>
                  <option value="Maturation">Maturation</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Add Field to Farm</span>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
