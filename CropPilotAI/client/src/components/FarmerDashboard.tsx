import React from 'react';
import { 
  Sprout, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Droplets, 
  Sun, 
  Wind, 
  Plus, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Farm, AdvisoryReport, DashboardMetrics } from '../types';

interface DashboardProps {
  metrics: DashboardMetrics;
  farms: Farm[];
  recentAdvisories: AdvisoryReport[];
  onNewDiagnosis: () => void;
  onOpenFarmModal: () => void;
  onSelectAdvisory: (advisory: AdvisoryReport) => void;
}

export const FarmerDashboard: React.FC<DashboardProps> = ({
  metrics,
  farms,
  recentAdvisories,
  onNewDiagnosis,
  onOpenFarmModal,
  onSelectAdvisory
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-6 sm:p-8 border border-emerald-900/40 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>AI Crop Surveillance Online</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Agronomic Control Center
            </h1>
            <p className="text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
              Real-time crop health diagnostics, pathogen containment protocols, and satellite-guided agronomic management powered by Google Gemini and Supabase.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNewDiagnosis}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="h-5 w-5" />
              <span>Diagnose Symptoms</span>
            </button>
            <button
              onClick={onOpenFarmModal}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm transition-all"
            >
              <Plus className="h-4 w-4 text-emerald-400" />
              <span>Add Farm / Field</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Acreage */}
        <div className="glass-panel p-5 rounded-xl glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Monitored Area</span>
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">{metrics.totalAcreage}</span>
            <span className="text-slate-400 text-sm ml-1.5 font-medium">Acres</span>
          </div>
          <p className="mt-2 text-xs text-slate-400 flex items-center space-x-1">
            <span className="text-emerald-400 font-semibold">{metrics.totalFarms} Farms</span>
            <span>across {metrics.totalFields} cultivated parcels</span>
          </p>
        </div>

        {/* Health Index */}
        <div className="glass-panel p-5 rounded-xl glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Agronomic Health Index</span>
            <div className="p-2 rounded-lg bg-green-950 text-green-400 border border-green-800/60">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">{metrics.healthIndex}%</span>
          </div>
          <p className="mt-2 text-xs text-emerald-400 font-medium flex items-center space-x-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Optimal vegetative canopy resilience</span>
          </p>
        </div>

        {/* Active Alerts */}
        <div className="glass-panel p-5 rounded-xl glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pathogen Alerts</span>
            <div className={`p-2 rounded-lg ${metrics.activeAlerts > 0 ? 'bg-amber-950 text-amber-400 border border-amber-800/60' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">{metrics.activeAlerts}</span>
            <span className="text-slate-400 text-sm ml-1.5 font-medium">Active</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {metrics.activeAlerts > 0 ? 'Remediation protocols active in parcels' : 'No critical outbreaks detected'}
          </p>
        </div>

        {/* AI Advisories Resolved */}
        <div className="glass-panel p-5 rounded-xl glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Syntheses Archived</span>
            <div className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/60">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">{metrics.totalAdvisories}</span>
            <span className="text-slate-400 text-sm ml-1.5 font-medium">Reports</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Persisted in Supabase PostgreSQL
          </p>
        </div>
      </div>

      {/* Main Grid: Weather Telemetry + Active Parcels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Farm Parcels List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Registered Farms & Active Fields</h2>
              <p className="text-xs text-slate-400">Current growth stages and soil moisture status</p>
            </div>
            <button
              onClick={onOpenFarmModal}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>Manage All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {farms.map((farm) => (
              <div key={farm.id} className="glass-panel rounded-xl p-5 border border-slate-800/80 hover:border-emerald-700/50 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white">{farm.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-slate-500" />
                      <span>{farm.location}</span>
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                    {farm.total_acreage} ac
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Active Crop Parcels</div>
                  <div className="space-y-2">
                    {(farm.fields || []).slice(0, 2).map((field) => (
                      <div key={field.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                        <div className="flex items-center space-x-2">
                          <Sprout className="h-4 w-4 text-emerald-400" />
                          <div>
                            <p className="text-xs font-medium text-white">{field.name}</p>
                            <p className="text-[10px] text-slate-400">{field.current_crop} ({field.variety || 'Standard'})</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {field.growth_stage}
                        </span>
                      </div>
                    ))}
                    {(farm.fields || []).length === 0 && (
                      <p className="text-xs text-slate-500 italic py-1">No field parcels registered yet.</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/40">
                  <span>Soil: <strong className="text-slate-200">{farm.primary_soil_type}</strong></span>
                  <span>Irrigation: <strong className="text-slate-200">{farm.irrigation_system}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Agronomic Weather Widget & Advisory History */}
        <div className="space-y-6">
          {/* Micro-Climate & Spray Feasibility Card */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <Sun className="h-4 w-4 text-amber-400" />
                <span>Field Spray Conditions</span>
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800">
                Favorable
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80">
                <Sun className="h-4 w-4 text-amber-400 mx-auto" />
                <span className="block text-sm font-bold text-white mt-1">26°C</span>
                <span className="text-[10px] text-slate-400">Ambient Temp</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80">
                <Droplets className="h-4 w-4 text-blue-400 mx-auto" />
                <span className="block text-sm font-bold text-white mt-1">62%</span>
                <span className="text-[10px] text-slate-400">Rel. Humidity</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80">
                <Wind className="h-4 w-4 text-slate-400 mx-auto" />
                <span className="block text-sm font-bold text-white mt-1">7 km/h</span>
                <span className="text-[10px] text-slate-400">Wind Velocity</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60">
              Low wind and moderate humidity window optimal for foliar bio-fungicide and micronutrient application between 06:00 - 09:30 AM.
            </p>
          </div>

          {/* Recent Advisories Quick Feed */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Recent AI Diagnoses</h2>
              <span className="text-xs text-slate-400">{recentAdvisories.length} records</span>
            </div>

            <div className="space-y-3">
              {recentAdvisories.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectAdvisory(item)}
                  className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-emerald-600/50 cursor-pointer transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.crop_name}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                      item.severity === 'HIGH' ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                      item.severity === 'MODERATE' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {item.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium line-clamp-1">{item.diagnosis_title}</p>
                  <p className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Confidence: {item.confidence_score}%</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </p>
                </div>
              ))}

              {recentAdvisories.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No advisories requested yet. Click &quot;Diagnose Crop&quot; to begin.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
