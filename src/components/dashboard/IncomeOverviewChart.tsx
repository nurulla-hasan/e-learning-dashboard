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
import { incomeBarData } from '../../data/dashboard.data';





const IncomeOverviewChart = () => {
  const date = new Date();
  const currentYear = date.getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  //const {data, isLoading, isError} = useGetIncomeGrowthQuery(selectedYear);
  //const barData = data?.data;


  // if(isLoading){
  //     return <IncomeOverviewLoading/>
  //   }
  
  //   if (!isLoading && isError) {
  //     return <h1 className="text-lg text-red-500">Server Error Occured</h1>;
  //   }



  return (
    <div className="md:p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Income Overview</h2>
        <select
          className="border rounded px-2 py-1 bg-white"
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
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={incomeBarData}>
            <defs>
              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007bff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#007bff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" />
            <YAxis/>
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
