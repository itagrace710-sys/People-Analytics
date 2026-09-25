import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserPlus, 
  X, 
  Check, 
  Sparkles, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  Layers, 
  Users,
  PlusCircle,
  Upload,
  FileSpreadsheet
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/mockHrData';

export const AddEmployeeModal: React.FC = () => {
  const { 
    showAddEmployeeModal, 
    setShowAddEmployeeModal, 
    addEmployeeRecord,
    batchAddEmployees,
    runInstantAnalysis,
    setActiveTab
  } = useApp();

  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [jobTitle, setJobTitle] = useState('Senior Software Engineer');
  const [salary, setSalary] = useState<number>(135000);
  const [gender, setGender] = useState<'Female' | 'Male' | 'Non-Binary'>('Female');
  const [status, setStatus] = useState<'Active' | 'Terminated' | 'On Leave'>('Active');
  const [hireDate, setHireDate] = useState('2024-02-15');
  const [tenureYears, setTenureYears] = useState<number>(2.5);
  const [performanceRating, setPerformanceRating] = useState<number>(4);
  const [engagementScore, setEngagementScore] = useState<number>(85);
  const [exitReason, setExitReason] = useState<'Compensation' | 'Career Growth' | 'Manager Conflict' | 'Relocation' | 'Personal' | 'Other'>('Career Growth');
  const [location, setLocation] = useState('San Francisco, HQ');

  if (!showAddEmployeeModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addEmployeeRecord({
      name: name.trim(),
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@company.com`,
      department,
      jobTitle,
      salary: Number(salary) || 85000,
      gender,
      dateOfBirth: '1992-06-15',
      hireDate,
      exitDate: status === 'Terminated' ? '2026-08-10' : undefined,
      employmentStatus: status,
      employmentType: 'Full-time',
      location,
      tenureYears: Number(tenureYears) || 1.0,
      performanceRating: Number(performanceRating) || 3,
      engagementScore: Number(engagementScore) || 75,
      absenceDaysLastYear: status === 'Terminated' ? 9 : 4,
      exitReason: status === 'Terminated' ? exitReason : undefined
    });

    setShowAddEmployeeModal(false);
    runInstantAnalysis();
  };

  const handleAddBatch = (count: number) => {
    // Generate quick batch of records
    const batch = Array.from({ length: count }).map((_, idx) => {
      const depts = DEPARTMENTS;
      const dept = depts[idx % depts.length];
      const isExit = idx % 12 === 0;
      return {
        id: `EMP-BATCH-${Date.now()}-${idx}`,
        name: `Batch Candidate ${idx + 1}`,
        email: `batch.person${idx + 1}@company.com`,
        department: dept,
        jobTitle: `${dept} Specialist`,
        salary: 95000 + (idx * 1200) % 40000,
        gender: idx % 2 === 0 ? 'Female' : 'Male',
        dateOfBirth: '1990-04-12',
        hireDate: '2024-01-10',
        exitDate: isExit ? '2026-07-15' : undefined,
        employmentStatus: isExit ? 'Terminated' : 'Active',
        employmentType: 'Full-time',
        location: 'San Francisco, HQ',
        tenureYears: 1.8,
        performanceRating: 3 + (idx % 3),
        engagementScore: 78 + (idx % 18),
        absenceDaysLastYear: 4,
        exitReason: isExit ? 'Career Growth' : undefined
      } as any;
    });

    batchAddEmployees(batch);
    setShowAddEmployeeModal(false);
    runInstantAnalysis();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add People Information & Analyze</h3>
              <p className="text-xs text-slate-400">Add an individual employee record or batch ingest into the active 3,000 dataset</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddEmployeeModal(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Batch Ingestion Buttons */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-slate-200">Rapid Test Batch Ingestion</span>
            <p className="text-[11px] text-slate-400">Need to test high volume? Add sample groups instantly</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAddBatch(25)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            >
              +25 People
            </button>
            <button
              type="button"
              onClick={() => handleAddBatch(100)}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 text-xs font-medium border border-indigo-800 transition-colors"
            >
              +100 People
            </button>
            <button
              type="button"
              onClick={() => handleAddBatch(500)}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-colors"
            >
              +500 People
            </button>
          </div>
        </div>

        {/* Bulk CSV Import Callout */}
        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-300">
            <FileSpreadsheet className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>Have an existing HR spreadsheet? Use bulk CSV import to upload hundreds at once.</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowAddEmployeeModal(false);
              setActiveTab('data_clean');
            }}
            className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Open Bulk CSV Importer</span>
          </button>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Employee Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Maya Lin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Department *</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Job Title *</label>
              <input
                type="text"
                placeholder="e.g. Staff Backend Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Annual Base Salary ($) *</label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Employment Status *</label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Active">Active</option>
                <option value="Terminated">Terminated (Exit)</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Gender Representation</label>
              <select
                value={gender}
                onChange={(e: any) => setGender(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-Binary">Non-Binary</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Tenure (Years)</label>
              <input
                type="number"
                step="0.1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Performance Rating (1 - 5)</label>
              <select
                value={performanceRating}
                onChange={(e) => setPerformanceRating(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value="1">1 - Unsatisfactory</option>
                <option value="2">2 - Needs Development</option>
                <option value="3">3 - Meets Standards</option>
                <option value="4">4 - Exceeds Expectations</option>
                <option value="5">5 - Exceptional</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Engagement Score (0 - 100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={engagementScore}
                onChange={(e) => setEngagementScore(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {status === 'Terminated' && (
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Primary Exit Reason</label>
                <select
                  value={exitReason}
                  onChange={(e: any) => setExitReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Compensation">Compensation</option>
                  <option value="Career Growth">Career Growth</option>
                  <option value="Manager Conflict">Manager Conflict</option>
                  <option value="Relocation">Relocation</option>
                  <option value="Personal">Personal</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowAddEmployeeModal(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Add & Generate Analysis</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
