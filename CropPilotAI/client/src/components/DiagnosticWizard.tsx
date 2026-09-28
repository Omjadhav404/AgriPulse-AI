import React, { useState } from 'react';
import { 
  Sparkles, 
  Sprout, 
  HelpCircle, 
  Leaf, 
  Check, 
  Loader2, 
  Calendar, 
  Thermometer, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Farm, AdvisoryReport } from '../types';
import { submitDiagnosticRequest } from '../services/api';

interface DiagnosticWizardProps {
  farms: Farm[];
  onDiagnosisComplete: (result: AdvisoryReport) => void;
  onCancel: () => void;
}

export const DiagnosticWizard: React.FC<DiagnosticWizardProps> = ({
  farms,
  onDiagnosisComplete,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [selectedFarmId, setSelectedFarmId] = useState<string>(farms[0]?.id || '');
  const [selectedFieldId, setSelectedFieldId] = useState<string>('');
  const [cropName, setCropName] = useState('Tomato');
  const [cropVariety, setCropVariety] = useState('Roma VF');
  const [growthStage, setGrowthStage] = useState<'Germination' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Maturation' | 'Harvested'>('Flowering');
  const [symptomsDescription, setSymptomsDescription] = useState('Yellow concentric ring lesions with dark margins on lower foliage. Slight wilting during peak midday heat.');
  const [affectedParts, setAffectedParts] = useState<string[]>(['leaves', 'stems']);
  const [soilType, setSoilType] = useState('Clay Loam');
  const [recentTreatments, setRecentTreatments] = useState('None in past 14 days');
  const [temperature, setTemperature] = useState('28°C');
  const [humidity, setHumidity] = useState('75%');
  const [rainfall, setRainfall] = useState('Moderate showers 2 days ago');

  const plantPartsList = ['leaves', 'stems', 'roots', 'flowers', 'fruits / pods', 'seedlings'];

  // Quick symptom presets to easily test real-world scenarios
  const symptomPresets = [
    {
      label: 'Yellow leaf spots on flowering tomatoes',
      crop: 'Tomato',
      variety: 'Roma VF',
      stage: 'Flowering' as const,
      parts: ['leaves', 'stems'],
      symptoms: 'Yellow concentric ring lesions with dark margins on lower foliage. Slight wilting during peak midday heat.'
    },
    {
      label: 'Orange pustule stripes on winter wheat',
      crop: 'Wheat',
      variety: 'HD-2967',
      stage: 'Vegetative' as const,
      parts: ['leaves'],
      symptoms: 'Linear yellow and bright orange pustules running parallel along leaf veins. Rapid leaf drying and chlorosis.'
    },
    {
      label: 'Sudden wilting on potato parcel',
      crop: 'Potato',
      variety: 'Kufri Jyoti',
      stage: 'Fruiting' as const,
      parts: ['leaves', 'stems', 'roots'],
      symptoms: 'Sudden unilateral wilting of foliage without early yellowing. Stem vascular ring displays brown discoloration.'
    }
  ];

  const handleApplyPreset = (preset: typeof symptomPresets[0]) => {
    setCropName(preset.crop);
    setCropVariety(preset.variety);
    setGrowthStage(preset.stage);
    setAffectedParts(preset.parts);
    setSymptomsDescription(preset.symptoms);
  };

  const togglePart = (part: string) => {
    if (affectedParts.includes(part)) {
      setAffectedParts(affectedParts.filter(p => p !== part));
    } else {
      setAffectedParts([...affectedParts, part]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        cropName,
        cropVariety,
        growthStage,
        symptomsDescription,
        affectedParts,
        soilType,
        recentTreatments,
        weatherConditions: {
          temperature,
          humidity,
          rainfall
        },
        farmId: selectedFarmId || undefined,
        fieldId: selectedFieldId || undefined
      };

      const result = await submitDiagnosticRequest(payload);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (cErr) {
        // ignore if canvas confetti is blocked
      }

      onDiagnosisComplete(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Diagnostic service error. Please verify server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Crop Diagnostic & Treatment Console</h2>
            <p className="text-xs text-slate-400">Powered by Google Gemini 2.5 Flash Agronomic Intelligence</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-900 transition-colors"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-sm flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Preset Scenario Selectors */}
      <div className="mt-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
          ⚡ One-Click Field Symptom Presets (Quick Verification):
        </span>
        <div className="flex flex-wrap gap-2">
          {symptomPresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-700/60 transition-all font-medium"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Section 1: Crop and Growth Stage */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Crop Species *
            </label>
            <input
              type="text"
              required
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              placeholder="e.g. Tomato, Wheat, Potato, Rice"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Variety / Hybrid Cultivar
            </label>
            <input
              type="text"
              value={cropVariety}
              onChange={(e) => setCropVariety(e.target.value)}
              placeholder="e.g. Roma VF, HD-2967"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Growth Stage *
            </label>
            <select
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="Germination">Germination / Emergence</option>
              <option value="Vegetative">Vegetative Growth</option>
              <option value="Flowering">Flowering / Heading</option>
              <option value="Fruiting">Fruiting / Pod Formation</option>
              <option value="Maturation">Maturation / Grain Filling</option>
              <option value="Harvested">Post-Harvest / Fallow</option>
            </select>
          </div>
        </div>

        {/* Section 2: Affected Plant Organs */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Affected Plant Parts (Select All Applicable)
          </label>
          <div className="flex flex-wrap gap-2">
            {plantPartsList.map((part) => {
              const isSelected = affectedParts.includes(part);
              return (
                <button
                  type="button"
                  key={part}
                  onClick={() => togglePart(part)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-sm'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3 text-emerald-400" />}
                  <span className="capitalize">{part}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Detailed Symptoms */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Observed Visual Symptoms & Spread Pattern *
          </label>
          <textarea
            required
            rows={3}
            value={symptomsDescription}
            onChange={(e) => setSymptomsDescription(e.target.value)}
            placeholder="Describe lesion colors, halo rings, wilting patterns, leaf curling, presence of powdery residue, or pest infestation..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Section 4: Environmental & Field Context */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block">
            Agronomic Field Context & Soil Characteristics
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Soil Profile</label>
              <input
                type="text"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                placeholder="Clay Loam / Sandy"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Temperature</label>
              <input
                type="text"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="e.g. 28°C"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Humidity</label>
              <input
                type="text"
                value={humidity}
                onChange={(e) => setHumidity(e.target.value)}
                placeholder="e.g. 75%"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Recent Rainfall</label>
              <input
                type="text"
                value={rainfall}
                onChange={(e) => setRainfall(e.target.value)}
                placeholder="e.g. Heavy showers"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Synthesizing Diagnosis via Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Dispatch AI Diagnosis</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
