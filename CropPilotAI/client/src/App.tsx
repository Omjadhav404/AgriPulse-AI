import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FarmerDashboard } from './components/FarmerDashboard';
import { DiagnosticWizard } from './components/DiagnosticWizard';
import { AdvisoryResultCard } from './components/AdvisoryResultCard';
import { FarmManagerModal } from './components/FarmManagerModal';
import { HistoryTable } from './components/HistoryTable';
import { AuthModal } from './components/AuthModal';
import { Farm, Field, AdvisoryReport, DashboardMetrics } from './types';
import { 
  fetchFarms, 
  fetchAdvisoryHistory, 
  fetchDashboardMetrics, 
  fetchHealth 
} from './services/api';
import { Sprout, MapPin, Sparkles, Layers, ShieldCheck, HeartHandshake } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'advisor' | 'farms' | 'history' | 'report'>('dashboard');
  const [farms, setFarms] = useState<Farm[]>([]);
  const [advisories, setAdvisories] = useState<AdvisoryReport[]>([]);
  const [selectedAdvisory, setSelectedAdvisory] = useState<AdvisoryReport | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalFarms: 2,
    totalAcreage: 46.5,
    totalFields: 3,
    activeAlerts: 1,
    totalAdvisories: 1,
    healthIndex: 94.2,
    cropDistribution: { Tomato: 8.5, Wheat: 12.0, Chickpea: 10.0 }
  });
  const [systemStatus, setSystemStatus] = useState({ supabase: false, gemini: false });
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: 'Demo Farmer', email: 'farmer@croppilot.ai' });

  // Initial Data Fetch
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [farmsData, advData, metricsData, healthData] = await Promise.all([
        fetchFarms(),
        fetchAdvisoryHistory(),
        fetchDashboardMetrics(),
        fetchHealth()
      ]);

      if (farmsData && farmsData.length > 0) setFarms(farmsData);
      if (advData) setAdvisories(advData);
      if (metricsData) setMetrics(metricsData);
      if (healthData) {
        setSystemStatus({
          supabase: Boolean(healthData.supabaseConnected),
          gemini: Boolean(healthData.geminiAiActive)
        });
      }
    } catch (e) {
      console.warn('Data sync warning:', e);
    }
  };

  const handleDiagnosisComplete = (report: AdvisoryReport) => {
    setSelectedAdvisory(report);
    setAdvisories([report, ...advisories]);
    setCurrentTab('report');
    // Refresh metrics in background
    fetchDashboardMetrics().then(m => m && setMetrics(m));
  };

  const handleSelectAdvisory = (report: AdvisoryReport) => {
    setSelectedAdvisory(report);
    setCurrentTab('report');
  };

  const handleFarmAdded = (newFarm: Farm) => {
    setFarms([...farms, newFarm]);
    fetchDashboardMetrics().then(m => m && setMetrics(m));
  };

  const handleFieldAdded = (farmId: string, newField: Field) => {
    setFarms(farms.map(f => {
      if (f.id === farmId) {
        return { ...f, fields: [...(f.fields || []), newField] };
      }
      return f;
    }));
    fetchDashboardMetrics().then(m => m && setMetrics(m));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => setCurrentTab(tab as any)}
        onNewDiagnosis={() => setCurrentTab('advisor')}
        onOpenFarmModal={() => setIsFarmModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        systemStatus={systemStatus}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'dashboard' && (
          <FarmerDashboard
            metrics={metrics}
            farms={farms}
            recentAdvisories={advisories}
            onNewDiagnosis={() => setCurrentTab('advisor')}
            onOpenFarmModal={() => setIsFarmModalOpen(true)}
            onSelectAdvisory={handleSelectAdvisory}
          />
        )}

        {currentTab === 'advisor' && (
          <DiagnosticWizard
            farms={farms}
            onDiagnosisComplete={handleDiagnosisComplete}
            onCancel={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'report' && selectedAdvisory && (
          <AdvisoryResultCard
            advisory={selectedAdvisory}
            onBack={() => setCurrentTab('dashboard')}
            onNewDiagnosis={() => setCurrentTab('advisor')}
          />
        )}

        {currentTab === 'history' && (
          <HistoryTable
            advisories={advisories}
            onSelectAdvisory={handleSelectAdvisory}
            onNewDiagnosis={() => setCurrentTab('advisor')}
          />
        )}

        {currentTab === 'farms' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Agricultural Holdings & Parcel Registry</h1>
                <p className="text-xs text-slate-400">Manage farm estates, soil classification, irrigation, and crop rotations</p>
              </div>
              <button
                onClick={() => setIsFarmModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors self-start sm:self-auto"
              >
                + Register New Farm
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {farms.map((farm) => (
                <div key={farm.id} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white">{farm.name}</h2>
                      <p className="text-xs text-slate-400 flex items-center space-x-1 mt-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                        <span>{farm.location}</span>
                      </p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {farm.total_acreage} Acres
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Primary Soil</span>
                      <span className="text-slate-200 font-medium">{farm.primary_soil_type}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Irrigation</span>
                      <span className="text-slate-200 font-medium">{farm.irrigation_system}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Cultivated Fields ({(farm.fields || []).length})
                    </h3>
                    <div className="space-y-2">
                      {(farm.fields || []).map((field) => (
                        <div key={field.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
                          <div className="flex items-center space-x-2.5">
                            <Sprout className="h-4 w-4 text-emerald-400" />
                            <div>
                              <p className="text-xs font-semibold text-white">{field.name}</p>
                              <p className="text-[10px] text-slate-400">
                                {field.current_crop} • {field.size_acres} ac • {field.variety || 'Default'}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
                            {field.growth_stage}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Global Modals */}
      <FarmManagerModal
        isOpen={isFarmModalOpen}
        onClose={() => setIsFarmModalOpen(false)}
        farms={farms}
        onFarmAdded={handleFarmAdded}
        onFieldAdded={handleFieldAdded}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(u) => setCurrentUser(u)}
      />

      {/* Clean Agronomic Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 rounded bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-slate-950">
              🌱
            </div>
            <span className="font-semibold text-slate-300">CropPilotAI</span>
            <span>— Precision Agronomy & Crop Advisory Engine</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>Google Gemini 2.5 SDK</span>
            <span>•</span>
            <span>Supabase Cloud PostgreSQL</span>
            <span>•</span>
            <span>Google Antigravity IDE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
