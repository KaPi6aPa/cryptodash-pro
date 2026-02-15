import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: LucideIcon;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, isPositive, icon: Icon }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg hover:shadow-xl hover:bg-slate-800/80 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 text-sm font-medium tracking-wide">{title}</h3>
        <div className="p-2 bg-slate-700/50 rounded-lg group-hover:bg-cyan-500/10 transition-colors">
            <Icon className="w-5 h-5 text-slate-300 group-hover:text-cyan-400 transition-colors" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
        <div className={`flex items-center text-sm font-semibold px-2 py-1 rounded-full ${isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
          {isPositive ? '↑' : '↓'} {trend}
        </div>
      </div>
    </div>
  );
};