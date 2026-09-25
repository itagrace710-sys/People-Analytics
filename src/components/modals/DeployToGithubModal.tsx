import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Github, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  X, 
  Rocket, 
  Terminal, 
  FileCode2, 
  ShieldCheck, 
  AlertTriangle,
  FolderGit2,
  Check,
  Download,
  Globe,
  HelpCircle,
  PlayCircle,
  RefreshCw,
  Sliders
} from 'lucide-react';

export const DeployToGithubModal: React.FC = () => {
  const { showDeployModal, setShowDeployModal, addAuditLog } = useApp();

  const [githubUsername, setGithubUsername] = useState('your-github-username');
  const [repoName, setRepoName] = useState('people-analytics-studio');
  const [activeTab, setActiveTab] = useState<'actions' | 'cli' | 'troubleshoot' | 'checklist'>('actions');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  if (!showDeployModal) return null;

  const repoUrl = `https://github.com/${githubUsername}/${repoName}`;
  const pagesUrl = `https://${githubUsername}.github.io/${repoName}/`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const gitPushCommands = `# Step 1: Connect your local repository to your new GitHub repository
git remote add origin https://github.com/${githubUsername}/${repoName}.git

# Step 2: Ensure default branch is main
git branch -M main

# Step 3: Push code to GitHub
git push -u origin main`;

  const cliDeployCommands = `# Build production bundle and push directly to gh-pages branch
npm run deploy`;

  const workflowYaml = `name: Deploy to GitHub Pages

on:
  push:
    branches: ["main", "master"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm install --legacy-peer-deps

      - name: Build production bundle
        run: npm run build
        env:
          GITHUB_REPOSITORY: \${{ github.repository }}

      - name: Upload GitHub Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

  const handleDownloadDeployScript = () => {
    const scriptContent = `#!/bin/bash
# ====================================================================
# People Analytics Studio - GitHub Push & Deployment Script
# ====================================================================

echo "🚀 Preparing deployment to GitHub..."

# Check git status
git status

# Add origin
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/${githubUsername}/${repoName}.git

# Set branch to main
git branch -M main

# Commit any recent changes
git add .
git commit -m "Deploy: Updated People Analytics Studio build & configs" || true

# Push to GitHub
echo "Pushing code to https://github.com/${githubUsername}/${repoName}..."
git push -u origin main

echo "✅ Code pushed successfully!"
echo "➡️ Go to: https://github.com/${githubUsername}/${repoName}/settings/pages"
echo "➡️ Set Source to 'GitHub Actions' (or 'Deploy from a branch' -> gh-pages)"
echo "🌟 Live app will be available at: ${pagesUrl}"
`;
    const blob = new Blob([scriptContent], { type: 'text/x-sh' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deploy-to-github.sh';
    a.click();
    URL.revokeObjectURL(url);
    addAuditLog('Deploy Script Downloaded', 'export', 'Downloaded automated deploy-to-github.sh script');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-3xl w-full text-slate-200 overflow-hidden animate-in fade-in zoom-in-95 my-auto">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center text-white shadow-inner">
              <Github className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-bold text-white tracking-tight">Deploy App to GitHub</h2>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready to Deploy
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Host for free on <span className="text-indigo-300 font-medium">GitHub Pages</span> with automated CI/CD workflows
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowDeployModal(false)}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Configuration Bar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Your GitHub Username or Org:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">@</span>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value.trim() || 'your-username')}
                  placeholder="e.g. itagrace710"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-xs text-indigo-300 font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Repository Name:
              </label>
              <input
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value.trim() || 'people-analytics-studio')}
                placeholder="e.g. people-analytics-studio"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-indigo-300 font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Live Preview URLs */}
          <div className="mt-3 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Target Live URL:</span>
              <a 
                href={pagesUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-mono text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
              >
                {pagesUrl}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
              >
                <span>Open Repo on GitHub</span>
                <ExternalLink className="w-3 h-3 text-indigo-400" />
              </a>

              <a
                href="https://github.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-medium transition-colors"
              >
                <span>Create New Repo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Fix Blank Page / Deployment Alert */}
        <div className="mx-5 mt-4 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3 text-xs">
          <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 mt-0.5">
            <Rocket className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <span className="font-semibold text-white">Fix for Blank Page on GitHub Pages:</span>
            <p className="text-slate-300 leading-relaxed">
              In your GitHub repo: go to <strong className="text-indigo-300">Settings → Pages</strong>. Under <strong>Build and deployment → Source</strong>, ensure you have selected <strong className="text-emerald-400 underline decoration-emerald-500">GitHub Actions</strong> (NOT &quot;Deploy from a branch&quot;).
            </p>
          </div>
        </div>

        {/* Method Switcher Tabs */}
        <div className="flex border-b border-slate-800 px-4 pt-2 gap-2 bg-slate-900/40 overflow-x-auto">
          <button
            onClick={() => setActiveTab('actions')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'actions'
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Rocket className="w-3.5 h-3.5 text-indigo-400" />
            <span>GitHub Actions (Auto CI/CD)</span>
          </button>

          <button
            onClick={() => setActiveTab('troubleshoot')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'troubleshoot'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Blank Page or Empty Run? (Fixes)</span>
          </button>

          <button
            onClick={() => setActiveTab('cli')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'cli'
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>CLI Deploy (`gh-pages`)</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'checklist'
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Checklist</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">
          
          {/* TAB: Troubleshoot (Nothing in workflow run) */}
          {activeTab === 'troubleshoot' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/30 text-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Why is there "nothing in the workflow run" on GitHub?</span>
                </div>
                <p className="text-amber-200/90 leading-relaxed">
                  If the <strong>Actions</strong> tab says <em>"Get started with GitHub Actions"</em> or shows no runs, it almost always means one of the 4 quick checks below:
                </p>
              </div>

              {/* Check 1: Does .github/workflows/deploy.yml exist on GitHub? */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xs font-bold font-mono">1</span>
                    <h4 className="text-xs font-bold text-white">Check if the file is in your GitHub repository</h4>
                  </div>
                  <button
                    onClick={() => copyToClipboard(workflowYaml, 'yaml-copy')}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
                  >
                    {copiedIndex === 'yaml-copy' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-300" />
                        <span>Copied YAML!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Workflow YAML</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-300 pl-8 leading-relaxed">
                  Look at your GitHub repository homepage. Do you see a folder named <code className="text-indigo-300 font-mono">.github/workflows</code>?
                  <br />
                  If not (e.g. if you uploaded files via browser drag-and-drop, browsers silently hide dot-folders!):
                </p>
                <div className="pl-8 text-xs text-slate-400 space-y-1">
                  <p>1. In your GitHub repository, click <strong className="text-white">Add file</strong> → <strong className="text-white">Create new file</strong>.</p>
                  <p>2. In the filename box, type: <code className="text-emerald-400 font-mono font-bold">.github/workflows/deploy.yml</code></p>
                  <p>3. Click <strong>Copy Workflow YAML</strong> button above and paste the content.</p>
                  <p>4. Click the green <strong className="text-white">Commit changes...</strong> button. This will instantly trigger your first workflow run!</p>
                </div>
              </div>

              {/* Check 2: Enable GitHub Actions in Repository Settings */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xs font-bold font-mono">2</span>
                  <h4 className="text-xs font-bold text-white">Ensure GitHub Actions are enabled in Settings</h4>
                </div>
                <div className="pl-8 text-xs text-slate-400 space-y-1.5">
                  <p>New GitHub repos sometimes have actions turned off:</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>Go to <strong className="text-white">Settings</strong> → <strong className="text-white">Actions</strong> → <strong className="text-white">General</strong>.</li>
                    <li>Under <strong className="text-white">Actions permissions</strong>, select <strong className="text-emerald-400 font-semibold">Allow all actions and reusable workflows</strong>.</li>
                    <li>Under <strong className="text-white">Workflow permissions</strong> (scroll down), select <strong className="text-emerald-400 font-semibold">Read and write permissions</strong>.</li>
                    <li>Click <strong className="text-white">Save</strong>.</li>
                  </ol>
                </div>
              </div>

              {/* Check 3: Pages Source Setting */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xs font-bold font-mono">3</span>
                  <h4 className="text-xs font-bold text-white">Set GitHub Pages Source to "GitHub Actions"</h4>
                </div>
                <div className="pl-8 text-xs text-slate-400 space-y-1">
                  <p>1. Go to <strong className="text-white">Settings</strong> → <strong className="text-white">Pages</strong> in your GitHub repo.</p>
                  <p>2. Under <strong className="text-white">Build and deployment</strong> → <strong className="text-white">Source</strong>, select <strong className="text-indigo-400 font-semibold">GitHub Actions</strong> (not "Deploy from a branch").</p>
                </div>
              </div>

              {/* Check 4: Manually Trigger the Run with "Run workflow" */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xs font-bold font-mono">4</span>
                  <h4 className="text-xs font-bold text-white">Trigger the workflow manually with 1-click</h4>
                </div>
                <div className="pl-8 text-xs text-slate-400 space-y-1">
                  <p>Once <code className="text-slate-200">.github/workflows/deploy.yml</code> is in your repo:</p>
                  <p>1. Go to the <strong className="text-white">Actions</strong> tab at the top of your GitHub repository.</p>
                  <p>2. Click <strong className="text-indigo-400 font-semibold">Deploy to GitHub Pages</strong> in the left sidebar.</p>
                  <p>3. Click the <strong className="text-white">Run workflow</strong> dropdown button on the right side and click the green <strong className="text-emerald-400">Run workflow</strong> button!</p>
                  <p className="text-emerald-400 pt-1 font-medium">Within 10 seconds, the workflow run will appear and start building!</p>
                </div>
              </div>

              {/* Alternative: Instant 1-Command CLI */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 to-indigo-950/40 border border-indigo-500/30 space-y-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-bold text-white">Alternative: Bypass Actions completely with `gh-pages`</h4>
                </div>
                <p className="text-xs text-slate-300">
                  If GitHub Actions continues to give you issues, you don&apos;t need Actions at all! You can deploy directly with one terminal command:
                </p>
                <pre className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300">
                  npm run deploy
                </pre>
                <p className="text-xs text-slate-400">
                  Then in GitHub <strong>Settings → Pages</strong>, set Source to <strong>Deploy from a branch</strong> and select <strong>gh-pages</strong>!
                </p>
              </div>
            </div>
          )}

          {/* TAB 1: GitHub Actions */}
          {activeTab === 'actions' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-3">
                <Rocket className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Automated Continuous Deployment is configured!</span>
                  <p className="text-indigo-300/90 mt-0.5">
                    We created <code className="text-white bg-slate-950 px-1 py-0.5 rounded font-mono">.github/workflows/deploy.yml</code> (configured for both <code className="text-white bg-slate-950 px-1 py-0.5 rounded font-mono">main</code> and <code className="text-white bg-slate-950 px-1 py-0.5 rounded font-mono">master</code>).
                  </p>
                </div>
              </div>

              {/* Step 1 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px]">1</span>
                  <span>Create an empty repository on GitHub</span>
                </div>
                <p className="text-xs text-slate-400 pl-7">
                  Go to <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline inline-flex items-center gap-1">github.com/new <ExternalLink className="w-2.5 h-2.5" /></a>, name it <strong className="text-white font-mono">{repoName}</strong>, set it to <strong>Public</strong> (for free GitHub Pages), and do not initialize with README.
                </p>
              </div>

              {/* Step 2 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px]">2</span>
                    <span>Link remote and push your code</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(gitPushCommands, 'push-cmds')}
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    {copiedIndex === 'push-cmds' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-indigo-400" />
                        <span>Copy Commands</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="pl-7">
                  <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto selection:bg-indigo-600">
                    {gitPushCommands}
                  </pre>
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px]">3</span>
                  <span>Enable GitHub Actions as the Pages Source</span>
                </div>
                <div className="pl-7 text-xs text-slate-400 space-y-1">
                  <p>In your GitHub repository:</p>
                  <ol className="list-decimal list-inside space-y-0.5 text-slate-300">
                    <li>Click <strong className="text-white">Settings</strong> tab at the top.</li>
                    <li>Click <strong className="text-white">Pages</strong> in the left sidebar menu.</li>
                    <li>Under <strong className="text-white">Build and deployment</strong> → <strong className="text-white">Source</strong>, select <strong className="text-indigo-400">GitHub Actions</strong>.</li>
                  </ol>
                  <p className="text-[11px] text-emerald-400 font-medium pt-1">
                    ✨ That&apos;s it! GitHub Actions will run automatically and your app will be live at:
                  </p>
                  <a href={pagesUrl} target="_blank" rel="noopener noreferrer" className="block text-indigo-300 font-mono font-semibold hover:underline">
                    {pagesUrl}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLI gh-pages */}
          {activeTab === 'cli' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 flex items-start gap-3">
                <Terminal className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Manual 1-Command Deployment via `gh-pages`</span>
                  <p className="text-slate-400 mt-0.5">
                    We&apos;ve installed the <code className="text-indigo-300 bg-slate-950 px-1 py-0.5 rounded font-mono">gh-pages</code> package and added <code className="text-indigo-300 bg-slate-950 px-1 py-0.5 rounded font-mono">npm run deploy</code> to <code className="text-slate-200">package.json</code>.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Run in your terminal:</span>
                  <button
                    onClick={() => copyToClipboard(cliDeployCommands, 'cli-cmds')}
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    {copiedIndex === 'cli-cmds' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-indigo-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300">
                  {cliDeployCommands}
                </pre>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-200">GitHub Pages Settings for branch deploy:</p>
                <p>1. Go to <strong>Settings</strong> → <strong>Pages</strong> in your GitHub repository.</p>
                <p>2. Set Source to <strong>Deploy from a branch</strong>.</p>
                <p>3. Select branch <strong className="text-indigo-400">gh-pages</strong> and folder <strong className="text-indigo-400">/ (root)</strong>, then hit Save.</p>
              </div>
            </div>
          )}

          {/* TAB 4: Checklist */}
          {activeTab === 'checklist' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                All essential configurations required for a seamless GitHub Pages deployment have been completed:
              </p>

              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-200">Relative Base Path (<code className="text-indigo-400 font-mono">base: &apos;./&apos;</code>)</p>
                      <p className="text-[11px] text-slate-400">Configured in <code className="text-slate-300">vite.config.ts</code> so asset URLs load properly on subpaths like <code className="text-slate-300">/&lt;repo-name&gt;/</code></p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Configured</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-200">GitHub Actions CI/CD Pipeline (main &amp; master)</p>
                      <p className="text-[11px] text-slate-400">Created <code className="text-slate-300">.github/workflows/deploy.yml</code> for zero-config automated builds on push</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Ready</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-200">SPA 404 Routing Fallback</p>
                      <p className="text-[11px] text-slate-400">Configured build script to copy <code className="text-slate-300">dist/index.html</code> to <code className="text-slate-300">dist/404.html</code> for GitHub Pages direct URL routing</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Configured</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-200">NPM Config &amp; Legacy Peer Deps</p>
                      <p className="text-[11px] text-slate-400">Configured <code className="text-slate-300">.npmrc</code> with <code className="text-slate-300">legacy-peer-deps=true</code> to prevent Ubuntu runner dependency conflicts</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Configured</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-200">NPM Deploy Scripts &amp; gh-pages Package</p>
                      <p className="text-[11px] text-slate-400"><code className="text-indigo-400 font-mono">npm run deploy</code> script available in <code className="text-slate-300">package.json</code></p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Installed</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleDownloadDeployScript}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Download Deploy Script (.sh)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(gitPushCommands, 'footer-copy')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
            >
              {copiedIndex === 'footer-copy' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Commands Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Git Push Commands</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowDeployModal(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
