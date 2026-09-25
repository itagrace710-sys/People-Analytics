import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ThemeToggle } from './ThemeToggle';
import { 
  Building2, 
  ShieldCheck, 
  Search, 
  Bell, 
  ChevronDown, 
  Sparkles, 
  UserCheck, 
  Lock, 
  Database,
  Layers,
  ArrowRightLeft,
  UserPlus,
  Play,
  Loader2,
  Users,
  Github
} from 'lucide-react';
import { UserRole } from '../types/user';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    users, 
    permissions, 
    searchQuery, 
    setSearchQuery, 
    dataProfile,
    isDataCleaned,
    setActiveTab,
    allEmployees,
    datasetSize,
    loadBenchmarkDataset,
    setShowAddEmployeeModal,
    runInstantAnalysis,
    isAnalyzing,
    setShowDeployModal
  } = useApp();

  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showDatasetMenu, setShowDatasetMenu] = useState(false);

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-950/80 text-purple-300 border-purple-800/60';
      case 'hr_admin': return 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60';
      case 'hr_analyst': return 'bg-blue-950/80 text-blue-300 border-blue-800/60';
      case 'manager': return 'bg-amber-950/80 text-amber-300 border-amber-800/60';
      case 'viewer': return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'hr_admin': return 'HR Admin';
      case 'hr_analyst': return 'People Analyst';
      case 'manager': return 'Manager Scope';
      case 'viewer': return 'Executive Viewer';
    }
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-3 md:px-6 flex items-center justify-between gap-3">
      {/* Brand & Active Project */}
      <div className="flex items-center gap-3">
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-sky-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-all flex-shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-4 h-4 md:w-5 md:h-5 text-indigo-400 group-hover:scale-105 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100 tracking-tight text-xs md:text-sm">People Analytics</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Studio</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">HR Intelligence & Data Modeling</p>
          </div>
        </div>

        {/* Dataset Scale Selector (3,000 People Dataset Support) */}
        <div className="relative">
          <button
            onClick={() => setShowDatasetMenu(!showDatasetMenu)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition-colors"
            title="Switch dataset scale or load 3,000 people data"
          >
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono text-indigo-300 font-bold">{allEmployees.length.toLocaleString()}</span>
            <span className="text-slate-400 hidden sm:inline">People</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showDatasetMenu && (
            <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-slate-200 animate-in fade-in">
              <div className="px-2.5 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Workforce Scale
              </div>
              <div className="py-1 space-y-1">
                <button
                  onClick={() => {
                    loadBenchmarkDataset(3000);
                    setShowDatasetMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition-colors ${
                    allEmployees.length === 3000 
                      ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30' 
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div>
                    <p className="font-bold">3,000 People Data</p>
                    <p className="text-[10px] text-slate-400">Enterprise benchmark dataset</p>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                    Recommended
                  </span>
                </button>

                <button
                  onClick={() => {
                    loadBenchmarkDataset(487);
                    setShowDatasetMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition-colors ${
                    allEmployees.length === 487 
                      ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30' 
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div>
                    <p className="font-bold">487 People Data</p>
                    <p className="text-[10px] text-slate-400">Standard mid-size company sample</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">487</span>
                </button>

                <button
                  onClick={() => {
                    loadBenchmarkDataset(5000);
                    setShowDatasetMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition-colors ${
                    allEmployees.length === 5000 
                      ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30' 
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div>
                    <p className="font-bold">5,000 People Data</p>
                    <p className="text-[10px] text-slate-400">High-scale organization stress test</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">5,000</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Search */}
      <div className="flex-1 max-w-xs xl:max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search employees, departments, SQL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Action Toolbar: Theme Switcher, GitHub Deploy, + Add Person & Instant Analysis */}
      <div className="flex items-center gap-2">
        {/* Background Theme Switcher Toggle */}
        <ThemeToggle />

        {/* Deploy to GitHub Button */}
        <button
          onClick={() => setShowDeployModal(true)}
          className="px-2.5 md:px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700/80 hover:border-indigo-500/50 flex items-center gap-1.5 transition-all shadow-sm group"
          title="Deploy app to GitHub / GitHub Pages"
        >
          <Github className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
          <span className="hidden sm:inline">GitHub Deploy</span>
          <span className="sm:hidden">Deploy</span>
        </button>

        <button
          onClick={() => setShowAddEmployeeModal(true)}
          className="px-2.5 md:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
          <span>+ Add Person</span>
        </button>

        <button
          onClick={runInstantAnalysis}
          disabled={isAnalyzing}
          className="px-3 md:px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all disabled:opacity-75"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Analyze & Results</span>
              <span className="sm:hidden">Analyze</span>
            </>
          )}
        </button>

        {/* Quick Role Tester / Switcher Pill */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all shadow-sm ${getRoleBadgeColor(currentUser.role)} hover:opacity-90`}
            title="Switch User Role to test permissions and scoping"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <div className="text-left hidden lg:block">
              <span className="block leading-none text-[11px]">{getRoleDisplayName(currentUser.role)}</span>
            </div>
            <ArrowRightLeft className="w-3 h-3 opacity-60 ml-0.5" />
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-2 z-50 text-slate-200 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-slate-200">Switch Account & Role Test</p>
                <p className="text-[11px] text-slate-400">Experience role-based data permissions</p>
              </div>
              <div className="py-1 space-y-1">
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setCurrentUser(u);
                      setShowRoleSwitcher(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                      currentUser.id === u.id 
                        ? 'bg-indigo-600/20 text-indigo-300 font-medium border border-indigo-500/30' 
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img src={u.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                      <div>
                        <p className="leading-tight">{u.name}</p>
                        <p className="text-[10px] text-slate-400">{u.title}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-800 border border-slate-700">
                      {getRoleDisplayName(u.role)}
                    </span>
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-800 mt-1">
                <button 
                  onClick={() => {
                    setActiveTab('users');
                    setShowRoleSwitcher(false);
                  }}
                  className="w-full text-center py-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Manage Users & Permissions →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info */}
        <div 
          onClick={() => setActiveTab('users')}
          className="flex items-center gap-2 pl-1 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <img 
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'} 
            alt={currentUser.name}
            className="w-7 h-7 rounded-full border border-indigo-500/30 object-cover"
          />
        </div>
      </div>
    </header>
  );
};
