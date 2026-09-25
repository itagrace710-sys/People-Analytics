import React, { useState, useRef, useMemo } from 'react';
import Papa from 'papaparse';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Database, 
  ArrowRight, 
  FileText, 
  RefreshCw, 
  Layers, 
  Check, 
  Zap,
  HelpCircle,
  TrendingUp,
  Users,
  Eye,
  Sliders
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Employee } from '../types/analytics';
import { DEPARTMENTS } from '../data/mockHrData';

interface ColumnMapping {
  id: string;
  name: string;
  department: string;
  jobTitle: string;
  salary: string;
  employmentStatus: string;
  gender: string;
  hireDate: string;
  location: string;
  performanceRating: string;
  engagementScore: string;
  absenceDaysLastYear: string;
  exitDate: string;
  exitReason: string;
  email: string;
}

const DEFAULT_MAPPING: ColumnMapping = {
  id: '',
  name: '',
  department: '',
  jobTitle: '',
  salary: '',
  employmentStatus: '',
  gender: '',
  hireDate: '',
  location: '',
  performanceRating: '',
  engagementScore: '',
  absenceDaysLastYear: '',
  exitDate: '',
  exitReason: '',
  email: ''
};

const SAMPLE_CSV_CONTENT = `Employee ID,Full Name,Email,Department,Job Title,Salary,Employment Status,Hire Date,Gender,Location,Performance Rating,Engagement Score,Absence Days,Exit Date,Exit Reason
EMP-10001,Elena Rostova,elena.rostova@enterprise.corp,Engineering,Lead Systems Architect,174000,Active,2021-03-15,Female,New York,4.8,92,4,,
EMP-10002,Marcus Vance,marcus.vance@enterprise.corp,Product,Senior Product Manager,145000,Active,2022-07-01,Male,San Francisco,4.5,88,6,,
EMP-10003,Sarah Chen,sarah.chen@enterprise.corp,Sales,Strategic Enterprise AE,128000,Terminated,2020-01-10,Female,Chicago,3.9,64,12,2025-11-30,Compensation
EMP-10004,Devon Miller,devon.miller@enterprise.corp,Operations,Operations Analyst,89000,Active,2023-04-18,Male,Austin,4.1,81,5,,
EMP-10005,Amina Diallo,amina.diallo@enterprise.corp,Marketing,Growth Marketing Lead,115000,Active,2022-09-05,Female,London,4.6,89,3,,
EMP-10006,Lucas Silva,lucas.silva@enterprise.corp,Customer Success,Enterprise CSM,98000,On Leave,2021-11-20,Male,Toronto,4.0,76,8,,
EMP-10007,Priya Patel,priya.patel@enterprise.corp,Finance,Senior Financial Analyst,118000,Active,2022-02-14,Female,New York,4.4,85,4,,
EMP-10008,Julian Moreau,julian.moreau@enterprise.corp,Human Resources,People Partner,105000,Terminated,2021-06-10,Male,Paris,3.8,61,9,2025-10-15,Career Growth`;

export const CsvDataUpload: React.FC<{ onNavigateToAnalytics?: () => void }> = ({ onNavigateToAnalytics }) => {
  const { 
    allEmployees, 
    batchAddEmployees, 
    replaceEmployees, 
    runInstantAnalysis, 
    uploadCustomDataset,
    setActiveTab,
    setShowAnalysisModal
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload & parse states
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [rawHeaders, setRawHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, any>[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>(DEFAULT_MAPPING);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [autoRunAnalysis, setAutoRunAnalysis] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importedSummary, setImportedSummary] = useState<{
    count: number;
    mode: 'append' | 'replace';
    newTotal: number;
    avgSalary: number;
    topDept: string;
  } | null>(null);
  const [pasteMode, setPasteMode] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);

  // Auto-detect mappings based on header names
  const autoDetectMappings = (headers: string[]): ColumnMapping => {
    const mapping: ColumnMapping = { ...DEFAULT_MAPPING };
    const lowerHeaders = headers.map(h => ({ raw: h, clean: h.trim().toLowerCase().replace(/[^a-z0-9]/g, '') }));

    const matchHeader = (keywords: string[]): string => {
      for (const kw of keywords) {
        const cleanKw = kw.toLowerCase().replace(/[^a-z0-9]/g, '');
        const found = lowerHeaders.find(h => h.clean === cleanKw || h.clean.includes(cleanKw) || cleanKw.includes(h.clean));
        if (found) return found.raw;
      }
      return '';
    };

    mapping.name = matchHeader(['fullname', 'name', 'employeename', 'staffname', 'worker']);
    mapping.id = matchHeader(['employeeid', 'empid', 'id', 'badge', 'staffid']);
    mapping.department = matchHeader(['department', 'dept', 'division', 'unit', 'team', 'orgunit']);
    mapping.jobTitle = matchHeader(['jobtitle', 'title', 'role', 'position', 'designation']);
    mapping.salary = matchHeader(['salary', 'basepay', 'annualsalary', 'pay', 'compensation', 'remuneration', 'wage']);
    mapping.employmentStatus = matchHeader(['employmentstatus', 'status', 'state', 'activestatus']);
    mapping.gender = matchHeader(['gender', 'sex']);
    mapping.hireDate = matchHeader(['hiredate', 'startdate', 'joined', 'joindate', 'dateofhire']);
    mapping.location = matchHeader(['location', 'office', 'city', 'site', 'worklocation', 'country']);
    mapping.performanceRating = matchHeader(['performancerating', 'performance', 'rating', 'review', 'kpirating']);
    mapping.engagementScore = matchHeader(['engagementscore', 'engagement', 'pulse', 'pulsescore', 'satisfaction']);
    mapping.absenceDaysLastYear = matchHeader(['absencedays', 'absencedayslastyear', 'absence', 'sickdays', 'pto', 'leavedays']);
    mapping.exitDate = matchHeader(['exitdate', 'terminationdate', 'enddate', 'resignationdate', 'leavedate']);
    mapping.exitReason = matchHeader(['exitreason', 'separationreason', 'turnoverreason', 'reasonforleaving', 'reason']);
    mapping.email = matchHeader(['email', 'workemail', 'mail', 'emailaddress']);

    return mapping;
  };

  const handleParseResults = (data: any[], headers: string[], sourceName: string, sizeStr?: string) => {
    if (!data || data.length === 0) {
      setParseError('The file contains no readable rows or headers.');
      return;
    }

    setParseError(null);
    setFileName(sourceName);
    if (sizeStr) setFileSize(sizeStr);
    setRawHeaders(headers);
    setRawRows(data);
    
    // Auto-detect column mappings
    const detected = autoDetectMappings(headers);
    setColumnMapping(detected);
    setImportedSummary(null);
  };

  const handleFileChange = (file: File) => {
    const sizeInKb = (file.size / 1024).toFixed(1);
    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` 
      : `${sizeInKb} KB`;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        const headers = results.meta.fields || [];
        handleParseResults(results.data, headers, file.name, sizeStr);
      },
      error: (err: any) => {
        setParseError(`Failed to parse CSV file: ${err?.message || String(err)}`);
      }
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handlePasteParse = () => {
    if (!pastedText.trim()) return;
    Papa.parse(pastedText.trim(), {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        const headers = results.meta.fields || [];
        handleParseResults(results.data, headers, 'Pasted_Data.csv', `${(pastedText.length / 1024).toFixed(1)} KB`);
        setPasteMode(false);
      },
      error: (err: any) => {
        setParseError(`Failed to parse pasted text: ${err?.message || String(err)}`);
      }
    });
  };

  const downloadSampleTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'hr_workforce_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const loadDemoDataset = (count: 50 | 500) => {
    const roles: Record<string, string[]> = {
      Engineering: ['Software Engineer', 'Senior Frontend Dev', 'Staff Backend Architect', 'DevOps Engineer', 'QA Automation Lead'],
      Product: ['Associate PM', 'Product Manager', 'Director of Product', 'UX Researcher', 'Principal Product Designer'],
      Sales: ['Account Executive', 'Enterprise AE', 'Sales Development Rep', 'VP of Global Sales', 'Sales Engineer'],
      Marketing: ['Growth Specialist', 'Content Strategist', 'Performance Marketing Lead', 'Brand Manager', 'SEO Analyst'],
      Operations: ['Operations Lead', 'Business Operations Analyst', 'Procurement Specialist', 'Supply Chain Director'],
      'Customer Success': ['CS Associate', 'Senior CSM', 'Director of Customer Experience', 'Support Operations Specialist'],
      Finance: ['Financial Analyst', 'Senior Controller', 'Staff Accountant', 'Director of FP&A'],
      'Human Resources': ['HR Generalist', 'Technical Recruiter', 'Compensation & Benefits Lead', 'People Operations Partner']
    };

    const firstNames = ['Sophia', 'Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Ava', 'Elijah', 'Charlotte', 'William', 'Amelia', 'James', 'Harper', 'Benjamin', 'Evelyn', 'Lucas', 'Mia', 'Henry', 'Isabella', 'Alexander'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
    const locations = ['New York', 'San Francisco', 'London', 'Chicago', 'Austin', 'Singapore', 'Berlin', 'Toronto', 'Sydney'];
    const exitReasons: ('Compensation' | 'Career Growth' | 'Manager Conflict' | 'Relocation' | 'Personal')[] = ['Compensation', 'Career Growth', 'Manager Conflict', 'Relocation', 'Personal'];

    let csv = 'Employee ID,Full Name,Email,Department,Job Title,Salary,Employment Status,Hire Date,Gender,Location,Performance Rating,Engagement Score,Absence Days,Exit Date,Exit Reason\n';
    
    for (let i = 1; i <= count; i++) {
      const id = `EMP-CSV-${String(i).padStart(4, '0')}`;
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${fName} ${lName}`;
      const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@demo.corp`;
      const dept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
      const deptRoles = roles[dept] || ['Specialist'];
      const jobTitle = deptRoles[Math.floor(Math.random() * deptRoles.length)];
      const salary = Math.round(55000 + Math.random() * 115000);
      const isTerminated = Math.random() < 0.12;
      const isOnLeave = !isTerminated && Math.random() < 0.05;
      const status = isTerminated ? 'Terminated' : isOnLeave ? 'On Leave' : 'Active';
      const year = 2018 + Math.floor(Math.random() * 6);
      const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
      const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
      const hireDate = `${year}-${month}-${day}`;
      const gender = Math.random() > 0.5 ? 'Female' : 'Male';
      const location = locations[Math.floor(Math.random() * locations.length)];
      const perf = (3.2 + Math.random() * 1.8).toFixed(1);
      const eng = Math.round(55 + Math.random() * 45);
      const absence = Math.floor(Math.random() * 14);
      const exitDate = isTerminated ? `2025-${String(1 + Math.floor(Math.random() * 12)).padStart(2, '0')}-15` : '';
      const exitReason = isTerminated ? exitReasons[Math.floor(Math.random() * exitReasons.length)] : '';

      csv += `"${id}","${fullName}","${email}","${dept}","${jobTitle}",${salary},"${status}","${hireDate}","${gender}","${location}",${perf},${eng},${absence},"${exitDate}","${exitReason}"\n`;
    }

    Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        handleParseResults(
          results.data, 
          results.meta.fields || [], 
          `Demo_Workforce_${count}_Employees.csv`, 
          `${(csv.length / 1024).toFixed(1)} KB`
        );
      }
    });
  };

  // Convert raw rows into validated Employee objects
  const { validatedEmployees, invalidRowCount } = useMemo(() => {
    if (!rawRows || rawRows.length === 0) {
      return { validatedEmployees: [], invalidRowCount: 0 };
    }

    let invalids = 0;
    const list: Employee[] = [];

    rawRows.forEach((row, index) => {
      // Name resolution
      const rawName = columnMapping.name ? String(row[columnMapping.name] || '').trim() : '';
      const name = rawName || `Imported Person ${index + 1}`;

      // ID resolution
      const rawId = columnMapping.id ? String(row[columnMapping.id] || '').trim() : '';
      const id = rawId || `EMP-IMP-${Date.now().toString().slice(-4)}-${String(index + 1).padStart(4, '0')}`;

      // Department resolution
      let dept = columnMapping.department ? String(row[columnMapping.department] || '').trim() : 'Operations';
      if (!dept) dept = 'Operations';
      // Normalize simple names
      if (dept.toLowerCase() === 'eng' || dept.toLowerCase().includes('engineer')) dept = 'Engineering';
      if (dept.toLowerCase() === 'hr' || dept.toLowerCase().includes('human')) dept = 'Human Resources';
      if (dept.toLowerCase() === 'cs' || dept.toLowerCase().includes('customer')) dept = 'Customer Success';
      if (dept.toLowerCase() === 'ops' || dept.toLowerCase().includes('operations')) dept = 'Operations';

      // Job Title resolution
      const jobTitle = columnMapping.jobTitle ? String(row[columnMapping.jobTitle] || '').trim() : 'Specialist';

      // Salary resolution (clean symbols like $, commas, etc.)
      const rawSal = columnMapping.salary ? String(row[columnMapping.salary] || '') : '85000';
      const cleanSalNum = Number(rawSal.replace(/[^0-9.]/g, ''));
      const salary = !isNaN(cleanSalNum) && cleanSalNum > 0 ? Math.round(cleanSalNum) : 85000;

      // Status resolution
      const rawStatus = columnMapping.employmentStatus ? String(row[columnMapping.employmentStatus] || '').trim().toLowerCase() : 'active';
      let employmentStatus: 'Active' | 'Terminated' | 'On Leave' = 'Active';
      if (rawStatus.includes('term') || rawStatus.includes('exit') || rawStatus.includes('left') || rawStatus.includes('inactive')) {
        employmentStatus = 'Terminated';
      } else if (rawStatus.includes('leave') || rawStatus.includes('maternity') || rawStatus.includes('sabbatical')) {
        employmentStatus = 'On Leave';
      }

      // Gender resolution
      const rawGender = columnMapping.gender ? String(row[columnMapping.gender] || '').trim().toLowerCase() : 'male';
      const gender: 'Female' | 'Male' | 'Non-Binary' | 'Unknown' = 
        rawGender.startsWith('f') ? 'Female' :
        rawGender.startsWith('m') ? 'Male' :
        rawGender.includes('non') ? 'Non-Binary' : 'Female';

      // Hire date
      const rawHire = columnMapping.hireDate ? String(row[columnMapping.hireDate] || '').trim() : '';
      let hireDate = '2023-01-15';
      if (rawHire && rawHire.length >= 4) {
        hireDate = rawHire.split('T')[0];
      }

      // Location
      const location = columnMapping.location ? String(row[columnMapping.location] || '').trim() : 'New York';

      // Rating
      const rawRating = columnMapping.performanceRating ? parseFloat(String(row[columnMapping.performanceRating])) : 4.0;
      const performanceRating = !isNaN(rawRating) && rawRating >= 1 && rawRating <= 5 ? Number(rawRating.toFixed(1)) : 4.0;

      // Engagement
      const rawEng = columnMapping.engagementScore ? parseInt(String(row[columnMapping.engagementScore])) : 82;
      const engagementScore = !isNaN(rawEng) && rawEng >= 0 && rawEng <= 100 ? rawEng : 82;

      // Absence Days
      const rawAbs = columnMapping.absenceDaysLastYear ? parseInt(String(row[columnMapping.absenceDaysLastYear])) : 5;
      const absenceDaysLastYear = !isNaN(rawAbs) && rawAbs >= 0 ? rawAbs : 5;

      // Tenure
      const hireYear = parseInt(hireDate.slice(0, 4)) || 2022;
      const tenureYears = Math.max(0.5, Number((2026 - hireYear).toFixed(1)));

      // Email
      const rawEmail = columnMapping.email ? String(row[columnMapping.email] || '').trim() : '';
      const email = rawEmail || `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@enterprise.corp`;

      // Exit Date & Reason
      const exitDate = employmentStatus === 'Terminated' 
        ? (columnMapping.exitDate ? String(row[columnMapping.exitDate] || '2025-11-15') : '2025-11-15')
        : undefined;

      const exitReason = employmentStatus === 'Terminated'
        ? (columnMapping.exitReason ? (String(row[columnMapping.exitReason]) as any) : 'Career Growth')
        : undefined;

      list.push({
        id,
        name,
        email,
        department: dept,
        jobTitle: jobTitle || 'Specialist',
        salary,
        employmentStatus,
        employmentType: 'Full-time',
        gender,
        dateOfBirth: '1992-05-14',
        hireDate,
        exitDate,
        exitReason,
        location,
        performanceRating,
        engagementScore,
        tenureYears,
        absenceDaysLastYear
      });
    });

    return { validatedEmployees: list, invalidRowCount: invalids };
  }, [rawRows, columnMapping]);

  // Execute the bulk import
  const executeImport = () => {
    if (validatedEmployees.length === 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      if (importMode === 'append') {
        batchAddEmployees(validatedEmployees);
      } else {
        replaceEmployees(validatedEmployees);
      }

      // Update Profiler
      uploadCustomDataset(fileName || 'Bulk_Import.csv', validatedEmployees);

      // Compute summary stats
      const totalSal = validatedEmployees.reduce((acc, e) => acc + e.salary, 0);
      const avgSal = Math.round(totalSal / validatedEmployees.length);
      
      const deptCounts: Record<string, number> = {};
      validatedEmployees.forEach(e => {
        deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;
      });
      const topDept = Object.entries(deptCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Engineering';

      const updatedCount = importMode === 'append' ? allEmployees.length + validatedEmployees.length : validatedEmployees.length;

      setImportedSummary({
        count: validatedEmployees.length,
        mode: importMode,
        newTotal: updatedCount,
        avgSalary: avgSal,
        topDept
      });

      setIsProcessing(false);

      if (autoRunAnalysis) {
        runInstantAnalysis();
      }
    }, 600);
  };

  const resetAll = () => {
    setFileName(null);
    setFileSize(null);
    setRawHeaders([]);
    setRawRows([]);
    setColumnMapping(DEFAULT_MAPPING);
    setImportedSummary(null);
    setParseError(null);
    setPastedText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Starters */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                Workforce Bulk Ingestion Engine
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Instant CSV Ingestion
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <FileSpreadsheet className="w-6 h-6 text-indigo-400" />
              <span>Bulk Import HR Employee Data</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Upload your company's employee master spreadsheet or CSV file. Map custom column names, preview parsed records in real-time, and ingest hundreds or thousands of rows directly into your active People Analytics models.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={downloadSampleTemplate}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all hover:border-indigo-500/50"
              title="Download a standardized CSV template ready for your employee data"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Download CSV Template</span>
            </button>

            <button
              onClick={() => loadDemoDataset(50)}
              className="px-3.5 py-2.5 rounded-xl bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
              title="Instantly generate and parse a realistic 50-employee CSV"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Load 50 Sample CSV</span>
            </button>

            <button
              onClick={() => loadDemoDataset(500)}
              className="px-3.5 py-2.5 rounded-xl bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
              title="Instantly generate and parse a realistic 500-employee CSV"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Load 500 Sample CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Parse Error Notification */}
      {parseError && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <span>{parseError}</span>
          </div>
          <button onClick={() => setParseError(null)} className="text-slate-400 hover:text-white text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Success Notification after import */}
      {importedSummary && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-indigo-950/80 border border-emerald-500/50 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Successfully Imported {importedSummary.count.toLocaleString()} Employee Records!</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {importedSummary.mode === 'append' ? 'Appended to Workforce' : 'Dataset Replaced'}
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Total active workforce is now <strong className="text-white font-mono">{importedSummary.newTotal.toLocaleString()}</strong> people across all departments.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  if (onNavigateToAnalytics) onNavigateToAnalytics();
                  else setActiveTab('analytics');
                }}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Open Analytics View</span>
              </button>

              <button
                onClick={() => setShowAnalysisModal(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>View Generated Analysis</span>
              </button>

              <button
                onClick={resetAll}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Import Another File</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Imported Rows</span>
              <span className="font-mono font-bold text-white text-sm">+{importedSummary.count.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">New Total Workforce</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{importedSummary.newTotal.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Average Ingested Salary</span>
              <span className="font-mono font-bold text-indigo-300 text-sm">${importedSummary.avgSalary.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Primary Ingested Dept</span>
              <span className="font-semibold text-slate-200 text-sm truncate">{importedSummary.topDept}</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: Upload or Paste File */}
      {!fileName && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-mono">1</span>
                <span>Select or Drop Your HR CSV File</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Supports standard UTF-8 CSV, TSV, or plain text tables exported from Workday, BambooHR, ADP, SAP, or Excel.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPasteMode(!pasteMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                  pasteMode 
                    ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50' 
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{pasteMode ? 'Back to Drag & Drop' : 'Paste CSV Raw Text'}</span>
              </button>
            </div>
          </div>

          {pasteMode ? (
            <div className="space-y-4">
              <label className="block text-xs font-medium text-slate-300">
                Paste your CSV content with headers in the first line:
              </label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder={`Employee ID,Full Name,Department,Job Title,Salary,Employment Status\nEMP-01,John Doe,Engineering,Software Engineer,130000,Active\nEMP-02,Jane Smith,Product,Product Manager,140000,Active`}
                rows={8}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setPasteMode(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasteParse}
                  disabled={!pastedText.trim()}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 disabled:opacity-50 flex items-center gap-2"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Parse Pasted CSV</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-950/30 scale-[1.01]'
                  : 'border-slate-700 hover:border-indigo-500/60 bg-slate-950/40 hover:bg-slate-950/70'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .tsv, .txt"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>

              <h4 className="text-base font-bold text-white">
                Drag and drop your HR CSV file here
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
                Click to browse files on your computer. Supports .csv and .tsv files up to 50MB with arbitrary column orders.
              </p>

              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 shadow-sm inline-flex items-center gap-2 pointer-events-none"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Browse Files</span>
              </button>

              <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Auto-header detection
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Auto-currency & date parsing
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Unlimited records & benchmark scale
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: File Loaded -> Column Mapping & Preview */}
      {fileName && (
        <div className="space-y-6">
          {/* File Status Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{fileName}</h4>
                  {fileSize && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {fileSize}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                  <span><strong className="text-emerald-400 font-mono">{rawRows.length.toLocaleString()}</strong> rows detected</span>
                  <span>•</span>
                  <span><strong className="text-indigo-400 font-mono">{rawHeaders.length}</strong> columns detected</span>
                  <span>•</span>
                  <span className="text-slate-300">Ready for mapping & validation</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetAll}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Choose Another File</span>
              </button>
            </div>
          </div>

          {/* Column Mapping Section */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <span>Column Header Mapping</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verify or adjust how your CSV headers match the People Analytics system schema.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Smart Auto-Mapped</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Target Field: Full Name */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <span>Full Name</span>
                    <span className="text-[10px] text-amber-400 font-bold">*Required</span>
                  </label>
                  {columnMapping.name && (
                    <span className="text-[10px] font-mono text-emerald-400">Mapped</span>
                  )}
                </div>
                <select
                  value={columnMapping.name}
                  onChange={(e) => setColumnMapping({ ...columnMapping, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="">-- Select Column --</option>
                  {rawHeaders.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-500 truncate">
                  Sample: {columnMapping.name && rawRows[0] ? String(rawRows[0][columnMapping.name] || 'N/A') : 'Auto-generated if blank'}
                </div>
              </div>

              {/* Target Field: Employee ID */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <span>Employee ID</span>
                    <span className="text-[10px] text-slate-400">Optional</span>
                  </label>
                  {columnMapping.id && (
                    <span className="text-[10px] font-mono text-emerald-400">Mapped</span>
                  )}
                </div>
                <select
                  value={columnMapping.id}
                  onChange={(e) => setColumnMapping({ ...columnMapping, id: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="">-- Select Column (or Auto-ID) --</option>
                  {rawHeaders.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-500 truncate">
                  Sample: {columnMapping.id && rawRows[0] ? String(rawRows[0][columnMapping.id] || 'N/A') : 'Will auto-generate EMP-xxxx'}
                </div>
              </div>

              {/* Target Field: Department */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <span>Department</span>
                    <span className="text-[10px] text-amber-400 font-bold">*Required</span>
                  </label>
                  {columnMapping.department && (
                    <span className="text-[10px] font-mono text-emerald-400">Mapped</span>
                  )}
                </div>
                <select
                  value={columnMapping.department}
                  onChange={(e) => setColumnMapping({ ...columnMapping, department: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="">-- Select Column --</option>
                  {rawHeaders.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-500 truncate">
                  Sample: {columnMapping.department && rawRows[0] ? String(rawRows[0][columnMapping.department] || 'N/A') : 'Defaults to Operations'}
                </div>
              </div>

              {/* Target Field: Job Title */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-white">Job Title / Role</label>
                  {columnMapping.jobTitle && (
                    <span className="text-[10px] font-mono text-emerald-400">Mapped</span>
                  )}
                </div>
                <select
                  value={columnMapping.jobTitle}
                  onChange={(e) => setColumnMapping({ ...columnMapping, jobTitle: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="">-- Select Column --</option>
                  {rawHeaders.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-500 truncate">
                  Sample: {columnMapping.jobTitle && rawRows[0] ? String(rawRows[0][columnMapping.jobTitle] || 'N/A') : 'Specialist'}
                </div>
              </div>

              {/* Target Field: Annual Salary */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <span>Annual Salary</span>
                    <span className="text-[10px] text-amber-400 font-bold">*Required</span>
                  </label>
                  {columnMapping.salary && (
                    <span className="text-[10px] font-mono text-emerald-400">Mapped</span>
                  )}
                </div>
                <select
                  value={columnMapping.salary}
                  onChange={(e) => setColumnMapping({ ...columnMapping, salary: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="">-- Select Column --</option>
                  {rawHeaders.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-500 truncate">
                  Sample: {columnMapping.salary && rawRows[0] ? String(rawRows[0][columnMapping.salary] || 'N/A') : 'Cleans $, commas automatically'}
                </div>
              </div>

              {/* Target Field: Employment Status */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-white">Employment Status</label>
                  {columnMapping.employmentStatus && (
                    <span className="text-[10px] font-mono text-emerald-400">Mapped</span>
                  )}
                </div>
                <select
                  value={columnMapping.employmentStatus}
                  onChange={(e) => setColumnMapping({ ...columnMapping, employmentStatus: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="">-- Select Column --</option>
                  {rawHeaders.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-500 truncate">
                  Sample: {columnMapping.employmentStatus && rawRows[0] ? String(rawRows[0][columnMapping.employmentStatus] || 'N/A') : 'Active, Terminated, On Leave'}
                </div>
              </div>

              {/* Target Field: Hire Date */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-white">Hire Date</label>
                  {columnMapping.hireDate && (
                    <span className="text-[10px] font-mono text-emerald-400">Mapped</span>
                  )}
                </div>
                <select
                  value={columnMapping.hireDate}
                  onChange={(e) => setColumnMapping({ ...columnMapping, hireDate: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="">-- Select Column --</option>
                  {rawHeaders.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-500 truncate">
                  Sample: {columnMapping.hireDate && rawRows[0] ? String(rawRows[0][columnMapping.hireDate] || 'N/A') : 'YYYY-MM-DD standard'}
                </div>
              </div>

              {/* Target Field: Performance Rating */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-white">Performance (1-5)</label>
                  {columnMapping.performanceRating && (
                    <span className="text-[10px] font-mono text-emerald-400">Mapped</span>
                  )}
                </div>
                <select
                  value={columnMapping.performanceRating}
                  onChange={(e) => setColumnMapping({ ...columnMapping, performanceRating: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="">-- Select Column --</option>
                  {rawHeaders.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-500 truncate">
                  Sample: {columnMapping.performanceRating && rawRows[0] ? String(rawRows[0][columnMapping.performanceRating] || 'N/A') : 'Defaults to 4.0'}
                </div>
              </div>

              {/* Target Field: Engagement Score */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-white">Engagement (0-100)</label>
                  {columnMapping.engagementScore && (
                    <span className="text-[10px] font-mono text-emerald-400">Mapped</span>
                  )}
                </div>
                <select
                  value={columnMapping.engagementScore}
                  onChange={(e) => setColumnMapping({ ...columnMapping, engagementScore: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="">-- Select Column --</option>
                  {rawHeaders.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-500 truncate">
                  Sample: {columnMapping.engagementScore && rawRows[0] ? String(rawRows[0][columnMapping.engagementScore] || 'N/A') : 'Defaults to 82%'}
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: Preview Parsed Records */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>Data Ingestion Preview (First 8 Rows)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Check sanitized employee attributes before committing the bulk import.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
                  {validatedEmployees.length.toLocaleString()} Valid Records Ready
                </span>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-medium">
                    <th className="py-2.5 px-3">Emp ID</th>
                    <th className="py-2.5 px-3">Full Name</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Job Title</th>
                    <th className="py-2.5 px-3 text-right">Salary</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-center">Rating</th>
                    <th className="py-2.5 px-3 text-center">Engagement</th>
                    <th className="py-2.5 px-3">Hire Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {validatedEmployees.slice(0, 8).map((emp, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 text-indigo-400 font-bold">{emp.id}</td>
                      <td className="py-2.5 px-3 text-slate-100 font-sans font-medium">{emp.name}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-sans">
                          {emp.department}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 font-sans">{emp.jobTitle}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-100">
                        ${emp.salary.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          emp.employmentStatus === 'Active' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                            : emp.employmentStatus === 'Terminated'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {emp.employmentStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-amber-400 font-bold">{emp.performanceRating}★</td>
                      <td className="py-2.5 px-3 text-center text-indigo-300">{emp.engagementScore}%</td>
                      <td className="py-2.5 px-3 text-slate-400">{emp.hireDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {validatedEmployees.length > 8 && (
              <p className="text-center text-[11px] text-slate-500 pt-1">
                + {validatedEmployees.length - 8} more rows ready to be imported into the active workforce model.
              </p>
            )}
          </div>

          {/* STEP 4: Import Configuration & Execution */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border border-indigo-500/40 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-mono">2</span>
                <span>Select Import Mode & Commit to Workforce</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose whether to merge these records with your existing data or replace your active dataset.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option A: Append */}
              <label 
                onClick={() => setImportMode('append')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  importMode === 'append'
                    ? 'border-indigo-500 bg-indigo-950/30'
                    : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'append'}
                  onChange={() => setImportMode('append')}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Append & Merge with Existing</span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Adds the <strong className="text-slate-200">{validatedEmployees.length.toLocaleString()}</strong> records to your active <strong className="text-slate-200">{allEmployees.length.toLocaleString()}</strong> records. New total will be <strong className="text-emerald-400 font-mono">{(allEmployees.length + validatedEmployees.length).toLocaleString()}</strong> employees.
                  </p>
                </div>
              </label>

              {/* Option B: Replace */}
              <label 
                onClick={() => setImportMode('replace')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  importMode === 'replace'
                    ? 'border-indigo-500 bg-indigo-950/30'
                    : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="text-sm font-bold text-white">Replace Entire Workforce</span>
                  <p className="text-xs text-slate-400 mt-1">
                    Clears the current dataset and establishes these <strong className="text-slate-200">{validatedEmployees.length.toLocaleString()}</strong> records as the sole baseline for all HR analytics.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRunAnalysis}
                  onChange={(e) => setAutoRunAnalysis(e.target.checked)}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Automatically run instant People Analytics & open results summary</span>
              </label>

              <div className="flex items-center gap-3">
                <button
                  onClick={resetAll}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={executeImport}
                  disabled={isProcessing || validatedEmployees.length === 0}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-bold shadow-xl shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Ingesting {validatedEmployees.length.toLocaleString()} Records...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>
                        Confirm Bulk Import ({validatedEmployees.length.toLocaleString()} Records)
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
