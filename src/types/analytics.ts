export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  jobTitle: string;
  gender: 'Female' | 'Male' | 'Non-Binary' | 'Unknown';
  dateOfBirth: string;
  hireDate: string;
  exitDate?: string;
  employmentStatus: 'Active' | 'Terminated' | 'On Leave';
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  location: string;
  managerId?: string;
  managerName?: string;
  salary: number;
  performanceRating: number; // 1 to 5
  engagementScore: number; // 0 to 100
  tenureYears: number;
  exitReason?: 'Compensation' | 'Career Growth' | 'Manager Conflict' | 'Relocation' | 'Personal' | 'Retirement' | 'Other';
  absenceDaysLastYear: number;
}

export interface DataQualityIssue {
  id: string;
  type: 'duplicate_id' | 'missing_dept' | 'invalid_date' | 'inconsistent_title' | 'text_salary' | 'blank_status';
  severity: 'critical' | 'warning' | 'info';
  description: string;
  affectedCount: number;
  suggestedFix: string;
  autoFixable: boolean;
}

export interface DataProfileSummary {
  rowCount: number;
  columnCount: number;
  completeness: number; // percentage
  consistency: number;
  accuracy: number;
  uniqueness: number;
  validity: number;
  overallScore: number;
  issues: DataQualityIssue[];
}

export interface TransformationStep {
  id: string;
  title: string;
  description: string;
  category: 'cleaning' | 'transformation' | 'enrichment' | 'filter';
  applied: boolean;
  powerQueryM: string;
  sqlQuery: string;
  pythonCode: string;
}

export interface ModelTable {
  id: string;
  name: string;
  type: 'dimension' | 'fact';
  description: string;
  columns: { name: string; type: string; isKey?: boolean; isForeignKey?: boolean }[];
  rowCount: number;
}

export interface ModelRelationship {
  id: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  cardinality: '1:1' | '1:N' | 'N:1' | 'N:N';
  active: boolean;
}

export interface DaxMeasure {
  id: string;
  name: string;
  category: 'Workforce' | 'Attrition' | 'Compensation' | 'Recruitment' | 'Performance';
  formula: string;
  explanation: string;
  targetTable: string;
}

export interface HRMetricInsight {
  metricName: string;
  currentValue: string;
  previousValue: string;
  percentChange: string;
  trend: 'up' | 'down' | 'neutral';
  whatChanged: string;
  whereItChanged: string;
  hrPlaybook: string[];
}

export interface GeneratedAnalysisSummary {
  analyzedAt: string;
  totalEvaluated: number;
  activeCount: number;
  exitCount: number;
  turnoverRate: number;
  voluntaryTurnoverRate: number;
  averageSalary: number;
  averageEngagement: number;
  averageTenure: number;
  averageAbsenceDays: number;
  highestChurnDepartment: { name: string; rate: number };
  lowestChurnDepartment: { name: string; rate: number };
  topRetentionRiskRole: string;
  keyFindings: string[];
  actionablePlaybook: string[];
}
