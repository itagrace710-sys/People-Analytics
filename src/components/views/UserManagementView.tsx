import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Lock, 
  Unlock, 
  Trash2, 
  Edit3, 
  Search, 
  Check, 
  X, 
  History, 
  CheckCircle2, 
  AlertTriangle,
  Building,
  KeyRound,
  ArrowRightLeft
} from 'lucide-react';
import { User, UserRole, ROLE_PERMISSIONS } from '../../types/user';
import { DEPARTMENTS } from '../../data/mockHrData';

export const UserManagementView: React.FC = () => {
  const { 
    users, 
    currentUser, 
    setCurrentUser, 
    addUser, 
    updateUser, 
    deleteUser, 
    permissions, 
    auditLogs 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'matrix' | 'audit'>('users');
  const [searchUser, setSearchUser] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // New User Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('hr_analyst');
  const [formDeptScope, setFormDeptScope] = useState('All');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.role.toLowerCase().includes(searchUser.toLowerCase()) ||
    (u.departmentScope && u.departmentScope.toLowerCase().includes(searchUser.toLowerCase()))
  );

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    addUser({
      name: formName,
      email: formEmail,
      title: formTitle || 'HR Team Member',
      role: formRole,
      departmentScope: formDeptScope,
      status: 'active',
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + (users.length * 100)}?w=150&auto=format&fit=crop&q=80`
    });

    setShowAddModal(false);
    setFormName('');
    setFormEmail('');
    setFormTitle('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUser(editingUser.id, {
      role: editingUser.role,
      departmentScope: editingUser.departmentScope,
      title: editingUser.title,
      status: editingUser.status
    });

    setEditingUser(null);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-950/80 text-purple-300 border-purple-800/60';
      case 'hr_admin': return 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60';
      case 'hr_analyst': return 'bg-blue-950/80 text-blue-300 border-blue-800/60';
      case 'manager': return 'bg-amber-950/80 text-amber-300 border-amber-800/60';
      case 'viewer': return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">User Database & Access Control</h1>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Integrated RBAC
            </span>
          </div>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Manage user accounts, enforce granular department data scopes, configure compensation privacy, and inspect security audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {permissions.canManageUsers && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add New User Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-medium space-x-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Database ({users.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'matrix'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Role Permissions Matrix</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Security Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* Tab 1: User Accounts Table */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter users by name, email, or role..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="text-xs text-slate-400">
              Active Session: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role})
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-[11px] text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department Scope</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Login</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((user) => {
                  const isCurrent = user.id === currentUser.id;
                  return (
                    <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {isCurrent && (
                                <span className="text-[9px] px-1 py-0.2 rounded font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                  YOU
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${getRoleBadge(user.role)}`}>
                          {user.role}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono text-slate-300 flex items-center gap-1">
                          {user.departmentScope === 'All' ? (
                            <span className="text-slate-400">All Departments</span>
                          ) : (
                            <span className="text-amber-400 font-semibold flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              {user.departmentScope}
                            </span>
                          )}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                          user.status === 'active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-400 text-[11px] font-mono">
                        {user.lastLogin}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick test switch */}
                          {!isCurrent && (
                            <button
                              onClick={() => setCurrentUser(user)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-[11px] transition-colors flex items-center gap-1"
                              title="Switch active session to this user to test their permissions"
                            >
                              <ArrowRightLeft className="w-3 h-3" />
                              <span>Switch</span>
                            </button>
                          )}

                          {permissions.canManageUsers && (
                            <>
                              <button
                                onClick={() => setEditingUser(user)}
                                className="p-1 rounded text-slate-400 hover:text-indigo-400 transition-colors"
                                title="Edit user role & scope"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {users.length > 1 && !isCurrent && (
                                <button
                                  onClick={() => deleteUser(user.id)}
                                  className="p-1 rounded text-slate-400 hover:text-red-400 transition-colors"
                                  title="Delete user account"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Permissions Matrix */}
      {activeTab === 'matrix' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Role-Based Access Control (RBAC) Entitlements</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Overview of data accessibility rules across executive, administrative, and line-of-business roles.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-[11px] text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Role Tier</th>
                  <th className="py-2.5 px-3">Scope Scope</th>
                  <th className="py-2.5 px-3">View Compensation</th>
                  <th className="py-2.5 px-3">Edit / Clean Data</th>
                  <th className="py-2.5 px-3">SQL / Code Runner</th>
                  <th className="py-2.5 px-3">User Administration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {(['super_admin', 'hr_admin', 'hr_analyst', 'manager', 'viewer'] as const).map(role => {
                  const perm = ROLE_PERMISSIONS[role];
                  return (
                    <tr key={role} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-bold text-white capitalize">{role.replace('_', ' ')}</td>
                      <td className="py-3 px-3">
                        {perm.canViewAllDepartments ? (
                          <span className="text-emerald-400">All Departments</span>
                        ) : (
                          <span className="text-amber-400">Department Scoped</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {perm.canViewCompensation ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <X className="w-4 h-4 text-red-400" />
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {perm.canEditData ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <X className="w-4 h-4 text-slate-600" />
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {perm.canExecuteCustomCode ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <X className="w-4 h-4 text-slate-600" />
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {perm.canManageUsers ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <X className="w-4 h-4 text-slate-600" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Security Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Immutable Security & Compliance Audit Log</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every authentication event, data transformation, role change, and query execution is recorded.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400">Audit Active</span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{log.action}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-indigo-400 border border-slate-700">
                      {log.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{log.details}</p>
                </div>

                <div className="text-right sm:flex-shrink-0 text-[11px] font-mono text-slate-400">
                  <span className="block text-slate-300">{log.userEmail}</span>
                  <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateUser} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Provision New User Account</h3>
            
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Rachel Adams"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Work Email</label>
              <input
                type="email"
                placeholder="e.g. rachel.adams@company.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Job Title</label>
              <input
                type="text"
                placeholder="e.g. People Operations Specialist"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Role Assignment</label>
                <select
                  value={formRole}
                  onChange={(e: any) => setFormRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 capitalize"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="hr_admin">HR Admin</option>
                  <option value="hr_analyst">HR Analyst</option>
                  <option value="manager">Manager</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Department Scope</label>
                <select
                  value={formDeptScope}
                  onChange={(e) => setFormDeptScope(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">All Departments</option>
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Edit User Settings: {editingUser.name}</h3>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Title</label>
              <input
                type="text"
                value={editingUser.title}
                onChange={(e) => setEditingUser({ ...editingUser, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e: any) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 capitalize"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="hr_admin">HR Admin</option>
                  <option value="hr_analyst">HR Analyst</option>
                  <option value="manager">Manager</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Department Scope</label>
                <select
                  value={editingUser.departmentScope || 'All'}
                  onChange={(e) => setEditingUser({ ...editingUser, departmentScope: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">All Departments</option>
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Account Status</label>
              <select
                value={editingUser.status}
                onChange={(e: any) => setEditingUser({ ...editingUser, status: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 capitalize"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
