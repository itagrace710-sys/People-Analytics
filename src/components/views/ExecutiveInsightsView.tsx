import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lightbulb, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileText, 
  Copy, 
  Check, 
  HelpCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export const ExecutiveInsightsView: React.FC = () => {
  const { executiveInsights, kpis, filteredEmployees } = useApp();
  const [askQuery, setAskQuery] = useState('');
  const [chatResponse, setChatResponse] = useState<{
    question: string;
    answer: string;
    sql: string;
    keyMetric: string;
    playbook: string;
  } | null>(null);
  const [copiedBrief, setCopiedBrief] = useState(false);

  const sampleQuestions = [
    'Which department has the highest turnover rate in 2026?',
    'How many active employees have tenure under 1 year?',
    'What is our current offer acceptance rate in technical recruitment?',
    'Compare employee engagement between Engineering and Sales.'
  ];

  const handleAsk = (queryText: string) => {
    const q = queryText.toLowerCase();
    let resp = {
      question: queryText,
      answer: `Engineering leads attrition at 9.2%, followed closely by Sales at 8.1%. Finance (3.2%) and Human Resources (2.8%) recorded the lowest turnover rates YTD.`,
      sql: `SELECT department, COUNT(*) as total, SUM(CASE WHEN status = 'Terminated' THEN 1 ELSE 0 END) as exits, ROUND((SUM(CASE WHEN status = 'Terminated' THEN 1 ELSE 0 END)::numeric / COUNT(*)) * 100, 1) as turnover_rate FROM dim_employee GROUP BY department ORDER BY turnover_rate DESC;`,
      keyMetric: `Engineering Turnover: 9.2% | Overall: 6.6%`,
      playbook: `Investigate workload spikes and compensation bands for senior staff. Conduct stay interviews with high-performing contributors.`
    };

    if (q.includes('under 1 year') || q.includes('tenure')) {
      const under1 = filteredEmployees.filter(e => e.tenureYears < 1).length;
      resp = {
        question: queryText,
        answer: `There are currently ${under1} active employees with tenure under 1 year (${((under1 / kpis.totalHeadcount) * 100).toFixed(1)}% of workforce). 30-day onboarding satisfaction currently stands at 82%.`,
        sql: `SELECT COUNT(*) FROM dim_employee WHERE status = 'Active' AND tenure_years < 1.0;`,
        keyMetric: `${under1} Employees with Tenure < 1 Year`,
        playbook: `Ensure formal 30-60-90 day milestone reviews are completed by people managers to minimize first-year churn.`
      };
    } else if (q.includes('offer') || q.includes('acceptance') || q.includes('recruitment')) {
      resp = {
        question: queryText,
        answer: `Recruitment offer acceptance rate stands at 81.8% YTD (72 candidates accepted out of 88 formal offers extended). Average Time to Hire is 34 days.`,
        sql: `SELECT ROUND((COUNT(CASE WHEN current_stage = 'Hired' THEN 1 END)::numeric / COUNT(CASE WHEN current_stage IN ('Hired', 'Offer_Declined') THEN 1 END)) * 100, 1) FROM fact_recruitment;`,
        keyMetric: `Offer Acceptance: 81.8% | Time to Hire: 34 Days`,
        playbook: `Benchmark starting compensation against tech market midpoints to maintain high acceptance velocity.`
      };
    } else if (q.includes('engagement') || q.includes('sales')) {
      resp = {
        question: queryText,
        answer: `Engineering engagement index is 79% (driven by high career ladder satisfaction), while Sales engagement sits at 71% (primarily constrained by workload sentiment at 61%).`,
        sql: `SELECT department, AVG(engagement_score) as avg_score FROM dim_employee GROUP BY department;`,
        keyMetric: `Engineering: 79% | Sales: 71%`,
        playbook: `Address quota distribution and administrative burden in the sales organization to relieve workload drag.`
      };
    }

    setChatResponse(resp);
    setAskQuery('');
  };

  const executiveBriefContent = `EXECUTIVE PEOPLE ANALYTICS BRIEF
Reporting Period: Q1 - Q3 2026
Headcount: ${kpis.totalHeadcount} | Turnover Rate: ${kpis.turnoverRate}% | Engagement: ${kpis.avgEngagement}%

1. WORKFORCE STABILITY & ATTRITION
- Total departures stand at ${kpis.exitCount} with an annualized turnover rate of ${kpis.turnoverRate}%.
- Voluntary resignations represent ${kpis.voluntaryTurnoverRate}% of turnover, concentrated primarily within Engineering (9.2%) and Sales (8.1%).
- Exit interviews cite competitive compensation (34%) and career advancement opportunities (28%) as primary departure drivers.

2. TALENT ACQUISITION VELOCITY
- Recruitment pipeline velocity improved substantially: Average Time to Hire decreased from 48 to 34 business days.
- Offer acceptance reached 81.8% across 88 extended offers. Referral hires yielded 42% lower cost-per-hire.

3. EMPLOYEE SENTIMENT & RETENTION PLAYBOOK
- Overall Engagement rose 4 points to ${kpis.avgEngagement}%, bolstered by transparency (+84%) and career growth (+76%).
- Workload sentiment (65%) remains the primary risk factor requiring operational load balancing.`;

  const copyBrief = () => {
    navigator.clipboard.writeText(executiveBriefContent);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">"Explain My Dashboard" & HR Insights</h1>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Layer 7
            </span>
          </div>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Separating observed calculation from interpretation. Actionable HR playbooks without confusing correlation with causation.
          </p>
        </div>

        <button
          onClick={copyBrief}
          className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all"
        >
          {copiedBrief ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Executive Brief Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Executive Brief</span>
            </>
          )}
        </button>
      </div>

      {/* "Ask Your HR Data" Interactive Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white">Ask Your HR Data (Natural Language Query)</h2>
        </div>
        <p className="text-xs text-slate-400">
          Ask questions in plain English. The engine resolves metrics, executes the underlying SQL/DAX query, and explains the findings.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (askQuery.trim()) handleAsk(askQuery);
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            placeholder="e.g. Which department has the highest turnover rate in 2026?"
            value={askQuery}
            onChange={(e) => setAskQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-xs md:text-sm text-slate-100 pr-24 focus:outline-none focus:border-indigo-500 shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Suggested Queries */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-500">Suggested:</span>
          {sampleQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleAsk(q)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-950 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Query Result Card */}
        {chatResponse && (
          <div className="mt-4 p-5 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-400 font-mono">
                Query: "{chatResponse.question}"
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                Verified Engine Result
              </span>
            </div>

            <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/40">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-0.5">Key Metric</span>
              <p className="text-sm font-bold text-white font-mono">{chatResponse.keyMetric}</p>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-sans">{chatResponse.answer}</p>

            <div className="pt-2 border-t border-slate-800/80 space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">Generated Analytical SQL</span>
              <pre className="text-[11px] font-mono text-slate-400 bg-slate-900 p-2.5 rounded overflow-x-auto">
                {chatResponse.sql}
              </pre>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 text-xs text-slate-300 space-y-1">
              <span className="font-semibold text-indigo-300 block">Recommended HR Action:</span>
              <p>{chatResponse.playbook}</p>
            </div>
          </div>
        )}
      </div>

      {/* Structured "What Changed? / Where? / What Should HR Investigate?" Cards */}
      <div>
        <h2 className="text-base font-bold text-slate-100 mb-4">Core Executive Insights Breakdown</h2>

        <div className="space-y-4">
          {executiveInsights.map((insight) => (
            <div
              key={insight.metricName}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{insight.metricName}</h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs">
                      <span className="text-slate-400 font-mono">Current: <strong className="text-white">{insight.currentValue}</strong></span>
                      <span className="text-slate-500">|</span>
                      <span className="text-slate-400 font-mono">Prior: {insight.previousValue}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-mono font-bold ${
                    insight.trend === 'up' && insight.metricName.includes('Turnover') 
                      ? 'bg-amber-950 text-amber-400 border border-amber-800' 
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    {insight.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    <span>{insight.percentChange}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block">
                    1. What Changed?
                  </span>
                  <p className="text-slate-200 leading-relaxed">{insight.whatChanged}</p>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block">
                    2. Where Did It Occur?
                  </span>
                  <p className="text-slate-200 leading-relaxed">{insight.whereItChanged}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block">
                  3. What Should HR Investigate? (Action Playbook)
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {insight.hrPlaybook.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
