import React from 'react';

export const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  options = [], // For type="select"
  rows = 3,     // For type="textarea"
  disabled = false,
  helperText,
  icon: Icon,
  className = '',
  ...props
}) => {
  const baseInputStyles = `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 ${
    error
      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
      : 'border-slate-300 focus:border-teal-500 focus:ring-teal-100'
  } ${Icon ? 'pl-10' : ''}`;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-xs font-semibold text-slate-700 tracking-wide"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        {type === 'select' ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={`${baseInputStyles} appearance-none cursor-pointer pr-10`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => {
              const val = typeof opt === 'object' ? opt.value : opt;
              const lbl = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={val} value={val}>
                  {lbl}
                </option>
              );
            })}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            required={required}
            className={baseInputStyles}
            {...props}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={baseInputStyles}
            {...props}
          />
        )}
      </div>

      {error ? (
        <p className="text-xs font-medium text-rose-500">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
};

export default FormInput;
