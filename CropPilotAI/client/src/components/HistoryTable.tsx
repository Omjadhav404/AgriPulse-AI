import React, { useState } from 'react';
import { Search, Filter, ShieldCheck, ChevronRight, AlertTriangle, Calendar, FileText } from 'lucide-react';
import { AdvisoryReport } from '../types';

interface HistoryTableProps {
  advisories: AdvisoryReport[];
  onSelectAdvisory: (advisory: AdvisoryReport) => void;
  onNewDiagnosis: () => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  advisories,
  onSelectAdvisory,
  onNewDiagnosis
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredAdvisories = advisories.filter((adv) => {
    const matchesSearch = 
      adv.crop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adv.diagnosis_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adv.pathogen_or_cause.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = severityFilter === 'ALL' || adv.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-950 text-red-400 border border-red-800';
      case 'HIGH':
        return 'bg-orange-950 text-orange-400 border border-orange-800';
      case 'MODERATE':
        return 'bg-amber-950 text-amber-400 border border-amber-800';
      default:
        return 'bg-emerald-950 text-emerald-400 border border-emerald-800';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Advisory Audit Archives</h1>
          <p className="text-xs text-slate-400">Searchable repository of past crop pathologies and treatment plans</p>
        </div>

        <button
          onClick={onNewDiagnosis}
          className="text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors self-start sm:self-auto"
        >
          New Diagnosis
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by crop species, pathogen, or symptoms..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MODERATE">Moderate</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Advisories Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4 sm:px-6">Crop & Stage</th>
                <th className="py-3.5 px-4">Diagnosis & Pathogen</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredAdvisories.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onSelectAdvisory(item)}
                  className="hover:bg-slate-900/50 cursor-pointer transition-colors group"
                >
                  <td className="py-4 px-4 sm:px-6">
                    <span className="font-bold text-white block">{item.crop_name}</span>
                    <span className="text-xs text-slate-400">{item.growth_stage}</span>
                  </td>
                  <td className="py-4 px-4 max-w-xs sm:max-w-md">
                    <span className="font-semibold text-slate-200 block group-hover:text-emerald-400 transition-colors">
                      {item.diagnosis_title}
                    </span>
                    <span className="text-xs text-slate-400 line-clamp-1">{item.pathogen_or_cause}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getSeverityBadge(item.severity)}`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-semibold text-emerald-400">{item.confidence_score}%</span>
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-400 whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      className="p-1 rounded-lg text-slate-400 group-hover:text-emerald-400 group-hover:bg-slate-800 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredAdvisories.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 text-sm">
                    No diagnostic records found matching current query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
