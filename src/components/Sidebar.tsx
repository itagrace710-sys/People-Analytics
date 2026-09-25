import React from 'react';
import { useApp } from '../context/AppContext';
import { ThemeToggle } from './ThemeToggle';
import { 
  Home, 
  Database, 
  Sparkles, 
  Network, 
  BarChart3, 
  Lightbulb, 
  Terminal, 
  FileCode2, 
  Users, 
  DownloadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Github,
  Rocket
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, dataProfile, isDataCleaned, permissions, setShowDeployModal } = useApp();

  const navItems = [
    { id: 'home', label: 'Home Overview', icon: Home, badge: null },
    { 
      id: 'data', 
      label: 'Data Centre', 
      icon: Database, 
      badge: `${dataProfile.rowCount} Rows` 
    },
    { 
      id: 'clean', 
      label: 'Clean Data', 
      icon: Sparkles, 
      badge: isDataCleaned ? 'Clean' : `${dataProfile.issues.length} Issues`,
      badgeColor: isDataCleaned ? 'bg-emerald-950 text-emerald-400 border-emerald-800/60' : 'bg-amber-950 text-amber-400 border-amber-800/60'
    },
    { id: 'model', label: 'Data Model', icon: Network, badge: 'Power Pivot' },
    { id: 'analytics', label: 'Dashboards', icon: BarChart3, badge: 'Live' },
    { id: 'insights', label: 'Explain Dashboard', icon: Lightbulb, badge: 'AI' },
    { id: 'sql_python', label: 'SQL & Python Lab', icon: Terminal, badge: 'Code' },
    { id: 'dax_bi', label: 'DAX & Power BI', icon: FileCode2, badge: 'Assets' },
    { id: 'users', label: 'User Database', icon: Users, badge: 'RBAC' },
    { id: 'export', label: 'Download & Export', icon: DownloadCloud, badge: null },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-900/60 flex flex-col flex-shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Platform Slogan / Status */}
      <div className="p-4 border-b border-slate-800/60">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950/40 p-3 rounded-xl border border-indigo-500/10">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-1">
            <span>Data Quality Health</span>
            <span className="text-indigo-400 font-mono">{dataProfile.overallScore}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                dataProfile.overallScore > 90 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${dataProfile.overallScore}%` }}
            />
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
            {isDataCleaned ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ready for reporting</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Raw issues detected</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Analytics Lifecycle
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                }`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
                  isActive 
                    ? 'bg-indigo-700/60 text-indigo-100 border-indigo-400/40' 
                    : item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Theme Switcher Pill in Sidebar */}
      <div className="p-3 border-t border-slate-800/60">
        <ThemeToggle variant="inline" />
      </div>

      {/* GitHub Deployment Quick Action */}
      <div className="px-3 pb-3">
        <button
          onClick={() => setShowDeployModal(true)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-slate-950 to-indigo-950/40 border border-slate-700/80 hover:border-indigo-500/50 text-slate-200 text-xs transition-all group shadow-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300">
              <Github className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-200 group-hover:text-white leading-tight">Deploy to GitHub</p>
              <p className="text-[10px] text-slate-400">Pages CI/CD ready</p>
            </div>
          </div>
          <Rocket className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/60 text-[11px] text-slate-500 space-y-1">
        <div className="flex items-center justify-between text-slate-400">
          <span>Engine</span>
          <span className="font-mono text-indigo-400">PAS v2.6.4</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Security</span>
          <span className="font-mono text-emerald-400">RBAC Active</span>
        </div>
      </div>
    </aside>
  );
};
