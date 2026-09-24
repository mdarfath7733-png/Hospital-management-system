import React from 'react';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  variant = 'teal',
  trend,
  onClick,
}) => {
  const variantStyles = {
    teal: {
      iconBg: 'bg-teal-50 text-teal-600 border-teal-100',
      borderHover: 'hover:border-teal-300',
    },
    blue: {
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      borderHover: 'hover:border-blue-300',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      borderHover: 'hover:border-emerald-300',
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      borderHover: 'hover:border-rose-300',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      borderHover: 'hover:border-amber-300',
    },
    purple: {
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      borderHover: 'hover:border-purple-300',
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.teal;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 p-5 shadow-sm transition-all duration-200 ${
        onClick ? `cursor-pointer hover:shadow-md ${currentVariant.borderHover}` : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            {value}
          </h3>
        </div>
        {Icon && (
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border ${currentVariant.iconBg}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`font-semibold ${
                trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-rose-600' : 'text-slate-500'
              }`}
            >
              {trend > 0 ? `+${trend}` : trend}
            </span>
          )}
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
