import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  Sparkles, 
  Database, 
  FileText, 
  Terminal, 
  Lightbulb, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  Shield, 
  Users, 
  TrendingUp, 
  Percent, 
  HeartHandshake, 
  Briefcase,
  UserPlus,
  Zap,
  Loader2,
  FileCheck2,
  Cpu,
  Upload,
  Palette,
  Sun,
  Moon,
  Check
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    setActiveTab, 
    kpis, 
    dataProfile, 
    currentUser, 
    permissions,
    allEmployees,
    loadBenchmarkDataset,
    runInstantAnalysis,
    isAnalyzing,
    setShowAddEmployeeModal,
    setShowAnalysisModal,
    lastAnalysisResult,
    backgroundTheme,
    setBackgroundTheme
  } = useApp();

  const primaryActions = [
    {
      title: 'Analyse HR Data',
      desc: 'Explore headcount, attrition rates, and demographic breakdowns',
      tab: 'analytics',
      icon: BarChart3,
      badge: 'Interactive',
      gradient: 'from-blue-600/20 to-indigo-600/20 border-blue-500/30'
    },
    {
      title: 'Clean My Data',
      desc: 'Power Query-style deduplication, type casting, and standardizations',
      tab: 'clean',
      icon: Sparkles,
      badge: `${dataProfile.issues.length} Issues Fixed`,
      gradient: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/30'
    },
    {
      title: 'Data Model (Power Pivot)',
      desc: 'Inspect Star Schema dimensions, fact tables, and 1:N relationships',
      tab: 'model',
      icon: Database,
      badge: 'Star Schema',
      gradient: 'from-purple-600/20 to-pink-600/20 border-purple-500/30'
    },
    {
      title: 'Generate HR Report',
      desc: 'Download clean Excel, Google Sheets, or PDF Management briefings',
      tab: 'export',
      icon: FileText,
      badge: 'One-Click Export',
      gradient: 'from-amber-600/20 to-orange-600/20 border-amber-500/30'
    },
    {
      title: 'Ask My HR Data',
      desc: 'Automated executive insights: What changed, where, and HR playbooks',
      tab: 'insights',
      icon: Lightbulb,
      badge: 'AI Analyst',
      gradient: 'from-cyan-600/20 to-blue-600/20 border-cyan-500/30'
    },
    {
      title: 'SQL / Python / DAX Lab',
      desc: 'Query employee tables directly, run Pandas scripts, copy DAX measures',
      tab: 'sql_python',
      icon: Terminal,
      badge: 'BI Engine',
      gradient: 'from-violet-600/20 to-indigo-600/20 border-violet-500/30'
    }
  ];

  const recentProjects = [
    {
      name: 'Workforce Attrition & Retention 2026',
      dataset: 'Employee_Master_2026.xlsx',
      updated: 'Updated today',
      status: 'Ready',
      records: 487,
      tab: 'analytics'
    },
    {
      name: 'Q3 Employee Engagement Pulse Survey',
      dataset: 'Pulse_Q3_Responses.csv',
      updated: 'Updated yesterday',
      status: 'Cleaned',
      records: 433,
      tab: 'insights'
    },
    {
      name: 'Technical Recruitment Funnel Velocity',
      dataset: 'ATS_Export_Q1_Q3.xlsx',
      updated: '3 days ago',
      status: 'Ready',
      records: 2840,
      tab: 'analytics'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/20 p-6 md:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>People Analytics Intelligence Platform</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {currentUser.name.split(' ')[0]}
            </h1>
            <p className="text-slate-300 text-sm mt-1.5 max-w-2xl leading-relaxed">
              Upload raw HR data → Clean → Structure → Model → Analyze → Explain → Export. 
              The enterprise analytics platform bridging HR workflows with SQL, Python, and Power BI.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setActiveTab('data')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Database className="w-4 h-4" />
              <span>Upload HR Data</span>
            </button>
            <button
              onClick={() => setActiveTab('clean')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Auto-Clean Pipeline</span>
            </button>
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* App Canvas Background Toggle Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 md:p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-100">App Background Atmosphere</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-medium bg-slate-800 text-indigo-300 border border-slate-700">
                1-Click Switch
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Customize your canvas: White (Clean Light), Grey (Executive Slate), Multicolored (Aurora Mesh), or Classic Dark
            </p>
          </div>
        </div>

        {/* 4 Theme Switch Buttons */}
        <div className="grid grid-cols-2 sm:flex items-center gap-1.5 bg-slate-950/70 p-1.5 rounded-xl border border-slate-800">
          {/* White */}
          <button
            onClick={() => setBackgroundTheme('white')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              backgroundTheme === 'white'
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Switch to clean white light background"
          >
            <span className="w-3 h-3 rounded-full bg-white border border-slate-300 flex-shrink-0" />
            <span>White</span>
            {backgroundTheme === 'white' && <Check className="w-3 h-3 text-slate-900" />}
          </button>

          {/* Grey */}
          <button
            onClick={() => setBackgroundTheme('grey')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              backgroundTheme === 'grey'
                ? 'bg-slate-700 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Switch to executive neutral grey background"
          >
            <span className="w-3 h-3 rounded-full bg-slate-500 border border-slate-400 flex-shrink-0" />
            <span>Grey</span>
            {backgroundTheme === 'grey' && <Check className="w-3 h-3 text-white" />}
          </button>

          {/* Multicolored */}
          <button
            onClick={() => setBackgroundTheme('multicolored')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              backgroundTheme === 'multicolored'
                ? 'bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-500 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Switch to vibrant multicolored aurora gradient canvas"
          >
            <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-indigo-400 via-pink-400 to-cyan-400 flex-shrink-0" />
            <span>Multicolored</span>
            {backgroundTheme === 'multicolored' && <Check className="w-3 h-3 text-white" />}
          </button>

          {/* Classic Dark */}
          <button
            onClick={() => setBackgroundTheme('dark')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              backgroundTheme === 'dark'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Switch to classic deep dark midnight mode"
          >
            <span className="w-3 h-3 rounded-full bg-slate-950 border border-slate-700 flex-shrink-0" />
            <span>Dark</span>
            {backgroundTheme === 'dark' && <Check className="w-3 h-3 text-slate-200" />}
          </button>
        </div>
      </div>

      {/* 3,000+ People Analytics & Rapid Results Engine Panel */}
      <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                Workforce Scale Engine
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Active Dataset: {allEmployees.length.toLocaleString()} People
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Cpu className="w-6 h-6 text-indigo-400" />
              <span>3,000 People Data Analysis & Result Generator</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Load and analyze 3,000 authentic employee records across 8 departments, or add new individual & batch records. Generate instant executive reports with attrition velocity, salary equity, and department drilldowns.
            </p>

            {/* Quick scale switcher buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 font-medium">Quick Presets:</span>
              <button
                onClick={() => loadBenchmarkDataset(3000)}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs font-semibold transition-all ${
                  allEmployees.length === 3000
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/50'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                ★ 3,000 Benchmark
              </button>
              <button
                onClick={() => loadBenchmarkDataset(487)}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs font-semibold transition-all ${
                  allEmployees.length === 487
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/50'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                487 Standard
              </button>
              <button
                onClick={() => loadBenchmarkDataset(5000)}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs font-semibold transition-all ${
                  allEmployees.length === 5000
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/50'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                5,000 Enterprise
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Bulk CSV Import Button */}
            <button
              onClick={() => setActiveTab('data_clean')}
              className="px-4 py-3 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/90 border border-indigo-700/60 text-indigo-300 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 hover:border-indigo-500"
              title="Bulk import hundreds or thousands of HR records from CSV file"
            >
              <Upload className="w-4 h-4 text-indigo-400" />
              <span>Bulk CSV Import</span>
            </button>

            {/* + Add Person Button */}
            <button
              onClick={() => setShowAddEmployeeModal(true)}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 hover:border-slate-500"
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>+ Add People Data</span>
            </button>

            {/* Run Instant Analysis & Results Button */}
            <button
              onClick={runInstantAnalysis}
              disabled={isAnalyzing}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white text-xs font-bold shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2.5 disabled:opacity-75"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Computing 3,000 Records...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Analyze {allEmployees.length.toLocaleString()} & Generate Result</span>
                </>
              )}
            </button>

            {lastAnalysisResult && (
              <button
                onClick={() => setShowAnalysisModal(true)}
                className="px-3.5 py-3 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/60 text-indigo-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                title="View previous analysis breakdown"
              >
                <FileCheck2 className="w-4 h-4 text-indigo-400" />
                <span className="hidden xl:inline">View Report</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Headcount</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{kpis.totalHeadcount}</span>
            <span className="text-xs text-emerald-400 font-medium">+{kpis.activeCount} Active</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Scoped to organization master</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Turnover Rate</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{kpis.turnoverRate}%</span>
            <span className="text-xs text-slate-400">{kpis.exitCount} exits YTD</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Voluntary: {kpis.voluntaryTurnoverRate}%</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Engagement Index</span>
            <HeartHandshake className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{kpis.avgEngagement}%</span>
            <span className="text-xs text-emerald-400 font-medium">+4.0% vs Q2</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Quarterly response rate 89%</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Data Health Score</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{dataProfile.overallScore}%</span>
            <span className="text-xs text-emerald-400 font-medium">Production Ready</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Power Query verified</div>
        </div>
      </div>

      {/* Main What would you like to do today? Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100">What would you like to do today?</h2>
            <p className="text-xs text-slate-400">Choose a workflow suited for your experience level</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {primaryActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.title}
                onClick={() => setActiveTab(action.tab)}
                className={`p-5 rounded-xl border bg-slate-900/60 hover:bg-slate-900 transition-all cursor-pointer group shadow-sm hover:shadow-md hover:border-indigo-500/40 relative overflow-hidden flex flex-col justify-between ${action.gradient}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950/80 border border-slate-800 text-slate-300">
                      {action.badge}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-100 text-sm group-hover:text-indigo-300 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {action.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-medium">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Projects & Role Notice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects List */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-slate-200">Recent Projects</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">3 Active Datasets</span>
          </div>

          <div className="space-y-3">
            {recentProjects.map((proj) => (
              <div
                key={proj.name}
                onClick={() => setActiveTab(proj.tab)}
                className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-950"
              >
                <div>
                  <h4 className="text-xs font-semibold text-slate-200 hover:text-indigo-400 transition-colors">
                    {proj.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="font-mono text-slate-300">{proj.dataset}</span>
                    <span>•</span>
                    <span>{proj.records} rows</span>
                    <span>•</span>
                    <span>{proj.updated}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                    {proj.status}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500 hover:text-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Role & Permissions Overview */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-200">Active Permissions</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
                {currentUser.role.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Your session is authenticated as <strong>{currentUser.name}</strong> ({currentUser.title}).
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-300">Department Scope</span>
                <span className="font-mono text-indigo-400 font-semibold">{currentUser.departmentScope || 'All'}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-300">View Compensation Data</span>
                <span className={`font-mono font-semibold ${permissions.canViewCompensation ? 'text-emerald-400' : 'text-red-400'}`}>
                  {permissions.canViewCompensation ? 'Granted' : 'Redacted'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-300">Execute Custom SQL/Code</span>
                <span className={`font-mono font-semibold ${permissions.canExecuteCustomCode ? 'text-emerald-400' : 'text-red-400'}`}>
                  {permissions.canExecuteCustomCode ? 'Allowed' : 'Restricted'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-300">User Account Admin</span>
                <span className={`font-mono font-semibold ${permissions.canManageUsers ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {permissions.canManageUsers ? 'Super Admin' : 'Read Only'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('users')}
            className="mt-4 w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors text-center"
          >
            Manage User Database & Roles →
          </button>
        </div>
      </div>
    </div>
  );
};
