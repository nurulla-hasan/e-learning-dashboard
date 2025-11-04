import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { yearOptions } from '../../data/options.data';
import { useGetDashboardDataQuery } from '@/redux/features/dashboard/dashboardApi';
import { useTranslation } from 'react-i18next';

const UserOverviewChart = () => {
  const date = new Date();
  const currentYear = date.getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { data, isLoading, isError } = useGetDashboardDataQuery(undefined);
  const { t, i18n } = useTranslation('common');
  const userGrowth = (data?.data?.userGrowth || []) as Array<{ month: string; role: string; count: number }>;
  const filtered = userGrowth.filter((u) => u.month.includes(selectedYear));
  const monthOrder = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const agg: Record<string, number> = monthOrder.reduce((acc, m) => { acc[m] = 0; return acc; }, {} as Record<string, number>);
  filtered.forEach((u) => {
    const m = u.month.split(' ')[0];
    agg[m] = (agg[m] || 0) + u.count;
  });
  const barData = monthOrder.map((m) => ({ month: m, users: agg[m] ?? 0 })).filter(d => d.users !== undefined);

  return (
    <div className="md:p-6 bg-white rounded-lg shadow-sm">
      {isLoading ? (
        <div className="h-80 animate-pulse bg-gray-100 rounded" />
      ) : isError ? (
        <div className="text-red-500 p-4">{t('dashboard.user.error')}</div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{t('dashboard.user.title')}</h2>
            <select
              className="border bg-white rounded px-2 py-1"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              aria-label={t('dashboard.user.yearSelect')}
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
              <BarChart
                data={barData}
                margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    new Intl.NumberFormat(i18n.language).format(value as number),
                    t('dashboard.user.tooltipUsers'),
                  ]}
                  cursor={{ fill: '#E7F0FA' }}
                />
                <Bar dataKey="users" fill="#22385C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOverviewChart;
