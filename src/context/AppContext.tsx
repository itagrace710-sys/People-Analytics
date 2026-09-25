import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { User, UserRole, RolePermissions, ROLE_PERMISSIONS, AuditEntry } from '../types/user';
import { 
  Employee, 
  DataProfileSummary, 
  TransformationStep, 
  ModelTable, 
  ModelRelationship, 
  DaxMeasure,
  HRMetricInsight,
  GeneratedAnalysisSummary
} from '../types/analytics';
import { 
  INITIAL_USERS, 
  INITIAL_AUDIT_LOGS, 
  GENERATED_EMPLOYEES, 
  INITIAL_DATA_PROFILE, 
  INITIAL_TRANSFORMATION_PIPELINE, 
  INITIAL_DATA_MODEL_TABLES, 
  INITIAL_MODEL_RELATIONSHIPS, 
  DAX_MEASURES_LIBRARY,
  EXECUTIVE_INSIGHTS,
  DIRTY_RAW_SAMPLE,
  DirtyEmployeeRow,
  createEmployees
} from '../data/mockHrData';

export type BackgroundTheme = 'white' | 'grey' | 'multicolored' | 'dark';

interface AppContextType {
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Background Theme / Canvas Mode
  backgroundTheme: BackgroundTheme;
  setBackgroundTheme: (theme: BackgroundTheme) => void;

  // Account Management & User Database
  users: User[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  addUser: (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  permissions: RolePermissions;
  auditLogs: AuditEntry[];
  addAuditLog: (action: string, category: AuditEntry['category'], details: string) => void;

  // Dataset & Filters
  allEmployees: Employee[];
  filteredEmployees: Employee[];
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Scalable Dataset & Adding Information
  datasetSize: number;
  loadBenchmarkDataset: (count: number) => void;
  addEmployeeRecord: (empData: Omit<Employee, 'id'>) => Employee;
  batchAddEmployees: (newEmps: Employee[]) => void;
  replaceEmployees: (newEmps: Employee[]) => void;
  
  // Instant Analysis & Result Generation
  isAnalyzing: boolean;
  runInstantAnalysis: () => void;
  lastAnalysisResult: GeneratedAnalysisSummary | null;
  showAddEmployeeModal: boolean;
  setShowAddEmployeeModal: (val: boolean) => void;
  showAnalysisModal: boolean;
  setShowAnalysisModal: (val: boolean) => void;
  showDeployModal: boolean;
  setShowDeployModal: (val: boolean) => void;

  // Data Profiler & Cleaning Engine
  dataProfile: DataProfileSummary;
  dirtyRawData: DirtyEmployeeRow[];
  isDataCleaned: boolean;
  autoFixAllIssues: () => void;
  resetRawData: () => void;
  uploadCustomDataset: (fileName: string, rows: any[]) => void;
  transformationSteps: TransformationStep[];
  toggleTransformationStep: (id: string) => void;
  addTransformationStep: (newStep: Omit<TransformationStep, 'id' | 'applied'>) => void;

  // Data Model
  modelTables: ModelTable[];
  modelRelationships: ModelRelationship[];
  toggleRelationship: (id: string) => void;

  // DAX & Insights
  daxMeasures: DaxMeasure[];
  executiveInsights: HRMetricInsight[];

  // Aggregated KPIs
  kpis: {
    totalHeadcount: number;
    activeCount: number;
    exitCount: number;
    turnoverRate: number;
    voluntaryTurnoverRate: number;
    avgSalary: number;
    avgEngagement: number;
    avgTenure: number;
    avgAbsenceDays: number;
    departmentBreakdown: { department: string; count: number; turnoverRate: number; avgSalary: number }[];
    genderBreakdown: { gender: string; count: number; percentage: number }[];
    tenureBuckets: { range: string; count: number }[];
    exitReasons: { reason: string; count: number }[];
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('home');

  // Background Theme / Canvas Mode ('white' | 'grey' | 'multicolored' | 'dark')
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>(() => {
    try {
      const saved = localStorage.getItem('pas_app_theme') as BackgroundTheme;
      if (saved && ['white', 'grey', 'multicolored', 'dark'].includes(saved)) {
        return saved;
      }
    } catch (e) {
      console.warn('Could not read backgroundTheme from localStorage:', e);
    }
    return 'multicolored'; // Default to vibrant multicolored theme as requested or easily toggled
  });

  useEffect(() => {
    try {
      localStorage.setItem('pas_app_theme', backgroundTheme);
      document.documentElement.setAttribute('data-theme', backgroundTheme);
    } catch (e) {
      console.warn('Could not persist theme:', e);
    }
  }, [backgroundTheme]);

  // Load / Persist Users
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('pas_users_db');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUserState] = useState<User>(() => users[0] || INITIAL_USERS[0]);

  useEffect(() => {
    try {
      localStorage.setItem('pas_users_db', JSON.stringify(users));
    } catch (e) {
      console.warn('Could not persist users:', e);
    }
  }, [users]);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(() => {
    try {
      const saved = localStorage.getItem('pas_audit_logs');
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const addAuditLog = (action: string, category: AuditEntry['category'], details: string) => {
    const newLog: AuditEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userEmail: currentUser.email,
      action,
      category,
      details
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    addAuditLog('User Session Switched', 'auth', `Switched active account profile to ${user.name} (${user.role})`);
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    const newUser: User = {
      ...userData,
      id: `u-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never'
    };
    setUsers(prev => [...prev, newUser]);
    addAuditLog('User Account Created', 'user_management', `Provisioned new account for ${newUser.email} with role [${newUser.role}]`);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (currentUser.id === id) {
      setCurrentUserState(prev => ({ ...prev, ...updates }));
    }
    addAuditLog('User Account Updated', 'user_management', `Modified settings for user ID ${id}`);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    addAuditLog('User Account Deleted', 'user_management', `Removed user ID ${id} from database`);
  };

  // Role permissions
  const permissions = useMemo(() => {
    return ROLE_PERMISSIONS[currentUser.role] || ROLE_PERMISSIONS.viewer;
  }, [currentUser.role]);

  // HR Data State
  const [allEmployees, setAllEmployees] = useState<Employee[]>(GENERATED_EMPLOYEES);
  const [datasetSize, setDatasetSize] = useState<number>(3000);
  const [dataProfile, setDataProfile] = useState<DataProfileSummary>(INITIAL_DATA_PROFILE);
  const [transformationSteps, setTransformationSteps] = useState<TransformationStep[]>(INITIAL_TRANSFORMATION_PIPELINE);
  const [dirtyRawData, setDirtyRawData] = useState<DirtyEmployeeRow[]>(DIRTY_RAW_SAMPLE);
  const [isDataCleaned, setIsDataCleaned] = useState<boolean>(true);

  // Instant Analysis and Modals
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [lastAnalysisResult, setLastAnalysisResult] = useState<GeneratedAnalysisSummary | null>(null);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState<boolean>(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState<boolean>(false);
  const [showDeployModal, setShowDeployModal] = useState<boolean>(false);

  // Helper to compute analysis summary from any list of employees
  const computeAnalysisResult = (emps: Employee[]): GeneratedAnalysisSummary => {
    const total = emps.length;
    const active = emps.filter(e => e.employmentStatus === 'Active' || e.employmentStatus === 'On Leave').length;
    const exits = emps.filter(e => e.employmentStatus === 'Terminated').length;
    const turnoverRate = total > 0 ? Number(((exits / total) * 100).toFixed(1)) : 0;
    const voluntary = emps.filter(e => 
      e.employmentStatus === 'Terminated' && 
      (e.exitReason === 'Compensation' || e.exitReason === 'Career Growth' || e.exitReason === 'Personal')
    ).length;
    const voluntaryTurnoverRate = total > 0 ? Number(((voluntary / total) * 100).toFixed(1)) : 0;
    const avgSalary = total > 0 ? Math.round(emps.reduce((acc, e) => acc + e.salary, 0) / total) : 0;
    const avgEng = total > 0 ? Math.round(emps.reduce((acc, e) => acc + e.engagementScore, 0) / total) : 0;
    const avgTenure = total > 0 ? Number((emps.reduce((acc, e) => acc + e.tenureYears, 0) / total).toFixed(1)) : 0;
    const avgAbsence = total > 0 ? Number((emps.reduce((acc, e) => acc + e.absenceDaysLastYear, 0) / total).toFixed(1)) : 0;

    // Department breakdown
    const deptMap: Record<string, { total: number; exits: number; totalSalary: number }> = {};
    emps.forEach(e => {
      if (!deptMap[e.department]) deptMap[e.department] = { total: 0, exits: 0, totalSalary: 0 };
      deptMap[e.department].total += 1;
      deptMap[e.department].totalSalary += e.salary;
      if (e.employmentStatus === 'Terminated') deptMap[e.department].exits += 1;
    });

    const deptRanked = Object.entries(deptMap).map(([name, val]) => ({
      name,
      rate: val.total > 0 ? Number(((val.exits / val.total) * 100).toFixed(1)) : 0
    })).sort((a, b) => b.rate - a.rate);

    const highestChurn = deptRanked[0] || { name: 'Engineering', rate: 9.1 };
    const lowestChurn = deptRanked[deptRanked.length - 1] || { name: 'Human Resources', rate: 2.8 };

    const keyFindings = [
      `Evaluated full workforce dataset of ${total.toLocaleString()} employee records: ${active.toLocaleString()} active staff and ${exits} exits (${turnoverRate}% annualized turnover).`,
      `${highestChurn.name} has the highest attrition risk at ${highestChurn.rate}%, whereas ${lowestChurn.name} recorded lowest churn at ${lowestChurn.rate}%.`,
      `Workforce average compensation is $${avgSalary.toLocaleString()} with overall employee engagement at ${avgEng}%.`,
      `Average tenure across the organization is ${avgTenure} years with ${avgAbsence} average annual unplanned absence days.`
    ];

    const actionablePlaybook = [
      `Prioritize immediate retention interventions in ${highestChurn.name}: conduct stay interviews with key engineers and leaders.`,
      `Benchmark compensation bands against market midpoints to guard against the ${voluntary} voluntary resignations (${voluntaryTurnoverRate}%).`,
      `Review workload sentiment which remains a primary drag on overall morale across Sales and Support squads.`,
      `Protect talent pipeline: sustain structured 30-60-90 day milestone reviews to minimize first-year tenure drop-off.`
    ];

    return {
      analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      totalEvaluated: total,
      activeCount: active,
      exitCount: exits,
      turnoverRate,
      voluntaryTurnoverRate,
      averageSalary: avgSalary,
      averageEngagement: avgEng,
      averageTenure: avgTenure,
      averageAbsenceDays: avgAbsence,
      highestChurnDepartment: highestChurn,
      lowestChurnDepartment: lowestChurn,
      topRetentionRiskRole: `${highestChurn.name} Senior Specialist`,
      keyFindings,
      actionablePlaybook
    };
  };

  // Run instant analysis
  const runInstantAnalysis = () => {
    setIsAnalyzing(true);
    addAuditLog('Instant Analysis Executed', 'query', `Evaluated workforce metrics and generated insights across ${allEmployees.length} records`);
    setTimeout(() => {
      const summary = computeAnalysisResult(allEmployees);
      setLastAnalysisResult(summary);
      setIsAnalyzing(false);
      setShowAnalysisModal(true);
    }, 400);
  };

  // Add individual employee record
  const addEmployeeRecord = (empData: Omit<Employee, 'id'>): Employee => {
    const nextNum = allEmployees.length > 0 
      ? Math.max(...allEmployees.map(e => parseInt(e.id.replace('EMP-', '') || '1000', 10))) + 1 
      : 1001;
    const newEmp: Employee = {
      ...empData,
      id: `EMP-${nextNum}`
    };

    const updated = [newEmp, ...allEmployees];
    setAllEmployees(updated);
    setDatasetSize(updated.length);
    setDataProfile(prev => ({
      ...prev,
      rowCount: updated.length,
      overallScore: Math.min(99.6, prev.overallScore + 0.1)
    }));

    addAuditLog(
      'Employee Record Added', 
      'data_clean', 
      `Added record for ${newEmp.name} (${newEmp.id}) to ${newEmp.department} department. Dataset updated to ${updated.length} records.`
    );

    // Auto-generate fresh analysis
    const summary = computeAnalysisResult(updated);
    setLastAnalysisResult(summary);

    return newEmp;
  };

  // Batch add employees
  const batchAddEmployees = (newEmps: Employee[]) => {
    const updated = [...newEmps, ...allEmployees];
    setAllEmployees(updated);
    setDatasetSize(updated.length);
    setDataProfile(prev => ({
      ...prev,
      rowCount: updated.length
    }));
    addAuditLog('Batch Records Ingested', 'data_clean', `Imported ${newEmps.length} employee records. Total workforce: ${updated.length}`);
    const summary = computeAnalysisResult(updated);
    setLastAnalysisResult(summary);
  };

  // Replace entire workforce with imported employee records
  const replaceEmployees = (newEmps: Employee[]) => {
    setAllEmployees(newEmps);
    setDatasetSize(newEmps.length);
    setDataProfile(prev => ({
      ...prev,
      rowCount: newEmps.length,
      overallScore: 98.4
    }));
    addAuditLog('Workforce Replaced via Bulk CSV', 'data_clean', `Replaced active dataset with ${newEmps.length.toLocaleString()} employee records from CSV import.`);
    const summary = computeAnalysisResult(newEmps);
    setLastAnalysisResult(summary);
  };

  // Load benchmark dataset size (e.g. 3,000, 487, 5,000)
  const loadBenchmarkDataset = (count: number) => {
    setIsAnalyzing(true);
    const emps = createEmployees(count);
    setAllEmployees(emps);
    setDatasetSize(count);
    setDataProfile(prev => ({
      ...prev,
      rowCount: count,
      overallScore: 94.6
    }));
    addAuditLog('Dataset Scaled', 'data_clean', `Loaded scaled benchmark of ${count.toLocaleString()} employee records into People Analytics Studio`);
    setTimeout(() => {
      const summary = computeAnalysisResult(emps);
      setLastAnalysisResult(summary);
      setIsAnalyzing(false);
      setShowAnalysisModal(true);
    }, 450);
  };

  // Filters
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data Model & DAX
  const [modelTables] = useState<ModelTable[]>(INITIAL_DATA_MODEL_TABLES);
  const [modelRelationships, setModelRelationships] = useState<ModelRelationship[]>(INITIAL_MODEL_RELATIONSHIPS);
  const [daxMeasures] = useState<DaxMeasure[]>(DAX_MEASURES_LIBRARY);
  const executiveInsights = EXECUTIVE_INSIGHTS;

  const toggleRelationship = (id: string) => {
    setModelRelationships(prev => prev.map(rel => rel.id === id ? { ...rel, active: !rel.active } : rel));
    addAuditLog('Data Model Schema Updated', 'query', `Toggled relationship ${id}`);
  };

  const toggleTransformationStep = (id: string) => {
    setTransformationSteps(prev => prev.map(step => step.id === id ? { ...step, applied: !step.applied } : step));
    addAuditLog('Transformation Pipeline Modified', 'data_clean', `Toggled cleaning step ${id}`);
  };

  const addTransformationStep = (newStep: Omit<TransformationStep, 'id' | 'applied'>) => {
    const step: TransformationStep = {
      ...newStep,
      id: `step-${Date.now()}`,
      applied: true
    };
    setTransformationSteps(prev => [...prev, step]);
    addAuditLog('Custom Cleaning Step Added', 'data_clean', `Appended step: ${newStep.title}`);
  };

  const autoFixAllIssues = () => {
    setIsDataCleaned(true);
    setDataProfile(prev => ({
      ...prev,
      overallScore: 99.4,
      completeness: 99.8,
      consistency: 98.9,
      accuracy: 99.5,
      uniqueness: 100,
      validity: 99.1,
      issues: prev.issues.filter(i => !i.autoFixable)
    }));
    // Clean dirty sample representation
    setDirtyRawData(prev => 
      prev
        .filter(r => !r.Notes?.includes('DUPLICATE'))
        .map(r => ({
          ...r,
          Employee_Name: r.Employee_Name.trim(),
          Department: r.Department.toLowerCase() === 'eng' ? 'Engineering' : (r.Department.toLowerCase() === 'ops' ? 'Operations' : (r.Department || 'Human Resources')),
          Salary: r.Salary.replace(/[^0-9.]/g, '')
        }))
    );
    addAuditLog('Auto-Clean Executed', 'data_clean', 'Power Query automated repair pipeline executed: 5 issues resolved, quality score reached 99.4%');
  };

  const resetRawData = () => {
    setIsDataCleaned(false);
    setDataProfile(INITIAL_DATA_PROFILE);
    setDirtyRawData(DIRTY_RAW_SAMPLE);
    addAuditLog('Dataset Reset', 'data_clean', 'Reverted active dataset back to raw uncleaned batch state');
  };

  const uploadCustomDataset = (fileName: string, rows: any[]) => {
    addAuditLog('Dataset Uploaded', 'data_clean', `Imported ${fileName} (${rows.length} records parsed)`);
    // update profile with realistic numbers based on uploaded rows
    setDataProfile({
      rowCount: rows.length,
      columnCount: Object.keys(rows[0] || {}).length || 10,
      completeness: 96.2,
      consistency: 91.0,
      accuracy: 94.0,
      uniqueness: 98.5,
      validity: 93.4,
      overallScore: 94.6,
      issues: INITIAL_DATA_PROFILE.issues
    });
  };

  // Enforce role-based access restrictions
  // If user has a department scope (e.g., manager restricted to 'Engineering'), enforce it
  const effectiveDepartment = currentUser.departmentScope && currentUser.departmentScope !== 'All' 
    ? currentUser.departmentScope 
    : selectedDepartment;

  // Filtered employees list
  const filteredEmployees = useMemo(() => {
    return allEmployees.filter(emp => {
      // Role scope filter
      if (currentUser.departmentScope && currentUser.departmentScope !== 'All') {
        if (emp.department.toLowerCase() !== currentUser.departmentScope.toLowerCase()) {
          return false;
        }
      } else if (effectiveDepartment !== 'All') {
        if (emp.department.toLowerCase() !== effectiveDepartment.toLowerCase()) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== 'All' && emp.employmentStatus !== selectedStatus) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = emp.name.toLowerCase().includes(q);
        const matchId = emp.id.toLowerCase().includes(q);
        const matchTitle = emp.jobTitle.toLowerCase().includes(q);
        const matchDept = emp.department.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchTitle && !matchDept) return false;
      }

      return true;
    });
  }, [allEmployees, currentUser.departmentScope, effectiveDepartment, selectedStatus, searchQuery]);

  // Aggregate HR KPIs
  const kpis = useMemo(() => {
    const totalHeadcount = filteredEmployees.length;
    const activeCount = filteredEmployees.filter(e => e.employmentStatus === 'Active' || e.employmentStatus === 'On Leave').length;
    const exitCount = filteredEmployees.filter(e => e.employmentStatus === 'Terminated').length;
    const turnoverRate = totalHeadcount > 0 ? Number(((exitCount / totalHeadcount) * 100).toFixed(1)) : 0;
    
    const voluntaryExits = filteredEmployees.filter(e => 
      e.employmentStatus === 'Terminated' && 
      (e.exitReason === 'Compensation' || e.exitReason === 'Career Growth' || e.exitReason === 'Personal')
    ).length;
    const voluntaryTurnoverRate = totalHeadcount > 0 ? Number(((voluntaryExits / totalHeadcount) * 100).toFixed(1)) : 0;

    const avgSalary = totalHeadcount > 0 
      ? Math.round(filteredEmployees.reduce((acc, e) => acc + e.salary, 0) / totalHeadcount) 
      : 0;

    const avgEngagement = totalHeadcount > 0 
      ? Math.round(filteredEmployees.reduce((acc, e) => acc + e.engagementScore, 0) / totalHeadcount) 
      : 0;

    const avgTenure = totalHeadcount > 0 
      ? Number((filteredEmployees.reduce((acc, e) => acc + e.tenureYears, 0) / totalHeadcount).toFixed(1)) 
      : 0;

    const avgAbsenceDays = totalHeadcount > 0 
      ? Number((filteredEmployees.reduce((acc, e) => acc + e.absenceDaysLastYear, 0) / totalHeadcount).toFixed(1)) 
      : 0;

    // Dept breakdown
    const deptMap: Record<string, { count: number; exits: number; totalSalary: number }> = {};
    filteredEmployees.forEach(e => {
      if (!deptMap[e.department]) {
        deptMap[e.department] = { count: 0, exits: 0, totalSalary: 0 };
      }
      deptMap[e.department].count += 1;
      deptMap[e.department].totalSalary += e.salary;
      if (e.employmentStatus === 'Terminated') {
        deptMap[e.department].exits += 1;
      }
    });

    const departmentBreakdown = Object.entries(deptMap).map(([dept, val]) => ({
      department: dept,
      count: val.count,
      turnoverRate: val.count > 0 ? Number(((val.exits / val.count) * 100).toFixed(1)) : 0,
      avgSalary: val.count > 0 ? Math.round(val.totalSalary / val.count) : 0
    })).sort((a, b) => b.count - a.count);

    // Gender breakdown
    const genderMap: Record<string, number> = {};
    filteredEmployees.forEach(e => {
      genderMap[e.gender] = (genderMap[e.gender] || 0) + 1;
    });
    const genderBreakdown = Object.entries(genderMap).map(([g, count]) => ({
      gender: g,
      count,
      percentage: totalHeadcount > 0 ? Number(((count / totalHeadcount) * 100).toFixed(1)) : 0
    }));

    // Tenure buckets
    const tenureBuckets = [
      { range: '< 1 Year', count: filteredEmployees.filter(e => e.tenureYears < 1).length },
      { range: '1 - 2 Years', count: filteredEmployees.filter(e => e.tenureYears >= 1 && e.tenureYears < 2).length },
      { range: '2 - 4 Years', count: filteredEmployees.filter(e => e.tenureYears >= 2 && e.tenureYears < 4).length },
      { range: '4+ Years', count: filteredEmployees.filter(e => e.tenureYears >= 4).length },
    ];

    // Exit reasons
    const exitReasonMap: Record<string, number> = {};
    filteredEmployees.filter(e => e.employmentStatus === 'Terminated' && e.exitReason).forEach(e => {
      const reason = e.exitReason || 'Other';
      exitReasonMap[reason] = (exitReasonMap[reason] || 0) + 1;
    });
    const exitReasons = Object.entries(exitReasonMap).map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalHeadcount,
      activeCount,
      exitCount,
      turnoverRate,
      voluntaryTurnoverRate,
      avgSalary,
      avgEngagement,
      avgTenure,
      avgAbsenceDays,
      departmentBreakdown,
      genderBreakdown,
      tenureBuckets,
      exitReasons
    };
  }, [filteredEmployees]);

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      backgroundTheme,
      setBackgroundTheme,
      users,
      currentUser,
      setCurrentUser,
      addUser,
      updateUser,
      deleteUser,
      permissions,
      auditLogs,
      addAuditLog,
      allEmployees,
      filteredEmployees,
      selectedDepartment: effectiveDepartment,
      setSelectedDepartment,
      selectedStatus,
      setSelectedStatus,
      searchQuery,
      setSearchQuery,
      datasetSize,
      loadBenchmarkDataset,
      addEmployeeRecord,
      batchAddEmployees,
      replaceEmployees,
      isAnalyzing,
      runInstantAnalysis,
      lastAnalysisResult,
      showAddEmployeeModal,
      setShowAddEmployeeModal,
      showAnalysisModal,
      setShowAnalysisModal,
      showDeployModal,
      setShowDeployModal,
      dataProfile,
      dirtyRawData,
      isDataCleaned,
      autoFixAllIssues,
      resetRawData,
      uploadCustomDataset,
      transformationSteps,
      toggleTransformationStep,
      addTransformationStep,
      modelTables,
      modelRelationships,
      toggleRelationship,
      daxMeasures,
      executiveInsights,
      kpis
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
