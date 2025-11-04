import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { yearOptions } from '../../data/options.data';
import { useGetDashboardDataQuery } from '@/redux/features/dashboard/dashboardApi';
import { useTranslation } from 'react-i18next';

const IncomeOverviewChart = () => {
  const date = new Date();
  const currentYear = date.getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { data, isLoading, isError } = useGetDashboardDataQuery(undefined);
  const { t } = useTranslation('common');
  const growth = (data?.data?.earningGrowth || []) as Array<{ label: string; total: number }>;
  const filtered = growth.filter((g) => g.label.includes(selectedYear));
  const barData = filtered.map((g) => ({
    month: g.label.split(' ')[0],
    income: g.total,
  }));

  if (isLoading) {
    return (
      <div className="md:p-6 bg-white rounded-lg shadow-sm">
        <div className="h-80 animate-pulse bg-gray-100 rounded" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="md:p-6 bg-white rounded-lg shadow-sm">
        <div className="text-red-500 p-4">{t('dashboard.income.error')}</div>
      </div>
    );
  }

  return (
    <div className="md:p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t('dashboard.income.title')}</h2>
        <select
          className="border rounded px-2 py-1 bg-white"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          aria-label={t('dashboard.income.yearSelect')}
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={barData}>
            <defs>
              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007bff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#007bff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#007bff"
              fillOpacity={1}
              fill="url(#colorBookings)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeOverviewChart;
