import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  Database,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { DaxMeasure } from '../../types/analytics';

export const DaxPowerBiView: React.FC = () => {
  const { daxMeasures, modelTables, modelRelationships } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Attrition', 'Workforce', 'Compensation', 'Recruitment'];

  const filteredMeasures = selectedCategory === 'All'
    ? daxMeasures
    : daxMeasures.filter(m => m.category === selectedCategory);

  const handleCopyDax = (m: DaxMeasure) => {
    navigator.clipboard.writeText(m.formula);
    setCopiedId(m.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadPowerBiBundle = () => {
    const bundle = {
      project: "People Analytics Studio Power BI Package",
      version: "2.0",
      tables: modelTables.map(t => ({
        tableName: t.name,
        type: t.type,
        columns: t.columns.map(c => ({ name: c.name, dataType: c.type }))
      })),
      relationships: modelRelationships.map(r => ({
        from: `${r.fromTable}[${r.fromColumn}]`,
        to: `${r.toTable}[${r.toColumn}]`,
        cardinality: r.cardinality
      })),
      daxMeasures: daxMeasures.map(m => ({
        name: m.name,
        targetTable: m.targetTable,
        expression: m.formula
      }))
    };

    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `People_Analytics_PowerBI_Model_2026.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Power BI Studio & DAX Measure Library</h1>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Layer 9
            </span>
          </div>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Enterprise DAX measures, dimensional Star Schema relationships, and Power BI-ready data modeling specifications.
          </p>
        </div>

        <button
          onClick={handleDownloadPowerBiBundle}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Power BI Schema (.json / .pbit)</span>
        </button>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Measure Domain:</span>
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* DAX Measures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMeasures.map((measure) => (
          <div
            key={measure.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">{measure.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    Table: {measure.targetTable}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {measure.category}
                  </span>
                </div>
              </div>

              {/* DAX Formula Box */}
              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/90 font-mono text-xs text-indigo-300 overflow-x-auto">
                <pre className="leading-relaxed whitespace-pre-wrap">{measure.formula}</pre>
              </div>

              {/* Explanation */}
              <div className="mt-3 flex items-start gap-2 text-xs text-slate-400">
                <HelpCircle className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">{measure.explanation}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">DAX Version 2.0 Compliant</span>
              <button
                onClick={() => handleCopyDax(measure)}
                className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                {copiedId === measure.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied DAX!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy DAX</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
