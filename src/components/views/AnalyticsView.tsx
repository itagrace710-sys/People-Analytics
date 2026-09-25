import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  TrendingDown, 
  TrendingUp, 
  Percent, 
  Briefcase, 
  HeartHandshake, 
  DollarSign, 
  Calendar, 
  Filter, 
  Clock, 
  AlertCircle, 
  Lock, 
  ShieldAlert, 
  CheckCircle,
  Award,
  UserPlus,
  Zap,
  Loader2
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/mockHrData';

export const AnalyticsView: React.FC = () => {
  const { 
    kpis, 
    allEmployees,
    filteredEmployees, 
    selectedDepartment, 
    setSelectedDepartment, 
    selectedStatus, 
    setSelectedStatus, 
    currentUser, 
    permissions,
    setActiveTab,
    loadBenchmarkDataset,
    runInstantAnalysis,
    isAnalyzing,
    setShowAddEmployeeModal,
    setShowAnalysisModal
  } = useApp();

  const [activeModule, setActiveModule] = useState<
    'workforce' | 'attrition' | 'recruitment' | 'engagement' | 'performance' | 'compensation' | 'attendance'
  >('workforce');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Global Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">People Analytics Dashboard</h1>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Layer 6
            </span>
          </div>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Real-time interactive HR metrics engine with demographic distributions, attrition diagnosis, and funnel velocity.
          </p>
        </div>

        {/* Global Slicer Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Department Slicer */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">Dept:</span>
            {currentUser.departmentScope && currentUser.departmentScope !== 'All' ? (
              <span className="font-mono text-indigo-300 font-semibold flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                {currentUser.departmentScope} (Locked)
              </span>
            ) : (
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900 text-slate-200">All Departments</option>
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d} className="bg-slate-900 text-slate-200">{d}</option>
                ))}
              </select>
            )}
          </div>

          {/* Status Slicer */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
            <span className="text-slate-400">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-slate-200">All Statuses</option>
              <option value="Active" className="bg-slate-900 text-slate-200">Active</option>
              <option value="Terminated" className="bg-slate-900 text-slate-200">Terminated</option>
              <option value="On Leave" className="bg-slate-900 text-slate-200">On Leave</option>
            </select>
          </div>

          {/* Quick 3000 Scale Toggle */}
          <button
            onClick={() => loadBenchmarkDataset(allEmployees.length === 3000 ? 487 : 3000)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-colors flex items-center gap-1.5"
            title="Toggle between 3,000 workforce benchmark and 487 sample"
          >
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono">{allEmployees.length.toLocaleString()}</span>
            <span className="text-slate-400 hidden xl:inline">Employees</span>
          </button>

          {/* + Add Person */}
          <button
            onClick={() => setShowAddEmployeeModal(true)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">+ Add Person</span>
          </button>

          {/* ⚡ Analyze & Generate Results */}
          <button
            onClick={runInstantAnalysis}
            disabled={isAnalyzing}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 disabled:opacity-75"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Analyze & Results</span>
              </>
            )}
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-colors flex items-center gap-1.5"
          >
            <span>Explain My Dashboard →</span>
          </button>
        </div>
      </div>

      {/* Module Selector Navigation Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto text-xs font-medium space-x-1">
        {[
          { id: 'workforce', label: 'Workforce & Demographics', icon: Users },
          { id: 'attrition', label: 'Attrition & Turnover', icon: TrendingDown },
          { id: 'recruitment', label: 'Recruitment Funnel', icon: UserPlus },
          { id: 'engagement', label: 'Engagement & Morale', icon: HeartHandshake },
          { id: 'performance', label: 'Performance Appraisals', icon: Award },
          { id: 'compensation', label: 'Compensation & Equity', icon: DollarSign },
          { id: 'attendance', label: 'Attendance & Leave', icon: Calendar },
        ].map(mod => {
          const Icon = mod.icon;
          const isActive = activeModule === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 font-semibold bg-indigo-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{mod.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. WORKFORCE & DEMOGRAPHICS */}
      {activeModule === 'workforce' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Headcount in Scope</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">{kpis.totalHeadcount}</div>
              <div className="text-[11px] text-emerald-400 mt-1">Active: {kpis.activeCount} employees</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Average Tenure</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">{kpis.avgTenure} yrs</div>
              <div className="text-[11px] text-slate-400 mt-1">Healthy organizational stability</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">New Hires (YTD)</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">42</div>
              <div className="text-[11px] text-indigo-400 mt-1">+8.6% workforce expansion</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Average Absence Days</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">{kpis.avgAbsenceDays} d</div>
              <div className="text-[11px] text-slate-400 mt-1">Below industry baseline (6.2d)</div>
            </div>
          </div>

          {/* Department Breakdown Bar List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Headcount Distribution by Department</h3>
              <div className="space-y-3">
                {kpis.departmentBreakdown.map(dept => {
                  const pct = kpis.totalHeadcount > 0 ? (dept.count / kpis.totalHeadcount) * 100 : 0;
                  return (
                    <div key={dept.department}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300 font-medium">{dept.department}</span>
                        <span className="font-mono text-slate-200 font-bold">{dept.count} ({pct.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Demographics: Gender & Tenure Distribution */}
            <div className="space-y-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-200 mb-3">Gender Diversity Representation</h3>
                <div className="grid grid-cols-3 gap-3">
                  {kpis.genderBreakdown.map(g => (
                    <div key={g.gender} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-center">
                      <span className="text-xs text-slate-400">{g.gender}</span>
                      <div className="text-xl font-bold text-white font-mono mt-1">{g.count}</div>
                      <span className="text-[10px] text-indigo-400 font-mono">{g.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-200 mb-3">Tenure Cohort Breakdown</h3>
                <div className="grid grid-cols-4 gap-2">
                  {kpis.tenureBuckets.map(b => (
                    <div key={b.range} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-center">
                      <span className="text-[11px] text-slate-400 block truncate">{b.range}</span>
                      <div className="text-lg font-bold text-white font-mono mt-1">{b.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ATTRITION & RETENTION */}
      {activeModule === 'attrition' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Total Departures</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">{kpis.exitCount}</div>
              <div className="text-[11px] text-amber-400 mt-1">YTD exits across departments</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Annualized Turnover</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">{kpis.turnoverRate}%</div>
              <div className="text-[11px] text-slate-400 mt-1">Calculated via standard DAX</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Voluntary Resignations</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">{kpis.voluntaryTurnoverRate}%</div>
              <div className="text-[11px] text-indigo-400 mt-1">65% of all terminations</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Retention Health</span>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                {(100 - kpis.turnoverRate).toFixed(1)}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Target is &gt; 92.0%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Turnover by Department */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Turnover Rate by Department</h3>
              <div className="space-y-3">
                {kpis.departmentBreakdown.map(dept => (
                  <div key={dept.department}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium">{dept.department}</span>
                      <span className="font-mono text-slate-200 font-bold">{dept.turnoverRate}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          dept.turnoverRate > 8.0 ? 'bg-red-500' : (dept.turnoverRate > 5.0 ? 'bg-amber-500' : 'bg-emerald-500')
                        }`}
                        style={{ width: `${Math.min(100, dept.turnoverRate * 8)}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exit Reasons Distribution */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Primary Exit Reasons (Resignations)</h3>
              <div className="space-y-3">
                {kpis.exitReasons.map(r => {
                  const pct = kpis.exitCount > 0 ? (r.count / kpis.exitCount) * 100 : 0;
                  return (
                    <div key={r.reason}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300 font-medium">{r.reason}</span>
                        <span className="font-mono text-slate-200 font-bold">{r.count} exits ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. RECRUITMENT FUNNEL */}
      {activeModule === 'recruitment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Avg Time to Hire</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">34 Days</div>
              <div className="text-[11px] text-emerald-400 mt-1">-14 days vs Q1 baseline</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Cost Per Hire</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">$4,120</div>
              <div className="text-[11px] text-slate-400 mt-1">Referrals lowered blended cost</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Offer Acceptance Rate</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">81.8%</div>
              <div className="text-[11px] text-emerald-400 mt-1">72 of 88 offers accepted</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Total Applicants</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">2,840</div>
              <div className="text-[11px] text-indigo-400 mt-1">Inbound + Sourced candidates</div>
            </div>
          </div>

          {/* Recruitment Funnel Stages */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-200 mb-6">ATS Stage Conversion Funnel</h3>
            <div className="space-y-4 max-w-3xl mx-auto">
              {[
                { stage: '1. Inbound Applicants', count: 2840, conversion: '100%', color: 'bg-indigo-600' },
                { stage: '2. Recruiter Screened', count: 1420, conversion: '50.0%', color: 'bg-indigo-500' },
                { stage: '3. Technical & Team Interview', count: 680, conversion: '23.9%', color: 'bg-indigo-400' },
                { stage: '4. Formal Offer Extended', count: 88, conversion: '3.1%', color: 'bg-sky-400' },
                { stage: '5. Signed Hires Onboarded', count: 72, conversion: '2.5%', color: 'bg-emerald-500' },
              ].map(stg => (
                <div key={stg.stage} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-200 font-medium">{stg.stage}</span>
                    <span className="font-mono text-slate-300 font-bold">{stg.count.toLocaleString()} ({stg.conversion})</span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div className={`h-full rounded-full ${stg.color}`} style={{ width: stg.conversion }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. ENGAGEMENT & CULTURE */}
      {activeModule === 'engagement' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Overall Engagement Score</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">{kpis.avgEngagement}%</div>
              <div className="text-[11px] text-emerald-400 mt-1">+4.0% vs prior quarter</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Employee NPS (eNPS)</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">+34</div>
              <div className="text-[11px] text-emerald-400 mt-1">Promoters: 52% | Detractors: 18%</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Survey Participation</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">89.2%</div>
              <div className="text-[11px] text-slate-400 mt-1">434 responses out of 487</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Workload Sentiment</span>
              <div className="text-2xl font-bold text-amber-400 font-mono mt-1">65%</div>
              <div className="text-[11px] text-amber-400 mt-1">Key area for HR attention</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-200 mb-6">Engagement Driver Analysis</h3>
            <div className="space-y-4">
              {[
                { driver: 'Internal Communication & Transparency', score: 84, benchmark: 80, desc: 'Company town halls and executive Q&As well-received' },
                { driver: 'Leadership Trust & Direction', score: 72, benchmark: 70, desc: 'Confidence in 2026 strategic roadmap' },
                { driver: 'Recognition & Feedback', score: 69, benchmark: 72, desc: 'Peer recognition program adoption increased' },
                { driver: 'Career Growth & Learning', score: 76, benchmark: 68, desc: 'New engineering career ladder rolled out' },
                { driver: 'Workload & Sustainable Pace', score: 65, benchmark: 74, desc: 'Sales and Support teams report deadline pressure' },
              ].map(item => (
                <div key={item.driver}>
                  <div className="flex justify-between text-xs mb-1">
                    <div>
                      <span className="text-slate-200 font-medium">{item.driver}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{item.desc}</span>
                    </div>
                    <span className="font-mono text-indigo-400 font-bold">{item.score}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full rounded-full ${item.score >= 75 ? 'bg-emerald-500' : (item.score >= 68 ? 'bg-indigo-500' : 'bg-amber-500')}`} 
                      style={{ width: `${item.score}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. PERFORMANCE APPRAISALS */}
      {activeModule === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Average Rating</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">3.62 / 5.0</div>
              <div className="text-[11px] text-slate-400 mt-1">Centered bell curve distribution</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Exceptional Performers</span>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">8.2%</div>
              <div className="text-[11px] text-slate-400 mt-1">Top-tier leadership pool</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Goal Attainment (KPIs)</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">91.4%</div>
              <div className="text-[11px] text-emerald-400 mt-1">Company OKRs on track</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Underperforming Pool</span>
              <div className="text-2xl font-bold text-amber-400 font-mono mt-1">4.1%</div>
              <div className="text-[11px] text-slate-400 mt-1">Enrolled in coaching plans</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-200 mb-6">Performance Bell Curve Distribution</h3>
            <div className="grid grid-cols-5 gap-3 text-center">
              {[
                { label: 'Unsatisfactory (1)', pct: '4%', count: 19, color: 'bg-red-500' },
                { label: 'Needs Dev (2)', pct: '13%', count: 63, color: 'bg-amber-500' },
                { label: 'Meets Standards (3)', pct: '54%', count: 263, color: 'bg-blue-500' },
                { label: 'Exceeds (4)', pct: '21%', count: 102, color: 'bg-indigo-500' },
                { label: 'Exceptional (5)', pct: '8%', count: 40, color: 'bg-emerald-500' },
              ].map(tier => (
                <div key={tier.label} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">{tier.label}</span>
                    <div className="text-2xl font-bold text-white font-mono my-2">{tier.pct}</div>
                    <span className="text-xs text-slate-400 font-mono">{tier.count} staff</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className={`h-full ${tier.color}`} style={{ width: tier.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. COMPENSATION & EQUITY (WITH ROLE PERMISSION PRIVACY CONTROL) */}
      {activeModule === 'compensation' && (
        <div className="space-y-6">
          {!permissions.canViewCompensation ? (
            <div className="p-8 rounded-2xl bg-amber-950/20 border border-amber-900/40 text-center max-w-xl mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Compensation Privacy Restricted</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your current active role (<strong>{currentUser.role}</strong>) does not have authorization to view sensitive salary figures or individual compensation benchmarks.
              </p>
              <p className="text-[11px] text-slate-400">
                To test compensation analytics, switch your active account role to <strong>Super Admin</strong>, <strong>HR Admin</strong>, or <strong>People Analyst</strong> via the top right role pill.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
                  <span className="text-xs text-slate-400 font-medium">Average Base Salary</span>
                  <div className="text-2xl font-bold text-white font-mono mt-1">${kpis.avgSalary.toLocaleString()}</div>
                  <div className="text-[11px] text-emerald-400 mt-1">Annualized across active headcount</div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
                  <span className="text-xs text-slate-400 font-medium">Total Annual Payroll</span>
                  <div className="text-2xl font-bold text-white font-mono mt-1">
                    ${((kpis.avgSalary * kpis.totalHeadcount) / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Pre-variable & bonus allocation</div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
                  <span className="text-xs text-slate-400 font-medium">Average Compa-Ratio</span>
                  <div className="text-2xl font-bold text-white font-mono mt-1">0.98</div>
                  <div className="text-[11px] text-emerald-400 mt-1">2% below market midpoint</div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
                  <span className="text-xs text-slate-400 font-medium">Gender Pay Ratio</span>
                  <div className="text-2xl font-bold text-white font-mono mt-1">99.1%</div>
                  <div className="text-[11px] text-emerald-400 mt-1">Controlled for tenure and job level</div>
                </div>
              </div>

              {/* Department Salary Breakdown */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-200 mb-4">Average Annual Compensation by Department</h3>
                <div className="space-y-3">
                  {kpis.departmentBreakdown.map(dept => (
                    <div key={dept.department}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300 font-medium">{dept.department}</span>
                        <span className="font-mono text-emerald-400 font-bold">${dept.avgSalary.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${Math.min(100, (dept.avgSalary / 160000) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 7. ATTENDANCE & LEAVE */}
      {activeModule === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Unplanned Absence Rate</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">2.4%</div>
              <div className="text-[11px] text-emerald-400 mt-1">Calculated via FactAttendance</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Avg Annual Sick Days</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">{kpis.avgAbsenceDays} Days</div>
              <div className="text-[11px] text-slate-400 mt-1">Average per employee/year</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">PTO Utilization Rate</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">78.5%</div>
              <div className="text-[11px] text-indigo-400 mt-1">Healthy vacation usage</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Current Staff on Leave</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">16</div>
              <div className="text-[11px] text-slate-400 mt-1">Parental & medical leave</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Leave Type Breakdown (Annual Days Taken)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-xs text-slate-400">Paid Time Off (PTO)</span>
                <div className="text-xl font-bold text-white font-mono mt-1">6,840 d</div>
                <span className="text-[10px] text-indigo-400">58% of total leave</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-xs text-slate-400">Sick & Medical Leave</span>
                <div className="text-xl font-bold text-white font-mono mt-1">1,940 d</div>
                <span className="text-[10px] text-amber-400">17% of total leave</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-xs text-slate-400">Parental Leave</span>
                <div className="text-xl font-bold text-white font-mono mt-1">2,100 d</div>
                <span className="text-[10px] text-emerald-400">18% of total leave</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-xs text-slate-400">Unpaid / Other</span>
                <div className="text-xl font-bold text-white font-mono mt-1">820 d</div>
                <span className="text-[10px] text-slate-500">7% of total leave</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
