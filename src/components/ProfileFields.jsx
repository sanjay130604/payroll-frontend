import React from "react";

export const ViewField = ({ v }) => (
    <div className="mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 min-h-[42px] flex items-center">
        {v || <span className="text-slate-400 italic">Not set</span>}
    </div>
);

export const InputField = ({ k, l, value, onChange, edit, readOnly }) => (
    <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block ml-1">{l}</label>
        {edit && !readOnly
            ? <input
                value={value}
                onChange={e => onChange(k, e.target.value)}
                className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-800" />
            : <ViewField v={value} />
        }
    </div>
);

export const SelectField = ({ k, l, value, options, onChange, edit }) => (
    <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block ml-1">{l}</label>
        {edit
            ? <div className="relative mt-1">
                <select
                    value={value}
                    onChange={e => onChange(k, e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-800 appearance-none bg-white">
                    <option value="">Select Option</option>
                    {options.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <span className="text-[10px]">▼</span>
                </div>
            </div>
            : <ViewField v={value} />
        }
    </div>
);
