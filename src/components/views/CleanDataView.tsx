import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Check, 
  Copy, 
  Plus, 
  Code2, 
  Database, 
  Terminal, 
  Layers, 
  ArrowRight, 
  Sliders, 
  CheckCircle2, 
  Play, 
  Info
} from 'lucide-react';
import { TransformationStep } from '../../types/analytics';

export const CleanDataView: React.FC = () => {
  const { 
    transformationSteps, 
    toggleTransformationStep, 
    addTransformationStep, 
    allEmployees,
    dirtyRawData,
    isDataCleaned,
    autoFixAllIssues
  } = useApp();

  const [activeCodeLang, setActiveCodeLang] = useState<'m' | 'sql' | 'python'>('m');
  const [selectedStepId, setSelectedStepId] = useState<string>(transformationSteps[0]?.id || 'step-1');
  const [copiedCode, setCopiedCode] = useState(false);
  const [showAddStepModal, setShowAddStepModal] = useState(false);

  // New step form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'cleaning' | 'transformation' | 'enrichment'>('transformation');
  const [newM, setNewM] = useState('');
  const [newSql, setNewSql] = useState('');
  const [newPython, setNewPython] = useState('');

  const selectedStep = transformationSteps.find(s => s.id === selectedStepId) || transformationSteps[0];

  // Aggregate pipeline code
  const aggregateMCode = `let\n    Source = Excel.Workbook(File.Contents("Employees.xlsx"), null, true),\n    #"RawData_Sheet" = Source{[Item="Employees",Kind="Sheet"]}[Data],\n    #"Promoted Headers" = Table.PromoteHeaders(#"RawData_Sheet", [PromoteAllScalars=true]),\n` +
    transformationSteps.filter(s => s.applied).map((s, idx) => `    #"Step_${idx + 1}" = ${s.powerQueryM}`).join(',\n') +
    `\nin\n    #"Step_${transformationSteps.filter(s => s.applied).length}"`;

  const aggregateSqlCode = `-- PEOPLE ANALYTICS STUDIO: AUTOMATED CLEANING PIPELINE\n-- Target Table: raw_employees -> clean_employees\n\nBEGIN TRANSACTION;\n\n` +
    transformationSteps.filter(s => s.applied).map(s => `-- ${s.title}\n${s.sqlQuery}`).join('\n\n') +
    `\n\nCOMMIT;\n-- Pipeline complete: Ready for dimensional modeling`;

  const aggregatePythonCode = `# PEOPLE ANALYTICS STUDIO: DATA CLEANING PIPELINE (PANDAS)\nimport pandas as pd\nimport numpy as np\n\ndf = pd.read_excel("Employees.xlsx")\nprint(f"Raw shape: {df.shape}")\n\n` +
    transformationSteps.filter(s => s.applied).map(s => `# ${s.title}\n${s.pythonCode}`).join('\n\n') +
    `\n\n# Pipeline complete\ndf.to_parquet("clean_employees.parquet")\nprint(f"Clean shape: {df.shape}")`;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCreateStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTransformationStep({
      title: newTitle,
      description: newDesc || 'Custom transformation step',
      category: newCategory,
      powerQueryM: newM || `Table.TransformColumns(#"PreviousStep", {{"Custom", each _, type any}})`,
      sqlQuery: newSql || `UPDATE clean_employees SET updated_at = NOW();`,
      pythonCode: newPython || `df['Custom'] = df['Custom'].fillna('')`
    });

    setShowAddStepModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Power Query-Style Cleaning Engine</h1>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Layer 3
            </span>
          </div>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Reproducible ETL transformations. Review steps, toggle rules, and export equivalent Power Query M, SQL, or Python/Pandas logic.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddStepModal(true)}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>Add Custom Step</span>
          </button>
          {!isDataCleaned && (
            <button
              onClick={autoFixAllIssues}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply All Steps</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Applied Steps List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Transformation History ({transformationSteps.filter(s => s.applied).length}/{transformationSteps.length})
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Order Preserved</span>
            </div>

            <div className="space-y-2">
              {transformationSteps.map((step, idx) => {
                const isSelected = step.id === selectedStepId;
                return (
                  <div
                    key={step.id}
                    onClick={() => setSelectedStepId(step.id)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-950 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-200 leading-tight">{step.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{step.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTransformationStep(step.id);
                      }}
                      className={`text-xs px-2 py-0.5 rounded font-mono font-medium transition-colors ${
                        step.applied
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {step.applied ? 'ACTIVE' : 'OFF'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Explanation */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <Info className="w-4 h-4 text-indigo-400" />
              <span>Multi-Language Transformation Parity</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Every transformation configured here generates 100% compliant syntax across Power Query M, standard SQL, and Python Pandas, enabling seamless handoff to analytics engineers.
            </p>
          </div>
        </div>

        {/* Right Column: Code Generator & Selected Step Details */}
        <div className="lg:col-span-7 space-y-4">
          {/* Selected Step Inspector */}
          {selectedStep && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
                    Selected Transformation
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedStep.title}</h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono capitalize">
                  {selectedStep.category}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedStep.description}</p>
            </div>
          )}

          {/* Code Viewer Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            {/* Language Switcher */}
            <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveCodeLang('m')}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
                    activeCodeLang === 'm'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  Power Query M
                </button>
                <button
                  onClick={() => setActiveCodeLang('sql')}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
                    activeCodeLang === 'sql'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  SQL DML
                </button>
                <button
                  onClick={() => setActiveCodeLang('python')}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
                    activeCodeLang === 'python'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  Python (Pandas)
                </button>
              </div>

              <button
                onClick={() => {
                  const code = activeCodeLang === 'm' ? aggregateMCode : (activeCodeLang === 'sql' ? aggregateSqlCode : aggregatePythonCode);
                  handleCopy(code);
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Pipeline</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Output */}
            <div className="p-4 bg-slate-950 font-mono text-xs overflow-x-auto max-h-[380px] text-slate-200">
              <pre className="text-slate-300 leading-relaxed">
                {activeCodeLang === 'm' && aggregateMCode}
                {activeCodeLang === 'sql' && aggregateSqlCode}
                {activeCodeLang === 'python' && aggregatePythonCode}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Add Step Modal */}
      {showAddStepModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateStep} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Add Custom Transformation Step</h3>
            
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Step Title</label>
              <input
                type="text"
                placeholder="e.g. Impute Missing Location by Department"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Description</label>
              <input
                type="text"
                placeholder="Explain the logic and HR impact"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="cleaning">Cleaning</option>
                  <option value="transformation">Transformation</option>
                  <option value="enrichment">Enrichment</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Python Pandas snippet</label>
                <input
                  type="text"
                  placeholder="df['col'] = ..."
                  value={newPython}
                  onChange={(e) => setNewPython(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddStepModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
              >
                Save Transformation Step
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
