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
import { userBarData } from '../../data/dashboard.data';




const UserOverviewChart = () => {
  const date = new Date();
  const currentYear = date.getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  //const {data, isLoading, isError} = useGetUserGrowthQuery(selectedYear);
  //const barData = data?.data || [];


  // if(isLoading){
  //   return <JobOverviewLoading/>
  // }

  // if (!isLoading && isError) {
  //   return <h1 className="text-lg text-red-500">Server Error Occured</h1>;
  // }



  return (
    <div className="md:p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">User Overview</h2>
        <select
          className="border bg-white rounded px-2 py-1"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
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
            data={userBarData}
            margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis
              // domain={domain}
              // ticks={ticks}
              // tickFormatter={(value) =>
              //   new Intl.NumberFormat('en').format(value)
              // }
            />
            <Tooltip
              formatter={(value) => [
                new Intl.NumberFormat('en').format(value as number),
                'users',
              ]}
              cursor={{ fill: '#E7F0FA' }}
            />
            <Bar dataKey="users" fill="#22385C" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserOverviewChart;
