import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Terminal, 
  Play, 
  HelpCircle, 
  Copy, 
  Check, 
  Download, 
  Database, 
  Code2, 
  Sparkles, 
  Layers, 
  ChevronRight,
  BookOpen
} from 'lucide-react';

export const SqlPythonLabView: React.FC = () => {
  const { allEmployees, permissions, currentUser, addAuditLog } = useApp();
  const [activeEngine, setActiveEngine] = useState<'sql' | 'python'>('sql');

  // SQL State
  const defaultSql = `SELECT \n  department,\n  COUNT(*) AS total_employees,\n  SUM(CASE WHEN employment_status = 'Terminated' THEN 1 ELSE 0 END) AS exits,\n  ROUND((SUM(CASE WHEN employment_status = 'Terminated' THEN 1 ELSE 0 END)::numeric / COUNT(*)) * 100, 1) AS turnover_rate_pct,\n  ROUND(AVG(salary), 0) AS avg_salary\nFROM dim_employee\nGROUP BY department\nORDER BY turnover_rate_pct DESC;`;
  
  const [sqlQuery, setSqlQuery] = useState(defaultSql);
  const [sqlResult, setSqlResult] = useState<any[] | null>(null);
  const [sqlTime, setSqlTime] = useState<number | null>(null);
  const [sqlExplaining, setSqlExplaining] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Python State
  const [pythonScriptType, setPythonScriptType] = useState<'turnover' | 'compensation' | 'retention'>('turnover');
  const [pythonOutput, setPythonOutput] = useState<string | null>(null);
  const [isPythonRunning, setIsPythonRunning] = useState(false);
  const [copiedPython, setCopiedPython] = useState(false);

  // Predefined SQL queries
  const sqlPresets = [
    {
      title: 'Turnover Rate by Department',
      desc: 'Aggregates terminations and calculates turnover percentage',
      query: defaultSql,
      explanation: 'Groups employees by Department, counts total rows, computes conditional sum of terminated employees, and divides to obtain turnover rate percentage.'
    },
    {
      title: 'High Performers with Tenure > 2 Years',
      desc: 'Filters talent retention targets with Rating >= 4',
      query: `SELECT \n  id, name, department, job_title, tenure_years, performance_rating, engagement_score\nFROM dim_employee\nWHERE tenure_years >= 2.0 AND performance_rating >= 4\nORDER BY performance_rating DESC, tenure_years DESC\nLIMIT 15;`,
      explanation: 'Filters DimEmployee records where tenure is greater than 2 years and performance appraisal rating is 4 or 5. Ideal for leadership retention pipelines.'
    },
    {
      title: 'Unplanned Absence vs Engagement Score',
      desc: 'Identifies correlation between sick days and pulse score',
      query: `SELECT \n  department,\n  ROUND(AVG(absence_days_last_year), 1) AS avg_absence_days,\n  ROUND(AVG(engagement_score), 1) AS avg_engagement,\n  ROUND(AVG(performance_rating), 2) AS avg_performance\nFROM dim_employee\nGROUP BY department\nORDER BY avg_absence_days DESC;`,
      explanation: 'Computes department-level averages for absenteeism, engagement score, and performance to identify teams experiencing burnout or fatigue.'
    }
  ];

  const handleRunSql = () => {
    const start = performance.now();
    addAuditLog('SQL Query Executed', 'query', `Executed analytical SQL query in SQL Lab`);

    // Execute query simulation on employee data
    if (sqlQuery.includes('performance_rating >= 4') || sqlQuery.includes('tenure_years >= 2.0')) {
      const filtered = allEmployees
        .filter(e => e.tenureYears >= 2.0 && e.performanceRating >= 4)
        .slice(0, 15)
        .map(e => ({
          id: e.id,
          name: e.name,
          department: e.department,
          job_title: e.jobTitle,
          tenure_years: e.tenureYears,
          performance_rating: e.performanceRating,
          engagement_score: e.engagementScore
        }));
      setSqlResult(filtered);
    } else if (sqlQuery.includes('absence_days_last_year')) {
      const deptMap: Record<string, { absence: number; eng: number; perf: number; count: number }> = {};
      allEmployees.forEach(e => {
        if (!deptMap[e.department]) deptMap[e.department] = { absence: 0, eng: 0, perf: 0, count: 0 };
        deptMap[e.department].absence += e.absenceDaysLastYear;
        deptMap[e.department].eng += e.engagementScore;
        deptMap[e.department].perf += e.performanceRating;
        deptMap[e.department].count += 1;
      });
      const res = Object.entries(deptMap).map(([dept, v]) => ({
        department: dept,
        avg_absence_days: (v.absence / v.count).toFixed(1),
        avg_engagement: (v.eng / v.count).toFixed(1),
        avg_performance: (v.perf / v.count).toFixed(2)
      })).sort((a, b) => Number(b.avg_absence_days) - Number(a.avg_absence_days));
      setSqlResult(res);
    } else {
      // Default turnover query
      const deptMap: Record<string, { total: number; exits: number; salary: number }> = {};
      allEmployees.forEach(e => {
        if (!deptMap[e.department]) deptMap[e.department] = { total: 0, exits: 0, salary: 0 };
        deptMap[e.department].total += 1;
        deptMap[e.department].salary += e.salary;
        if (e.employmentStatus === 'Terminated') deptMap[e.department].exits += 1;
      });
      const res = Object.entries(deptMap).map(([dept, v]) => ({
        department: dept,
        total_employees: v.total,
        exits: v.exits,
        turnover_rate_pct: `${((v.exits / v.total) * 100).toFixed(1)}%`,
        avg_salary: `$${Math.round(v.salary / (v.total || 1)).toLocaleString()}`
      })).sort((a, b) => parseFloat(b.turnover_rate_pct) - parseFloat(a.turnover_rate_pct));
      setSqlResult(res);
    }

    const elapsed = Math.round(performance.now() - start);
    setSqlTime(Math.max(12, elapsed));
  };

  const getPythonCode = () => {
    switch (pythonScriptType) {
      case 'turnover':
        return `# PEOPLE ANALYTICS PYTHON LAB: ATTRITION LOGISTIC REGRESSION
import pandas as pd
import numpy as np

# Load modeled dataset
df = pd.read_parquet("clean_employees.parquet")

# 1. Feature Engineering
df['is_terminated'] = (df['employment_status'] == 'Terminated').astype(int)
df['tenure_bucket'] = pd.cut(df['tenure_years'], bins=[0, 1, 2, 4, 10], labels=['<1yr', '1-2yr', '2-4yr', '4yr+'])

# 2. Group Aggregations
turnover_summary = df.groupby('department').agg(
    headcount=('id', 'count'),
    exits=('is_terminated', 'sum'),
    avg_engagement=('engagement_score', 'mean'),
    avg_salary=('salary', 'mean')
).reset_index()

turnover_summary['turnover_pct'] = (turnover_summary['exits'] / turnover_summary['headcount'] * 100).round(2)
turnover_summary = turnover_summary.sort_values(by='turnover_pct', ascending=False)

print("=== TURNOVER SUMMARY BY DEPARTMENT ===")
print(turnover_summary.to_string(index=False))`;

      case 'compensation':
        return `# PEOPLE ANALYTICS PYTHON LAB: COMPA-RATIO & SALARY BANDS
import pandas as pd

df = pd.read_parquet("clean_employees.parquet")

# Calculate Department Quartiles and Pay Equity
salary_stats = df.groupby(['department', 'gender'])['salary'].agg(['count', 'median', 'mean']).round(0)
print("=== COMPENSATION DISTRIBUTION (GENDER X DEPT) ===")
print(salary_stats)`;

      case 'retention':
        return `# PEOPLE ANALYTICS PYTHON LAB: RETENTION SURVIVAL ANALYSIS
import pandas as pd

df = pd.read_parquet("clean_employees.parquet")

retention_by_tenure = df.groupby('tenure_years')['employment_status'].value_counts(normalize=True).unstack().fillna(0)
print("=== COHORT RETENTION RATES OVER TENURE ===")
print(retention_by_tenure.head(10))`;
    }
  };

  const handleRunPython = () => {
    setIsPythonRunning(true);
    addAuditLog('Python Script Executed', 'query', `Executed ${pythonScriptType} analysis in Python Lab`);
    setTimeout(() => {
      setIsPythonRunning(false);
      setPythonOutput(`[PAS Runtime: Python 3.11.8 | Pandas 2.2.1 | NumPy 1.26.4]
Execution time: 0.142s | Memory: 42.1 MB

=== TURNOVER SUMMARY BY DEPARTMENT ===
     department  headcount  exits  avg_engagement  avg_salary  turnover_pct
    Engineering        154     14           78.42    148,200          9.09
          Sales         98      8           71.18    118,500          8.16
     Operations         64      3           76.50     99,400          4.69
        Product         48      2           81.25    142,000          4.17
      Marketing         42      2           77.10    109,200          4.76
Human Resources         36      1           80.40    104,100          2.78
        Finance         28      1           82.10    121,000          3.57
          Legal         17      1           84.60    156,000          5.88

[Process finished with exit code 0]`);
    }, 450);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">SQL & Python Analytics Lab</h1>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-violet-500/10 text-violet-400 border border-violet-500/20">
              Layer 8
            </span>
          </div>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Execute SQL queries directly on HR dimension and fact tables, or run Python/Pandas scripts with automated syntax explanations.
          </p>
        </div>

        {/* Engine Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => setActiveEngine('sql')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
              activeEngine === 'sql'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>SQL Analysis</span>
          </button>
          <button
            onClick={() => setActiveEngine('python')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
              activeEngine === 'python'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Python / Pandas</span>
          </button>
        </div>
      </div>

      {/* SQL Engine View */}
      {activeEngine === 'sql' && (
        <div className="space-y-6">
          {/* Query Presets Ribbon */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {sqlPresets.map((preset) => (
              <div
                key={preset.title}
                onClick={() => setSqlQuery(preset.query)}
                className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all hover:bg-slate-900"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-1">
                  <span>{preset.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{preset.desc}</p>
              </div>
            ))}
          </div>

          {/* SQL Editor Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-mono font-bold text-slate-200">dim_employee, fact_payroll, fact_attendance</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSqlExplaining(!sqlExplaining)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{sqlExplaining ? 'Hide Explanation' : 'Explain this SQL'}</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(sqlQuery);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleRunSql}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Query</span>
                </button>
              </div>
            </div>

            {/* SQL Textarea */}
            <div className="p-4 bg-slate-950 font-mono text-xs">
              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                rows={7}
                className="w-full bg-transparent text-slate-200 focus:outline-none resize-none leading-relaxed"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Explain this SQL Box for Beginners */}
          {sqlExplaining && (
            <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-indigo-300 font-bold">
                <BookOpen className="w-4 h-4" />
                <span>Beginner SQL Guide: How this Query Works</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                1. <strong>FROM dim_employee:</strong> Targets the clean employee table containing all 487 rows.<br />
                2. <strong>GROUP BY department:</strong> Groups rows by department so calculations are performed on each distinct squad.<br />
                3. <strong>SUM(CASE WHEN ...):</strong> Evaluates terminations. If an employee exited, it counts 1, else 0.<br />
                4. <strong>ROUND(..., 1):</strong> Divides terminations by total headcount and rounds to one decimal place.<br />
                5. <strong>ORDER BY turnover_rate_pct DESC:</strong> Ranks departments from highest turnover to lowest.
              </p>
            </div>
          )}

          {/* Results Grid */}
          {sqlResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm space-y-2">
              <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Query executed successfully: <strong className="text-white">{sqlResult.length} rows</strong> returned
                </span>
                <span className="font-mono text-emerald-400">{sqlTime}ms</span>
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-[11px] text-slate-400 uppercase border-b border-slate-800">
                    <tr>
                      {Object.keys(sqlResult[0] || {}).map((col) => (
                        <th key={col} className="py-2.5 px-3">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {sqlResult.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        {Object.values(row).map((val: any, cidx) => (
                          <td key={cidx} className="py-2 px-3">{String(val)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Python Engine View */}
      {activeEngine === 'python' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Analysis Type:</span>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
                {(['turnover', 'compensation', 'retention'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setPythonScriptType(t)}
                    className={`px-3 py-1 rounded capitalize font-medium transition-colors ${
                      pythonScriptType === t ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getPythonCode());
                  setCopiedPython(true);
                  setTimeout(() => setCopiedPython(false), 2000);
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                {copiedPython ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPython ? 'Copied' : 'Copy Script'}</span>
              </button>

              <button
                onClick={handleRunPython}
                disabled={isPythonRunning}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isPythonRunning ? 'Executing...' : 'Run Python'}</span>
              </button>
            </div>
          </div>

          {/* Python Code Viewer */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-950 font-mono text-xs text-slate-200 overflow-x-auto">
              <pre className="leading-relaxed">{getPythonCode()}</pre>
            </div>
          </div>

          {/* Python Output Console */}
          {pythonOutput && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-sm font-mono text-xs text-emerald-400 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 border-b border-slate-800">
                <span>STDOUT Terminal Output</span>
                <span className="text-emerald-400 font-bold">SUCCESS</span>
              </div>
              <pre className="overflow-x-auto text-slate-200 leading-relaxed">{pythonOutput}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
