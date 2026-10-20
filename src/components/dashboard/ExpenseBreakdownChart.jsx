import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardHeader } from '../ui/Card';
import { formatCurrency } from '../../utils/currency';
import { getCategoryMeta } from '../../data/categories';

const COLORS = [
  '#f97316', // orange
  '#10b981', // emerald
  '#3b82f6', // blue
  '#ec4899', // pink
  '#f59e0b', // amber
  '#6366f1', // indigo
  '#f43f5e', // rose
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#14b8a6', // teal
  '#64748b', // slate
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-xl text-xs space-y-1 border border-slate-800">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: payload[0].color }}
          />
          <span className="font-semibold">{data.name}</span>
        </div>
        <p className="font-bold text-white pl-4.5">
          {formatCurrency(data.amount)} ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

export const ExpenseBreakdownChart = ({ data = [] }) => {
  const hasData = data && data.length > 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader
        title="Expense Breakdown"
        subtitle="Spending distribution by category"
      />

      <div className="flex-1 min-h-[280px] w-full flex items-center justify-center">
        {!hasData ? (
          <div className="text-slate-400 text-xs text-center">
            No expense records in the selected period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
              >
                {data.map((entry, index) => {
                  const meta = getCategoryMeta(entry.name, 'expense');
                  const color = meta.hex || COLORS[index % COLORS.length];
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                layout="horizontal"
                iconType="circle"
                wrapperStyle={{
                  paddingTop: '10px',
                  fontSize: '11px',
                  maxHeight: '65px',
                  overflowY: 'auto',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
