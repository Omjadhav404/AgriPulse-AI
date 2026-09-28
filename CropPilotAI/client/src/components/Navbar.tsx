import React from 'react';
import { Sprout, ShieldCheck, Activity, Database, Sparkles, UserCheck, PlusCircle } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onNewDiagnosis: () => void;
  onOpenFarmModal: () => void;
  onOpenAuth: () => void;
  systemStatus: { supabase: boolean; gemini: boolean };
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onNewDiagnosis,
  onOpenFarmModal,
  onOpenAuth,
  systemStatus
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sprout className="h-6 w-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">CropPilot<span className="text-emerald-400">AI</span></span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                  v1.0 Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">AI Agriculture Advisory & Agronomy Engine</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'dashboard'
                  ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentTab('advisor')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                currentTab === 'advisor'
                  ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>AI Advisor</span>
            </button>
            <button
              onClick={() => setCurrentTab('farms')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'farms'
                  ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Farms & Fields
            </button>
            <button
              onClick={() => setCurrentTab('history')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'history'
                  ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Advisory Logs
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center space-x-3">
            {/* System Status Indicators */}
            <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
              <div className="flex items-center space-x-1">
                <Database className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-[11px]">Supabase:</span>
                <span className={`h-2 w-2 rounded-full ${systemStatus.supabase ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-400'}`} />
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center space-x-1">
                <Sparkles className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-[11px]">Gemini:</span>
                <span className={`h-2 w-2 rounded-full ${systemStatus.gemini ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-emerald-400'}`} />
              </div>
            </div>

            {/* Quick Action Diagnostic Button */}
            <button
              onClick={onNewDiagnosis}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Diagnose Crop</span>
            </button>

            {/* Farmer Profile Button */}
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium transition-colors"
              title="Farmer Profile & Settings"
            >
              <div className="h-6 w-6 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xs">
                🌾
              </div>
              <span className="hidden sm:inline">Demo Farmer</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
