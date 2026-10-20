import React from 'react';

export const Select = ({
  label,
  id,
  value,
  onChange,
  options = [],
  error,
  helperText,
  required = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full rounded-lg border text-sm transition-colors duration-150 py-2 px-3 bg-white ${
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
            : 'border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
        } text-slate-900 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500 shadow-xs cursor-pointer`}
        {...props}
      >
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value ?? opt.id : opt;
          const lbl = typeof opt === 'object' ? opt.label ?? opt.name : opt;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};
