import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Network, 
  Database, 
  Key, 
  ArrowRight, 
  CheckCircle2, 
  Table, 
  Layers, 
  Sparkles, 
  BookOpen, 
  Link2,
  GitBranch
} from 'lucide-react';

export const DataModelView: React.FC = () => {
  const { modelTables, modelRelationships, toggleRelationship } = useApp();
  const [selectedTableId, setSelectedTableId] = useState<string>('dim_emp');
  const [showDataDictionary, setShowDataDictionary] = useState<boolean>(false);

  const selectedTable = modelTables.find(t => t.id === selectedTableId) || modelTables[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Automated HR Data Model (Power Pivot)</h1>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Layer 4
            </span>
          </div>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Star schema dimensional model separating entities into Dimension and Fact tables with automatic relationship detection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDataDictionary(!showDataDictionary)}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>{showDataDictionary ? 'Hide Data Dictionary' : 'View Data Dictionary'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Visual ERD / Relationship Schema Map */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">
              Entity Relationship Diagram (ERD)
            </span>
            <h3 className="text-base font-bold text-white">HR Star Schema Architecture</h3>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span className="text-slate-300">Dimension Table</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
              <span className="text-slate-300">Fact Table</span>
            </div>
          </div>
        </div>

        {/* Schema Grid Representation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Column 1: Master Dimensions */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dimensions</h4>
            {modelTables.filter(t => t.type === 'dimension').map(table => (
              <div
                key={table.id}
                onClick={() => setSelectedTableId(table.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedTableId === table.id
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-400" />
                    <span className="font-mono font-bold text-white text-xs">{table.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {table.rowCount.toLocaleString()} rows
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{table.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {table.columns.slice(0, 4).map(c => (
                    <span key={c.name} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                      {c.name}
                    </span>
                  ))}
                  {table.columns.length > 4 && (
                    <span className="text-[10px] font-mono text-slate-500">+{table.columns.length - 4}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Column 2: Active Relationships Connectors */}
          <div className="space-y-4 flex flex-col justify-center">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Relationships (1:N)</h4>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
              {modelRelationships.map((rel) => (
                <div
                  key={rel.id}
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 text-[11px]"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-mono text-slate-200">
                      <span className="text-indigo-400 font-semibold">{rel.fromTable}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <span className="text-pink-400 font-semibold">{rel.toTable}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {rel.fromColumn} = {rel.toColumn} ({rel.cardinality})
                    </p>
                  </div>

                  <button
                    onClick={() => toggleRelationship(rel.id)}
                    className={`px-2 py-0.5 rounded font-mono text-[10px] transition-colors ${
                      rel.active
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {rel.active ? 'ACTIVE' : 'OFF'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Fact Tables */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fact Tables</h4>
            {modelTables.filter(t => t.type === 'fact').map(table => (
              <div
                key={table.id}
                onClick={() => setSelectedTableId(table.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedTableId === table.id
                    ? 'bg-pink-950/40 border-pink-500 shadow-md shadow-pink-500/10'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-pink-400" />
                    <span className="font-mono font-bold text-white text-xs">{table.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800">
                    {table.rowCount.toLocaleString()} rows
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{table.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {table.columns.slice(0, 4).map(c => (
                    <span key={c.name} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                      {c.name}
                    </span>
                  ))}
                  {table.columns.length > 4 && (
                    <span className="text-[10px] font-mono text-slate-500">+{table.columns.length - 4}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Table Inspector */}
      {selectedTable && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white text-base">{selectedTable.name}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                  selectedTable.type === 'dimension' ? 'bg-indigo-950 text-indigo-400 border border-indigo-800' : 'bg-pink-950 text-pink-400 border border-pink-800'
                }`}>
                  {selectedTable.type} table
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{selectedTable.description}</p>
            </div>
            <span className="font-mono text-xs text-slate-400">Total Records: {selectedTable.rowCount.toLocaleString()}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-[11px] text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">Column Name</th>
                  <th className="py-2 px-3">SQL Data Type</th>
                  <th className="py-2 px-3">Constraint / Key</th>
                  <th className="py-2 px-3 font-sans">Business Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {selectedTable.columns.map((col) => (
                  <tr key={col.name} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-slate-100 flex items-center gap-2">
                      {col.isKey && <Key className="w-3.5 h-3.5 text-amber-400" />}
                      {col.isForeignKey && <Link2 className="w-3.5 h-3.5 text-sky-400" />}
                      <span>{col.name}</span>
                    </td>
                    <td className="py-2.5 px-3 text-indigo-400">{col.type}</td>
                    <td className="py-2.5 px-3">
                      {col.isKey ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                          PRIMARY KEY
                        </span>
                      ) : col.isForeignKey ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                          FOREIGN KEY
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-400 text-[11px]">
                      {col.name.includes('ID') ? 'Unique entity identifier' :
                       col.name.includes('Date') ? 'Standard calendar event timestamp' :
                       col.name.includes('Salary') ? 'Gross base salary annualized' :
                       'Attribute dimension field'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Data Dictionary Generator Modal/Drawer */}
      {showDataDictionary && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Standardized People Analytics Data Dictionary</h3>
            </div>
            <span className="text-xs text-slate-400">Enterprise BI Documentation</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            This dictionary documents all 32 HR metrics and entity attributes across employee demographics, payroll, performance, and ATS funnels.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 rounded-lg">
              <thead className="bg-slate-950 text-[11px] text-slate-400 uppercase font-mono">
                <tr>
                  <th className="py-2 px-3">Entity Field</th>
                  <th className="py-2 px-3">Data Type</th>
                  <th className="py-2 px-3">Source System</th>
                  <th className="py-2 px-3">Definition & Calculation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-[11px] text-slate-300">
                <tr>
                  <td className="py-2 px-3 text-indigo-300 font-bold">Employee_ID</td>
                  <td className="py-2 px-3">VARCHAR(20)</td>
                  <td className="py-2 px-3">HRIS Master</td>
                  <td className="py-2 px-3 font-sans">Unique immutable employee identifier.</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-indigo-300 font-bold">Hire_Date</td>
                  <td className="py-2 px-3">DATE</td>
                  <td className="py-2 px-3">HRIS / Onboarding</td>
                  <td className="py-2 px-3 font-sans">Official day of employment initiation (used for tenure calculation).</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-indigo-300 font-bold">Base_Salary</td>
                  <td className="py-2 px-3">NUMERIC(12,2)</td>
                  <td className="py-2 px-3">Payroll System</td>
                  <td className="py-2 px-3 font-sans">Annualized gross salary prior to variable compensation or equity grants.</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-indigo-300 font-bold">Turnover_Rate</td>
                  <td className="py-2 px-3">DECIMAL(5,2)</td>
                  <td className="py-2 px-3">Analytics Engine</td>
                  <td className="py-2 px-3 font-sans">DIVIDE(Count of Terminations, Average Headcount) * 100.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
