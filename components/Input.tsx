
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[14px] font-bold text-slate-700 ml-1">
        {label}
      </label>
      <input
        {...props}
        className={`px-4 py-3.5 rounded-xl border transition-all duration-200 outline-none font-medium text-slate-600 placeholder:text-slate-300 placeholder:font-normal
          ${error 
            ? 'border-red-400 bg-red-50 focus:border-red-500' 
            : 'border-slate-200 bg-white focus:border-indigo-400'
          } ${className || ''}`}
      />
      {error && <span className="text-[11px] text-red-500 font-bold ml-1 uppercase tracking-wider">{error}</span>}
    </div>
  );
};

export default Input;
