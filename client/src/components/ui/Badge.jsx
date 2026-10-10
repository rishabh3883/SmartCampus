import React from 'react';

export const RoleBadge = ({ role = 'Student', className = "" }) => {
    const roleStyles = {
        Admin: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        Student: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        Employee: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        Staff: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        Security: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    };

    const style = roleStyles[role] || roleStyles.Student;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${style} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            {role === 'Employee' ? 'Staff' : role}
        </span>
    );
};

export const StatusChip = ({ status = 'Active', variant = 'default', className = "" }) => {
    const variantStyles = {
        success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        default: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    };

    const computedVariant = 
        variant !== 'default' ? variant :
        ['Resolved', 'Active', 'Approved', 'Optimal'].includes(status) ? 'success' :
        ['Pending', 'Warning', 'In Progress'].includes(status) ? 'warning' :
        ['Rejected', 'Emergency', 'Suspended', 'High'].includes(status) ? 'danger' : 'default';

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[computedVariant]} ${className}`}>
            {status}
        </span>
    );
};

export default { RoleBadge, StatusChip };
