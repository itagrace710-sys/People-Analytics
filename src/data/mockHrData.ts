import { Employee, DataProfileSummary, TransformationStep, ModelTable, ModelRelationship, DaxMeasure, HRMetricInsight } from '../types/analytics';
import { User, AuditEntry } from '../types/user';

export const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@company.com',
    role: 'super_admin',
    title: 'Head of People Operations',
    departmentScope: 'All',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2025-01-10',
    lastLogin: 'Just now',
  },
  {
    id: 'u-2',
    name: 'Marcus Vance',
    email: 'marcus.v@company.com',
    role: 'hr_analyst',
    title: 'Senior People Data Analyst',
    departmentScope: 'All',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2025-02-14',
    lastLogin: '2 hours ago',
  },
  {
    id: 'u-3',
    name: 'Elena Rostova',
    email: 'elena.r@company.com',
    role: 'hr_admin',
    title: 'HR Business Partner Lead',
    departmentScope: 'All',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2025-03-01',
    lastLogin: 'Yesterday',
  },
  {
    id: 'u-4',
    name: 'David Chen',
    email: 'david.chen@company.com',
    role: 'manager',
    title: 'Engineering Director',
    departmentScope: 'Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2025-04-12',
    lastLogin: '3 days ago',
  },
  {
    id: 'u-5',
    name: 'Victoria Stone',
    email: 'v.stone@company.com',
    role: 'viewer',
    title: 'Executive Board Member',
    departmentScope: 'All',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2025-05-19',
    lastLogin: '5 days ago',
  },
];

export const INITIAL_AUDIT_LOGS: AuditEntry[] = [
  {
    id: 'aud-1',
    timestamp: '2026-09-25 08:30:15',
    userEmail: 'sarah.jenkins@company.com',
    action: 'Session Authenticated',
    category: 'auth',
    details: 'User logged in with Super Admin privileges via SSO',
  },
  {
    id: 'aud-2',
    timestamp: '2026-09-25 08:35:42',
    userEmail: 'marcus.v@company.com',
    action: 'Dataset Profiled',
    category: 'data_clean',
    details: 'Ran automatic profile on Employee_Master_2026.xlsx (487 records scanned)',
  },
  {
    id: 'aud-3',
    timestamp: '2026-09-25 08:42:10',
    userEmail: 'marcus.v@company.com',
    action: 'Power Query Pipeline Executed',
    category: 'data_clean',
    details: 'Applied 8 transformation steps: deduped IDs, converted currency, standardized depts',
  },
  {
    id: 'aud-4',
    timestamp: '2026-09-25 08:50:00',
    userEmail: 'david.chen@company.com',
    action: 'Role-Scoped Dashboard Viewed',
    category: 'query',
    details: 'Engineering Director accessed scoped workforce dashboard (dept: Engineering)',
  },
];

const FIRST_NAMES = [
  'Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Charlotte', 'Elijah', 'Amelia', 'James', 'Ava',
  'William', 'Sophia', 'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Evelyn', 'Theodore', 'Harper',
  'Alexander', 'Camila', 'Jackson', 'Gianna', 'Mateo', 'Abigail', 'Daniel', 'Luna', 'Michael', 'Ella',
  'Mason', 'Elizabeth', 'Sebastian', 'Sofia', 'Ethan', 'Emily', 'Logan', 'Avery', 'Owen', 'Mila',
  'Samuel', 'Aria', 'Jacob', 'Chloe', 'Asher', 'Layla', 'Aiden', 'Penelope', 'John', 'Riley'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'
];

export const DEPARTMENTS = [
  'Engineering',
  'Sales',
  'Marketing',
  'Product',
  'Operations',
  'Human Resources',
  'Finance',
  'Legal'
];

const JOB_TITLES: Record<string, string[]> = {
  Engineering: ['Frontend Engineer', 'Backend Engineer', 'DevOps Specialist', 'QA Engineer', 'Tech Lead', 'Staff Architect'],
  Sales: ['Account Executive', 'Sales Development Rep', 'Enterprise AE', 'Sales Manager', 'Customer Success Manager'],
  Marketing: ['Growth Specialist', 'Content Strategist', 'SEO Lead', 'Brand Manager', 'Product Marketing Manager'],
  Product: ['Product Manager', 'Associate PM', 'UX Researcher', 'Product Designer', 'Director of Product'],
  Operations: ['Operations Analyst', 'Supply Coordinator', 'Facilities Lead', 'Procurement Specialist'],
  'Human Resources': ['HR Generalist', 'Technical Recruiter', 'People Partner', 'Compensation Analyst', 'L&D Specialist'],
  Finance: ['Financial Analyst', 'Accountant', 'Controller', 'Billing Specialist', 'Treasury Associate'],
  Legal: ['Corporate Counsel', 'Compliance Officer', 'Legal Assistant', 'Contracts Specialist']
};

const LOCATIONS = ['San Francisco, HQ', 'New York, Office', 'London, UK', 'Berlin, Remote', 'Austin, TX', 'Toronto, Remote'];

// Dynamic generator supporting 487, 3000, 5000+ authentic employee records
export const createEmployees = (count: number = 3000): Employee[] => {
  const exitTarget = Math.round(count * 0.066); // ~6.6% standard turnover baseline
  return Array.from({ length: count }).map((_, idx) => {
    const idNum = 1000 + idx;
    const id = `EMP-${idNum}`;
    const firstName = FIRST_NAMES[idx % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(idx * 7 + Math.floor(idx / FIRST_NAMES.length)) % LAST_NAMES.length];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${idx > 500 ? (idx % 100) : ''}@company.com`;
    
    // Department distribution
    let dept = 'Engineering';
    const r = (idx * 31 + Math.floor(idx / 17)) % 100;
    if (r < 32) dept = 'Engineering';
    else if (r < 52) dept = 'Sales';
    else if (r < 65) dept = 'Operations';
    else if (r < 75) dept = 'Product';
    else if (r < 84) dept = 'Marketing';
    else if (r < 91) dept = 'Human Resources';
    else if (r < 96) dept = 'Finance';
    else dept = 'Legal';

    const titles = JOB_TITLES[dept];
    const jobTitle = titles[(idx * 3) % titles.length];
    const gender: 'Female' | 'Male' | 'Non-Binary' = idx % 2 === 0 ? 'Female' : (idx % 7 === 0 ? 'Non-Binary' : 'Male');
    
    // Tenure & hire dates
    const tenureYears = Number((0.5 + ((idx * 1.37) % 6.5)).toFixed(1));
    const hireYear = 2026 - Math.floor(tenureYears);
    const hireMonth = String(1 + (idx % 12)).padStart(2, '0');
    const hireDay = String(1 + ((idx * 3) % 28)).padStart(2, '0');
    const hireDate = `${hireYear}-${hireMonth}-${hireDay}`;

    // Exits (~6.6% turnover rate)
    const isExit = idx < exitTarget;
    const employmentStatus = isExit ? 'Terminated' : (idx % 29 === 0 ? 'On Leave' : 'Active');
    
    let exitDate: string | undefined = undefined;
    let exitReason: Employee['exitReason'] = undefined;
    if (isExit) {
      exitDate = `2026-0${1 + (idx % 8)}-${String(10 + (idx % 18)).padStart(2, '0')}`;
      const reasons: Employee['exitReason'][] = ['Compensation', 'Career Growth', 'Manager Conflict', 'Relocation', 'Personal', 'Other'];
      exitReason = reasons[idx % reasons.length];
    }

    // Base salaries vary by dept
    const deptBase: Record<string, number> = {
      Engineering: 125000,
      Product: 120000,
      Sales: 95000,
      Marketing: 88000,
      Finance: 98000,
      Legal: 135000,
      Operations: 76000,
      'Human Resources': 82000
    };
    const salary = Math.round((deptBase[dept] + ((idx * 1321) % 45000)) / 1000) * 1000;

    // Performance rating 1 to 5 (bell curve centered around 3.6)
    const perfSeed = (idx * 19) % 100;
    let performanceRating = 3;
    if (perfSeed < 8) performanceRating = 1;
    else if (perfSeed < 20) performanceRating = 2;
    else if (perfSeed < 65) performanceRating = 3;
    else if (perfSeed < 88) performanceRating = 4;
    else performanceRating = 5;

    // Engagement score (0-100)
    const engagementScore = Math.min(100, Math.max(35, Math.round(75 + ((idx * 17) % 30) - (isExit ? 25 : 0))));
    const absenceDaysLastYear = isExit ? (8 + (idx % 14)) : (2 + (idx % 9));

    return {
      id,
      name,
      email,
      department: dept,
      jobTitle,
      gender,
      dateOfBirth: `19${75 + (idx % 26)}-${String(1 + ((idx * 2) % 12)).padStart(2, '0')}-15`,
      hireDate,
      exitDate,
      employmentStatus,
      employmentType: idx % 19 === 0 ? 'Part-time' : (idx % 33 === 0 ? 'Contract' : 'Full-time'),
      location: LOCATIONS[idx % LOCATIONS.length],
      managerName: idx < 15 ? 'Sarah Jenkins' : (dept === 'Engineering' ? 'David Chen' : 'Elena Rostova'),
      salary,
      performanceRating,
      engagementScore,
      tenureYears,
      exitReason,
      absenceDaysLastYear
    };
  });
};

// Generate 3,000 authentic employee records as standard enterprise benchmark
export const GENERATED_EMPLOYEES: Employee[] = createEmployees(3000);

// Sample Dirty Raw Data representation before Power Query cleaning
export interface DirtyEmployeeRow {
  Employee_ID: string;
  Employee_Name: string;
  Department: string;
  Job_Title: string;
  Gender: string;
  Hire_Date: string;
  Salary: string;
  Status: string;
  Notes?: string;
}

export const DIRTY_RAW_SAMPLE: DirtyEmployeeRow[] = [
  { Employee_ID: 'EMP-1001', Employee_Name: '  Liam Smith  ', Department: 'Engineering', Job_Title: 'Frontend Engineer', Gender: 'Male', Hire_Date: '2023-04-12', Salary: '$135,000.00', Status: 'ACTIVE' },
  { Employee_ID: 'EMP-1002', Employee_Name: 'Olivia Johnson', Department: 'eng', Job_Title: 'Backend Engineer', Gender: 'Female', Hire_Date: '04/12/2022', Salary: '128000', Status: 'Active' },
  { Employee_ID: 'EMP-1002', Employee_Name: 'Olivia Johnson', Department: 'Engineering', Job_Title: 'Backend Engineer', Gender: 'Female', Hire_Date: '2022-04-12', Salary: '$128,000', Status: 'Active', Notes: 'DUPLICATE ROW' },
  { Employee_ID: 'EMP-1003', Employee_Name: 'Noah Williams', Department: '', Job_Title: 'Account Executive', Gender: '', Hire_Date: '2024-01-15', Salary: '95000', Status: 'Active' },
  { Employee_ID: 'EMP-1004', Employee_Name: 'Emma Brown', Department: 'Sales', Job_Title: 'SR ACCOUNT EXEC', Gender: 'Female', Hire_Date: '2021-08-20', Salary: '110,000', Status: 'Terminated' },
  { Employee_ID: 'EMP-1005', Employee_Name: 'Oliver Jones', Department: 'Marketing', Job_Title: 'Growth Specialist', Gender: 'M', Hire_Date: '2023-11-01', Salary: '$88,000', Status: 'Active' },
  { Employee_ID: 'EMP-1006', Employee_Name: 'Charlotte Garcia', Department: 'Human Resources', Job_Title: 'HR Generalist', Gender: 'F', Hire_Date: '2022-06-18', Salary: '82,000', Status: 'Active' },
  { Employee_ID: 'EMP-1007', Employee_Name: 'Elijah Miller', Department: 'Ops', Job_Title: 'Operations Analyst', Gender: 'Male', Hire_Date: '2024-03-01', Salary: '76000 USD', Status: 'On Leave' },
  { Employee_ID: 'EMP-1008', Employee_Name: 'Amelia Davis', Department: 'Product', Job_Title: 'UX Researcher', Gender: 'Female', Hire_Date: '2023-02-14', Salary: '$115,000', Status: 'Active' },
  { Employee_ID: 'EMP-1009', Employee_Name: 'James Rodriguez', Department: 'Finance', Job_Title: 'financial analyst', Gender: 'Male', Hire_Date: '2022-09-09', Salary: '98,000', Status: 'Active' },
  { Employee_ID: 'EMP-1010', Employee_Name: 'Ava Martinez', Department: 'Legal', Job_Title: 'Contracts Specialist', Gender: 'Female', Hire_Date: '2021-12-05', Salary: '105,000', Status: 'Active' },
  { Employee_ID: 'EMP-1005', Employee_Name: 'Oliver Jones', Department: 'Marketing', Job_Title: 'Growth Specialist', Gender: 'Male', Hire_Date: '2023-11-01', Salary: '88000', Status: 'Active', Notes: 'DUPLICATE ROW' }
];

export const INITIAL_DATA_PROFILE: DataProfileSummary = {
  rowCount: 3000,
  columnCount: 16,
  completeness: 94.8,
  consistency: 89.2,
  accuracy: 93.5,
  uniqueness: 97.4,
  validity: 91.0,
  overallScore: 93.2,
  issues: [
    {
      id: 'iss-1',
      type: 'duplicate_id',
      severity: 'critical',
      description: '12 Duplicate Employee IDs detected across raw batch uploads',
      affectedCount: 12,
      suggestedFix: 'Remove exact and secondary duplicate records retaining latest timestamp',
      autoFixable: true
    },
    {
      id: 'iss-2',
      type: 'missing_dept',
      severity: 'warning',
      description: '8 records with missing or empty Department assignment',
      affectedCount: 8,
      suggestedFix: 'Impute department from Job Title mapping or assign "Unassigned"',
      autoFixable: true
    },
    {
      id: 'iss-3',
      type: 'text_salary',
      severity: 'warning',
      description: '5 salary values stored with currency symbols ("$") or comma separators as text',
      affectedCount: 5,
      suggestedFix: 'Strip non-numeric characters and cast to Currency/Decimal numeric type',
      autoFixable: true
    },
    {
      id: 'iss-4',
      type: 'inconsistent_title',
      severity: 'info',
      description: '17 inconsistent casing and abbreviations in Job Titles (e.g. "SR ACCOUNT EXEC")',
      affectedCount: 17,
      suggestedFix: 'Apply title casing and map standard taxonomy abbreviations',
      autoFixable: true
    },
    {
      id: 'iss-5',
      type: 'invalid_date',
      severity: 'warning',
      description: '14 blank termination dates for employees marked with status "Terminated"',
      affectedCount: 14,
      suggestedFix: 'Validate exit status against payroll offboarding records',
      autoFixable: false
    }
  ]
};

export const INITIAL_TRANSFORMATION_PIPELINE: TransformationStep[] = [
  {
    id: 'step-1',
    title: 'Remove Duplicate Employee IDs',
    description: 'Deduplicate rows matching primary key Employee_ID, preserving the latest record.',
    category: 'cleaning',
    applied: true,
    powerQueryM: `Table.Distinct(#"PreviousStep", {"Employee_ID"})`,
    sqlQuery: `DELETE FROM raw_employees WHERE ctid NOT IN (\n  SELECT min(ctid) FROM raw_employees GROUP BY employee_id\n);`,
    pythonCode: `df = df.drop_duplicates(subset=['Employee_ID'], keep='first')`
  },
  {
    id: 'step-2',
    title: 'Trim Employee Names & Whitespace',
    description: 'Remove leading, trailing, and redundant inner spaces from text strings.',
    category: 'cleaning',
    applied: true,
    powerQueryM: `Table.TransformColumns(#"PreviousStep", {{"Employee_Name", Text.Trim, type text}})`,
    sqlQuery: `UPDATE raw_employees SET employee_name = TRIM(employee_name);`,
    pythonCode: `df['Employee_Name'] = df['Employee_Name'].astype(str).str.strip()`
  },
  {
    id: 'step-3',
    title: 'Standardize Department Names',
    description: 'Map department aliases (e.g. "eng" -> "Engineering", "Ops" -> "Operations").',
    category: 'transformation',
    applied: true,
    powerQueryM: `Table.ReplaceValue(#"PreviousStep", "eng", "Engineering", Replacer.ReplaceText, {"Department"})`,
    sqlQuery: `UPDATE raw_employees SET department = CASE\n  WHEN LOWER(department) IN ('eng', 'dev') THEN 'Engineering'\n  WHEN LOWER(department) = 'ops' THEN 'Operations'\n  ELSE department END;`,
    pythonCode: `dept_map = {'eng': 'Engineering', 'Ops': 'Operations', '': 'Unassigned'}\ndf['Department'] = df['Department'].replace(dept_map)`
  },
  {
    id: 'step-4',
    title: 'Convert Hire & Exit Dates to Standard ISO Format',
    description: 'Parse varied date strings ("04/12/2022", "2022-04-12") to standard YYYY-MM-DD.',
    category: 'transformation',
    applied: true,
    powerQueryM: `Table.TransformColumnTypes(#"PreviousStep", {{"Hire_Date", type date}})`,
    sqlQuery: `ALTER TABLE raw_employees ALTER COLUMN hire_date TYPE date USING hire_date::date;`,
    pythonCode: `df['Hire_Date'] = pd.to_datetime(df['Hire_Date'], errors='coerce').dt.strftime('%Y-%m-%d')`
  },
  {
    id: 'step-5',
    title: 'Clean & Cast Salary to Decimal Numeric',
    description: 'Remove currency signs ("$"), commas, and cast to numeric floating point value.',
    category: 'transformation',
    applied: true,
    powerQueryM: `Table.TransformColumns(#"PreviousStep", {{"Salary", each Number.From(Text.Select(_, {"0".."9", "."})), type number}})`,
    sqlQuery: `UPDATE raw_employees SET salary = REGEXP_REPLACE(salary, '[^0-9.]', '', 'g')::numeric;`,
    pythonCode: `df['Salary'] = df['Salary'].astype(str).str.replace(r'[^0-9.]', '', regex=True).astype(float)`
  },
  {
    id: 'step-6',
    title: 'Replace Blank Genders with "Unknown"',
    description: 'Handle missing demographic values gracefully for compliant non-biasing aggregation.',
    category: 'cleaning',
    applied: true,
    powerQueryM: `Table.ReplaceValue(#"PreviousStep", null, "Unknown", Replacer.ReplaceValue, {"Gender"})`,
    sqlQuery: `UPDATE raw_employees SET gender = COALESCE(NULLIF(gender, ''), 'Unknown');`,
    pythonCode: `df['Gender'] = df['Gender'].fillna('Unknown').replace('', 'Unknown')`
  },
  {
    id: 'step-7',
    title: 'Calculate Dynamic Tenure (Years)',
    description: 'Derived column calculating elapsed tenure from Hire Date to Exit Date or Today.',
    category: 'enrichment',
    applied: true,
    powerQueryM: `Table.AddColumn(#"PreviousStep", "Tenure_Years", each Duration.Days(DateTime.LocalNow() - [Hire_Date]) / 365.25)`,
    sqlQuery: `ALTER TABLE raw_employees ADD COLUMN tenure_years numeric GENERATED ALWAYS AS (\n  ROUND(EXTRACT(epoch FROM (COALESCE(exit_date, CURRENT_DATE) - hire_date)) / (365.25 * 86400), 1)\n) STORED;`,
    pythonCode: `now = pd.Timestamp.now()\ndf['Tenure_Years'] = ((now - pd.to_datetime(df['Hire_Date'])).dt.days / 365.25).round(1)`
  }
];

export const INITIAL_DATA_MODEL_TABLES: ModelTable[] = [
  {
    id: 'dim_emp',
    name: 'DimEmployee',
    type: 'dimension',
    description: 'Master employee dimension with historical snapshots and demographic attributes',
    rowCount: 487,
    columns: [
      { name: 'Employee_ID', type: 'VARCHAR(20)', isKey: true },
      { name: 'Full_Name', type: 'VARCHAR(100)' },
      { name: 'Department_ID', type: 'VARCHAR(20)', isForeignKey: true },
      { name: 'Job_ID', type: 'VARCHAR(20)', isForeignKey: true },
      { name: 'Hire_Date', type: 'DATE' },
      { name: 'Exit_Date', type: 'DATE' },
      { name: 'Status', type: 'VARCHAR(20)' },
      { name: 'Location', type: 'VARCHAR(50)' },
      { name: 'Gender', type: 'VARCHAR(20)' }
    ]
  },
  {
    id: 'dim_dept',
    name: 'DimDepartment',
    type: 'dimension',
    description: 'Organizational hierarchy, business units, and cost centers',
    rowCount: 8,
    columns: [
      { name: 'Department_ID', type: 'VARCHAR(20)', isKey: true },
      { name: 'Department_Name', type: 'VARCHAR(50)' },
      { name: 'Division', type: 'VARCHAR(50)' },
      { name: 'Cost_Center', type: 'VARCHAR(30)' },
      { name: 'Head_Of_Dept_ID', type: 'VARCHAR(20)' }
    ]
  },
  {
    id: 'fact_payroll',
    name: 'FactPayroll',
    type: 'fact',
    description: 'Compensation components, base salary, overtime, bonuses, and deductions',
    rowCount: 5844,
    columns: [
      { name: 'Payroll_ID', type: 'BIGINT', isKey: true },
      { name: 'Employee_ID', type: 'VARCHAR(20)', isForeignKey: true },
      { name: 'Period_Date', type: 'DATE' },
      { name: 'Base_Salary', type: 'NUMERIC(12,2)' },
      { name: 'Bonus_Amount', type: 'NUMERIC(12,2)' },
      { name: 'Compa_Ratio', type: 'NUMERIC(5,2)' }
    ]
  },
  {
    id: 'fact_attendance',
    name: 'FactAttendance',
    type: 'fact',
    description: 'Daily clock-ins, leave days, absences, sick records, and overtime tracking',
    rowCount: 121750,
    columns: [
      { name: 'Attendance_ID', type: 'BIGINT', isKey: true },
      { name: 'Employee_ID', type: 'VARCHAR(20)', isForeignKey: true },
      { name: 'Date', type: 'DATE' },
      { name: 'Attendance_Type', type: 'VARCHAR(30)' }, // Present, Sick, PTO, Unpaid
      { name: 'Hours_Worked', type: 'NUMERIC(4,2)' },
      { name: 'Late_Minutes', type: 'INT' }
    ]
  },
  {
    id: 'fact_performance',
    name: 'FactPerformance',
    type: 'fact',
    description: 'Annual and quarterly performance appraisals, KPI metrics, and goals achieved',
    rowCount: 1461,
    columns: [
      { name: 'Review_ID', type: 'BIGINT', isKey: true },
      { name: 'Employee_ID', type: 'VARCHAR(20)', isForeignKey: true },
      { name: 'Review_Period', type: 'VARCHAR(20)' },
      { name: 'Performance_Rating', type: 'INT' }, // 1 to 5
      { name: 'Goal_Achievement_Pct', type: 'NUMERIC(5,2)' },
      { name: 'Engagement_Score', type: 'INT' }
    ]
  },
  {
    id: 'fact_recruitment',
    name: 'FactRecruitment',
    type: 'fact',
    description: 'Applicant tracking, stage progression, time-to-fill, and candidate sources',
    rowCount: 2840,
    columns: [
      { name: 'Candidate_ID', type: 'VARCHAR(20)', isKey: true },
      { name: 'Department_ID', type: 'VARCHAR(20)', isForeignKey: true },
      { name: 'Application_Date', type: 'DATE' },
      { name: 'Current_Stage', type: 'VARCHAR(30)' }, // Applied, Screened, Interview, Offer, Hired, Rejected
      { name: 'Days_To_Hire', type: 'INT' },
      { name: 'Recruiting_Cost', type: 'NUMERIC(10,2)' }
    ]
  }
];

export const INITIAL_MODEL_RELATIONSHIPS: ModelRelationship[] = [
  {
    id: 'rel-1',
    fromTable: 'DimDepartment',
    fromColumn: 'Department_ID',
    toTable: 'DimEmployee',
    toColumn: 'Department_ID',
    cardinality: '1:N',
    active: true
  },
  {
    id: 'rel-2',
    fromTable: 'DimEmployee',
    fromColumn: 'Employee_ID',
    toTable: 'FactPayroll',
    toColumn: 'Employee_ID',
    cardinality: '1:N',
    active: true
  },
  {
    id: 'rel-3',
    fromTable: 'DimEmployee',
    fromColumn: 'Employee_ID',
    toTable: 'FactAttendance',
    toColumn: 'Employee_ID',
    cardinality: '1:N',
    active: true
  },
  {
    id: 'rel-4',
    fromTable: 'DimEmployee',
    fromColumn: 'Employee_ID',
    toTable: 'FactPerformance',
    toColumn: 'Employee_ID',
    cardinality: '1:N',
    active: true
  },
  {
    id: 'rel-5',
    fromTable: 'DimDepartment',
    fromColumn: 'Department_ID',
    toTable: 'FactRecruitment',
    toColumn: 'Department_ID',
    cardinality: '1:N',
    active: true
  }
];

export const DAX_MEASURES_LIBRARY: DaxMeasure[] = [
  {
    id: 'dax-1',
    name: 'Turnover Rate',
    category: 'Attrition',
    formula: `Turnover Rate = \nVAR Exits = CALCULATE(COUNTROWS('DimEmployee'), 'DimEmployee'[Status] = "Terminated")\nVAR AvgHeadcount = AVERAGE('DimEmployee'[Headcount])\nRETURN\nDIVIDE(Exits, AvgHeadcount, 0)`,
    explanation: 'Divides employee exits during the reporting interval by average headcount over the same period.',
    targetTable: 'DimEmployee'
  },
  {
    id: 'dax-2',
    name: 'Voluntary Turnover Rate',
    category: 'Attrition',
    formula: `Voluntary Turnover Rate = \nVAR VoluntaryExits = CALCULATE(\n    COUNTROWS('DimEmployee'),\n    'DimEmployee'[Status] = "Terminated",\n    'DimEmployee'[Exit_Reason] IN {"Compensation", "Career Growth", "Relocation", "Personal"}\n)\nVAR AvgHeadcount = [Average Headcount]\nRETURN\nDIVIDE(VoluntaryExits, AvgHeadcount, 0)`,
    explanation: 'Focuses strictly on voluntary resignations to measure talent retention risks independent of company-initiated separations.',
    targetTable: 'DimEmployee'
  },
  {
    id: 'dax-3',
    name: 'Active Headcount',
    category: 'Workforce',
    formula: `Active Headcount = \nCALCULATE(\n    DISTINCTCOUNT('DimEmployee'[Employee_ID]),\n    'DimEmployee'[Status] IN {"Active", "On Leave"}\n)`,
    explanation: 'Counts current non-terminated employees eligible for organizational capacity and payroll allocation.',
    targetTable: 'DimEmployee'
  },
  {
    id: 'dax-4',
    name: 'Average Compa-Ratio',
    category: 'Compensation',
    formula: `Average Compa-Ratio = \nAVERAGEX(\n    'FactPayroll',\n    DIVIDE('FactPayroll'[Base_Salary], RELATED('DimJob'[Salary_Midpoint]), 1.0)\n)`,
    explanation: 'Measures employee base compensation as a percentage against the market midpoint for their specific grade (1.0 = at midpoint).',
    targetTable: 'FactPayroll'
  },
  {
    id: 'dax-5',
    name: 'Time to Hire (Days)',
    category: 'Recruitment',
    formula: `Average Time to Hire = \nCALCULATE(\n    AVERAGE('FactRecruitment'[Days_To_Hire]),\n    'FactRecruitment'[Current_Stage] = "Hired"\n)`,
    explanation: 'Averages elapsed business days from initial candidate application to signed offer letter acceptance.',
    targetTable: 'FactRecruitment'
  },
  {
    id: 'dax-6',
    name: 'Absence Rate (%)',
    category: 'Workforce',
    formula: `Absence Rate = \nVAR TotalAbsenceDays = CALCULATE(\n    COUNTROWS('FactAttendance'),\n    'FactAttendance'[Attendance_Type] IN {"Sick", "Unpaid Absence"}\n)\nVAR TotalScheduledDays = COUNTROWS('FactAttendance')\nRETURN\nDIVIDE(TotalAbsenceDays, TotalScheduledDays, 0)`,
    explanation: 'Calculates the proportion of unplanned absent days out of total scheduled working days across the workforce.',
    targetTable: 'FactAttendance'
  }
];

export const EXECUTIVE_INSIGHTS: HRMetricInsight[] = [
  {
    metricName: 'Annualized Turnover Rate',
    currentValue: '6.6%',
    previousValue: '5.2%',
    percentChange: '+1.4% pts',
    trend: 'up',
    whatChanged: 'Turnover increased slightly over the prior quarter, driven by 32 employee departures against an active headcount of 487.',
    whereItChanged: 'Concentrated within Engineering (9.2%) and Sales (8.1%). Operations and Finance experienced record low churn (3.2% and 2.8%).',
    hrPlaybook: [
      'Conduct 30-day stay interviews for senior backend and full-stack software engineers.',
      'Review compensation benchmark bands: Engineering compensation ratio is currently 0.94 vs market.',
      'Investigate manager sentiment and team workload in high-churn squads before concluding causation.'
    ]
  },
  {
    metricName: 'Employee Engagement Index',
    currentValue: '78%',
    previousValue: '74%',
    percentChange: '+4.0%',
    trend: 'up',
    whatChanged: 'Overall workforce sentiment improved by 4 points across the quarterly pulse survey with an 89% response rate.',
    whereItChanged: 'Communication (+84%) and Growth Opportunities (+76%) posted strong gains following the internal career ladder launch.',
    hrPlaybook: [
      'Address Workload sentiment (65%), which remains the primary drag on overall morale in Sales and Customer Success.',
      'Scale manager coaching circles that improved leadership scores by 12 points in Product.'
    ]
  },
  {
    metricName: 'Recruitment Funnel Conversion',
    currentValue: '18.4%',
    previousValue: '14.1%',
    percentChange: '+4.3%',
    trend: 'up',
    whatChanged: 'Interview-to-offer acceptance rose to 82%, reducing overall average Time to Hire from 48 days down to 34 days.',
    whereItChanged: 'Technical roles benefited most from standardized asynchronous skill screens.',
    hrPlaybook: [
      'Maintain candidate pipeline velocity by capping take-home test review times to 48 hours.',
      'Audit candidate sourcing spend: referral channel yielded 42% of hires at 1/3 the cost per hire.'
    ]
  }
];
