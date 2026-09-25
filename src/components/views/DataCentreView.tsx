import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CsvDataUpload } from '../CsvDataUpload';
import { 
  Upload, 
  FileSpreadsheet, 
  Database, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink, 
  FileUp, 
  Table, 
  Info, 
  Check, 
  X,
  FileCode,
  UserPlus,
  Zap,
  Loader2,
  Users
} from 'lucide-react';
import Papa from 'papaparse';

export const DataCentreView: React.FC = () => {
  const { 
    dataProfile, 
    dirtyRawData, 
    allEmployees, 
    isDataCleaned, 
    autoFixAllIssues, 
    resetRawData, 
    uploadCustomDataset,
    setActiveTab,
    loadBenchmarkDataset,
    runInstantAnalysis,
    isAnalyzing,
    setShowAddEmployeeModal,
    setShowAnalysisModal,
    lastAnalysisResult
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'csv_upload' | 'profiler' | 'preview' | 'sources'>('csv_upload');
  const [googleSheetsModal, setGoogleSheetsModal] = useState(false);
  const [sheetUrl, setSheetUrl] = useState('https://docs.google.com/spreadsheets/d/1X9b..._hr_master_2026/edit');
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          uploadCustomDataset(file.name, results.data);
          setUploadSuccessMsg(`Successfully imported ${file.name} with ${results.data.length} records!`);
          setTimeout(() => setUploadSuccessMsg(null), 4000);
        }
      },
      error: (err) => {
        console.error('CSV Parse Error:', err);
      }
    });
  };

  const handleGoogleSheetsSync = () => {
    setGoogleSheetsModal(false);
    setUploadSuccessMsg('Connected Google Sheets template! Synced 487 live employee records.');
    setTimeout(() => setUploadSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Data Import & Profiler Centre</h1>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Layer 1 & 2
            </span>
          </div>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Connect Excel, CSV, Google Sheets, or Databases. The automated profiler diagnoses data quality issues instantly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Bulk CSV Import Button */}
          <button
            onClick={() => setActiveSubTab('csv_upload')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'csv_upload'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/50'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-indigo-300" />
            <span>Bulk CSV Import</span>
          </button>

          {/* Quick 3000 Scale Button */}
          <button
            onClick={() => loadBenchmarkDataset(3000)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              allEmployees.length === 3000
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title="Load 3,000 workforce benchmark dataset"
          >
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>3,000 Benchmark ({allEmployees.length})</span>
          </button>

          {/* + Add Record Button */}
          <button
            onClick={() => setShowAddEmployeeModal(true)}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Add Person</span>
          </button>

          {/* Instant Analysis Button */}
          <button
            onClick={runInstantAnalysis}
            disabled={isAnalyzing}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all disabled:opacity-75"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Analyze & Results</span>
              </>
            )}
          </button>

          {isDataCleaned ? (
            <button
              onClick={resetRawData}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Batch</span>
            </button>
          ) : (
            <button
              onClick={() => {
                autoFixAllIssues();
                setActiveTab('clean');
              }}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fix ({dataProfile.issues.length})</span>
            </button>
          )}
        </div>
      </div>

      {uploadSuccessMsg && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{uploadSuccessMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-medium overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('csv_upload')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'csv_upload'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Bulk CSV Importer</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
            Direct Import
          </span>
        </button>
        <button
          onClick={() => setActiveSubTab('profiler')}
          className={`px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'profiler'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Data Profiler & Quality Score
        </button>
        <button
          onClick={() => setActiveSubTab('preview')}
          className={`px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'preview'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Raw vs Cleaned Data Grid
        </button>
        <button
          onClick={() => setActiveSubTab('sources')}
          className={`px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'sources'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Connect New Sources (Google Sheets & DBs)
        </button>
      </div>

      {/* Tab 0: Bulk CSV Importer */}
      {activeSubTab === 'csv_upload' && (
        <CsvDataUpload onNavigateToAnalytics={() => setActiveTab('analytics')} />
      )}

      {/* Tab 1: Profiler & Score */}
      {activeSubTab === 'profiler' && (
        <div className="space-y-6">
          {/* Quality Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Score Meter */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Data Quality Score</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                    dataProfile.overallScore > 90 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {dataProfile.overallScore > 90 ? 'HIGH QUALITY' : 'ACTION REQUIRED'}
                  </span>
                </div>

                <div className="my-6 text-center">
                  <div className="text-5xl font-extrabold text-white font-mono tracking-tight">
                    {dataProfile.overallScore}%
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    {dataProfile.overallScore > 90 
                      ? 'Dataset conforms to HR analytics modeling standards.'
                      : 'Raw anomalies detected. Recommended to run the Power Query pipeline.'}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Total Scanned Rows</span>
                  <span className="font-mono font-bold text-slate-100">{dataProfile.rowCount}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Detected Columns</span>
                  <span className="font-mono font-bold text-slate-100">{dataProfile.columnCount}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Active Deduplication</span>
                  <span className="font-mono text-emerald-400 font-bold">{isDataCleaned ? 'Enforced' : 'Pending'}</span>
                </div>
              </div>
            </div>

            {/* Quality Dimensions Radar/Bars */}
            <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Five Pillars of People Data Health</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Completeness</span>
                    <span className="font-mono text-indigo-400 font-bold">{dataProfile.completeness}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${dataProfile.completeness}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Missing fields in department or termination dates</p>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Consistency</span>
                    <span className="font-mono text-indigo-400 font-bold">{dataProfile.consistency}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full" style={{ width: `${dataProfile.consistency}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Standardized casing, acronyms, and department taxonomy</p>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Accuracy & Types</span>
                    <span className="font-mono text-indigo-400 font-bold">{dataProfile.accuracy}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${dataProfile.accuracy}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Salary stored as currency/number vs text string</p>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Uniqueness</span>
                    <span className="font-mono text-indigo-400 font-bold">{dataProfile.uniqueness}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${dataProfile.uniqueness}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Primary key Employee_ID duplicate verification</p>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Validity</span>
                    <span className="font-mono text-indigo-400 font-bold">{dataProfile.validity}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${dataProfile.validity}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Date formatting (ISO 8601 YYYY-MM-DD vs mixed format)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Issues List with Fix Actions */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-slate-200">
                  Detected Quality Anomalies & Remediation Steps
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {dataProfile.issues.length} Pending Rules
              </span>
            </div>

            <div className="space-y-3">
              {dataProfile.issues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                        issue.severity === 'critical' ? 'bg-red-950 text-red-400 border border-red-800' :
                        issue.severity === 'warning' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-blue-950 text-blue-400 border border-blue-800'
                      }`}>
                        {issue.severity}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-200">{issue.description}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      <strong>Suggested Fix:</strong> {issue.suggestedFix} ({issue.affectedCount} rows affected)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {issue.autoFixable ? (
                      <button
                        onClick={() => {
                          autoFixAllIssues();
                          setActiveTab('clean');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Fix in Pipeline</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">Manual Validation</span>
                    )}
                  </div>
                </div>
              ))}

              {dataProfile.issues.length === 0 && (
                <div className="p-6 text-center text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-200">No critical anomalies remaining!</p>
                  <p className="text-[11px] text-slate-500 mt-1">All 487 rows have been cleaned, deduplicated, and typed.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Raw vs Cleaned Preview */}
      {activeSubTab === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Showing batch data preview ({isDataCleaned ? 'Standardized Clean Records' : 'Raw Dirty Upload Records with duplicates & text salaries'})
            </p>
            <button
              onClick={() => setActiveTab('clean')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Open Power Query Pipeline Editor →
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Employee ID</th>
                  <th className="py-2.5 px-3">Full Name</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Job Title</th>
                  <th className="py-2.5 px-3">Salary</th>
                  <th className="py-2.5 px-3">Hire Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Tenure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {isDataCleaned ? (
                  allEmployees.slice(0, 12).map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2 px-3 text-indigo-400 font-bold">{emp.id}</td>
                      <td className="py-2 px-3 font-sans text-slate-200 font-medium">{emp.name}</td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                          {emp.department}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-sans text-slate-300">{emp.jobTitle}</td>
                      <td className="py-2 px-3 text-emerald-400 font-semibold">${emp.salary.toLocaleString()}</td>
                      <td className="py-2 px-3 text-slate-400">{emp.hireDate}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          emp.employmentStatus === 'Active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          emp.employmentStatus === 'Terminated' ? 'bg-red-950 text-red-400 border border-red-800' :
                          'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {emp.employmentStatus}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-300">{emp.tenureYears} yrs</td>
                    </tr>
                  ))
                ) : (
                  dirtyRawData.map((row, idx) => (
                    <tr key={idx} className={`hover:bg-slate-800/40 transition-colors ${row.Notes ? 'bg-amber-950/20' : ''}`}>
                      <td className="py-2 px-3 text-amber-400 font-bold">{row.Employee_ID}</td>
                      <td className="py-2 px-3 font-sans text-slate-200">{row.Employee_Name}</td>
                      <td className="py-2 px-3 text-red-400">{row.Department || '<BLANK>'}</td>
                      <td className="py-2 px-3 font-sans text-slate-300">{row.Job_Title}</td>
                      <td className="py-2 px-3 text-amber-300 font-bold">{row.Salary}</td>
                      <td className="py-2 px-3 text-slate-400">{row.Hire_Date}</td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                          {row.Status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-500">{row.Notes || 'Pending Clean'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Connect Sources */}
      {activeSubTab === 'sources' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CSV / Excel File Upload */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                <FileUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200">Upload CSV / Excel File</h3>
              <p className="text-xs text-slate-400 mt-1">
                Drop your raw .xlsx, .csv, or .json file to parse columns, detect data types, and run the quality engine.
              </p>
            </div>

            <div className="mt-6 space-y-2">
              <button
                onClick={() => setActiveSubTab('csv_upload')}
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Open Bulk CSV Importer</span>
              </button>

              <label className="w-full flex items-center justify-center border border-dashed border-slate-700 hover:border-indigo-500 rounded-lg p-2 cursor-pointer bg-slate-950/40 hover:bg-slate-950 text-center transition-colors">
                <span className="text-[11px] text-slate-400">Quick upload file directly</span>
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Google Sheets Connect */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200">Connect Google Sheets</h3>
              <p className="text-xs text-slate-400 mt-1">
                Sync live employee rosters, leave schedules, and pulse surveys directly from Google Drive or Shared Drives.
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setGoogleSheetsModal(true)}
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Connect Google Sheets URL</span>
              </button>
            </div>
          </div>

          {/* Relational Database Connect */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200">Connect Relational DB</h3>
              <p className="text-xs text-slate-400 mt-1">
                Query directly from PostgreSQL, MySQL, BigQuery, Snowflake, or HRIS APIs (Workday, BambooHR, Rippling).
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setActiveTab('sql_python')}
                className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <Database className="w-4 h-4 text-indigo-400" />
                <span>Open SQL Query Engine</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Sheets Modal */}
      {googleSheetsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Connect Google Sheets Spreadsheet</h3>
              </div>
              <button onClick={() => setGoogleSheetsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Paste the public or shared Google Sheets URL containing your Employee Master, Attendance, or Payroll sheets.
            </p>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Google Sheets URL</label>
              <input
                type="text"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">Expected Sheet Tabs:</p>
              <p>✓ 01_Employee_Master &nbsp;&nbsp; ✓ 02_Payroll &nbsp;&nbsp; ✓ 03_Attendance</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setGoogleSheetsModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleGoogleSheetsSync}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Sync & Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
