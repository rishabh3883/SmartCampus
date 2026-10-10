import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({
    icon: Icon = Inbox,
    title = "No Data Found",
    description = "There are no records to display at this moment.",
    action = null,
    className = ""
}) => {
    return (
        <div className={`p-10 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center ${className}`}>
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4 shadow-inner">
                <Icon size={26} />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                {title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4 leading-relaxed">
                {description}
            </p>
            {action && (
                <div className="mt-2">
                    {action}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
