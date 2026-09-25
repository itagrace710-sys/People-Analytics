import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  X, 
  Check, 
  Copy, 
  Printer, 
  Users, 
  TrendingDown, 
  TrendingUp, 
  HeartHandshake, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';

export const AnalysisResultModal: React.FC = () => {
  const { 
    showAnalysisModal, 
    setShowAnalysisModal, 
    lastAnalysisResult,
    datasetSize,
    allEmployees,
    setActiveTab
  } = useApp();

  const [copied, setCopied] = useState(false);

  if (!showAnalysisModal || !lastAnalysisResult) return null;

  const result = lastAnalysisResult;

  const handleCopySummary = () => {
    const text = `PEOPLE ANALYTICS GENERATED REPORT (${result.totalEvaluated.toLocaleString()} RECORDS)
Evaluated: ${result.analyzedAt}
Headcount: ${result.totalEvaluated.toLocaleString()} | Active: ${result.activeCount.toLocaleString()} | Exits: ${result.exitCount}
Turnover Rate: ${result.turnoverRate}% (Voluntary: ${result.voluntaryTurnoverRate}%)
Avg Salary: $${result.averageSalary.toLocaleString()} | Avg Engagement: ${result.averageEngagement}%

KEY FINDINGS:
${result.keyFindings.map((f, i) => `${i + 1}. ${f}`).join('\n')}

ACTIONABLE HR PLAYBOOK:
${result.actionablePlaybook.map((p, i) => `- ${p}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 md:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
                  Generated People Analytics Results
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {result.totalEvaluated.toLocaleString()} Records
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Instant analytics execution completed at {result.analyzedAt} across active organizational roster
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAnalysisModal(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top 4 Primary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] text-slate-400">Total Analyzed</span>
            <div className="text-xl md:text-2xl font-bold text-white font-mono mt-1">
              {result.totalEvaluated.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">
              {result.activeCount.toLocaleString()} Active
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] text-slate-400">Turnover Rate</span>
            <div className="text-xl md:text-2xl font-bold text-white font-mono mt-1">
              {result.turnoverRate}%
            </div>
            <span className="text-[10px] text-amber-400 font-medium">
              Voluntary: {result.voluntaryTurnoverRate}%
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] text-slate-400">Avg Compensation</span>
            <div className="text-xl md:text-2xl font-bold text-white font-mono mt-1">
              ${result.averageSalary.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              Base annualized
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] text-slate-400">Engagement Index</span>
            <div className="text-xl md:text-2xl font-bold text-white font-mono mt-1">
              {result.averageEngagement}%
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">
              Org sentiment
            </span>
          </div>
        </div>

        {/* Department High Risk vs Most Stable Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-red-400 font-bold">
                Highest Attrition Risk
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {result.highestChurnDepartment.name} ({result.highestChurnDepartment.rate}% turnover)
              </h4>
              <p className="text-[11px] text-slate-300 mt-1">
                Concentrated departure risk. Recommended for priority stay interviews and salary band alignment.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold">
                Most Stable Department
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {result.lowestChurnDepartment.name} ({result.lowestChurnDepartment.rate}% turnover)
              </h4>
              <p className="text-[11px] text-slate-300 mt-1">
                Highest talent retention benchmark with strong management stability scores.
              </p>
            </div>
          </div>
        </div>

        {/* Key Findings Section */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span>Automated Key Analytical Findings</span>
          </h3>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-200">
            {result.keyFindings.map((finding, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-indigo-400 font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="leading-relaxed">{finding}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable HR Playbook */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span>Actionable HR Leadership Playbook</span>
          </h3>
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2 text-xs text-slate-200">
            {result.actionablePlaybook.map((action, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">{action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Summary Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Executive Summary</span>
                </>
              )}
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-400" />
              <span>Print Results</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowAnalysisModal(false);
                setActiveTab('analytics');
              }}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
            >
              <span>Explore Interactive Dashboards →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
