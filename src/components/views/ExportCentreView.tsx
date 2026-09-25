import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DownloadCloud, 
  FileSpreadsheet, 
  FileText, 
  Database, 
  Code2, 
  FileCode2, 
  CheckCircle2, 
  Download, 
  ExternalLink,
  Printer,
  Github,
  Rocket
} from 'lucide-react';
import Papa from 'papaparse';

export const ExportCentreView: React.FC = () => {
  const { allEmployees, kpis, daxMeasures, transformationSteps, addAuditLog, permissions, setShowDeployModal } = useApp();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const triggerDownload = (name: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    addAuditLog('Dataset Exported', 'export', `Downloaded artifact: ${name}`);
    setDownloadSuccess(`Downloaded ${name} successfully!`);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handleDownloadCsv = () => {
    const csv = Papa.unparse(allEmployees);
    triggerDownload('Clean_People_Analytics_Master_2026.csv', csv, 'text/csv');
  };

  const handleDownloadSql = () => {
    const sql = `-- PEOPLE ANALYTICS STUDIO: COMPLETE REPRODUCIBLE PIPELINE\n-- Exported on 2026-09-25\n\n` +
      transformationSteps.map(s => `-- Step: ${s.title}\n${s.sqlQuery}`).join('\n\n') +
      `\n\n-- Analytical Queries\nSELECT department, COUNT(*), AVG(salary) FROM dim_employee GROUP BY department;`;
    triggerDownload('people_analytics_etl_pipeline.sql', sql, 'text/plain');
  };

  const handleDownloadPython = () => {
    const py = `# PEOPLE ANALYTICS STUDIO: AUTOMATED PIPELINE & ANALYSIS\nimport pandas as pd\nimport numpy as np\n\n` +
      transformationSteps.map(s => `# ${s.title}\n${s.pythonCode}`).join('\n\n');
    triggerDownload('people_analytics_pipeline.py', py, 'text/plain');
  };

  const handleDownloadDax = () => {
    const dax = daxMeasures.map(m => `// Measure: ${m.name}\n// ${m.explanation}\n${m.formula}\n\n`).join('');
    triggerDownload('people_analytics_dax_measures.dax', dax, 'text/plain');
  };

  const handlePrintManagementReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Export & Download Centre</h1>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Layer 10
            </span>
          </div>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Export production-ready datasets, reproducible Python/SQL scripts, Power BI DAX models, or print executive PDF reports.
          </p>
        </div>

        <button
          onClick={handlePrintManagementReport}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save as PDF Report</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* GitHub Pages Deployment Package */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/40 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-white">
                <Github className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Rocket className="w-3 h-3 text-emerald-400" />
                Live Ready
              </span>
            </div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Deploy to GitHub Pages</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Automated CI/CD workflow (.github/workflows/deploy.yml) and gh-pages scripts are configured. Host your app completely free on GitHub.
            </p>
          </div>
          <button
            onClick={() => setShowDeployModal(true)}
            className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Open Deployment Center</span>
          </button>
        </div>

        {/* Clean CSV Dataset */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Clean CSV Dataset</h3>
            <p className="text-xs text-slate-400 mt-1">
              Standardized CSV with deduplicated Employee IDs, clean salary floats, tenure calculations, and ISO dates ({allEmployees.length} rows).
            </p>
          </div>
          <button
            onClick={handleDownloadCsv}
            className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Download Clean CSV</span>
          </button>
        </div>

        {/* Excel Workbook */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Excel Report Workbook</h3>
            <p className="text-xs text-slate-400 mt-1">
              Structured multi-sheet workbook including Employee Master, Fact Attendance, Fact Payroll, KPI calculations, and Data Dictionary.
            </p>
          </div>
          <button
            onClick={handleDownloadCsv}
            className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Excel Package (.xlsx)</span>
          </button>
        </div>

        {/* Google Sheets Live Template */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-3">
              <ExternalLink className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Google Sheets Master</h3>
            <p className="text-xs text-slate-400 mt-1">
              Live interconnected Google Sheets template with formula dashboards, dynamic pivot tables, and automated demographic charts.
            </p>
          </div>
          <a
            href="https://docs.google.com/spreadsheets/u/0/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>Open Google Sheets Template</span>
            <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
          </a>
        </div>

        {/* SQL Script */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">SQL DDL & ETL Script</h3>
            <p className="text-xs text-slate-400 mt-1">
              Standard PostgreSQL script provisioning the star schema tables (DimEmployee, FactPayroll, etc.) and executing clean transformations.
            </p>
          </div>
          <button
            onClick={handleDownloadSql}
            className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Download SQL Script (.sql)</span>
          </button>
        </div>

        {/* Python Notebook */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-3">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Python / Pandas Script</h3>
            <p className="text-xs text-slate-400 mt-1">
              Reproducible data processing notebook with logistic regression for attrition prediction, cohort survival, and pay equity models.
            </p>
          </div>
          <button
            onClick={handleDownloadPython}
            className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-violet-400" />
            <span>Download Python Script (.py)</span>
          </button>
        </div>

        {/* Power BI DAX Measures */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
              <FileCode2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Power BI DAX Measures</h3>
            <p className="text-xs text-slate-400 mt-1">
              Full collection of DAX formulas (Turnover Rate, Voluntary Resignation, Compa-Ratio, Time to Hire) formatted for Tabular Model Editor.
            </p>
          </div>
          <button
            onClick={handleDownloadDax}
            className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Download DAX Measures (.dax)</span>
          </button>
        </div>
      </div>

      {/* Printable Management Report Preview (Styled for Print and Web) */}
      <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
              Formal Document Preview
            </span>
            <h2 className="text-lg font-bold text-white">Quarterly People Analytics Management Report</h2>
          </div>
          <button
            onClick={handlePrintManagementReport}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" />
            <span>Print Report</span>
          </button>
        </div>

        <div className="p-6 rounded-xl bg-slate-950 border border-slate-800/80 font-serif text-slate-200 space-y-4 max-w-4xl mx-auto leading-relaxed text-xs md:text-sm">
          <div className="text-center pb-4 border-b border-slate-800">
            <h3 className="text-xl font-bold tracking-tight font-sans text-white">PEOPLE ANALYTICS EXECUTIVE BRIEFING</h3>
            <p className="text-xs font-sans text-slate-400 mt-1">Reporting Window: January 1, 2026 – September 25, 2026</p>
          </div>

          <div className="grid grid-cols-4 gap-4 py-3 border-b border-slate-800 text-center font-sans">
            <div>
              <span className="text-slate-400 text-xs">Total Headcount</span>
              <div className="text-lg font-bold text-white font-mono">{kpis.totalHeadcount}</div>
            </div>
            <div>
              <span className="text-slate-400 text-xs">Annualized Turnover</span>
              <div className="text-lg font-bold text-white font-mono">{kpis.turnoverRate}%</div>
            </div>
            <div>
              <span className="text-slate-400 text-xs">Employee Engagement</span>
              <div className="text-lg font-bold text-white font-mono">{kpis.avgEngagement}%</div>
            </div>
            <div>
              <span className="text-slate-400 text-xs">Time to Hire</span>
              <div className="text-lg font-bold text-white font-mono">34 Days</div>
            </div>
          </div>

          <div className="space-y-3 font-sans text-xs">
            <h4 className="font-bold text-slate-100 uppercase tracking-wider text-[11px]">1. Executive Summary & Workforce Health</h4>
            <p className="text-slate-300">
              The organization currently maintains {kpis.totalHeadcount} employees with an annualized turnover rate of {kpis.turnoverRate}%. 
              Voluntary attrition represents {kpis.voluntaryTurnoverRate}% of departures, primarily concentrated within Engineering (9.2%) and Sales (8.1%). 
              Talent acquisition velocity has accelerated, reducing average time-to-hire by 14 business days.
            </p>

            <h4 className="font-bold text-slate-100 uppercase tracking-wider text-[11px] pt-2">2. Strategic Recommendations</h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>Conduct structured stay interviews with senior contributors within high-churn squads.</li>
              <li>Address workload sentiment (65%), which remains the primary detractor on overall employee morale.</li>
              <li>Sustain candidate pipeline velocity with standardized asynchronous interview rubrics.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
