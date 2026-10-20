import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardHeader } from '../ui/Card';
import { formatCurrency } from '../../utils/currency';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs space-y-1.5 border border-slate-800">
        <p className="font-bold text-slate-300 border-b border-slate-700 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="capitalize text-slate-400">{entry.name}:</span>
            </div>
            <span className="font-bold text-white">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const CashFlowChart = ({ data = [] }) => {
  const hasData = data && data.length > 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader
        title="Income vs Expenses"
        subtitle="Monthly cash flow comparison"
      />

      <div className="flex-1 min-h-[280px] w-full pt-2">
        {!hasData ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
            No transaction records found for cash flow analysis.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => formatCurrency(val, { compact: true })}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
              />
              <Bar
                name="Income"
                dataKey="income"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              />
              <Bar
                name="Expense"
                dataKey="expense"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
