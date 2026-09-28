import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Leaf, 
  FlaskConical, 
  Droplets, 
  CalendarCheck, 
  Printer, 
  ArrowLeft, 
  Share2, 
  CheckCircle2, 
  Clock, 
  Info 
} from 'lucide-react';
import { AdvisoryReport } from '../types';

interface AdvisoryResultCardProps {
  advisory: AdvisoryReport;
  onBack: () => void;
  onNewDiagnosis: () => void;
}

export const AdvisoryResultCard: React.FC<AdvisoryResultCardProps> = ({
  advisory,
  onBack,
  onNewDiagnosis
}) => {
  const [activeTab, setActiveTab] = useState<'immediate' | 'organic' | 'chemical' | 'soil' | 'prevention'>('immediate');

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-950/80 text-red-300 border-red-700/80 shadow-red-900/30';
      case 'HIGH':
        return 'bg-orange-950/80 text-orange-300 border-orange-700/80 shadow-orange-900/30';
      case 'MODERATE':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/80 shadow-amber-900/30';
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80 shadow-emerald-900/30';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Action Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-200 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <Printer className="h-3.5 w-3.5 text-slate-400" />
            <span>Print Prescription</span>
          </button>
          <button
            onClick={onNewDiagnosis}
            className="text-xs font-semibold text-slate-950 px-3.5 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 transition-colors"
          >
            New Inquiry
          </button>
        </div>
      </div>

      {/* Main Agronomic Report Sheet */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-8">
        {/* Diagnostic Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm ${getSeverityStyle(advisory.severity)}`}>
                Severity: {advisory.severity}
              </span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                Category: {advisory.category}
              </span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-800/60">
                Confidence: {advisory.confidence_score}%
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {advisory.diagnosis_title}
            </h1>
            <p className="text-sm font-medium text-emerald-400">
              Pathogen / Etiology: <span className="text-slate-300 font-normal">{advisory.pathogen_or_cause}</span>
            </p>
          </div>

          <div className="text-right flex-shrink-0 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <p className="font-semibold text-white">{advisory.crop_name} ({advisory.crop_variety || 'General'})</p>
            <p>Stage: {advisory.growth_stage}</p>
            <p className="text-[11px] text-slate-500 mt-1">{new Date(advisory.created_at).toLocaleString()}</p>
          </div>
        </div>

        {/* Condition Analysis */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <Info className="h-4 w-4 text-emerald-400" />
            <span>Agronomic Condition Analysis</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {advisory.condition_analysis}
          </p>
        </div>

        {/* Prescription Treatment Tabs */}
        <div>
          <div className="flex border-b border-slate-800 overflow-x-auto gap-2">
            <button
              onClick={() => setActiveTab('immediate')}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-2 border-b-2 whitespace-nowrap ${
                activeTab === 'immediate'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Immediate Actions</span>
            </button>
            <button
              onClick={() => setActiveTab('organic')}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-2 border-b-2 whitespace-nowrap ${
                activeTab === 'organic'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Leaf className="h-4 w-4 text-green-400" />
              <span>Organic & Bio-Remedies</span>
            </button>
            <button
              onClick={() => setActiveTab('chemical')}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-2 border-b-2 whitespace-nowrap ${
                activeTab === 'chemical'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FlaskConical className="h-4 w-4 text-amber-400" />
              <span>Chemical Controls</span>
            </button>
            <button
              onClick={() => setActiveTab('soil')}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-2 border-b-2 whitespace-nowrap ${
                activeTab === 'soil'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Droplets className="h-4 w-4 text-blue-400" />
              <span>Soil & Irrigation</span>
            </button>
            <button
              onClick={() => setActiveTab('prevention')}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-2 border-b-2 whitespace-nowrap ${
                activeTab === 'prevention'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <CalendarCheck className="h-4 w-4 text-purple-400" />
              <span>Long-Term Prevention</span>
            </button>
          </div>

          {/* Tab Content Panel */}
          <div className="pt-6">
            {/* 1. Immediate Actions */}
            {activeTab === 'immediate' && (
              <div className="space-y-3 animate-fadeIn">
                <p className="text-xs text-slate-400">
                  Execute these containment steps within 24 hours to halt further spore germination and transmission across crop rows:
                </p>
                <div className="space-y-2">
                  {advisory.immediate_actions.map((action, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                      <div className="h-5 w-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center flex-shrink-0 text-xs font-bold border border-emerald-800">
                        {i + 1}
                      </div>
                      <p className="text-sm text-slate-200">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Organic Remediations */}
            {activeTab === 'organic' && (
              <div className="space-y-4 animate-fadeIn">
                <p className="text-xs text-slate-400">
                  Certified biological treatments adhering to eco-friendly agriculture and integrated pest management (IPM):
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {advisory.organic_remediations.map((rem, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                      <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                        <Leaf className="h-4 w-4" />
                        <span>{rem.method}</span>
                      </div>
                      <div className="text-xs text-slate-300 space-y-1">
                        <p><strong className="text-slate-400">Application Rate:</strong> {rem.application_rate}</p>
                        <p><strong className="text-slate-400">Frequency:</strong> {rem.frequency}</p>
                      </div>
                    </div>
                  ))}
                  {advisory.organic_remediations.length === 0 && (
                    <p className="text-xs text-slate-500 italic">No specific organic alternatives required for this condition.</p>
                  )}
                </div>
              </div>
            )}

            {/* 3. Chemical Controls */}
            {activeTab === 'chemical' && (
              <div className="space-y-4 animate-fadeIn">
                <p className="text-xs text-slate-400">
                  Conventional curative chemical interventions. Strict adherence to pre-harvest intervals (PHI) is mandatory:
                </p>
                <div className="space-y-3">
                  {advisory.chemical_controls.map((chem, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-bold text-white text-sm">{chem.compound}</h3>
                        <p className="text-xs text-slate-400">Active Ingredient: <strong className="text-slate-200">{chem.active_ingredient}</strong></p>
                        <p className="text-xs text-slate-400">Recommended Dosage: <strong className="text-emerald-400">{chem.dosage_per_acre}</strong></p>
                      </div>
                      <div className="flex-shrink-0 bg-slate-950 px-4 py-2 rounded-lg border border-slate-800 text-center">
                        <span className="block text-lg font-bold text-amber-400">{chem.safety_interval_days} Days</span>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Pre-Harvest Safety Interval (PHI)</span>
                      </div>
                    </div>
                  ))}
                  {advisory.chemical_controls.length === 0 && (
                    <p className="text-xs text-slate-500 italic">Chemical fungicides or pesticides not required at current severity level.</p>
                  )}
                </div>
              </div>
            )}

            {/* 4. Soil & Irrigation Advice */}
            {activeTab === 'soil' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm">
                    <Droplets className="h-4 w-4" />
                    <span>Hydrological & Soil Balancing Protocol</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {advisory.irrigation_and_soil_advice}
                  </p>
                </div>
              </div>
            )}

            {/* 5. Long-Term Prevention */}
            {activeTab === 'prevention' && (
              <div className="space-y-3 animate-fadeIn">
                <p className="text-xs text-slate-400">
                  Prevent recurrence in subsequent agricultural seasons:
                </p>
                <div className="space-y-2">
                  {advisory.long_term_prevention.map((prev, i) => (
                    <div key={i} className="flex items-start space-x-2.5 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                      <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-200">{prev}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Regulatory & Safety Disclaimer */}
        <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-1">
          <span className="font-semibold text-slate-300">Regulatory & Agronomic Disclaimer:</span>
          <p>{advisory.regulatory_disclaimer}</p>
        </div>
      </div>
    </div>
  );
};
